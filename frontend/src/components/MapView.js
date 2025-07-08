import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, useMap, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import IndustryModal from './IndustryModal';
import MapController from './MapController';
import MLHeatmap from './MLHeatmap';

import geocodingService from '../services/geocoding';
import overpassService from '../services/overpassAPI';
import { airQualityAPI } from '../services/api';
import { SpatialClustering } from '../utils/spatialClustering';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
};

const MapBounds = ({ onZoomChange }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setMaxBounds([[-85, -180], [85, 180]]);
    map.setMinZoom(2);
    map.setMaxZoom(18);
    
    let zoomTimer = null;
    
    // Throttled zoom change handler
    const handleZoom = () => {
      if (zoomTimer) clearTimeout(zoomTimer);
      zoomTimer = setTimeout(() => {
        onZoomChange(map.getZoom());
      }, 150); // 150ms throttle
    };
    
    map.on('zoomend', handleZoom);
    
    return () => {
      map.off('zoomend', handleZoom);
      if (zoomTimer) clearTimeout(zoomTimer);
    };
  }, [map, onZoomChange]);
  
  return null;
};

const MapView = ({ selectedLocation, onLocationSelect, airQualityData, activeHeatmaps, activeZoneTypes, currentZoom, onZoomChange, timeInterval, currentTime, onIndustriesUpdate }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [industrialZones, setIndustrialZones] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);
  const [zoomDebounceTimer, setZoomDebounceTimer] = useState(null);

  
  // Debounced zoom-based re-clustering
  useEffect(() => {
    if (industries.length === 0) return;
    
    // Clear existing timer
    if (zoomDebounceTimer) {
      clearTimeout(zoomDebounceTimer);
    }
    
    // Set new timer for debounced clustering
    const timer = setTimeout(() => {
      const zones = SpatialClustering.clusterIndustries(industries, currentZoom);
      setIndustrialZones(zones);
    }, 300); // 300ms debounce
    
    setZoomDebounceTimer(timer);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentZoom, industries]);
  
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const location = await geocodingService.reverseGeocode(selectedLocation.lat, selectedLocation.lon);
        setLocationInfo(location);
        
        const industryData = await overpassService.getIndustries(selectedLocation.lat, selectedLocation.lon, 0.3);
        setIndustries(industryData);
        onIndustriesUpdate(industryData);
        
        // Initial clustering will be handled by the zoom effect above
        
        // Fetch correlation data
        const correlation = await airQualityAPI.getIndustryData({ 
          lat: selectedLocation.lat, 
          lon: selectedLocation.lon 
        });
        setCorrelationData(correlation.data?.correlations || []);
      } catch (error) {
        console.error('Failed to fetch location data:', error);
      }
    };
    
    fetchLocationData();
  }, [selectedLocation]);
  






  const getAQIColor = (aqi) => {
    if (!aqi) return '#gray';
    switch(aqi) {
      case 1: return '#00e400';
      case 2: return '#ffff00';
      case 3: return '#ff7e00';
      case 4: return '#ff0000';
      case 5: return '#8f3f97';
      default: return '#gray';
    }
  };
  
  const getAQILevel = (aqi) => {
    if (!aqi) return 'Unknown';
    switch(aqi) {
      case 1: return 'Very Good';
      case 2: return 'Good';
      case 3: return 'Fair';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  };



  const handleIndustryClick = (industryType) => {
    setSelectedIndustry(industryType);
    setShowIndustryModal(true);
  };

  const getTopIndustries = () => {
    return industries.slice(0, 3).map(ind => ind.name);
  };

  const getZoneEmoji = (zoneType) => {
    const emojis = {
      'industrial': '🏭',  // Factory
      'mining': '⛏️',      // Pick
      'agriculture': '🌾', // Wheat
      'urban': '🏙️',     // Cityscape
      'mixed': '📍'       // Round pushpin
    };
    return emojis[zoneType] || '🏭';
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={[selectedLocation.lat, selectedLocation.lon]} 
        zoom={8} 
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        
        <MapBounds onZoomChange={onZoomChange} />
        <MapController selectedLocation={selectedLocation} />
        
        {/* ML-Powered AQI Heatmap */}
        <MLHeatmap currentZoom={currentZoom} activeHeatmaps={activeHeatmaps} selectedLocation={selectedLocation} />
        

        

        
        {/* Selected location marker */}
        <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
          <Popup>
            <div className="location-popup">
              <div className="location-header">
                <strong>{locationInfo?.city || 'Loading...'}</strong>
                {locationInfo?.state && <span>, {locationInfo.state}</span>}
                <br/>
                <span className="country">{locationInfo?.country || ''}</span>
              </div>
              
              <div className="coordinates">
                📍 {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
              </div>
              
              <div className="aqi-info">
                <strong>EU Air Quality Index: {airQualityData?.aqi || 'Loading...'}</strong>
                <div className="aqi-level">{getAQILevel(airQualityData?.aqi)}</div>
                <div className="aqi-indicator" style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: getAQIColor(airQualityData?.aqi),
                  borderRadius: '4px',
                  marginTop: '5px'
                }}></div>
                {airQualityData?.components && (
                  <div className="pollutant-details">
                    <div>PM2.5: {airQualityData.components.pm2_5?.toFixed(1)} μg/m³</div>
                    <div>NO₂: {airQualityData.components.no2?.toFixed(1)} μg/m³</div>
                  </div>
                )}
                <div className="aqi-standard-small">European Standard (1-5)</div>
              </div>
              
              {getTopIndustries().length > 0 && (
                <div className="top-industries">
                  <strong>Nearby Industries:</strong>
                  {getTopIndustries().map((industry, idx) => (
                    <button 
                      key={idx}
                      className="industry-link"
                      onClick={() => handleIndustryClick('petroleum')}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Industrial zones */}
        {activeHeatmaps.includes('industries') && industrialZones
          .filter(zone => activeZoneTypes.includes(zone.zoneType))
          .map(zone => (
          <React.Fragment key={zone.id}>
            {/* Bounding box rectangle - hidden when air quality is active */}
            {!activeHeatmaps.includes('airQuality') && (
              <Rectangle
                bounds={zone.bounds}
                pathOptions={{
                  color: zone.color,
                  weight: 2,
                  opacity: 0.8,
                  fillColor: zone.color,
                  fillOpacity: 0.2
                }}
              />
            )}
            
            {/* Zone center marker - always visible */}
            <Marker 
              position={zone.center}
              icon={L.divIcon({
                html: getZoneEmoji(zone.zoneType),
                iconSize: [30, 30],
                className: 'zone-marker'
              })}
            >
              <Popup>
                <div className="zone-popup">
                  <strong>{zone.zoneType.charAt(0).toUpperCase() + zone.zoneType.slice(1)} Zone</strong><br/>
                  <div className="zone-stats">
                    📊 {zone.facilities} facilities<br/>
                    📏 {zone.area} km²<br/>
                    💨 {zone.emissions}
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
      
      {showIndustryModal && (
        <IndustryModal 
          industry={selectedIndustry}
          onClose={() => setShowIndustryModal(false)}
        />
      )}
    </div>
  );
};

export default MapView;
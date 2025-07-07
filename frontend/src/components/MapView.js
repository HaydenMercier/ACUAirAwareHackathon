import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import IndustryModal from './IndustryModal';
import geocodingService from '../services/geocoding';
import overpassService from '../services/overpassAPI';
import { airQualityAPI } from '../services/api';

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

const MapBounds = () => {
  const map = useMap();
  
  useEffect(() => {
    map.setMaxBounds([[-85, -180], [85, 180]]);
    map.setMinZoom(2);
    map.setMaxZoom(18);
  }, [map]);
  
  return null;
};

const MapView = ({ selectedLocation, onLocationSelect, airQualityData, activeHeatmaps, timeInterval, currentTime }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);
  const [globalHeatmap, setGlobalHeatmap] = useState([]);
  
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const location = await geocodingService.reverseGeocode(selectedLocation.lat, selectedLocation.lon);
        setLocationInfo(location);
        
        const industryData = await overpassService.getIndustries(selectedLocation.lat, selectedLocation.lon, 0.3);
        setIndustries(industryData);
        
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
  
  useEffect(() => {
    // Generate global heatmap points
    const generateGlobalHeatmap = () => {
      const points = [];
      // Major pollution hotspots worldwide
      const hotspots = [
        { lat: 39.9042, lon: 116.4074, intensity: 0.9 }, // Beijing
        { lat: 28.7041, lon: 77.1025, intensity: 0.85 }, // Delhi
        { lat: 31.2304, lon: 121.4737, intensity: 0.8 }, // Shanghai
        { lat: 34.0522, lon: -118.2437, intensity: 0.7 }, // Los Angeles
        { lat: 40.7128, lon: -74.0060, intensity: 0.65 }, // New York
        { lat: 51.5074, lon: -0.1278, intensity: 0.6 }, // London
        { lat: 35.6762, lon: 139.6503, intensity: 0.75 }, // Tokyo
        { lat: -23.5505, lon: -46.6333, intensity: 0.7 }, // São Paulo
        { lat: 19.4326, lon: -99.1332, intensity: 0.8 }, // Mexico City
        { lat: 55.7558, lon: 37.6176, intensity: 0.65 } // Moscow
      ];
      
      hotspots.forEach(spot => {
        // Add some variation around each hotspot
        for (let i = 0; i < 3; i++) {
          points.push({
            lat: spot.lat + (Math.random() - 0.5) * 2,
            lon: spot.lon + (Math.random() - 0.5) * 2,
            intensity: spot.intensity + (Math.random() - 0.5) * 0.3
          });
        }
      });
      
      return points;
    };
    
    setGlobalHeatmap(generateGlobalHeatmap());
  }, []);



  const getHeatmapColor = (intensity) => {
    if (intensity > 0.8) return '#8b0000'; // Dark red
    if (intensity > 0.6) return '#ff0000'; // Red
    if (intensity > 0.4) return '#ff7e00'; // Orange
    if (intensity > 0.2) return '#ffff00'; // Yellow
    return '#00e400'; // Green
  };

  const getAQIColor = (aqi) => {
    if (!aqi) return '#gray';
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    return '#8f3f97';
  };



  const handleIndustryClick = (industryType) => {
    setSelectedIndustry(industryType);
    setShowIndustryModal(true);
  };

  const getTopIndustries = () => {
    return industries.slice(0, 3).map(ind => ind.name);
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
        
        <MapBounds />
        
        {/* Global Air Quality Heatmap */}
        {activeHeatmaps.includes('airQuality') && globalHeatmap.map((point, index) => (
          <CircleMarker
            key={`heatmap-${index}`}
            center={[point.lat, point.lon]}
            radius={Math.max(3, point.intensity * 8)}
            fillColor={getHeatmapColor(point.intensity)}
            fillOpacity={0.7}
            stroke={false}
          />
        ))}
        
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
                <strong>Air Quality Index: {airQualityData?.aqi || 'Loading...'}</strong>
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
                    <div>NO2: {airQualityData.components.no2?.toFixed(1)} μg/m³</div>
                  </div>
                )}
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

        {/* Industry markers */}
        {activeHeatmaps.includes('industries') && industries.map(industry => (
          <Marker 
            key={industry.id} 
            position={[industry.lat, industry.lon]}
            icon={L.divIcon({
              html: industry.icon,
              iconSize: [30, 30],
              className: 'industry-marker'
            })}
          >
            <Popup>
              <div>
                <strong>{industry.name}</strong><br/>
                Type: {industry.type}<br/>
                Primary Emissions: {industry.emissions}
              </div>
            </Popup>
          </Marker>
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
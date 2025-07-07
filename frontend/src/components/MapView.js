import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import IndustryModal from './IndustryModal';

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

const MapView = ({ selectedLocation, onLocationSelect, airQualityData, activeHeatmaps }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  
  const [industries] = useState([
    { id: 1, name: 'Oil Refinery', lat: 32.7767, lon: -96.7970, type: 'petroleum', emissions: 'High NO2', icon: '⛽' },
    { id: 2, name: 'Chemical Plant', lat: 32.7157, lon: -97.1331, type: 'chemical', emissions: 'High SO2', icon: '🧪' },
    { id: 3, name: 'Power Plant', lat: 32.8998, lon: -97.0403, type: 'energy', emissions: 'High PM2.5', icon: '⚡' },
    { id: 4, name: 'Steel Mill', lat: 32.6569, lon: -96.8716, type: 'steel', emissions: 'High PM10', icon: '🏭' },
    { id: 5, name: 'Cement Plant', lat: 32.9207, lon: -96.6211, type: 'cement', emissions: 'High CO2', icon: '🏗️' },
  ]);

  const [locationData] = useState([
    { name: 'Dallas', lat: 32.7767, lon: -96.7970, industries: ['Oil Refinery', 'Chemical Plant', 'Steel Mill'] },
    { name: 'Fort Worth', lat: 32.7157, lon: -97.1331, industries: ['Power Plant', 'Cement Plant', 'Manufacturing'] },
    { name: 'Plano', lat: 33.0198, lon: -96.6989, industries: ['Electronics', 'Aerospace', 'Logistics'] },
  ]);

  const [heatmapData] = useState([
    { lat: 32.7767, lon: -96.7970, intensity: 0.8, type: 'airQuality' },
    { lat: 32.7157, lon: -97.1331, intensity: 0.6, type: 'airQuality' },
    { lat: 32.8998, lon: -97.0403, intensity: 0.9, type: 'airQuality' },
    { lat: 32.7767, lon: -96.7970, intensity: 0.7, type: 'deaths' },
    { lat: 32.7157, lon: -97.1331, intensity: 0.5, type: 'deaths' },
  ]);

  const getAQIColor = (aqi) => {
    if (!aqi) return '#gray';
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    return '#8f3f97';
  };

  const getHeatmapColor = (type) => {
    switch(type) {
      case 'airQuality': return '#ff6b6b';
      case 'deaths': return '#8b0000';
      case 'industries': return '#4ecdc4';
      default: return '#ff6b6b';
    }
  };

  const handleIndustryClick = (industryType) => {
    setSelectedIndustry(industryType);
    setShowIndustryModal(true);
  };

  const getLocationInfo = (lat, lon) => {
    return locationData.find(loc => 
      Math.abs(loc.lat - lat) < 0.1 && Math.abs(loc.lon - lon) < 0.1
    ) || { name: 'Unknown Location', industries: ['Mixed Industrial', 'Commercial', 'Residential'] };
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
        
        {/* Heatmap circles */}
        {heatmapData
          .filter(point => activeHeatmaps.includes(point.type))
          .map((point, index) => (
            <Circle
              key={`${point.type}-${index}`}
              center={[point.lat, point.lon]}
              radius={point.intensity * 10000}
              fillColor={getHeatmapColor(point.type)}
              fillOpacity={0.3}
              stroke={false}
            />
          ))
        }
        
        {/* Selected location marker */}
        <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
          <Popup>
            <div className="location-popup">
              <strong>{getLocationInfo(selectedLocation.lat, selectedLocation.lon).name}</strong><br/>
              <div className="aqi-info">
                AQI: {airQualityData?.aqi || 'Loading...'}<br/>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: getAQIColor(airQualityData?.aqi),
                  display: 'inline-block',
                  marginTop: '5px'
                }}></div>
              </div>
              <div className="top-industries">
                <strong>Top Industries:</strong>
                {getLocationInfo(selectedLocation.lat, selectedLocation.lon).industries.map((industry, idx) => (
                  <button 
                    key={idx}
                    className="industry-link"
                    onClick={() => handleIndustryClick(industry.toLowerCase().includes('oil') ? 'petroleum' : 
                                                     industry.toLowerCase().includes('chemical') ? 'chemical' : 'energy')}
                  >
                    {industry}
                  </button>
                ))}
              </div>
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
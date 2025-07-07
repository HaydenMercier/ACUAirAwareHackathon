import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

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

const MapView = ({ selectedLocation, onLocationSelect, airQualityData }) => {
  const [industries] = useState([
    { id: 1, name: 'Oil Refinery', lat: 32.7767, lon: -96.7970, type: 'petroleum', emissions: 'High NO2' },
    { id: 2, name: 'Chemical Plant', lat: 32.7157, lon: -97.1331, type: 'chemical', emissions: 'High SO2' },
    { id: 3, name: 'Power Plant', lat: 32.8998, lon: -97.0403, type: 'energy', emissions: 'High PM2.5' },
  ]);

  const getAQIColor = (aqi) => {
    if (!aqi) return '#gray';
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    return '#8f3f97';
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={[selectedLocation.lat, selectedLocation.lon]} 
        zoom={8} 
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        
        {/* Selected location marker */}
        <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
          <Popup>
            <div>
              <strong>Selected Location</strong><br/>
              AQI: {airQualityData?.aqi || 'Loading...'}<br/>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: getAQIColor(airQualityData?.aqi),
                display: 'inline-block',
                marginTop: '5px'
              }}></div>
            </div>
          </Popup>
        </Marker>

        {/* Industry markers */}
        {industries.map(industry => (
          <Marker 
            key={industry.id} 
            position={[industry.lat, industry.lon]}
            icon={L.divIcon({
              html: '🏭',
              iconSize: [25, 25],
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
    </div>
  );
};

export default MapView;
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const MapView = () => {
  return (
    <div className="map-container">
      <MapContainer center={[32.4487, -99.7331]} zoom={6} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </div>
  );
};

export default MapView;
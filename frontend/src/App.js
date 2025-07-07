import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import { airQualityAPI } from './services/api';
import './styles/App.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState({ lat: 32.7767, lon: -96.7970 });
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAirQuality();
  }, [selectedLocation]);

  const fetchAirQuality = async () => {
    setLoading(true);
    try {
      const response = await airQualityAPI.getAirQualityData(selectedLocation.lat, selectedLocation.lon);
      setAirQualityData(response.data);
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header>
        <h1>🏭 Smokestack</h1>
        <p>Industrial Air Pollution Tracker</p>
      </header>
      <main>
        <MapView 
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          airQualityData={airQualityData}
        />
        <Dashboard 
          airQualityData={airQualityData}
          loading={loading}
          location={selectedLocation}
        />
      </main>
    </div>
  );
}

export default App;
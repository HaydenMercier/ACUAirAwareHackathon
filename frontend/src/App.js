import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import TimelineSlider from './components/TimelineSlider';
import HeatmapToggle from './components/HeatmapToggle';
import SearchBar from './components/SearchBar';
import { airQualityAPI } from './services/api';
import './styles/App.css';

function App() {
  const [showHomePage, setShowHomePage] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState({ lat: 32.7767, lon: -96.7970 });
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeInterval, setTimeInterval] = useState('year');
  const [currentTime, setCurrentTime] = useState(2024);
  const [activeHeatmaps, setActiveHeatmaps] = useState(['airQuality']);

  useEffect(() => {
    if (!showHomePage) {
      fetchAirQuality();
    }
  }, [selectedLocation, showHomePage]);

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

  const handleHeatmapToggle = (heatmapId) => {
    setActiveHeatmaps(prev => 
      prev.includes(heatmapId) 
        ? prev.filter(id => id !== heatmapId)
        : [...prev, heatmapId]
    );
  };

  if (showHomePage) {
    return <HomePage onEnterApp={() => setShowHomePage(false)} />;
  }

  return (
    <div className="App">
      <header>
        <h1>🏭 Smokestack</h1>
        <SearchBar onLocationSelect={setSelectedLocation} />
      </header>
      
      <div className="controls-panel">
        <TimelineSlider 
          onTimeChange={setCurrentTime}
          onIntervalChange={setTimeInterval}
        />
        <HeatmapToggle 
          activeHeatmaps={activeHeatmaps}
          onToggle={handleHeatmapToggle}
        />
      </div>

      <main>
        <MapView 
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
          airQualityData={airQualityData}
          activeHeatmaps={activeHeatmaps}
          timeInterval={timeInterval}
          currentTime={currentTime}
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
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import TimelineSlider from './components/TimelineSlider';
import HeatmapToggle from './components/HeatmapToggle';
import Navbar from './components/Navbar';
import ErrorBanner from './components/ErrorBanner';
import ContactFooter from './components/ContactFooter';
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
  const [currentView, setCurrentView] = useState('home');
  const [industries, setIndustries] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!showHomePage) {
      fetchAirQuality();
    }
  }, [selectedLocation, showHomePage]);

  const fetchAirQuality = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await airQualityAPI.getAirQualityData(selectedLocation.lat, selectedLocation.lon);
      setAirQualityData(response.data);
      
      // Check if response contains error info
      if (response.data?.error) {
        setApiError(response.data.error);
      }
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
      setApiError({ 
        type: 'network', 
        message: 'Failed to connect to air quality service' 
      });
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

  const handleNavigateHome = () => {
    setCurrentView('home');
    setShowHomePage(true);
  };
  
  const handleNavigateMap = () => {
    setCurrentView('map');
    setShowHomePage(false);
  };
  
  if (showHomePage) {
    return (
      <div>
        <Navbar 
          onNavigateHome={handleNavigateHome}
          onNavigateMap={handleNavigateMap}
        />
        <HomePage onEnterApp={handleNavigateMap} />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar 
        onNavigateHome={handleNavigateHome}
        onNavigateMap={handleNavigateMap}
      />
      
      <ErrorBanner 
        error={apiError}
        onDismiss={() => setApiError(null)}
      />
      
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
          onIndustriesUpdate={setIndustries}
        />
        <Dashboard 
          airQualityData={airQualityData}
          loading={loading}
          location={selectedLocation}
          industries={industries}
          onLocationSelect={setSelectedLocation}
        />
      </main>
      
      <ContactFooter />
    </div>
  );
}

export default App;
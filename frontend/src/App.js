import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import AQILegend from './components/AQILegend';
import TimelineSlider from './components/TimelineSlider';
import HeatmapToggle from './components/HeatmapToggle';
import Navbar from './components/Navbar';
import ErrorBanner from './components/ErrorBanner';

import ContributingIndustries from './components/ContributingIndustries';
import correlationService from './services/correlationService';
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
  const [correlationData, setCorrelationData] = useState([
    { industry: 'Loading...', impact: 'Calculating...', correlation: '--', distance: '--' },
    { industry: 'Analyzing...', impact: 'Processing...', correlation: '--', distance: '--' },
    { industry: 'Scanning...', impact: 'Evaluating...', correlation: '--', distance: '--' },
    { industry: 'Detecting...', impact: 'Measuring...', correlation: '--', distance: '--' },
    { industry: 'Monitoring...', impact: 'Assessing...', correlation: '--', distance: '--' }
  ]);
  const [aqiStandard, setAqiStandard] = useState('EU');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!showHomePage) {
      fetchAirQuality();
    }
  }, [selectedLocation, showHomePage]);
  
  useEffect(() => {
    if (industries.length > 0 && airQualityData) {
      const correlations = correlationService.calculateProximityCorrelation(
        selectedLocation, 
        industries, 
        airQualityData
      );
      setCorrelationData(correlations.length > 0 ? correlations : [
        { industry: 'No industries found', impact: 'No data available', correlation: 'N/A', distance: 'N/A' },
        { industry: 'Limited data coverage', impact: 'Insufficient sensors', correlation: 'N/A', distance: 'N/A' },
        { industry: 'Remote location', impact: 'Low industrial activity', correlation: 'N/A', distance: 'N/A' },
        { industry: 'Rural area detected', impact: 'Minimal pollution sources', correlation: 'N/A', distance: 'N/A' },
        { industry: 'Clean air zone', impact: 'Background levels only', correlation: 'N/A', distance: 'N/A' }
      ]);
    }
  }, [selectedLocation, industries, airQualityData]);

  const fetchAirQuality = async () => {
    console.log('🚀 fetchAirQuality started for location:', selectedLocation);
    setLoading(true);
    setApiError(null);
    
    try {
      console.log('📡 Calling airQualityAPI.getAirQualityData...');
      const response = await airQualityAPI.getAirQualityData(selectedLocation.lat, selectedLocation.lon);
      
      console.log('📝 API Response received:', {
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'no data',
        aqi: response.data?.aqi,
        components: response.data?.components ? Object.keys(response.data.components) : 'no components'
      });
      
      setAirQualityData(response.data);
      setLastUpdated(new Date());
      
      console.log('✅ Air quality data set in state:', response.data);
      
      // Check if response contains error info
      if (response.data?.error) {
        console.warn('⚠️ API returned error:', response.data.error);
        setApiError(response.data.error);
      }
    } catch (error) {
      console.error('❌ fetchAirQuality failed:', {
        message: error.message,
        stack: error.stack,
        selectedLocation
      });
      setApiError({ 
        type: 'network', 
        message: 'Failed to connect to air quality service' 
      });
    }
    
    setLoading(false);
    console.log('🏁 fetchAirQuality completed');
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
  
  const handleNavigateIndustries = () => {
    setCurrentView('industries');
    setShowHomePage(false);
  };
  
  if (showHomePage) {
    return (
      <div className="App">
        <Navbar 
          onNavigateHome={handleNavigateHome}
          onNavigateMap={handleNavigateMap}
          onNavigateIndustries={handleNavigateIndustries}
        />
        <HomePage onEnterApp={handleNavigateMap} />
      </div>
    );
  }
  
  if (currentView === 'industries') {
    return (
      <div className="App">
        <Navbar 
          onNavigateHome={handleNavigateHome}
          onNavigateMap={handleNavigateMap}
          onNavigateIndustries={handleNavigateIndustries}
        />
        <ContributingIndustries />
      </div>
    );
  }

  return (
    <div className="App map-page">
      <Navbar 
        onNavigateHome={handleNavigateHome}
        onNavigateMap={handleNavigateMap}
        onNavigateIndustries={handleNavigateIndustries}
      />
      
      <ErrorBanner 
        error={apiError}
        onDismiss={() => setApiError(null)}
      />
      
      <div className="controls-panel">
        <TimelineSlider 
          onTimeChange={setCurrentTime}
          onIntervalChange={setTimeInterval}
          lastUpdated={lastUpdated}
          aqiStandard={aqiStandard}
          onAqiStandardChange={setAqiStandard}
        />
        <HeatmapToggle 
          activeHeatmaps={activeHeatmaps}
          onToggle={handleHeatmapToggle}
        />
      </div>

      <main className="grid-layout">
        <div className="map-area">
          <MapView 
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
            airQualityData={airQualityData}
            activeHeatmaps={activeHeatmaps}
            timeInterval={timeInterval}
            currentTime={currentTime}
            onIndustriesUpdate={setIndustries}
          />
        </div>
        <div className="aqi-area">
          <AQILegend aqiStandard={aqiStandard} />
        </div>
        <div className="correlation-area">
          <div className="industry-correlation">
            <h3>Industry Correlation</h3>
            {correlationData.map((item, index) => (
              <div key={index} className="correlation-item">
                <div className="correlation-header">
                  <strong>{item.industry}</strong>
                  <span className="correlation-value">{item.correlation}</span>
                </div>
                <div className="correlation-details">
                  <span className="impact">{item.impact}</span>
                  <span className="distance">{item.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-area">
          <Dashboard 
            airQualityData={airQualityData}
            loading={loading}
            location={selectedLocation}
            industries={industries}
            onLocationSelect={setSelectedLocation}
            aqiStandard={aqiStandard}
          />
        </div>
        <div className="quick-facts-area">
          <div className="education-panel">
            <h3>💡 Quick Facts</h3>
            <ul>
              <li>PM2.5 particles are 30x smaller than human hair width</li>
              <li>Oil refineries are major sources of NO2 emissions</li>
              <li>Chemical plants often release SO2 compounds</li>
              <li>Wind direction affects pollution dispersion patterns</li>
            </ul>
          </div>
        </div>
        <div className="footer-area">
          <div className="info-card">
            <div className="info-content">
              Built with ❤️ for cleaner air • Data from OpenWeather & OpenStreetMap
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
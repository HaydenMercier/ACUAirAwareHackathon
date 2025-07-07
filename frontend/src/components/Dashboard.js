import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import geocodingService from '../services/geocoding';
import correlationService from '../services/correlationService';
import { convertEUtoUS, getAQILevel, getAQIColor } from '../utils/aqiConverter';

const Dashboard = ({ airQualityData, loading, location, industries, onLocationSelect, aqiStandard = 'EU' }) => {
  const [locationInfo, setLocationInfo] = useState(null);
  const [correlationData, setCorrelationData] = useState([]);
  
  useEffect(() => {
    const fetchLocationInfo = async () => {
      try {
        const info = await geocodingService.reverseGeocode(location.lat, location.lon);
        setLocationInfo(info);
      } catch (error) {
        console.error('Failed to get location info:', error);
      }
    };
    
    fetchLocationInfo();
  }, [location]);
  
  useEffect(() => {
    if (industries && airQualityData) {
      const correlations = correlationService.calculateProximityCorrelation(
        location, 
        industries, 
        airQualityData
      );
      setCorrelationData(correlations);
    }
  }, [location, industries, airQualityData]);
  
  const getDisplayAQI = () => {
    if (!airQualityData?.aqi) return null;
    return aqiStandard === 'US' ? convertEUtoUS(airQualityData.aqi) : airQualityData.aqi;
  };
  
  const displayAqi = getDisplayAQI();



  return (
    <div className="dashboard">
      <div className="location-info">
        <h3>📍 Current Location</h3>
        <div className="location-details">
          <div className="location-name">
            <strong>{locationInfo?.city || 'Loading...'}</strong>
            {locationInfo?.state && <span>, {locationInfo.state}</span>}
          </div>
          <div className="location-country">{locationInfo?.country || ''}</div>
          <div className="location-coords">{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</div>
        </div>
        <div className="search-container">
          <SearchBar onLocationSelect={onLocationSelect} />
        </div>
      </div>

      <div className="metrics-panel">
        <h3>Air Quality Metrics</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div>
            <div className="metric-cards">
              <div className="metric-card" style={{ borderLeft: `4px solid ${getAQIColor(displayAqi, aqiStandard)}` }}>
                <h4>{aqiStandard} AQI</h4>
                <span className="value">{displayAqi || 'N/A'}</span>
                <span className="level">{displayAqi ? getAQILevel(displayAqi, aqiStandard) : 'Unknown'}</span>
                <div className="aqi-standard-note">{aqiStandard === 'EU' ? 'European Standard (1-5)' : 'US Standard (0-500)'}</div>
              </div>
              <div className="metric-card">
                <h4>PM2.5</h4>
                <span className="value">{airQualityData?.components?.pm2_5?.toFixed(1) || 'N/A'}</span>
                <span className="unit">μg/m³</span>
              </div>
              <div className="metric-card">
                <h4>NO2</h4>
                <span className="value">{airQualityData?.components?.no2?.toFixed(1) || 'N/A'}</span>
                <span className="unit">μg/m³</span>
              </div>
              <div className="metric-card">
                <h4>SO2</h4>
                <span className="value">{airQualityData?.components?.so2?.toFixed(1) || 'N/A'}</span>
                <span className="unit">μg/m³</span>
              </div>
            </div>
            {airQualityData?.source === 'nearest' && (
              <div className="data-notice nearest">
                📍 Using nearest available data ({airQualityData.distance?.toFixed(1)}km away)
              </div>
            )}
            {airQualityData?.source === 'interpolated' && (
              <div className="data-notice interpolated">
                📊 Interpolated from {airQualityData.sensorCount} sensors (avg {airQualityData.avgDistance?.toFixed(1)}km away)
              </div>
            )}
            {airQualityData?.source === 'unavailable' && (
              <div className="data-notice unavailable">
                ⚠️ No air quality data available for this region
              </div>
            )}
          </div>
        )}
      </div>




      
      <div className="education-panel">
        <h3>💡 Quick Facts</h3>
        <ul>
          <li>PM2.5 particles are 30x smaller than human hair width</li>
          <li>Oil refineries are major sources of NO2 emissions</li>
          <li>Chemical plants often release SO2 compounds</li>
          <li>Wind direction affects pollution dispersion patterns</li>
        </ul>
      </div>
      
      <div className="metrics-guide-panel">
        <h3>📊 Understanding Air Quality Metrics</h3>
        <div className="metric-explanation">
          <div className="metric-item">
            <strong>AQI (Air Quality Index):</strong> Overall air quality rating from 1-5 (EU) or 0-500 (US). Higher values indicate worse air quality.
          </div>
          <div className="metric-item">
            <strong>PM2.5:</strong> Fine particles ≤2.5μm that penetrate deep into lungs. Major health concern from vehicles and industry.
          </div>
          <div className="metric-item">
            <strong>NO2:</strong> Nitrogen dioxide from combustion. Causes respiratory issues and contributes to smog formation.
          </div>
          <div className="metric-item">
            <strong>SO2:</strong> Sulfur dioxide from fossil fuel burning. Triggers asthma and forms acid rain.
          </div>
        </div>
        <div className="usage-guide">
          <h4>💡 How to Use This Data:</h4>
          <ul>
            <li>Check AQI before outdoor activities - avoid exercise when levels are high</li>
            <li>Monitor PM2.5 if you have respiratory conditions</li>
            <li>Use industry correlation data to identify pollution sources near you</li>
            <li>Compare different locations to make informed living decisions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
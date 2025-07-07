import React from 'react';
import AQILegend from './AQILegend';

const Dashboard = ({ airQualityData, loading, location }) => {
  const getAQILevel = (aqi) => {
    if (!aqi) return 'Unknown';
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  const getAQIColor = (aqi) => {
    if (!aqi) return '#gray';
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    return '#8f3f97';
  };

  const correlationData = [
    { industry: 'Oil Refineries', impact: 'High NO2', correlation: '85%', distance: '2.3 km' },
    { industry: 'Chemical Plants', impact: 'High SO2', correlation: '72%', distance: '4.1 km' },
    { industry: 'Power Plants', impact: 'High PM2.5', correlation: '68%', distance: '6.8 km' },
  ];

  return (
    <div className="dashboard">
      <div className="location-info">
        <h3>📍 Current Location</h3>
        <p>{location.lat.toFixed(4)}, {location.lon.toFixed(4)}</p>
      </div>

      <div className="metrics-panel">
        <h3>Air Quality Metrics</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="metric-cards">
            <div className="metric-card" style={{ borderLeft: `4px solid ${getAQIColor(airQualityData?.aqi)}` }}>
              <h4>AQI</h4>
              <span className="value">{airQualityData?.aqi || '--'}</span>
              <span className="level">{getAQILevel(airQualityData?.aqi)}</span>
            </div>
            <div className="metric-card">
              <h4>PM2.5</h4>
              <span className="value">{airQualityData?.components?.pm2_5?.toFixed(1) || '--'}</span>
              <span className="unit">μg/m³</span>
            </div>
            <div className="metric-card">
              <h4>NO2</h4>
              <span className="value">{airQualityData?.components?.no2?.toFixed(1) || '--'}</span>
              <span className="unit">μg/m³</span>
            </div>
            <div className="metric-card">
              <h4>SO2</h4>
              <span className="value">{airQualityData?.components?.so2?.toFixed(1) || '--'}</span>
              <span className="unit">μg/m³</span>
            </div>
          </div>
        )}
      </div>

      <div className="industry-panel">
        <h3>🏭 Industry Correlation</h3>
        <div className="correlation-list">
          {correlationData.map((item, index) => (
            <div key={index} className="correlation-item">
              <div className="industry-name">{item.industry}</div>
              <div className="impact">{item.impact}</div>
              <div className="correlation">{item.correlation} correlation</div>
              <div className="distance">{item.distance} away</div>
            </div>
          ))}
        </div>
      </div>

      <AQILegend />
      
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
  );
};

export default Dashboard;
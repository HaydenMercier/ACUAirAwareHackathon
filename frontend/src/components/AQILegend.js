import React from 'react';

const AQILegend = ({ aqiStandard = 'EU' }) => {
  const euLevels = [
    { range: '1', level: 'Very Good', color: '#00e400', description: 'Air quality is excellent' },
    { range: '2', level: 'Good', color: '#ffff00', description: 'Air quality is satisfactory' },
    { range: '3', level: 'Fair', color: '#ff7e00', description: 'Moderate air quality, sensitive people may experience minor issues' },
    { range: '4', level: 'Poor', color: '#ff0000', description: 'Poor air quality, health effects for sensitive groups' },
    { range: '5', level: 'Very Poor', color: '#8f3f97', description: 'Very poor air quality, health effects for everyone' },
  ];
  
  const usLevels = [
    { range: '0-50', level: 'Good', color: '#00e400', description: 'Air quality is satisfactory' },
    { range: '51-100', level: 'Moderate', color: '#ffff00', description: 'Acceptable for most people' },
    { range: '101-150', level: 'Unhealthy for Sensitive', color: '#ff7e00', description: 'Sensitive groups may experience problems' },
    { range: '151-200', level: 'Unhealthy', color: '#ff0000', description: 'Everyone may experience problems' },
    { range: '201-300', level: 'Very Unhealthy', color: '#8f3f97', description: 'Health alert for everyone' },
    { range: '301+', level: 'Hazardous', color: '#7e0023', description: 'Emergency conditions' },
  ];
  
  const levels = aqiStandard === 'EU' ? euLevels : usLevels;

  return (
    <div className="aqi-legend">
      <h4>{aqiStandard === 'EU' ? '🇪🇺' : '🇺🇸'} Air Quality Index</h4>
      <div className="aqi-standard">{aqiStandard === 'EU' ? 'European Environment Agency Standard' : 'US Environmental Protection Agency Standard'}</div>
      {levels.map((level, index) => (
        <div key={index} className="legend-item">
          <div 
            className="color-box" 
            style={{ backgroundColor: level.color }}
          ></div>
          <div className="legend-text">
            <strong>{level.range}: {level.level}</strong>
            <div className="description">{level.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AQILegend;
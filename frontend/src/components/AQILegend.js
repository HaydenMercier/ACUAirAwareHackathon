import React from 'react';

const AQILegend = () => {
  const levels = [
    { range: '0-50', level: 'Good', color: '#00e400', description: 'Air quality is satisfactory' },
    { range: '51-100', level: 'Moderate', color: '#ffff00', description: 'Acceptable for most people' },
    { range: '101-150', level: 'Unhealthy for Sensitive', color: '#ff7e00', description: 'Sensitive groups may experience problems' },
    { range: '151-200', level: 'Unhealthy', color: '#ff0000', description: 'Everyone may experience problems' },
    { range: '201+', level: 'Very Unhealthy', color: '#8f3f97', description: 'Health alert for everyone' },
  ];

  return (
    <div className="aqi-legend">
      <h4>🌡️ AQI Scale</h4>
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
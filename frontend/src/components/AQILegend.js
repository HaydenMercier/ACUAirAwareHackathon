import React from 'react';

const AQILegend = () => {
  const levels = [
    { range: '1', level: 'Very Good', color: '#00e400', description: 'Air quality is excellent' },
    { range: '2', level: 'Good', color: '#ffff00', description: 'Air quality is satisfactory' },
    { range: '3', level: 'Fair', color: '#ff7e00', description: 'Moderate air quality, sensitive people may experience minor issues' },
    { range: '4', level: 'Poor', color: '#ff0000', description: 'Poor air quality, health effects for sensitive groups' },
    { range: '5', level: 'Very Poor', color: '#8f3f97', description: 'Very poor air quality, health effects for everyone' },
  ];

  return (
    <div className="aqi-legend">
      <h4>🇪🇺 EU Air Quality Index</h4>
      <div className="aqi-standard">European Environment Agency Standard</div>
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
import React from 'react';

const HeatmapToggle = ({ activeHeatmaps, onToggle }) => {
  const heatmapOptions = [
    { id: 'airQuality', label: 'Air Quality', icon: '🌫️', color: '#ff6b6b' },
    { id: 'industries', label: 'Industries', icon: '🏭', color: '#4ecdc4' }
  ];

  return (
    <div className="heatmap-toggle">
      <h4>🗺️ Map Layers</h4>
      {heatmapOptions.map(option => (
        <label key={option.id} className="toggle-option">
          <input
            type="checkbox"
            checked={activeHeatmaps.includes(option.id)}
            onChange={() => onToggle(option.id)}
          />
          <span className="toggle-label">
            <span className="toggle-icon">{option.icon}</span>
            {option.label}
          </span>
          <div 
            className="color-indicator" 
            style={{ backgroundColor: option.color }}
          ></div>
        </label>
      ))}
    </div>
  );
};

export default HeatmapToggle;
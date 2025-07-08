import React, { useState } from 'react';

const HeatmapToggle = ({ activeHeatmaps, onToggle, activeZoneTypes, onZoneTypeToggle }) => {
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const heatmapOptions = [
    { id: 'airQuality', label: 'Air Quality', icon: '🌫️', color: '#ff6b6b' },
    { id: 'industries', label: 'Industries', icon: '🏭', color: '#4ecdc4' }
  ];
  
  const zoneTypes = [
    { id: 'industrial', label: 'Industrial', emoji: '🏭', color: '#ff6b6b' },
    { id: 'mining', label: 'Mining', emoji: '⛏️', color: '#8b4513' },
    { id: 'agriculture', label: 'Agriculture', emoji: '🌾', color: '#90ee90' },
    { id: 'urban', label: 'Urban', emoji: '🏙️', color: '#87ceeb' },
    { id: 'mixed', label: 'Mixed', emoji: '📍', color: '#dda0dd' }
  ];
  
  const handleZoneTypeToggle = (zoneTypeId) => {
    const newActiveTypes = activeZoneTypes.includes(zoneTypeId)
      ? activeZoneTypes.filter(id => id !== zoneTypeId)
      : [...activeZoneTypes, zoneTypeId];
    onZoneTypeToggle(newActiveTypes);
  };

  return (
    <div className="heatmap-toggle">
      <h4>🗺️ Map Layers</h4>
      {heatmapOptions.map(option => (
        <div key={option.id} className="toggle-option-container">
          <label className="toggle-option">
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
          
          {option.id === 'industries' && (
            <div className="dropdown-container">
              <button 
                className="dropdown-btn"
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
              >
                ▼
              </button>
              
              {showIndustryDropdown && (
                <div className="zone-dropdown">
                  {zoneTypes.map(zone => (
                    <label key={zone.id} className="zone-option">
                      <input 
                        type="checkbox" 
                        checked={activeZoneTypes.includes(zone.id)}
                        onChange={() => handleZoneTypeToggle(zone.id)}
                      />
                      <span className="zone-emoji">{zone.emoji}</span>
                      <span className="zone-label">{zone.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HeatmapToggle;
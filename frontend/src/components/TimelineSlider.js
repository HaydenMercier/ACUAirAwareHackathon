import React, { useState } from 'react';

const TimelineSlider = ({ onTimeChange, onIntervalChange, lastUpdated, aqiStandard, onAqiStandardChange }) => {
  const [viewMode, setViewMode] = useState('today');
  const [currentYear, setCurrentYear] = useState(2024);

  const handleModeChange = (mode) => {
    setViewMode(mode);
    onIntervalChange(mode);
    if (mode === 'today') {
      onTimeChange('today');
    } else {
      onTimeChange(currentYear);
    }
  };

  const handleYearChange = (year) => {
    setCurrentYear(parseInt(year));
    onTimeChange(parseInt(year));
  };

  return (
    <div className="timeline-slider">
      <div className="controls-row">
        <div className="time-controls">
          <span className="control-label">Time Range:</span>
          <div className="button-group">
            <button
              className={viewMode === 'today' ? 'control-btn active' : 'control-btn'}
              onClick={() => handleModeChange('today')}
            >
              Today
            </button>
            <button
              className={viewMode === 'year' ? 'control-btn active' : 'control-btn'}
              onClick={() => handleModeChange('year')}
            >
              Yearly Average
            </button>
          </div>
        </div>
        
        <div className="aqi-controls">
          <span className="control-label">AQI Standard:</span>
          <div className="button-group">
            <button
              className={aqiStandard === 'EU' ? 'control-btn active' : 'control-btn'}
              onClick={() => onAqiStandardChange('EU')}
            >
              EU
            </button>
            <button
              className={aqiStandard === 'US' ? 'control-btn active' : 'control-btn'}
              onClick={() => onAqiStandardChange('US')}
            >
              US
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'today' && lastUpdated && (
        <div className="date-info">
          <span className="date-text">{lastUpdated.toLocaleDateString()} • Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}
      
      {viewMode === 'year' && (
        <div className="slider-container">
          <span className="time-label">{currentYear}</span>
          <input
            type="range"
            min={2020}
            max={2024}
            step={1}
            value={currentYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="time-slider"
            disabled
          />
          <span className="data-status">Historical data not available</span>
        </div>
      )}
    </div>
  );
};

export default TimelineSlider;
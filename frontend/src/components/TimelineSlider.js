import React, { useState } from 'react';

const TimelineSlider = ({ onTimeChange, onIntervalChange }) => {
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
      <div className="interval-buttons">
        <button
          className={viewMode === 'today' ? 'active' : ''}
          onClick={() => handleModeChange('today')}
        >
          Today
        </button>
        <button
          className={viewMode === 'year' ? 'active' : ''}
          onClick={() => handleModeChange('year')}
        >
          Yearly Average
        </button>
      </div>
      
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
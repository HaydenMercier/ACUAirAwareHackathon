import React, { useState } from 'react';

const TimelineSlider = ({ onTimeChange, onIntervalChange }) => {
  const [interval, setInterval] = useState('year');
  const [currentTime, setCurrentTime] = useState(2024);

  const intervals = {
    decade: { min: 1980, max: 2020, step: 10, current: 2020 },
    year: { min: 2020, max: 2024, step: 1, current: 2024 },
    month: { min: 1, max: 12, step: 1, current: 12 },
    day: { min: 1, max: 30, step: 1, current: 15 }
  };

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
    setCurrentTime(intervals[newInterval].current);
    onIntervalChange(newInterval);
    onTimeChange(intervals[newInterval].current);
  };

  const handleTimeChange = (value) => {
    setCurrentTime(parseInt(value));
    onTimeChange(parseInt(value));
  };

  const getTimeLabel = () => {
    switch(interval) {
      case 'decade': return `${currentTime}s`;
      case 'year': return currentTime;
      case 'month': return `Month ${currentTime}`;
      case 'day': return `Day ${currentTime}`;
      default: return currentTime;
    }
  };

  return (
    <div className="timeline-slider">
      <div className="interval-buttons">
        {Object.keys(intervals).map(int => (
          <button
            key={int}
            className={interval === int ? 'active' : ''}
            onClick={() => handleIntervalChange(int)}
          >
            {int.charAt(0).toUpperCase() + int.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="slider-container">
        <span className="time-label">{getTimeLabel()}</span>
        <input
          type="range"
          min={intervals[interval].min}
          max={intervals[interval].max}
          step={intervals[interval].step}
          value={currentTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="time-slider"
        />
      </div>
    </div>
  );
};

export default TimelineSlider;
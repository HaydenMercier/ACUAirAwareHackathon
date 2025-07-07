import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="metrics-panel">
        <h3>Air Quality Metrics</h3>
        <div className="metric-cards">
          <div className="metric-card">
            <h4>PM2.5</h4>
            <span className="value">--</span>
          </div>
          <div className="metric-card">
            <h4>AQI</h4>
            <span className="value">--</span>
          </div>
        </div>
      </div>
      <div className="industry-panel">
        <h3>Industry Correlation</h3>
        <div className="chart-placeholder">Chart will go here</div>
      </div>
    </div>
  );
};

export default Dashboard;
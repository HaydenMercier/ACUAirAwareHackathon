import React from 'react';
import smokestackIcon from '../icons/smokestackiconwhitenotext.png';

const Navbar = ({ onNavigateHome, onNavigateMap, onNavigateIndustries, onNavigateSimulator }) => {
  return (
    <nav className="header-nav">
      <div className="nav-content">
        <div className="nav-logo" onClick={onNavigateHome}>
          <img src={smokestackIcon} alt="SmokeStack" className="nav-icon" />
          <span className="nav-title">SmokeStack</span>
        </div>
        
        <div className="nav-buttons">
          <button onClick={onNavigateHome} className="nav-btn">Home</button>
          <button onClick={onNavigateMap} className="nav-btn">Map</button>
          <button onClick={onNavigateIndustries} className="nav-btn">Industries</button>
          <button onClick={onNavigateSimulator} className="nav-btn">🌍 Simulator</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';

const Navbar = ({ onNavigateHome, onNavigateMap, onNavigateIndustries }) => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-brand" onClick={onNavigateHome}>
          🏭 Smokestack
        </div>
        
        <div className="nav-links">
          <button onClick={onNavigateHome} className="nav-link">Home</button>
          <button onClick={onNavigateMap} className="nav-link">Map</button>
          <button onClick={onNavigateIndustries} className="nav-link">Industries</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
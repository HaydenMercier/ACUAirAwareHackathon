import React from 'react';
import SearchBar from './SearchBar';

const Navbar = ({ showSearch = false, onLocationSelect, onNavigateHome, onNavigateMap }) => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-brand" onClick={onNavigateHome}>
          🏭 Smokestack
        </div>
        
        <div className="nav-center">
          {showSearch && <SearchBar onLocationSelect={onLocationSelect} />}
        </div>
        
        <div className="nav-links">
          <button onClick={onNavigateHome} className="nav-link">Home</button>
          <button onClick={onNavigateMap} className="nav-link">Map</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
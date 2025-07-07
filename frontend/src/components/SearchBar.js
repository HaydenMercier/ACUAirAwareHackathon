import React, { useState, useEffect } from 'react';

const SearchBar = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockLocations = [
    { name: 'North America', type: 'continent', lat: 45.0, lon: -100.0 },
    { name: 'United States', type: 'country', lat: 39.8283, lon: -98.5795 },
    { name: 'Texas', type: 'state', lat: 31.9686, lon: -99.9018 },
    { name: 'Dallas, TX', type: 'city', lat: 32.7767, lon: -96.7970 },
    { name: 'Houston, TX', type: 'city', lat: 29.7604, lon: -95.3698 },
    { name: 'Austin, TX', type: 'city', lat: 30.2672, lon: -97.7431 },
    { name: 'Europe', type: 'continent', lat: 54.5260, lon: 15.2551 },
    { name: 'Germany', type: 'country', lat: 51.1657, lon: 10.4515 },
    { name: 'Berlin, Germany', type: 'city', lat: 52.5200, lon: 13.4050 }
  ];

  useEffect(() => {
    if (query.length > 1) {
      const filtered = mockLocations
        .filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
          const typeOrder = { continent: 0, country: 1, state: 2, city: 3 };
          return typeOrder[a.type] - typeOrder[b.type];
        });
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelect = (location) => {
    setQuery(location.name);
    setShowSuggestions(false);
    onLocationSelect({ lat: location.lat, lon: location.lon });
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelect(suggestion)}
            >
              <span className="suggestion-name">{suggestion.name}</span>
              <span className="suggestion-type">{suggestion.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
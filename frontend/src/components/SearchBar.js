import React, { useState, useEffect } from 'react';
import geocodingService from '../services/geocoding';

const SearchBar = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const results = await geocodingService.searchLocation(query);
          setSuggestions(results.slice(0, 8));
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search failed:', error);
          setSuggestions([]);
        }
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (location) => {
    setQuery(location.name.split(',')[0]);
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
      
      {showSuggestions && (
        <div className="suggestions-dropdown">
          {loading ? (
            <div className="suggestion-item loading-item">Searching...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSelect(suggestion)}
              >
                <span className="suggestion-name">{suggestion.name}</span>
                <span className="suggestion-type">{suggestion.type}</span>
              </div>
            ))
          ) : (
            <div className="suggestion-item no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
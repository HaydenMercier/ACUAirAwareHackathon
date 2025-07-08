import React, { useEffect, useState } from 'react';
import { Rectangle, useMap } from 'react-leaflet';
import { airQualityAPI } from '../services/api';

const AQIGrid = ({ currentZoom, activeHeatmaps }) => {
  const [gridCells, setGridCells] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const map = useMap();

  const getGridSize = (zoom) => {
    if (zoom <= 3) return null; // Country mode
    if (zoom <= 5) return 500; // 500km
    if (zoom <= 7) return 200; // 200km
    if (zoom <= 9) return 100; // 100km
    if (zoom <= 11) return 50; // 50km
    return 20; // 20km for high zoom
  };

  const getAQIColor = (aqi) => {
    if (!aqi) return '#gray';
    switch(aqi) {
      case 1: return '#00e400';
      case 2: return '#ffff00';
      case 3: return '#ff7e00';
      case 4: return '#ff0000';
      case 5: return '#8f3f97';
      default: return '#gray';
    }
  };

  const generateGridCells = async (bounds, gridSizeKm) => {
    const { _southWest: sw, _northEast: ne } = bounds;
    const latStep = gridSizeKm / 111;
    const lonStep = gridSizeKm / (111 * Math.cos(sw.lat * Math.PI / 180));
    
    const cells = [];
    const maxCells = 50; // Limit API calls
    let cellCount = 0;
    
    for (let lat = sw.lat; lat < ne.lat && cellCount < maxCells; lat += latStep) {
      for (let lon = sw.lng; lon < ne.lng && cellCount < maxCells; lon += lonStep) {
        const cellBounds = [
          [lat, lon],
          [Math.min(lat + latStep, ne.lat), Math.min(lon + lonStep, ne.lng)]
        ];
        
        // Generate mock AQI based on location for performance
        const mockAqi = Math.floor(Math.random() * 3) + 2;
        
        cells.push({
          bounds: cellBounds,
          aqi: mockAqi,
          center: [lat + latStep / 2, lon + lonStep / 2]
        });
        
        cellCount++;
      }
    }
    
    return cells;
  };

  const generateCountryData = () => {
    // Mock country-level AQI data
    return [
      { country: 'Australia', bounds: [[-44, 113], [-10, 154]], aqi: 2 },
      { country: 'USA', bounds: [[24, -125], [49, -66]], aqi: 3 },
      { country: 'China', bounds: [[18, 73], [54, 135]], aqi: 4 },
      { country: 'India', bounds: [[6, 68], [37, 97]], aqi: 4 },
      { country: 'Brazil', bounds: [[-34, -74], [5, -34]], aqi: 3 },
    ];
  };

  useEffect(() => {
    if (!activeHeatmaps.includes('airQuality')) {
      setGridCells([]);
      setCountryData([]);
      return;
    }

    const gridSize = getGridSize(currentZoom);
    
    if (!gridSize) {
      setGridCells([]);
      setCountryData(generateCountryData());
      return;
    }

    setCountryData([]);
    const bounds = map.getBounds();
    
    // Debounce grid generation
    const timer = setTimeout(() => {
      generateGridCells(bounds, gridSize).then(cells => {
        setGridCells(cells);
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentZoom, map, activeHeatmaps]);

  if (!activeHeatmaps.includes('airQuality')) return null;

  return (
    <>
      {/* Country-level rectangles */}
      {countryData.map((country, index) => (
        <Rectangle
          key={`country-${index}`}
          bounds={country.bounds}
          pathOptions={{
            color: getAQIColor(country.aqi),
            weight: 2,
            opacity: 0.7,
            fillColor: getAQIColor(country.aqi),
            fillOpacity: 0.3
          }}
        />
      ))}
      
      {/* Grid cells */}
      {gridCells.map((cell, index) => (
        <Rectangle
          key={`cell-${index}`}
          bounds={cell.bounds}
          pathOptions={{
            color: getAQIColor(cell.aqi),
            weight: 1,
            opacity: 0.6,
            fillColor: getAQIColor(cell.aqi),
            fillOpacity: 0.4
          }}
        />
      ))}
    </>
  );
};

export default AQIGrid;
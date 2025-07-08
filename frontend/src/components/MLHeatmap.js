import React, { useEffect, useState } from 'react';
import { Rectangle, useMap } from 'react-leaflet';
import mlService from '../services/mlService';

const MLHeatmap = ({ currentZoom, activeHeatmaps, selectedLocation }) => {
  const [heatmapCells, setHeatmapCells] = useState([]);
  const map = useMap();

  const getGridSize = (zoom) => {
    if (zoom <= 3) return null; // No grid at country level
    if (zoom <= 7) return 50; // 50km
    if (zoom <= 10) return 20; // 20km
    if (zoom <= 13) return 10; // 10km
    if (zoom <= 15) return 5; // 5km
    return 2; // 2km for highest zoom
  };

  const getAQIColor = (aqi) => {
    switch(Math.round(aqi)) {
      case 1: return '#00e400';
      case 2: return '#ffff00';
      case 3: return '#ff7e00';
      case 4: return '#ff0000';
      case 5: return '#8f3f97';
      default: return '#gray';
    }
  };

  const generateHeatmapGrid = async (bounds, gridSizeKm, centerLocation) => {
    const { _southWest: sw, _northEast: ne } = bounds;
    const latStep = gridSizeKm / 111;
    const lonStep = gridSizeKm / (111 * Math.cos(centerLocation.lat * Math.PI / 180));
    
    const coordinates = [];
    const cells = [];
    
    // Generate grid centered around selected location
    const centerLat = centerLocation.lat;
    const centerLon = centerLocation.lon;
    const gridRadius = Math.ceil(Math.max((ne.lat - sw.lat), (ne.lng - sw.lng)) / (2 * latStep)) + 1;
    
    for (let i = -gridRadius; i <= gridRadius; i++) {
      for (let j = -gridRadius; j <= gridRadius; j++) {
        const lat = centerLat + (i * latStep);
        const lon = centerLon + (j * lonStep);
        
        if (lat >= sw.lat && lat <= ne.lat && lon >= sw.lng && lon <= ne.lng) {
          coordinates.push({ latitude: lat, longitude: lon });
          cells.push({
            bounds: [[lat, lon], [lat + latStep, lon + lonStep]],
            center: [lat + latStep/2, lon + lonStep/2]
          });
        }
      }
    }
    
    // Get ML predictions for all coordinates
    const predictions = await mlService.predictAQIBatch(coordinates);
    
    // Combine cells with predictions
    return cells.map((cell, index) => ({
      ...cell,
      aqi: predictions[index]?.aqi || 2
    }));
  };

  useEffect(() => {
    if (!activeHeatmaps.includes('airQuality') || !selectedLocation) {
      setHeatmapCells([]);
      return;
    }

    const gridSize = getGridSize(currentZoom);
    if (!gridSize) {
      setHeatmapCells([]);
      return;
    }

    const bounds = map.getBounds();
    
    const timer = setTimeout(() => {
      generateHeatmapGrid(bounds, gridSize, selectedLocation).then(cells => {
        setHeatmapCells(cells);
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentZoom, map, activeHeatmaps, selectedLocation]);

  if (!activeHeatmaps.includes('airQuality')) return null;

  return (
    <>
      {heatmapCells.map((cell, index) => (
        <Rectangle
          key={`ml-cell-${index}`}
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

export default MLHeatmap;
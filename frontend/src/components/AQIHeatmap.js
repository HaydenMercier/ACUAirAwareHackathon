import React, { useEffect, useState } from 'react';
import { Rectangle, useMap } from 'react-leaflet';
import { airQualityAPI } from '../services/api';

const AQIHeatmap = ({ selectedLocation, activeHeatmaps }) => {
  const [gridCells, setGridCells] = useState([]);
  const map = useMap();

  const getAQIColor = (aqi) => {
    switch(aqi) {
      case 1: return '#00e400';
      case 2: return '#ffff00';
      case 3: return '#ff7e00';
      case 4: return '#ff0000';
      case 5: return '#8f3f97';
      default: return '#gray';
    }
  };

  const getCellSize = (zoom) => {
    if (zoom >= 15) return 2; // 2km at high zoom
    if (zoom >= 12) return 4; // 4km
    if (zoom >= 10) return 6; // 6km
    if (zoom >= 8) return 8; // 8km
    return 10; // 10km at low zoom
  };

  const generateGrid = async (centerLat, centerLon, zoom) => {
    const cellSize = getCellSize(zoom);
    const latStep = cellSize / 111; // ~111km per degree
    const lonStep = cellSize / (111 * Math.cos(centerLat * Math.PI / 180));
    
    const cells = [];
    const promises = [];
    
    // 4x4 grid centered around pinpoint
    for (let i = -2; i < 2; i++) {
      for (let j = -2; j < 2; j++) {
        const cellCenterLat = centerLat + (i + 0.5) * latStep;
        const cellCenterLon = centerLon + (j + 0.5) * lonStep;
        
        const bounds = [
          [centerLat + i * latStep, centerLon + j * lonStep],
          [centerLat + (i + 1) * latStep, centerLon + (j + 1) * lonStep]
        ];
        
        promises.push(
          airQualityAPI.getAirQualityData(cellCenterLat, cellCenterLon)
            .then(response => ({
              bounds,
              aqi: response.data?.aqi || 2
            }))
        );
      }
    }
    
    const results = await Promise.all(promises);
    setGridCells(results);
  };

  useEffect(() => {
    if (activeHeatmaps.includes('airQuality') && selectedLocation) {
      const zoom = map.getZoom();
      generateGrid(selectedLocation.lat, selectedLocation.lon, zoom);
    } else {
      setGridCells([]);
    }
    
    const handleZoom = () => {
      if (activeHeatmaps.includes('airQuality') && selectedLocation) {
        const zoom = map.getZoom();
        generateGrid(selectedLocation.lat, selectedLocation.lon, zoom);
      }
    };
    
    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [selectedLocation, activeHeatmaps, map]);

  if (!activeHeatmaps.includes('airQuality')) return null;

  return (
    <>
      {gridCells.map((cell, index) => (
        <Rectangle
          key={`aqi-${index}`}
          bounds={cell.bounds}
          pathOptions={{
            color: getAQIColor(cell.aqi),
            weight: 1,
            opacity: 0.7,
            fillColor: getAQIColor(cell.aqi),
            fillOpacity: 0.4
          }}
        />
      ))}
    </>
  );
};

export default AQIHeatmap;
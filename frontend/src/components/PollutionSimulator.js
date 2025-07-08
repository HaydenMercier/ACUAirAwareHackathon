import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/PollutionSimulator.css';

const PollutionSimulator = () => {
  const canvasRef = useRef(null);
  const [placedItems, setPlacedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  const [draggedPlacedItem, setDraggedPlacedItem] = useState(null);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [pollutionGrid, setPollutionGrid] = useState([]);
  const [averageAQI, setAverageAQI] = useState(50);
  const [windConfig, setWindConfig] = useState({ 
    speed: 10, 
    direction: 90, // degrees (0 = North, 90 = East, 180 = South, 270 = West)
    enabled: true 
  });
  const [hoveredItem, setHoveredItem] = useState(null);

  // Industry and natural feature definitions
  const industries = [
    { 
      id: 'mining', 
      name: 'Mining', 
      icon: '⛏️', 
      basePollution: 85,
      pollutants: { pm25: 40, pm10: 60, no2: 30, so2: 70, co: 25, o3: 15 }
    },
    { 
      id: 'agriculture', 
      name: 'Agriculture', 
      icon: '🚜', 
      basePollution: 25,
      pollutants: { pm25: 15, pm10: 20, no2: 10, so2: 5, co: 15, o3: 5 }
    },
    { 
      id: 'manufacturing', 
      name: 'Manufacturing', 
      icon: '🏭', 
      basePollution: 75,
      pollutants: { pm25: 35, pm10: 45, no2: 50, so2: 40, co: 30, o3: 20 }
    },
    { 
      id: 'renewable', 
      name: 'Renewable Power', 
      icon: '🌱', 
      basePollution: -10,
      pollutants: { pm25: -5, pm10: -5, no2: -3, so2: -2, co: -3, o3: -2 }
    },
    { 
      id: 'nonrenewable', 
      name: 'Non-Renewable Power', 
      icon: '⚡', 
      basePollution: 90,
      pollutants: { pm25: 45, pm10: 50, no2: 60, so2: 80, co: 40, o3: 30 }
    },
    { 
      id: 'population', 
      name: 'Population Centre', 
      icon: '🏘️', 
      basePollution: 40,
      pollutants: { pm25: 20, pm10: 25, no2: 35, so2: 15, co: 45, o3: 25 }
    }
  ];

  const naturalFeatures = [
    { 
      id: 'forest', 
      name: 'Forest', 
      icon: '🌲', 
      basePollution: -30,
      pollutants: { pm25: -15, pm10: -20, no2: -10, so2: -8, co: -12, o3: -25 }
    },
    { 
      id: 'valley', 
      name: 'Valley', 
      icon: '🏔️', 
      basePollution: 15,
      pollutants: { pm25: 10, pm10: 12, no2: 8, so2: 6, co: 8, o3: 5 }
    },
    { 
      id: 'mountain', 
      name: 'Mountain', 
      icon: '⛰️', 
      basePollution: -20,
      pollutants: { pm25: -10, pm10: -15, no2: -8, so2: -6, co: -8, o3: -5 }
    },
    { 
      id: 'river', 
      name: 'River', 
      icon: '🌊', 
      basePollution: -15,
      pollutants: { pm25: -8, pm10: -10, no2: -5, so2: -4, co: -6, o3: -3 }
    },
    { 
      id: 'ocean', 
      name: 'Ocean', 
      icon: '🌊', 
      basePollution: -25,
      pollutants: { pm25: -12, pm10: -15, no2: -8, so2: -6, co: -10, o3: -8 }
    },
    { 
      id: 'lake', 
      name: 'Lake', 
      icon: '🏞️', 
      basePollution: -18,
      pollutants: { pm25: -9, pm10: -12, no2: -6, so2: -4, co: -7, o3: -5 }
    }
  ];

  // Initialize pollution grid based on canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gridWidth = Math.ceil(canvas.width / (10 * zoom));
    const gridHeight = Math.ceil(canvas.height / (10 * zoom));
    
    const newGrid = Array(gridHeight).fill().map(() => 
      Array(gridWidth).fill().map(() => ({
        aqi: 50,
        pollutants: { pm25: 10, pm10: 15, no2: 20, so2: 10, co: 15, o3: 25 }
      }))
    );
    setPollutionGrid(newGrid);
  }, [zoom]);

  // Calculate pollution based on placed items with camera-relative positioning and wind effects
  const calculatePollution = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gridWidth = Math.ceil(canvas.width / (10 * zoom));
    const gridHeight = Math.ceil(canvas.height / (10 * zoom));
    
    const newGrid = Array(gridHeight).fill().map(() => 
      Array(gridWidth).fill().map(() => ({
        aqi: 50,
        pollutants: { pm25: 10, pm10: 15, no2: 20, so2: 10, co: 15, o3: 25 }
      }))
    );

    if (placedItems.length === 0) {
      setPollutionGrid(newGrid);
      setAverageAQI(50);
      return;
    }

    // Apply influence from each placed item with improved wind effects
    placedItems.forEach(item => {
      const itemData = [...industries, ...naturalFeatures].find(i => i.id === item.type);
      if (!itemData) return;

      // Convert world coordinates to grid coordinates
      const worldX = item.x - camera.x;
      const worldY = item.y - camera.y;
      const itemGridX = Math.floor(worldX / (10 * zoom));
      const itemGridY = Math.floor(worldY / (10 * zoom));
      
      // Calculate influence radius based on item properties and zoom
      const intensityMultiplier = item.properties?.intensity || 1;
      const areaMultiplier = Math.sqrt((item.properties?.area || item.properties?.population || 1000) / 1000);
      const baseRadius = Math.max(3, intensityMultiplier * areaMultiplier * 5 / zoom);

      // Wind effect calculations
      const windRadians = (windConfig.direction * Math.PI) / 180;
      const windStrength = windConfig.enabled ? windConfig.speed / 30 : 0; // Reduced for smoother effect

      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const dx = x - itemGridX;
          const dy = y - itemGridY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance <= baseRadius * 3) { // Extended range for smoother transitions
            let influence = Math.max(0, 1 - (distance / baseRadius));
            
            // Apply gradual wind smearing effect
            if (windConfig.enabled && windStrength > 0) {
              // Calculate angle from source to current point
              const pointAngle = Math.atan2(dy, dx);
              const windAngle = windRadians - Math.PI / 2; // Adjust for coordinate system
              
              // Calculate how aligned this point is with wind direction
              let angleDiff = Math.abs(pointAngle - windAngle);
              if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
              
              // Normalize angle difference (0 = perfectly aligned, π = opposite)
              const alignment = 1 - (angleDiff / Math.PI);
              
              // Create elliptical spread in wind direction
              const windFactor = 1 + (alignment * windStrength * 2);
              const crossWindFactor = 1 - (alignment * windStrength * 0.3);
              
              // Apply wind distortion to influence calculation
              const windDistortedDistance = distance / Math.sqrt(windFactor * crossWindFactor);
              influence = Math.max(0, 1 - (windDistortedDistance / baseRadius));
              
              // Extend pollution plume in wind direction with gradual falloff
              if (alignment > 0.3) { // Only extend if reasonably aligned with wind
                const extensionFactor = alignment * windStrength * 1.5;
                const extendedRadius = baseRadius * (1 + extensionFactor);
                const extendedInfluence = Math.max(0, 1 - (distance / extendedRadius));
                influence = Math.max(influence, extendedInfluence * 0.7); // Slightly reduced for realism
              }
              
              // Add turbulence effect for more natural dispersion
              const turbulence = Math.sin(dx * 0.1) * Math.cos(dy * 0.1) * windStrength * 0.1;
              influence *= (1 + turbulence);
            }
            
            // Apply smooth falloff at edges
            influence = Math.pow(influence, 1.2); // Slightly steeper falloff for better definition
            
            if (influence > 0.01) { // Only apply if influence is meaningful
              const pollutionEffect = itemData.basePollution * influence * intensityMultiplier * areaMultiplier;
              
              newGrid[y][x].aqi += pollutionEffect;
              
              // Apply pollutant-specific effects
              Object.keys(itemData.pollutants).forEach(pollutant => {
                newGrid[y][x].pollutants[pollutant] += 
                  itemData.pollutants[pollutant] * influence * intensityMultiplier * areaMultiplier;
              });
            }
          }
        }
      }
    });

    // Ensure AQI stays within reasonable bounds
    newGrid.forEach(row => {
      row.forEach(cell => {
        cell.aqi = Math.max(0, Math.min(500, cell.aqi));
        Object.keys(cell.pollutants).forEach(pollutant => {
          cell.pollutants[pollutant] = Math.max(0, cell.pollutants[pollutant]);
        });
      });
    });

    setPollutionGrid(newGrid);

    // Calculate average AQI for visible area only
    const visibleCells = newGrid.flat();
    const totalAQI = visibleCells.reduce((sum, cell) => sum + cell.aqi, 0);
    setAverageAQI(Math.round(totalAQI / visibleCells.length));
  }, [placedItems, camera, zoom, industries, naturalFeatures, windConfig]);

  useEffect(() => {
    calculatePollution();
  }, [placedItems, camera, zoom, windConfig, calculatePollution]);

  // Render pollution heatmap that fills the entire canvas
  const renderHeatmap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || pollutionGrid.length === 0) return;

    const ctx = canvas.getContext('2d');
    const gridHeight = pollutionGrid.length;
    const gridWidth = pollutionGrid[0]?.length || 0;
    const cellSize = 10 * zoom;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pollution heatmap covering entire canvas
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const cell = pollutionGrid[y][x];
        const aqi = cell.aqi;
        
        // Color based on AQI with better opacity scaling
        let color;
        if (aqi <= 50) {
          const intensity = Math.max(0.1, Math.min(0.6, aqi / 50 * 0.5));
          color = `rgba(0, 255, 0, ${intensity})`;
        } else if (aqi <= 100) {
          const intensity = Math.max(0.2, Math.min(0.7, (aqi - 50) / 50 * 0.5 + 0.2));
          color = `rgba(255, 255, 0, ${intensity})`;
        } else if (aqi <= 150) {
          const intensity = Math.max(0.3, Math.min(0.8, (aqi - 100) / 50 * 0.5 + 0.3));
          color = `rgba(255, 165, 0, ${intensity})`;
        } else if (aqi <= 200) {
          const intensity = Math.max(0.4, Math.min(0.85, (aqi - 150) / 50 * 0.45 + 0.4));
          color = `rgba(255, 0, 0, ${intensity})`;
        } else if (aqi <= 300) {
          const intensity = Math.max(0.5, Math.min(0.9, (aqi - 200) / 100 * 0.4 + 0.5));
          color = `rgba(128, 0, 128, ${intensity})`;
        } else {
          const intensity = Math.max(0.6, Math.min(0.95, (aqi - 300) / 200 * 0.35 + 0.6));
          color = `rgba(128, 0, 0, ${intensity})`;
        }

        ctx.fillStyle = color;
        ctx.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );
      }
    }

    // Draw placed items with camera offset
    placedItems.forEach(item => {
      const itemData = [...industries, ...naturalFeatures].find(i => i.id === item.type);
      if (!itemData) return;

      const screenX = item.x - camera.x;
      const screenY = item.y - camera.y;

      // Only draw if item is visible on screen
      if (screenX >= -50 && screenX <= canvas.width + 50 && 
          screenY >= -50 && screenY <= canvas.height + 50) {
        
        const isHovered = hoveredItem && hoveredItem.id === item.id;
        const iconSize = Math.max(16, 24 * zoom);
        
        ctx.font = `${iconSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillStyle = 'white';
        ctx.fillText(itemData.icon, screenX, screenY);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw interaction circle for better UX
        if (item.selected || isHovered) {
          const intensityMultiplier = item.properties?.intensity || 1;
          const areaMultiplier = Math.sqrt((item.properties?.area || item.properties?.population || 1000) / 1000);
          const radius = Math.max(30, intensityMultiplier * areaMultiplier * 50 * zoom);
          
          ctx.strokeStyle = item.selected ? 'rgba(255, 255, 0, 0.8)' : 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = item.selected ? 3 : 2;
          ctx.setLineDash(item.selected ? [] : [5, 5]);
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw clickable area indicator with proper circular boundary
        if (isHovered || item.selected) {
          ctx.strokeStyle = 'rgba(100, 150, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(screenX, screenY, 25, 0, 2 * Math.PI); // Match the click radius
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Highlight dragged item
        if (draggedPlacedItem && draggedPlacedItem.id === item.id) {
          ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(screenX, screenY, 35, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    });

    // Draw wind indicator
    if (windConfig.enabled) {
      const windX = canvas.width - 80;
      const windY = canvas.height - 80;
      const windLength = Math.max(20, windConfig.speed * 2);
      
      // Wind background circle
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.arc(windX, windY, 35, 0, 2 * Math.PI);
      ctx.fill();
      
      // Wind direction arrow
      const windRadians = (windConfig.direction * Math.PI) / 180;
      const arrowX = windX + Math.sin(windRadians) * windLength;
      const arrowY = windY - Math.cos(windRadians) * windLength;
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(windX, windY);
      ctx.lineTo(arrowX, arrowY);
      ctx.stroke();
      
      // Arrow head
      const headLength = 8;
      const headAngle = Math.PI / 6;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - headLength * Math.sin(windRadians + headAngle),
        arrowY + headLength * Math.cos(windRadians + headAngle)
      );
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - headLength * Math.sin(windRadians - headAngle),
        arrowY + headLength * Math.cos(windRadians - headAngle)
      );
      ctx.stroke();
      
      // Wind speed text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${windConfig.speed} km/h`, windX, windY + 50);
    }

    // Draw scale indicator
    const scaleLength = 100 * zoom;
    const scaleKm = Math.round(scaleLength / zoom / 10);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, canvas.height - 50, scaleLength + 20, 30);
    ctx.fillStyle = 'white';
    ctx.fillRect(25, canvas.height - 45, scaleLength, 4);
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${scaleKm} km`, 25 + scaleLength / 2, canvas.height - 30);
  }, [pollutionGrid, placedItems, zoom, camera, industries, naturalFeatures, draggedPlacedItem, hoveredItem, windConfig]);

  useEffect(() => {
    renderHeatmap();
  }, [renderHeatmap]);

  // Handle drag and drop
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    
    // Convert screen coordinates to world coordinates
    const worldX = screenX + camera.x;
    const worldY = screenY + camera.y;

    const newItem = {
      id: Date.now(),
      type: draggedItem.id,
      x: worldX,
      y: worldY,
      properties: getDefaultProperties(draggedItem.id),
      selected: false
    };

    setPlacedItems(prev => [...prev, newItem]);
    setDraggedItem(null);
  };

  const getDefaultProperties = (type) => {
    switch (type) {
      case 'population':
        return { population: 10000, area: 100, intensity: 1 };
      case 'mining':
        return { workers: 500, area: 200, intensity: 2 };
      case 'manufacturing':
        return { workers: 1000, area: 150, intensity: 1.5 };
      case 'agriculture':
        return { area: 1000, workers: 50, intensity: 1 };
      case 'renewable':
        return { capacity: 100, area: 80, intensity: 1 };
      case 'nonrenewable':
        return { capacity: 500, area: 120, intensity: 2 };
      case 'forest':
        return { area: 500, density: 80, intensity: 1.5 };
      case 'valley':
        return { area: 300, depth: 100, intensity: 1 };
      case 'mountain':
        return { area: 400, height: 1000, intensity: 1.2 };
      case 'river':
        return { length: 200, flow: 100, intensity: 1 };
      case 'ocean':
        return { area: 2000, depth: 1000, intensity: 2 };
      case 'lake':
        return { area: 150, depth: 50, intensity: 1 };
      default:
        return { area: 100, intensity: 1 };
    }
  };

  // Handle regular clicks (not right-clicks)
  const handleClick = (e) => {
    if (contextMenu) {
      setContextMenu(null);
    }
    
    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldX = screenX + camera.x;
    const worldY = screenY + camera.y;

    // Use circular hit detection with proper radius
    const clickRadius = 25; // Circular click area radius
    const clickedItem = placedItems.find(item => {
      const distance = Math.sqrt((item.x - worldX) ** 2 + (item.y - worldY) ** 2);
      return distance <= clickRadius;
    });

    if (clickedItem) {
      // Select the clicked item
      setPlacedItems(prev => prev.map(item => ({
        ...item,
        selected: item.id === clickedItem.id
      })));
    } else {
      // Deselect all items when clicking empty space
      setPlacedItems(prev => prev.map(item => ({ ...item, selected: false })));
    }
  };

  // Handle right-click context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    
    // Check if clicking on wind indicator
    const windX = rect.width - 80;
    const windY = rect.height - 80;
    const windDistance = Math.sqrt((screenX - windX) ** 2 + (screenY - windY) ** 2);
    
    if (windDistance <= 35) {
      // Right-clicked on wind indicator
      setEditModal({
        id: 'wind',
        type: 'wind',
        properties: { ...windConfig }
      });
      return;
    }
    
    // Convert to world coordinates
    const worldX = screenX + camera.x;
    const worldY = screenY + camera.y;

    // Use circular hit detection for context menu too
    const clickRadius = 25;
    const clickedItem = placedItems.find(item => {
      const distance = Math.sqrt((item.x - worldX) ** 2 + (item.y - worldY) ** 2);
      return distance <= clickRadius;
    });

    if (clickedItem) {
      // Select the item
      setPlacedItems(prev => prev.map(item => ({
        ...item,
        selected: item.id === clickedItem.id
      })));
      
      // Check if item has editable properties
      const hasEditableProperties = Object.keys(clickedItem.properties).length > 0;
      
      if (hasEditableProperties) {
        setContextMenu({ x: e.clientX, y: e.clientY, item: clickedItem });
      } else {
        // Show "no editable fields" context menu
        setContextMenu({ 
          x: e.clientX, 
          y: e.clientY, 
          item: clickedItem, 
          noEditableFields: true 
        });
      }
    } else {
      // Deselect all items
      setPlacedItems(prev => prev.map(item => ({ ...item, selected: false })));
    }
  };

  // Handle zoom with mouse wheel
  const handleWheel = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom * delta));
    
    // Zoom towards mouse position
    const zoomFactor = newZoom / zoom;
    const newCameraX = mouseX - (mouseX - camera.x) * zoomFactor;
    const newCameraY = mouseY - (mouseY - camera.y) * zoomFactor;
    
    setZoom(newZoom);
    setCamera({ x: newCameraX, y: newCameraY });
  };

  // Handle mouse down for panning and item dragging
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Left mouse button
      const rect = canvasRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldX = screenX + camera.x;
      const worldY = screenY + camera.y;

      // Check if clicking on an item using circular hit detection
      const clickRadius = 25;
      const clickedItem = placedItems.find(item => {
        const distance = Math.sqrt((item.x - worldX) ** 2 + (item.y - worldY) ** 2);
        return distance <= clickRadius;
      });

      if (clickedItem) {
        setIsDraggingItem(true);
        setDraggedPlacedItem(clickedItem);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      } else {
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      }
    }
  };

  // Handle mouse move for panning and item dragging
  const handleMouseMove = (e) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setCamera(prev => ({ x: prev.x - deltaX, y: prev.y - deltaY }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    } else if (isDraggingItem && draggedPlacedItem) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPlacedItems(prev => prev.map(item => 
        item.id === draggedPlacedItem.id 
          ? { ...item, x: item.x + deltaX, y: item.y + deltaY }
          : item
      ));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    } else {
      // Handle hover effects with circular hit detection
      const rect = canvasRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldX = screenX + camera.x;
      const worldY = screenY + camera.y;

      const hoverRadius = 25;
      const hoveredItem = placedItems.find(item => {
        const distance = Math.sqrt((item.x - worldX) ** 2 + (item.y - worldY) ** 2);
        return distance <= hoverRadius;
      });

      setHoveredItem(hoveredItem || null);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsPanning(false);
    setIsDraggingItem(false);
    setDraggedPlacedItem(null);
  };

  // Get AQI color and label
  const getAQIInfo = (aqi) => {
    if (aqi <= 50) return { color: '#00e400', label: 'Good' };
    if (aqi <= 100) return { color: '#ffff00', label: 'Moderate' };
    if (aqi <= 150) return { color: '#ff7e00', label: 'Unhealthy for Sensitive' };
    if (aqi <= 200) return { color: '#ff0000', label: 'Unhealthy' };
    if (aqi <= 300) return { color: '#8f3f97', label: 'Very Unhealthy' };
    return { color: '#7e0023', label: 'Hazardous' };
  };

  const aqiInfo = getAQIInfo(averageAQI);

  return (
    <div className="pollution-simulator">
      <div className="simulator-header">
        <h1>🌍 Interactive Pollution Simulator</h1>
        <p>Drag and drop industries and natural features to see their impact on air quality</p>
      </div>

      <div className="simulator-content">
        <div className="toolbox">
          <div className="tool-section">
            <h3>🏭 Industries</h3>
            <div className="tool-grid">
              {industries.map(industry => (
                <div
                  key={industry.id}
                  className="tool-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, industry)}
                  title={`${industry.name} - Base Pollution: ${industry.basePollution}`}
                >
                  <span className="tool-icon">{industry.icon}</span>
                  <span className="tool-name">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="tool-section">
            <h3>🌿 Natural Features</h3>
            <div className="tool-grid">
              {naturalFeatures.map(feature => (
                <div
                  key={feature.id}
                  className="tool-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, feature)}
                  title={`${feature.name} - Base Effect: ${feature.basePollution}`}
                >
                  <span className="tool-icon">{feature.icon}</span>
                  <span className="tool-name">{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="map-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className={`simulation-canvas ${isPanning ? 'panning' : ''} ${isDraggingItem ? 'dragging-item' : ''} ${hoveredItem ? 'hovering-item' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          <div className="map-controls">
            <button onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}>🔍+</button>
            <button onClick={() => setZoom(prev => Math.max(0.5, prev * 0.8))}>🔍-</button>
            <button onClick={() => { setZoom(1); setCamera({ x: 0, y: 0 }); }}>🎯</button>
            <button onClick={() => setPlacedItems([])}>🗑️</button>
          </div>
        </div>

        <div className="aqi-panel">
          <div className="aqi-display">
            <h3>Average AQI</h3>
            <div 
              className="aqi-value"
              style={{ backgroundColor: aqiInfo.color }}
            >
              {averageAQI}
            </div>
            <div className="aqi-label">{aqiInfo.label}</div>
          </div>

          <div className="aqi-legend">
            <h4>AQI Scale</h4>
            <div className="legend-item" style={{ backgroundColor: '#00e400' }}>
              0-50 Good
            </div>
            <div className="legend-item" style={{ backgroundColor: '#ffff00' }}>
              51-100 Moderate
            </div>
            <div className="legend-item" style={{ backgroundColor: '#ff7e00' }}>
              101-150 Unhealthy for Sensitive
            </div>
            <div className="legend-item" style={{ backgroundColor: '#ff0000' }}>
              151-200 Unhealthy
            </div>
            <div className="legend-item" style={{ backgroundColor: '#8f3f97' }}>
              201-300 Very Unhealthy
            </div>
            <div className="legend-item" style={{ backgroundColor: '#7e0023' }}>
              300+ Hazardous
            </div>
          </div>

          <div className="simulation-stats">
            <h4>📊 Statistics</h4>
            <div className="stat-item">
              <span>Items Placed:</span>
              <span>{placedItems.length}</span>
            </div>
            <div className="stat-item">
              <span>Zoom Level:</span>
              <span>{(zoom * 100).toFixed(0)}%</span>
            </div>
            <div className="stat-item">
              <span>View Scale:</span>
              <span>{Math.round(100 / zoom)} km per 100px</span>
            </div>
            <div className="stat-item">
              <span>Camera X:</span>
              <span>{Math.round(camera.x / 10)} km</span>
            </div>
            <div className="stat-item">
              <span>Camera Y:</span>
              <span>{Math.round(camera.y / 10)} km</span>
            </div>
          </div>

          <div className="wind-stats">
            <h4>🌬️ Wind</h4>
            <div className="stat-item">
              <span>Status:</span>
              <span>{windConfig.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            {windConfig.enabled && (
              <>
                <div className="stat-item">
                  <span>Speed:</span>
                  <span>{windConfig.speed} km/h</span>
                </div>
                <div className="stat-item">
                  <span>Direction:</span>
                  <span>{windConfig.direction}° ({
                    windConfig.direction < 45 || windConfig.direction >= 315 ? 'N' :
                    windConfig.direction < 135 ? 'E' :
                    windConfig.direction < 225 ? 'S' : 'W'
                  })</span>
                </div>
              </>
            )}
            <div className="wind-help">
              <small>Right-click the wind indicator (bottom-right) to configure</small>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.noEditableFields ? (
            <>
              <div className="context-menu-info">
                No editable fields available
              </div>
              <button onClick={() => {
                setPlacedItems(prev => prev.filter(item => item.id !== contextMenu.item.id));
                setContextMenu(null);
              }}>
                Remove
              </button>
              <button onClick={() => setContextMenu(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => {
                setEditModal(contextMenu.item);
                setContextMenu(null);
              }}>
                Edit Properties
              </button>
              <button onClick={() => {
                setPlacedItems(prev => prev.filter(item => item.id !== contextMenu.item.id));
                setContextMenu(null);
              }}>
                Remove
              </button>
              <button onClick={() => setContextMenu(null)}>
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>
              {editModal.type === 'wind' 
                ? 'Wind Configuration' 
                : `Edit ${[...industries, ...naturalFeatures].find(i => i.id === editModal.type)?.name}`
              }
            </h3>
            <div className="modal-content">
              {editModal.type === 'wind' ? (
                <>
                  <div className="property-input">
                    <label>Wind Speed (km/h):</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editModal.properties.speed}
                      onChange={(e) => {
                        const newValue = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                        setEditModal(prev => ({
                          ...prev,
                          properties: { ...prev.properties, speed: newValue }
                        }));
                      }}
                    />
                  </div>
                  <div className="property-input">
                    <label>Wind Direction (degrees):</label>
                    <input
                      type="number"
                      min="0"
                      max="359"
                      value={editModal.properties.direction}
                      onChange={(e) => {
                        const newValue = Math.max(0, Math.min(359, parseFloat(e.target.value) || 0));
                        setEditModal(prev => ({
                          ...prev,
                          properties: { ...prev.properties, direction: newValue }
                        }));
                      }}
                    />
                    <small>0° = North, 90° = East, 180° = South, 270° = West</small>
                  </div>
                  <div className="property-input">
                    <label>
                      <input
                        type="checkbox"
                        checked={editModal.properties.enabled}
                        onChange={(e) => {
                          setEditModal(prev => ({
                            ...prev,
                            properties: { ...prev.properties, enabled: e.target.checked }
                          }));
                        }}
                      />
                      Enable Wind Effects
                    </label>
                  </div>
                </>
              ) : (
                Object.entries(editModal.properties).map(([key, value]) => (
                  <div key={key} className="property-input">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value) || 0;
                        setEditModal(prev => ({
                          ...prev,
                          properties: { ...prev.properties, [key]: newValue }
                        }));
                      }}
                    />
                  </div>
                ))
              )}
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                if (editModal.type === 'wind') {
                  setWindConfig(editModal.properties);
                } else {
                  setPlacedItems(prev => prev.map(item => 
                    item.id === editModal.id ? editModal : item
                  ));
                }
                setEditModal(null);
              }}>
                Save
              </button>
              <button onClick={() => setEditModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close context menu */}
      {contextMenu && (
        <div 
          className="context-overlay"
          onClick={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default PollutionSimulator;

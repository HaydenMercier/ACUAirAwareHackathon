import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '../styles/IndustryMapper.css';

// Industry configurations with realistic pollution weightings
const INDUSTRY_CONFIGS = {
  mining: {
    name: 'Mining',
    icon: '⛏️',
    color: '#8B4513',
    baseEmissions: {
      pm25: 45,
      pm10: 85,
      no2: 35,
      so2: 60,
      co: 25,
      o3: 15
    },
    defaultSettings: {
      operationScale: 'medium',
      dailyOutput: 1000,
      equipmentAge: 'modern'
    }
  },
  agriculture: {
    name: 'Agriculture',
    icon: '🚜',
    color: '#228B22',
    baseEmissions: {
      pm25: 15,
      pm10: 30,
      no2: 20,
      so2: 5,
      co: 10,
      o3: 25
    },
    defaultSettings: {
      farmSize: 500,
      cropType: 'mixed',
      livestockCount: 100
    }
  },
  manufacturing: {
    name: 'Manufacturing',
    icon: '🏭',
    color: '#4682B4',
    baseEmissions: {
      pm25: 55,
      pm10: 75,
      no2: 65,
      so2: 45,
      co: 40,
      o3: 20
    },
    defaultSettings: {
      facilitySize: 'large',
      productionType: 'general',
      emissionControls: 'standard'
    }
  },
  renewablePower: {
    name: 'Renewable Power',
    icon: '🌱',
    color: '#32CD32',
    baseEmissions: {
      pm25: 2,
      pm10: 3,
      no2: 1,
      so2: 1,
      co: 1,
      o3: 0
    },
    defaultSettings: {
      capacity: 100,
      powerType: 'solar',
      efficiency: 'high'
    }
  },
  nonRenewablePower: {
    name: 'Non-Renewable Power',
    icon: '⚡',
    color: '#DC143C',
    baseEmissions: {
      pm25: 75,
      pm10: 95,
      no2: 85,
      so2: 120,
      co: 55,
      o3: 30
    },
    defaultSettings: {
      capacity: 500,
      fuelType: 'coal',
      efficiency: 'standard'
    }
  },
  populationCentres: {
    name: 'Population Centre',
    icon: '🏘️',
    color: '#FF6347',
    baseEmissions: {
      pm25: 25,
      pm10: 35,
      no2: 45,
      so2: 15,
      co: 35,
      o3: 40
    },
    defaultSettings: {
      population: 10000,
      density: 'medium',
      transportMode: 'mixed'
    }
  }
};

// Custom map component to handle clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    }
  });
  return null;
}

// Draggable industry item component
function DraggableIndustry({ industryKey, config, onDragStart }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('industry', industryKey);
    onDragStart(industryKey);
  };

  return (
    <div
      className="draggable-industry"
      draggable
      onDragStart={handleDragStart}
      style={{ borderColor: config.color }}
    >
      <div className="industry-icon" style={{ backgroundColor: config.color }}>
        {config.icon}
      </div>
      <span className="industry-name">{config.name}</span>
    </div>
  );
}

// Placed industry component with context menu
function PlacedIndustry({ industry, onEdit, onRemove }) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleEdit = () => {
    setShowContextMenu(false);
    onEdit(industry);
  };

  const handleRemove = () => {
    setShowContextMenu(false);
    onRemove(industry.id);
  };

  return (
    <>
      <div
        className="placed-industry"
        onContextMenu={handleRightClick}
        style={{
          left: industry.position.x,
          top: industry.position.y,
          backgroundColor: industry.config.color
        }}
      >
        <span className="placed-industry-icon">{industry.config.icon}</span>
      </div>
      
      {showContextMenu && (
        <>
          <div 
            className="context-menu-overlay" 
            onClick={() => setShowContextMenu(false)}
          />
          <div
            className="context-menu"
            style={{
              left: contextMenuPos.x,
              top: contextMenuPos.y
            }}
          >
            <button onClick={handleEdit}>Edit Settings</button>
            <button onClick={handleRemove} className="remove-btn">Remove</button>
          </div>
        </>
      )}
    </>
  );
}

// Settings modal component
function SettingsModal({ industry, onSave, onClose }) {
  const [settings, setSettings] = useState(industry.settings);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(industry.id, settings);
    onClose();
  };

  const renderSettingInput = (key, value) => {
    const config = industry.config;
    
    switch (key) {
      case 'population':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSettingChange(key, parseInt(e.target.value))}
            min="100"
            max="1000000"
            step="100"
          />
        );
      case 'operationScale':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(key, e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        );
      case 'fuelType':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(key, e.target.value)}
          >
            <option value="coal">Coal</option>
            <option value="natural-gas">Natural Gas</option>
            <option value="oil">Oil</option>
            <option value="nuclear">Nuclear</option>
          </select>
        );
      case 'powerType':
        return (
          <select
            value={value}
            onChange={(e) => handleSettingChange(key, e.target.value)}
          >
            <option value="solar">Solar</option>
            <option value="wind">Wind</option>
            <option value="hydro">Hydro</option>
            <option value="geothermal">Geothermal</option>
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleSettingChange(key, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="settings-modal">
        <div className="modal-header">
          <h3>Edit {industry.config.name} Settings</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="setting-row">
              <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
              {renderSettingInput(key, value)}
            </div>
          ))}
          
          <div className="emission-preview">
            <h4>Estimated Emissions Impact:</h4>
            <div className="emission-grid">
              {Object.entries(calculateEmissions(industry.config, settings)).map(([pollutant, value]) => (
                <div key={pollutant} className="emission-item">
                  <span className="pollutant">{pollutant.toUpperCase()}:</span>
                  <span className="value">{value.toFixed(1)} μg/m³</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// Calculate emissions based on industry type and settings
function calculateEmissions(config, settings) {
  const emissions = { ...config.baseEmissions };
  
  // Apply multipliers based on settings
  Object.entries(settings).forEach(([key, value]) => {
    let multiplier = 1;
    
    switch (key) {
      case 'population':
        multiplier = Math.log10(value / 1000) / 2;
        break;
      case 'operationScale':
        multiplier = value === 'small' ? 0.5 : value === 'large' ? 2 : 1;
        break;
      case 'capacity':
        multiplier = value / 100;
        break;
      case 'fuelType':
        if (value === 'coal') multiplier = 1.5;
        else if (value === 'natural-gas') multiplier = 0.7;
        else if (value === 'nuclear') multiplier = 0.1;
        break;
      case 'emissionControls':
        multiplier = value === 'advanced' ? 0.6 : value === 'basic' ? 1.3 : 1;
        break;
    }
    
    Object.keys(emissions).forEach(pollutant => {
      emissions[pollutant] *= multiplier;
    });
  });
  
  return emissions;
}

function IndustryMapper() {
  const [placedIndustries, setPlacedIndustries] = useState([]);
  const [draggedIndustry, setDraggedIndustry] = useState(null);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [nextId, setNextId] = useState(1);
  const mapRef = useRef();

  const handleDragStart = (industryKey) => {
    setDraggedIndustry(industryKey);
  };

  const handleMapClick = (latlng) => {
    if (draggedIndustry) {
      const mapContainer = mapRef.current;
      const mapBounds = mapContainer.getBoundingClientRect();
      
      // Convert lat/lng to pixel position relative to map
      const map = mapContainer.leafletElement || mapContainer;
      const point = map.latLngToContainerPoint(latlng);
      
      const newIndustry = {
        id: nextId,
        type: draggedIndustry,
        config: INDUSTRY_CONFIGS[draggedIndustry],
        position: { x: point.x, y: point.y },
        latlng: latlng,
        settings: { ...INDUSTRY_CONFIGS[draggedIndustry].defaultSettings }
      };
      
      setPlacedIndustries(prev => [...prev, newIndustry]);
      setNextId(prev => prev + 1);
      setDraggedIndustry(null);
    }
  };

  const handleEditIndustry = (industry) => {
    setEditingIndustry(industry);
  };

  const handleSaveSettings = (industryId, newSettings) => {
    setPlacedIndustries(prev =>
      prev.map(industry =>
        industry.id === industryId
          ? { ...industry, settings: newSettings }
          : industry
      )
    );
  };

  const handleRemoveIndustry = (industryId) => {
    setPlacedIndustries(prev => prev.filter(industry => industry.id !== industryId));
  };

  const calculateTotalEmissions = () => {
    return placedIndustries.reduce((total, industry) => {
      const emissions = calculateEmissions(industry.config, industry.settings);
      Object.keys(emissions).forEach(pollutant => {
        total[pollutant] = (total[pollutant] || 0) + emissions[pollutant];
      });
      return total;
    }, {});
  };

  return (
    <div className="industry-mapper">
      <div className="mapper-header">
        <h2>🏭 Industry Impact Simulator</h2>
        <p>Drag industries onto the map to simulate their environmental impact</p>
      </div>

      <div className="mapper-content">
        <div className="industry-palette">
          <h3>Available Industries</h3>
          <div className="industry-grid">
            {Object.entries(INDUSTRY_CONFIGS).map(([key, config]) => (
              <DraggableIndustry
                key={key}
                industryKey={key}
                config={config}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
          
          {draggedIndustry && (
            <div className="drag-instruction">
              <p>📍 Click anywhere on the map to place {INDUSTRY_CONFIGS[draggedIndustry].name}</p>
            </div>
          )}
        </div>

        <div className="map-container">
          <MapContainer
            ref={mapRef}
            center={[32.7767, -96.7970]}
            zoom={10}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>
          
          {/* Overlay for placed industries */}
          <div className="map-overlay">
            {placedIndustries.map(industry => (
              <PlacedIndustry
                key={industry.id}
                industry={industry}
                onEdit={handleEditIndustry}
                onRemove={handleRemoveIndustry}
              />
            ))}
          </div>
        </div>

        <div className="emissions-summary">
          <h3>Total Emissions Impact</h3>
          {placedIndustries.length > 0 ? (
            <div className="emissions-grid">
              {Object.entries(calculateTotalEmissions()).map(([pollutant, value]) => (
                <div key={pollutant} className="emission-summary-item">
                  <span className="pollutant-name">{pollutant.toUpperCase()}</span>
                  <span className="emission-value">{value.toFixed(1)} μg/m³</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-industries">No industries placed yet. Drag some from the palette above!</p>
          )}
        </div>
      </div>

      {editingIndustry && (
        <SettingsModal
          industry={editingIndustry}
          onSave={handleSaveSettings}
          onClose={() => setEditingIndustry(null)}
        />
      )}
    </div>
  );
}

export default IndustryMapper;

# 🌍 Interactive Pollution Simulator

## Overview
The Interactive Pollution Simulator is a comprehensive web-based tool that allows users to visualize and understand the impact of various industries and natural features on air quality through an interactive drag-and-drop interface.

## Features

### 🏭 Industry Simulation
- **Mining Operations** ⛏️ - High pollution impact with PM2.5, PM10, NO2, SO2, CO, and O3 emissions
- **Agriculture** 🚜 - Moderate impact with particulate matter and ammonia emissions
- **Manufacturing** 🏭 - High impact with diverse pollutant emissions
- **Renewable Power** 🌱 - Negative pollution impact (air cleaning effect)
- **Non-Renewable Power** ⚡ - Very high impact with significant SO2 and NOx emissions
- **Population Centers** 🏘️ - Moderate impact from transportation and residential activities

### 🌿 Natural Features
- **Forests** 🌲 - Strong air purification effect, especially for ozone and particulates
- **Valleys** 🏔️ - Pollution trapping effect due to topography
- **Mountains** ⛰️ - Air dispersion and cleaning effect
- **Rivers** 🌊 - Moderate air quality improvement
- **Oceans** 🌊 - Strong air purification and wind dispersion
- **Lakes** 🏞️ - Moderate air quality improvement and humidity regulation

## Technical Implementation

### Core Components

#### PollutionSimulator.js
- Main component handling the simulation logic
- Manages drag-and-drop functionality
- Calculates real-time pollution effects
- Renders interactive heatmap visualization

#### Key Features:
1. **Drag & Drop Interface**
   - Clone-based dragging (unlimited instances)
   - Visual feedback during drag operations
   - Precise drop positioning on canvas

2. **Real-time Pollution Calculation**
   - Grid-based pollution modeling (50x50 cells)
   - Distance-based influence calculation
   - Realistic pollution dispersion algorithms
   - Multi-pollutant tracking (PM2.5, PM10, NO2, SO2, CO, O3)

3. **Interactive Heatmap**
   - Color-coded AQI visualization
   - Real-time updates based on placed items
   - Zoom and pan functionality
   - Scale indicator that updates with zoom level

4. **Context Menu System**
   - Right-click to edit item properties
   - Customizable parameters for each industry/feature
   - Remove items functionality

5. **Property Editing**
   - Population centers: Population size, intensity
   - Mining: Worker count, operation intensity
   - Manufacturing: Worker count, production intensity
   - Agriculture: Area coverage, farming intensity
   - Power plants: Capacity, operational intensity
   - Natural features: Size/area, environmental impact intensity

### Pollution Modeling

#### Industry Base Pollution Values:
- **Mining**: 85 AQI units (very high impact)
- **Non-Renewable Power**: 90 AQI units (highest impact)
- **Manufacturing**: 75 AQI units (high impact)
- **Population Centers**: 40 AQI units (moderate impact)
- **Agriculture**: 25 AQI units (low-moderate impact)
- **Renewable Power**: -10 AQI units (beneficial)

#### Natural Feature Effects:
- **Forests**: -30 AQI units (strong purification)
- **Oceans**: -25 AQI units (strong beneficial effect)
- **Mountains**: -20 AQI units (air dispersion)
- **Lakes**: -18 AQI units (moderate purification)
- **Rivers**: -15 AQI units (moderate beneficial effect)
- **Valleys**: +15 AQI units (pollution trapping)

#### Influence Calculation:
```javascript
influence = max(0, 1 - (distance / radius))
pollutionEffect = basePollution × influence × intensity
```

### User Interface

#### Layout:
- **Left Panel**: Draggable industry and natural feature toolbox
- **Center**: Interactive simulation canvas with heatmap
- **Right Panel**: AQI display, legend, and statistics

#### Controls:
- **Zoom**: Mouse wheel or +/- buttons
- **Pan**: Click and drag on canvas
- **Reset View**: Center button to reset zoom and pan
- **Clear All**: Trash button to remove all placed items

#### Visual Elements:
- **AQI Color Scale**:
  - Green (0-50): Good air quality
  - Yellow (51-100): Moderate
  - Orange (101-150): Unhealthy for sensitive groups
  - Red (151-200): Unhealthy
  - Purple (201-300): Very unhealthy
  - Maroon (300+): Hazardous

## Usage Instructions

### Getting Started:
1. Navigate to the Pollution Simulator from the main navigation
2. Drag industries or natural features from the left toolbox
3. Drop them onto the simulation canvas
4. Watch the real-time heatmap update

### Advanced Features:
1. **Editing Properties**:
   - Right-click on any placed item
   - Select "Edit Properties"
   - Modify parameters like population, intensity, or area
   - Click "Save" to apply changes

2. **Zoom and Navigation**:
   - Use mouse wheel to zoom in/out
   - Click and drag to pan around the map
   - Use control buttons for precise navigation
   - Scale indicator shows current map scale

3. **Analysis**:
   - Monitor average AQI in the right panel
   - Observe pollution hotspots and clean areas
   - Experiment with different industry combinations
   - Test mitigation strategies with natural features

## Educational Value

### Learning Objectives:
- Understand industrial pollution sources and their relative impacts
- Visualize how natural features can mitigate air pollution
- Explore the relationship between urban planning and air quality
- Learn about different types of air pollutants and their sources

### Realistic Scenarios:
- Urban planning with industrial zones
- Environmental impact assessment
- Green infrastructure planning
- Pollution mitigation strategies

## Technical Specifications

### Performance:
- 50x50 pollution grid for detailed simulation
- Real-time calculation updates
- Smooth 60fps canvas rendering
- Responsive design for various screen sizes

### Browser Compatibility:
- Modern browsers with HTML5 Canvas support
- Chrome, Firefox, Safari, Edge
- Mobile-responsive design

### Dependencies:
- React 18.2.0
- HTML5 Canvas API
- CSS Grid and Flexbox
- Modern JavaScript (ES6+)

## Future Enhancements

### Planned Features:
1. **Weather Integration**: Wind direction and speed effects
2. **Time-based Simulation**: Day/night cycles and seasonal variations
3. **Export Functionality**: Save simulation results and screenshots
4. **Preset Scenarios**: Pre-built city layouts and industrial configurations
5. **Multi-layer Analysis**: Separate visualization for different pollutants
6. **Collaborative Mode**: Share and collaborate on simulations

### Advanced Modeling:
1. **Atmospheric Dispersion**: More sophisticated pollution spread models
2. **Topographical Effects**: Elevation-based air flow simulation
3. **Chemical Reactions**: Secondary pollutant formation
4. **Health Impact Modeling**: Population health effect calculations

## Integration

The Pollution Simulator integrates seamlessly with the existing Smokestack application:
- Accessible via main navigation
- Consistent design language and user experience
- Shared components and styling
- Responsive layout matching the main application

## Conclusion

The Interactive Pollution Simulator provides an engaging, educational, and scientifically-grounded tool for understanding air pollution dynamics. It combines realistic pollution modeling with an intuitive user interface to create a powerful learning and analysis platform.

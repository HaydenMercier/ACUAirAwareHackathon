# Smokestack
**Interactive Air Pollution & Industry Correlation Tracker**

Real-time visualization of air pollution data correlated with industrial sources.

## Features

### 🗺️ Interactive Map View
- Real-time air quality data visualization
- Industry correlation analysis
- Heatmap overlays for pollution patterns
- Location-based air quality monitoring

### 🌍 Pollution Simulator (NEW!)
- **Drag & Drop Interface**: Place industries and natural features on an interactive map
- **Real-time Heatmap**: See immediate pollution impact visualization
- **Realistic Modeling**: Science-based pollution calculations for 6 different pollutants
- **Industry Types**: Mining, Agriculture, Manufacturing, Renewable/Non-renewable Power, Population Centers
- **Natural Features**: Forests, Valleys, Mountains, Rivers, Oceans, Lakes
- **Interactive Editing**: Right-click to modify properties like population, intensity, and area
- **Zoom & Pan**: Explore detailed pollution patterns with dynamic scale indicator
- **AQI Visualization**: Color-coded air quality index from Good (green) to Hazardous (maroon)

### 📊 Data Analysis
- Contributing industries identification
- Correlation metrics and impact assessment
- Historical data tracking
- Multi-standard AQI calculations (US EPA, EU, etc.)

## Quick Start
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend  
cd frontend && npm install && npm start
```

## New Pollution Simulator

The Interactive Pollution Simulator allows users to:
- **Experiment** with different industrial configurations
- **Visualize** pollution dispersion patterns
- **Learn** about environmental impact of various industries
- **Test** mitigation strategies using natural features
- **Understand** the relationship between urban planning and air quality

Access the simulator through the main navigation or the "🌍 Try Pollution Simulator" button on the homepage.

## Documentation

- [Pollution Simulator Guide](./POLLUTION_SIMULATOR.md) - Comprehensive feature documentation
- [Demo Scenarios](./SIMULATOR_DEMO.md) - Step-by-step usage examples
- [Data Sources](./DATA_SOURCES.md) - Information about data sources and APIs

## Technology Stack

- **Frontend**: React 18, HTML5 Canvas, CSS Grid/Flexbox
- **Backend**: Node.js, Express
- **APIs**: OpenWeather Air Pollution API, OpenStreetMap
- **Visualization**: Leaflet.js, Chart.js, Custom Canvas Rendering

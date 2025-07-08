const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

// OpenWeather API configuration
const OPENWEATHER_API_KEY = '3be424e00a7824fc37f33e2fb6db3eb9';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

app.use(cors());
app.use(express.json());

// Air Quality API endpoint
app.get('/api/air-quality', async (req, res) => {
  const { lat, lon } = req.query;
  
  console.log('\n🌍 === AIR QUALITY API REQUEST ===');
  console.log(`📍 Location: ${lat}, ${lon}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
  try {
    const url = `${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
    console.log(`📡 OpenWeather URL: ${url}`);
    
    const response = await axios.get(url);
    const airData = response.data.list[0];
    
    console.log('\n📊 === AIR QUALITY METRICS ===');
    console.log(`🔢 AQI: ${airData.main.aqi} (1=Good, 5=Very Poor)`);
    console.log(`💨 PM2.5: ${airData.components.pm2_5.toFixed(2)} μg/m³`);
    console.log(`💨 PM10: ${airData.components.pm10.toFixed(2)} μg/m³`);
    console.log(`🏭 NO2: ${airData.components.no2.toFixed(2)} μg/m³`);
    console.log(`🏭 SO2: ${airData.components.so2.toFixed(2)} μg/m³`);
    console.log(`🚗 CO: ${airData.components.co.toFixed(2)} μg/m³`);
    console.log(`☀️ O3: ${airData.components.o3.toFixed(2)} μg/m³`);
    
    // Health assessment
    const aqi = airData.main.aqi;
    const healthStatus = aqi <= 2 ? '✅ GOOD' : aqi <= 3 ? '⚠️ MODERATE' : '❌ POOR';
    console.log(`🏥 Health Status: ${healthStatus}`);
    
    const processedData = {
      aqi: airData.main.aqi,
      components: {
        pm2_5: airData.components.pm2_5,
        pm10: airData.components.pm10,
        no2: airData.components.no2,
        so2: airData.components.so2,
        co: airData.components.co,
        o3: airData.components.o3
      },
      source: 'openweather',
      location: { lat: parseFloat(lat), lon: parseFloat(lon) },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Response sent to frontend\n');
    res.json(processedData);
    
  } catch (error) {
    console.log('\n❌ === API ERROR ===');
    console.log(`Error: ${error.message}`);
    console.log(`Status: ${error.response?.status}`);
    console.log(`Response: ${JSON.stringify(error.response?.data)}`);
    
    res.status(500).json({ 
      error: 'Failed to fetch air quality data',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log('\n🚀 === AIR QUALITY BACKEND STARTED ===');
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying OpenWeather API calls`);
  console.log(`🔑 API Key: ${OPENWEATHER_API_KEY.substring(0, 8)}...`);
  console.log('📊 Air quality metrics will be logged here\n');
});
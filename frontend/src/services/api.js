import axios from 'axios';

// OpenWeather API configuration
const OPENWEATHER_API_KEY = '3be424e00a7824fc37f33e2fb6db3eb9';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getMockAirQualityData = (lat, lon) => {
  console.log('🔄 Generating mock air quality data for:', { lat, lon });
  const baseAQI = Math.floor(Math.random() * 3) + 2;
  const pm25 = 15 + Math.random() * 25;
  const no2 = 20 + Math.random() * 30;
  const so2 = 5 + Math.random() * 15;
  
  const mockData = {
    aqi: baseAQI,
    components: {
      pm2_5: pm25,
      pm10: pm25 * 1.5,
      no2: no2,
      so2: so2,
      co: 200 + Math.random() * 300,
      o3: 50 + Math.random() * 50
    },
    source: 'mock',
    location: { lat, lon }
  };
  
  console.log('✅ Mock data generated:', mockData);
  return { data: mockData };
};

export const airQualityAPI = {
  getAirQualityData: async (lat, lon) => {
    console.log('🌍 Frontend: Starting air quality API call for:', { lat, lon });
    
    try {
      console.log('📡 Frontend: Calling backend proxy...');
      const response = await axios.get(`http://localhost:3001/api/air-quality?lat=${lat}&lon=${lon}`, { timeout: 10000 });
      
      console.log('✅ Frontend: Backend response received:', {
        status: response.status,
        data: response.data
      });
      
      return { data: response.data };
      
    } catch (error) {
      console.error('❌ Frontend: Backend call failed:', {
        message: error.message,
        status: error.response?.status
      });
      
      console.log('🔄 Frontend: Falling back to mock data...');
      return getMockAirQualityData(lat, lon);
    }
  },
  
  getIndustryData: (bounds) => Promise.resolve({ data: [] }),
  getHistoricalData: (location, days = 7) => Promise.resolve({ data: [] }),
  getDeathsData: (lat, lon, timeframe) => Promise.resolve({ data: [] }),
  getIndustryHistorical: (lat, lon, interval, time) => Promise.resolve({ data: [] }),
};
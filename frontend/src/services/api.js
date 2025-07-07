import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const airQualityAPI = {
  getAirQualityData: (lat, lon) => api.get(`/air-quality?lat=${lat}&lon=${lon}`),
  getIndustryData: (bounds) => api.get('/industries', { params: bounds }),
  getHistoricalData: (location, days = 7) => api.get(`/air-quality/historical?location=${location}&days=${days}`),
  getDeathsData: (lat, lon, timeframe) => api.get(`/industries/deaths?lat=${lat}&lon=${lon}&timeframe=${timeframe}`),
  getIndustryHistorical: (lat, lon, interval, time) => api.get(`/industries/historical?lat=${lat}&lon=${lon}&interval=${interval}&time=${time}`),
};

export default api;
import axios from 'axios';

class MLService {
  constructor() {
    this.modelEndpoint = 'http://localhost:3001/api/ml/predict-aqi';
  }

  async predictAQI(latitude, longitude) {
    try {
      const response = await axios.post(this.modelEndpoint, {
        latitude,
        longitude
      });
      return response.data.aqi;
    } catch (error) {
      console.warn('ML prediction failed, using fallback:', error.message);
      // Fallback to geographic-based estimation
      return this.fallbackAQI(latitude, longitude);
    }
  }

  async predictAQIBatch(coordinates) {
    try {
      const response = await axios.post(`${this.modelEndpoint}/batch`, {
        coordinates
      });
      return response.data.predictions;
    } catch (error) {
      console.warn('ML batch prediction failed, using fallback');
      return coordinates.map(coord => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
        aqi: this.fallbackAQI(coord.latitude, coord.longitude)
      }));
    }
  }

  fallbackAQI(lat, lon) {
    // Simple geographic-based AQI estimation
    if (Math.abs(lat) < 30) return Math.floor(Math.random() * 2) + 3; // Urban/tropical: 3-4
    if (Math.abs(lat) > 60) return Math.floor(Math.random() * 2) + 1; // Polar: 1-2
    return Math.floor(Math.random() * 3) + 2; // Temperate: 2-4
  }
}

export default new MLService();
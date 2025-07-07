const axios = require('axios');

class AirQualityService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'http://api.openweathermap.org/data/2.5/air_pollution';
  }

  async getCurrentAirQuality(lat, lon) {
    // If no API key, return mock data for demo
    if (!this.apiKey) {
      return this.getMockData(lat, lon);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/current`, {
        params: { lat, lon, appid: this.apiKey }
      });
      return this.formatAirQualityData(response.data);
    } catch (error) {
      console.log('API failed, using mock data:', error.message);
      return this.getMockData(lat, lon);
    }
  }

  getMockData(lat, lon) {
    // Generate realistic mock data based on location
    const baseAQI = Math.floor(Math.random() * 100) + 50;
    return {
      aqi: baseAQI,
      components: {
        pm2_5: Math.random() * 25 + 10,
        pm10: Math.random() * 50 + 20,
        no2: Math.random() * 40 + 10,
        so2: Math.random() * 20 + 5,
        co: Math.random() * 1000 + 200,
        o3: Math.random() * 100 + 50
      },
      timestamp: new Date()
    };
  }

  async getHistoricalData(location, days = 7) {
    return { message: 'Historical data endpoint', location, days };
  }

  formatAirQualityData(data) {
    return {
      aqi: data.list[0].main.aqi,
      components: data.list[0].components,
      timestamp: new Date(data.list[0].dt * 1000)
    };
  }
}

module.exports = new AirQualityService();
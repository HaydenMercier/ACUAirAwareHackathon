const axios = require('axios');

class AirQualityService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'http://api.openweathermap.org/data/2.5/air_pollution';
  }

  async getCurrentAirQuality(lat, lon) {
    const response = await axios.get(`${this.baseUrl}/current`, {
      params: { lat, lon, appid: this.apiKey }
    });
    return this.formatAirQualityData(response.data);
  }

  async getHistoricalData(location, days = 7) {
    // Placeholder for historical data logic
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
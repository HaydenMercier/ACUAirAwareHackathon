const axios = require('axios');

class AirQualityService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'http://api.openweathermap.org/data/2.5/air_pollution';
  }

  async getCurrentAirQuality(lat, lon) {
    // If no API key, try to find nearest available data
    if (!this.apiKey) {
      console.log('No API key provided, searching for nearest available data');
      return this.findNearestAQIData(lat, lon);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/current`, {
        params: { lat, lon, appid: this.apiKey },
        timeout: 10000
      });
      
      // Check if response has valid data
      if (!response.data || !response.data.list || response.data.list.length === 0) {
        console.log('No AQI data available for this location, searching nearby');
        return this.findNearestAQIData(lat, lon);
      }
      
      return this.formatAirQualityData(response.data);
    } catch (error) {
      let errorInfo = { type: 'unknown', message: 'Unknown error occurred' };
      
      if (error.response?.status === 401) {
        errorInfo = { type: 'api_key', message: 'Invalid API key - check OpenWeather API configuration' };
      } else if (error.response?.status === 429) {
        errorInfo = { type: 'rate_limit', message: 'API rate limit exceeded - please wait before making more requests' };
      } else if (error.response?.status === 404) {
        errorInfo = { type: 'not_found', message: 'No air quality data available for this location' };
      } else if (error.code === 'ECONNABORTED') {
        errorInfo = { type: 'timeout', message: 'API request timed out - check internet connection' };
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorInfo = { type: 'network', message: 'Cannot connect to OpenWeather API - check internet connection' };
      } else {
        errorInfo = { type: 'api', message: `API Error: ${error.message}` };
      }
      
      console.log('API failed, searching nearby:', errorInfo.message);
      const result = await this.findNearestAQIData(lat, lon);
      result.error = errorInfo;
      return result;
    }
  }

  async findNearestAQIData(lat, lon) {
    if (!this.apiKey) {
      const result = this.getUnavailableData();
      result.error = { type: 'api_key', message: 'OpenWeather API key not configured' };
      return result;
    }

    // Search in expanding radius for nearest available data
    const searchRadii = [0.1, 0.5, 1.0, 2.0, 5.0]; // degrees
    
    for (const radius of searchRadii) {
      const nearbyPoints = this.generateNearbyPoints(lat, lon, radius);
      
      for (const point of nearbyPoints) {
        try {
          const response = await axios.get(`${this.baseUrl}/current`, {
            params: { lat: point.lat, lon: point.lon, appid: this.apiKey },
            timeout: 5000
          });
          
          if (response.data?.list?.length > 0) {
            const data = this.formatAirQualityData(response.data);
            data.source = 'nearest';
            data.distance = this.calculateDistance(lat, lon, point.lat, point.lon);
            console.log(`Found AQI data ${data.distance.toFixed(1)}km away`);
            return data;
          }
        } catch (error) {
          continue; // Try next point
        }
      }
    }
    
    return this.getUnavailableData();
  }
  
  generateNearbyPoints(lat, lon, radius) {
    const points = [];
    const steps = 8; // 8 directions around the point
    
    for (let i = 0; i < steps; i++) {
      const angle = (i * 2 * Math.PI) / steps;
      points.push({
        lat: lat + radius * Math.cos(angle),
        lon: lon + radius * Math.sin(angle)
      });
    }
    
    return points;
  }
  
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  getUnavailableData() {
    return {
      aqi: null,
      components: {
        pm2_5: null,
        pm10: null,
        no2: null,
        so2: null,
        co: null,
        o3: null
      },
      timestamp: new Date(),
      source: 'unavailable'
    };
  }

  async getHistoricalData(location, days = 7) {
    // Historical data requires OpenWeather historical API (paid tier)
    return { 
      message: 'Historical data not available - requires paid API access', 
      location, 
      days 
    };
  }

  formatAirQualityData(data) {
    const listItem = data.list[0];
    return {
      aqi: listItem.main?.aqi || null,
      components: {
        pm2_5: listItem.components?.pm2_5 || null,
        pm10: listItem.components?.pm10 || null,
        no2: listItem.components?.no2 || null,
        so2: listItem.components?.so2 || null,
        co: listItem.components?.co || null,
        o3: listItem.components?.o3 || null
      },
      timestamp: new Date(listItem.dt * 1000),
      source: 'openweather'
    };
  }
}

module.exports = new AirQualityService();
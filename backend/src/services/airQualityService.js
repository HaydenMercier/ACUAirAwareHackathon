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

    // Collect multiple nearby sensors for inverse distance weighting
    const sensors = [];
    const searchRadii = [0.1, 0.5, 1.0, 2.0]; // degrees
    
    for (const radius of searchRadii) {
      const nearbyPoints = this.generateNearbyPoints(lat, lon, radius);
      
      for (const point of nearbyPoints) {
        try {
          const response = await axios.get(`${this.baseUrl}/current`, {
            params: { lat: point.lat, lon: point.lon, appid: this.apiKey },
            timeout: 3000
          });
          
          if (response.data?.list?.length > 0) {
            const distance = this.calculateDistance(lat, lon, point.lat, point.lon);
            const data = this.formatAirQualityData(response.data);
            
            sensors.push({
              ...data,
              distance,
              lat: point.lat,
              lon: point.lon
            });
            
            // Stop searching if we have enough sensors
            if (sensors.length >= 4) break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (sensors.length >= 2) break; // Enough for interpolation
    }
    
    if (sensors.length === 0) {
      return this.getUnavailableData();
    }
    
    if (sensors.length === 1) {
      // Single sensor - return as nearest
      const result = sensors[0];
      result.source = 'nearest';
      console.log(`Found AQI data ${result.distance.toFixed(1)}km away`);
      return result;
    }
    
    // Multiple sensors - use inverse distance weighting
    return this.interpolateAQIData(lat, lon, sensors);
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
  
  interpolateAQIData(targetLat, targetLon, sensors) {
    // Inverse Distance Weighting (IDW) interpolation
    const power = 2; // IDW power parameter
    let totalWeight = 0;
    let weightedValues = {
      aqi: 0,
      pm2_5: 0,
      pm10: 0,
      no2: 0,
      so2: 0,
      co: 0,
      o3: 0
    };
    
    sensors.forEach(sensor => {
      const distance = Math.max(sensor.distance, 0.1); // Avoid division by zero
      const weight = 1 / Math.pow(distance, power);
      totalWeight += weight;
      
      // Weight each component
      if (sensor.aqi) weightedValues.aqi += sensor.aqi * weight;
      if (sensor.components.pm2_5) weightedValues.pm2_5 += sensor.components.pm2_5 * weight;
      if (sensor.components.pm10) weightedValues.pm10 += sensor.components.pm10 * weight;
      if (sensor.components.no2) weightedValues.no2 += sensor.components.no2 * weight;
      if (sensor.components.so2) weightedValues.so2 += sensor.components.so2 * weight;
      if (sensor.components.co) weightedValues.co += sensor.components.co * weight;
      if (sensor.components.o3) weightedValues.o3 += sensor.components.o3 * weight;
    });
    
    // Normalize by total weight
    const interpolatedData = {
      aqi: Math.round(weightedValues.aqi / totalWeight),
      components: {
        pm2_5: weightedValues.pm2_5 / totalWeight,
        pm10: weightedValues.pm10 / totalWeight,
        no2: weightedValues.no2 / totalWeight,
        so2: weightedValues.so2 / totalWeight,
        co: weightedValues.co / totalWeight,
        o3: weightedValues.o3 / totalWeight
      },
      timestamp: new Date(),
      source: 'interpolated',
      sensorCount: sensors.length,
      avgDistance: sensors.reduce((sum, s) => sum + s.distance, 0) / sensors.length
    };
    
    console.log(`Interpolated AQI from ${sensors.length} sensors, avg distance: ${interpolatedData.avgDistance.toFixed(1)}km`);
    return interpolatedData;
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
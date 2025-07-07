class IndustryService {
  async getIndustriesInBounds(bounds) {
    return {
      industries: [
        { id: 1, name: 'Oil Refinery', lat: 32.7767, lon: -96.7970, type: 'petroleum', icon: '⛽', emissions: 'High NO2' },
        { id: 2, name: 'Chemical Plant', lat: 32.7157, lon: -97.1331, type: 'chemical', icon: '🧪', emissions: 'High SO2' },
        { id: 3, name: 'Power Plant', lat: 32.8998, lon: -97.0403, type: 'energy', icon: '⚡', emissions: 'High PM2.5' },
        { id: 4, name: 'Steel Mill', lat: 32.6569, lon: -96.8716, type: 'steel', icon: '🏭', emissions: 'High PM10' },
        { id: 5, name: 'Cement Plant', lat: 32.9207, lon: -96.6211, type: 'cement', icon: '🏗️', emissions: 'High CO2' }
      ]
    };
  }

  async getCorrelationData(lat, lon, radius) {
    return {
      correlations: [
        { industry: 'petroleum', correlation: 0.85, pollutant: 'NO2', distance: '2.3 km' },
        { industry: 'chemical', correlation: 0.72, pollutant: 'SO2', distance: '4.1 km' },
        { industry: 'energy', correlation: 0.68, pollutant: 'PM2.5', distance: '6.8 km' }
      ]
    };
  }

  async getDeathsData(lat, lon, timeframe) {
    // Mock deaths data by air pollution
    const baseDeaths = Math.floor(Math.random() * 50) + 10;
    return {
      totalDeaths: baseDeaths,
      causes: [
        { cause: 'Respiratory Disease', deaths: Math.floor(baseDeaths * 0.4) },
        { cause: 'Cardiovascular Disease', deaths: Math.floor(baseDeaths * 0.35) },
        { cause: 'Lung Cancer', deaths: Math.floor(baseDeaths * 0.25) }
      ],
      timeframe
    };
  }

  async getHistoricalData(lat, lon, interval, time) {
    // Mock historical data
    const data = [];
    const baseAQI = 75;
    
    for (let i = 0; i < 10; i++) {
      data.push({
        time: interval === 'year' ? time - i : time + i,
        aqi: baseAQI + (Math.random() - 0.5) * 30,
        pm25: 15 + (Math.random() - 0.5) * 10,
        deaths: Math.floor(Math.random() * 20) + 5
      });
    }
    
    return { data, interval };
  }
}

module.exports = new IndustryService();
class CorrelationService {
  calculateProximityCorrelation(selectedLocation, industries, airQualityData) {
    if (!airQualityData || !industries.length) return [];

    const correlations = industries.map(industry => {
      const distance = this.calculateDistance(
        selectedLocation.lat, selectedLocation.lon,
        industry.lat, industry.lon
      );

      // Simple proximity-based correlation
      // Closer industries have higher correlation with local pollution
      const proximityFactor = Math.max(0, 1 - (distance / 20)); // 20km max range
      const baseCorrelation = this.getIndustryBaseCorrelation(industry.type);
      const correlation = Math.min(0.95, baseCorrelation * proximityFactor);

      return {
        industry: industry.name,
        type: industry.type,
        correlation: Math.round(correlation * 100) + '%',
        distance: distance.toFixed(1) + ' km',
        impact: this.getIndustryImpact(industry.type, correlation)
      };
    })
    .filter(item => parseFloat(item.correlation) > 10) // Only show meaningful correlations
    .sort((a, b) => parseFloat(b.correlation) - parseFloat(a.correlation))
    .slice(0, 5); // Top 5

    return correlations;
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

  getIndustryBaseCorrelation(type) {
    // Base correlation factors by industry type
    const factors = {
      'industrial': 0.8,
      'mining': 0.75,
      'urban': 0.6,
      'agriculture': 0.3,
      'petroleum': 0.85,
      'chemical': 0.8,
      'energy': 0.7
    };
    return factors[type] || 0.5;
  }

  getIndustryImpact(type, correlation) {
    const impacts = {
      'industrial': 'Mixed Industrial Emissions',
      'mining': 'Particulate Matter',
      'urban': 'Vehicle Emissions',
      'agriculture': 'Agricultural Runoff',
      'petroleum': 'NO2, VOCs',
      'chemical': 'SO2, Toxic Compounds',
      'energy': 'PM2.5, SO2'
    };
    return impacts[type] || 'Various Pollutants';
  }
}

export default new CorrelationService();
class AQISimulator {
  simulateAQI(baseAQI, selectedLocation, industries, naturalFeatures = []) {
    if (!baseAQI) baseAQI = 2; // Default moderate AQI
    
    let adjustedAQI = baseAQI;
    let adjustedComponents = {
      pm2_5: 15,
      pm10: 25,
      no2: 20,
      so2: 10,
      co: 500,
      o3: 60
    };
    
    // Industry impact calculations
    const industryImpact = this.calculateIndustryImpact(selectedLocation, industries);
    adjustedAQI = Math.min(5, Math.max(1, adjustedAQI + industryImpact.aqiAdjustment));
    
    // Apply industry-specific pollutant increases
    Object.keys(industryImpact.pollutantAdjustments).forEach(pollutant => {
      if (adjustedComponents[pollutant]) {
        adjustedComponents[pollutant] *= (1 + industryImpact.pollutantAdjustments[pollutant]);
      }
    });
    
    // Natural features impact (forests, water bodies reduce pollution)
    const naturalImpact = this.calculateNaturalImpact(selectedLocation, naturalFeatures);
    adjustedAQI = Math.min(5, Math.max(1, adjustedAQI + naturalImpact.aqiAdjustment));
    
    // Apply natural pollutant reductions
    Object.keys(naturalImpact.pollutantAdjustments).forEach(pollutant => {
      if (adjustedComponents[pollutant]) {
        adjustedComponents[pollutant] *= (1 + naturalImpact.pollutantAdjustments[pollutant]);
      }
    });
    
    return {
      aqi: Math.round(adjustedAQI),
      components: {
        pm2_5: Math.round(adjustedComponents.pm2_5 * 10) / 10,
        pm10: Math.round(adjustedComponents.pm10 * 10) / 10,
        no2: Math.round(adjustedComponents.no2 * 10) / 10,
        so2: Math.round(adjustedComponents.so2 * 10) / 10,
        co: Math.round(adjustedComponents.co),
        o3: Math.round(adjustedComponents.o3 * 10) / 10
      },
      timestamp: new Date(),
      source: 'simulated',
      factors: {
        industries: industryImpact.factors,
        natural: naturalImpact.factors
      }
    };
  }
  
  calculateIndustryImpact(location, industries) {
    let totalAQIAdjustment = 0;
    let pollutantAdjustments = {
      pm2_5: 0,
      pm10: 0,
      no2: 0,
      so2: 0,
      co: 0,
      o3: 0
    };
    let factors = [];
    
    industries.forEach(industry => {
      const distance = this.calculateDistance(
        location.lat, location.lon,
        industry.lat, industry.lon
      );
      
      // Impact decreases with distance (max impact within 5km)
      const distanceFactor = Math.max(0, 1 - (distance / 10));
      
      if (distanceFactor > 0.1) {
        const impact = this.getIndustryImpact(industry.type, distanceFactor);
        totalAQIAdjustment += impact.aqiIncrease;
        
        // Add pollutant-specific impacts
        Object.keys(impact.pollutants).forEach(pollutant => {
          pollutantAdjustments[pollutant] += impact.pollutants[pollutant];
        });
        
        factors.push({
          name: industry.name,
          type: industry.type,
          distance: distance.toFixed(1) + ' km',
          impact: impact.aqiIncrease > 0.5 ? 'High' : impact.aqiIncrease > 0.2 ? 'Medium' : 'Low'
        });
      }
    });
    
    return {
      aqiAdjustment: Math.min(2, totalAQIAdjustment), // Cap at +2 AQI levels
      pollutantAdjustments,
      factors: factors.slice(0, 5) // Top 5 impacting industries
    };
  }
  
  calculateNaturalImpact(location, naturalFeatures) {
    let totalAQIAdjustment = 0;
    let pollutantAdjustments = {
      pm2_5: 0,
      pm10: 0,
      no2: 0,
      so2: 0,
      co: 0,
      o3: 0
    };
    let factors = [];
    
    // Simulate natural features based on location characteristics
    const simulatedFeatures = this.simulateNaturalFeatures(location);
    
    simulatedFeatures.forEach(feature => {
      const impact = this.getNaturalFeatureImpact(feature.type, feature.proximity);
      totalAQIAdjustment += impact.aqiDecrease;
      
      Object.keys(impact.pollutants).forEach(pollutant => {
        pollutantAdjustments[pollutant] += impact.pollutants[pollutant];
      });
      
      factors.push({
        name: feature.name,
        type: feature.type,
        impact: impact.aqiDecrease < -0.3 ? 'High' : impact.aqiDecrease < -0.1 ? 'Medium' : 'Low'
      });
    });
    
    return {
      aqiAdjustment: Math.max(-1.5, totalAQIAdjustment), // Cap at -1.5 AQI levels
      pollutantAdjustments,
      factors
    };
  }
  
  getIndustryImpact(type, distanceFactor) {
    const impacts = {
      'petroleum': {
        aqiIncrease: 0.8 * distanceFactor,
        pollutants: {
          no2: 0.4 * distanceFactor,
          so2: 0.3 * distanceFactor,
          pm2_5: 0.2 * distanceFactor
        }
      },
      'chemical': {
        aqiIncrease: 0.7 * distanceFactor,
        pollutants: {
          so2: 0.5 * distanceFactor,
          no2: 0.3 * distanceFactor,
          o3: 0.2 * distanceFactor
        }
      },
      'energy': {
        aqiIncrease: 0.9 * distanceFactor,
        pollutants: {
          pm2_5: 0.5 * distanceFactor,
          so2: 0.4 * distanceFactor,
          no2: 0.3 * distanceFactor
        }
      },
      'steel': {
        aqiIncrease: 0.6 * distanceFactor,
        pollutants: {
          pm10: 0.6 * distanceFactor,
          pm2_5: 0.4 * distanceFactor,
          co: 0.3 * distanceFactor
        }
      },
      'cement': {
        aqiIncrease: 0.5 * distanceFactor,
        pollutants: {
          pm10: 0.5 * distanceFactor,
          pm2_5: 0.3 * distanceFactor,
          so2: 0.2 * distanceFactor
        }
      },
      'industrial': {
        aqiIncrease: 0.4 * distanceFactor,
        pollutants: {
          pm2_5: 0.3 * distanceFactor,
          no2: 0.2 * distanceFactor,
          so2: 0.2 * distanceFactor
        }
      }
    };
    
    return impacts[type] || {
      aqiIncrease: 0.3 * distanceFactor,
      pollutants: { pm2_5: 0.2 * distanceFactor, no2: 0.1 * distanceFactor }
    };
  }
  
  simulateNaturalFeatures(location) {
    // Simulate natural features based on location
    const features = [];
    
    // Add some randomized natural features
    if (Math.random() > 0.6) {
      features.push({
        name: 'Urban Forest',
        type: 'forest',
        proximity: Math.random() * 0.8 + 0.2
      });
    }
    
    if (Math.random() > 0.7) {
      features.push({
        name: 'Water Body',
        type: 'water',
        proximity: Math.random() * 0.6 + 0.3
      });
    }
    
    if (Math.random() > 0.8) {
      features.push({
        name: 'Green Space',
        type: 'park',
        proximity: Math.random() * 0.9 + 0.1
      });
    }
    
    return features;
  }
  
  getNaturalFeatureImpact(type, proximity) {
    const impacts = {
      'forest': {
        aqiDecrease: -0.4 * proximity,
        pollutants: {
          pm2_5: -0.3 * proximity,
          pm10: -0.2 * proximity,
          o3: -0.1 * proximity
        }
      },
      'water': {
        aqiDecrease: -0.2 * proximity,
        pollutants: {
          pm10: -0.2 * proximity,
          pm2_5: -0.1 * proximity
        }
      },
      'park': {
        aqiDecrease: -0.3 * proximity,
        pollutants: {
          pm2_5: -0.2 * proximity,
          no2: -0.1 * proximity
        }
      }
    };
    
    return impacts[type] || {
      aqiDecrease: -0.1 * proximity,
      pollutants: { pm2_5: -0.1 * proximity }
    };
  }
  
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export default new AQISimulator();
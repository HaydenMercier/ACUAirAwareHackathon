// AQI Conversion Utilities
export const convertEUtoUS = (euAqi) => {
  if (!euAqi) return null;
  
  const conversionMap = {
    1: 25,   // Very Good → Good (0-50)
    2: 75,   // Good → Moderate (51-100)
    3: 125,  // Fair → Unhealthy for Sensitive (101-150)
    4: 175,  // Poor → Unhealthy (151-200)
    5: 250   // Very Poor → Very Unhealthy (201-300)
  };
  
  return conversionMap[euAqi] || null;
};

export const getAQILevel = (aqi, standard = 'EU') => {
  if (!aqi) return 'Unknown';
  
  if (standard === 'EU') {
    switch(aqi) {
      case 1: return 'Very Good';
      case 2: return 'Good';
      case 3: return 'Fair';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  } else {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }
};

export const getAQIColor = (aqi, standard = 'EU') => {
  if (!aqi) return '#gray';
  
  if (standard === 'EU') {
    switch(aqi) {
      case 1: return '#00e400';
      case 2: return '#ffff00';
      case 3: return '#ff7e00';
      case 4: return '#ff0000';
      case 5: return '#8f3f97';
      default: return '#gray';
    }
  } else {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  }
};
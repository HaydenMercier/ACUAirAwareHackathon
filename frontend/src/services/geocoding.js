import axios from 'axios';

class GeocodingService {
  constructor() {
    this.nominatimUrl = 'https://nominatim.openstreetmap.org';
  }

  async reverseGeocode(lat, lon) {
    try {
      const response = await axios.get(`${this.nominatimUrl}/reverse`, {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1
        }
      });
      
      const address = response.data.address || {};
      let city = address.city || address.town || address.village;
      
      // If no city found, search for nearest city
      if (!city) {
        city = await this.findNearestCity(lat, lon);
      }
      
      return {
        city: city || 'Remote Location',
        country: address.country || 'Unknown Country',
        state: address.state || address.region || '',
        fullAddress: response.data.display_name || `${lat}, ${lon}`
      };
    } catch (error) {
      console.error('Geocoding failed:', error);
      return {
        city: 'Remote Location',
        country: 'Unknown Country',
        state: '',
        fullAddress: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      };
    }
  }
  
  async findNearestCity(lat, lon) {
    try {
      const response = await axios.get(`${this.nominatimUrl}/search`, {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
          limit: 5,
          extratags: 1,
          namedetails: 1,
          bounded: 1,
          viewbox: `${lon-1},${lat-1},${lon+1},${lat+1}` // Search within ~100km radius
        }
      });
      
      // Find the first city/town in results
      for (const result of response.data) {
        const address = result.address || {};
        const city = address.city || address.town || address.village;
        if (city) {
          return `Near ${city}`;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Nearest city search failed:', error);
      return null;
    }
  }

  async searchLocation(query) {
    try {
      const response = await axios.get(`${this.nominatimUrl}/search`, {
        params: {
          q: query,
          format: 'json',
          limit: 15,
          addressdetails: 1
        }
      });
      
      return response.data
        .filter(item => {
          const address = item.address || {};
          return address.city || address.town || address.village || address.suburb;
        })
        .map(item => {
          const address = item.address || {};
          const suburb = address.suburb;
          const city = address.city || address.town || address.village;
          const state = address.state || address.region;
          const country = address.country;
          
          let displayName;
          if (suburb && city && state) {
            displayName = `${suburb}, ${city}, ${state}, ${country}`;
          } else if (city && state) {
            displayName = `${city}, ${state}, ${country}`;
          } else if (suburb && state) {
            displayName = `${suburb}, ${state}, ${country}`;
          } else if (city) {
            displayName = `${city}, ${country}`;
          } else {
            displayName = `${suburb || state}, ${country}`;
          }
          
          return {
            name: displayName,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            type: suburb ? 'suburb' : 'city',
            city,
            state,
            country,
            suburb
          };
        })
        .slice(0, 8);
    } catch (error) {
      console.error('Location search failed:', error);
      return [];
    }
  }

  getLocationType(osmType) {
    const typeMap = {
      'city': 'city',
      'town': 'city',
      'village': 'city',
      'country': 'country',
      'state': 'state',
      'administrative': 'region'
    };
    return typeMap[osmType] || 'location';
  }
}

export default new GeocodingService();
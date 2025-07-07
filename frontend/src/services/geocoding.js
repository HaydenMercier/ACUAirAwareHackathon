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
      return {
        city: address.city || address.town || address.village || 'Unknown City',
        country: address.country || 'Unknown Country',
        state: address.state || address.region || '',
        fullAddress: response.data.display_name || `${lat}, ${lon}`
      };
    } catch (error) {
      console.error('Geocoding failed:', error);
      return {
        city: 'Unknown City',
        country: 'Unknown Country',
        state: '',
        fullAddress: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      };
    }
  }

  async searchLocation(query) {
    try {
      const response = await axios.get(`${this.nominatimUrl}/search`, {
        params: {
          q: query,
          format: 'json',
          limit: 10,
          addressdetails: 1
        }
      });
      
      return response.data.map(item => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: this.getLocationType(item.type),
        address: item.address
      }));
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
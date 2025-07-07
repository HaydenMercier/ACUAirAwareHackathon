import axios from 'axios';

class OverpassService {
  constructor() {
    this.baseUrl = 'https://overpass-api.de/api/interpreter';
  }

  async getIndustries(lat, lon, radius = 0.2) {
    const query = `
      [out:json][timeout:25];
      (
        way["landuse"="industrial"](around:${radius * 111000},${lat},${lon});
        way["landuse"="quarry"](around:${radius * 111000},${lat},${lon});
        way["landuse"="farmland"](around:${radius * 111000},${lat},${lon});
        way["place"="city"](around:${radius * 111000},${lat},${lon});
        way["place"="town"](around:${radius * 111000},${lat},${lon});
      );
      out center meta;
    `;

    try {
      const response = await axios.post(this.baseUrl, query, {
        headers: { 'Content-Type': 'text/plain' }
      });

      return this.processIndustryData(response.data.elements);
    } catch (error) {
      console.error('Overpass API failed:', error);
      return this.getMockIndustries(lat, lon);
    }
  }

  processIndustryData(elements) {
    return elements.map((element, index) => {
      const center = element.center || { lat: element.lat, lon: element.lon };
      const tags = element.tags || {};
      
      return {
        id: element.id || index,
        name: tags.name || this.getIndustryName(tags),
        lat: center.lat,
        lon: center.lon,
        type: this.getIndustryType(tags),
        icon: this.getIndustryIcon(tags),
        emissions: this.getEmissions(tags),
        source: 'overpass'
      };
    }).filter(industry => industry.lat && industry.lon);
  }

  getIndustryName(tags) {
    if (tags.landuse === 'industrial') return 'Industrial Region';
    if (tags.landuse === 'quarry') return 'Mining Region';
    if (tags.landuse === 'farmland') return 'Agricultural Region';
    if (tags.place === 'city' || tags.place === 'town') return 'Urban Center';
    return 'Mixed Development';
  }

  getIndustryType(tags) {
    if (tags.landuse === 'quarry') return 'mining';
    if (tags.landuse === 'farmland') return 'agriculture';
    if (tags.place === 'city' || tags.place === 'town') return 'urban';
    if (tags.landuse === 'industrial') return 'industrial';
    return 'mixed';
  }

  getIndustryIcon(tags) {
    if (tags.landuse === 'quarry') return '⛏';
    if (tags.landuse === 'farmland') return '🌾';
    if (tags.place === 'city' || tags.place === 'town') return '🏙';
    if (tags.landuse === 'industrial') return '🏭';
    return '📍';
  }

  getEmissions(tags) {
    if (tags.landuse === 'quarry') return 'High PM10, Dust';
    if (tags.landuse === 'farmland') return 'NH3, Pesticides';
    if (tags.amenity === 'fuel') return 'VOCs, NO2';
    if (tags.industrial) return 'Mixed Pollutants';
    return 'Various Emissions';
  }

  getMockIndustries(lat, lon) {
    return [
      { id: 1, name: 'Industrial Region', lat: lat + 0.05, lon: lon + 0.05, type: 'industrial', icon: '🏭', emissions: 'Mixed Industrial' },
      { id: 2, name: 'Agricultural Region', lat: lat - 0.08, lon: lon + 0.08, type: 'agriculture', icon: '🌾', emissions: 'Agricultural Runoff' },
      { id: 3, name: 'Mining Region', lat: lat + 0.12, lon: lon - 0.05, type: 'mining', icon: '⛏', emissions: 'Particulate Matter' },
      { id: 4, name: 'Urban Center', lat: lat - 0.03, lon: lon - 0.08, type: 'urban', icon: '🏙', emissions: 'Vehicle Emissions' }
    ];
  }
}

export default new OverpassService();
// Spatial clustering utility for industrial zones
export class SpatialClustering {
  
  // Group nearby industries into zones using zoom-aware clustering
  static clusterIndustries(industries, zoomLevel = 8) {
    if (!industries || industries.length === 0) return [];
    
    // Separate industries by type for different clustering distances
    const industriesByType = industries.reduce((acc, industry) => {
      const type = industry.type || 'mixed';
      if (!acc[type]) acc[type] = [];
      acc[type].push(industry);
      return acc;
    }, {});
    
    const allZones = [];
    
    // Cluster each type with zoom-aware distance
    Object.entries(industriesByType).forEach(([type, typeIndustries]) => {
      const maxDistance = this.getZoomAwareDistance(type, zoomLevel);
      const zones = this.clusterByType(typeIndustries, maxDistance);
      allZones.push(...zones);
    });
    
    return allZones;
  }
  
  // Get zoom-aware clustering distance based on zone type and zoom level
  static getZoomAwareDistance(type, zoomLevel) {
    // Base distances (at zoom level 10)
    const baseDistances = {
      'urban': 8000,      // 8km for urban zones (highly generalized)
      'industrial': 5000, // 5km for industrial (increased)
      'agriculture': 4000, // 4km for agriculture
      'mining': 2000,     // 2km for mining
      'mixed': 3000       // 3km for mixed
    };
    
    const baseDistance = baseDistances[type] || 3000;
    
    // Zoom multiplier: lower zoom = more generalization
    // Zoom 1-5: 4x distance, Zoom 6-8: 2x distance, Zoom 9-12: 1x distance, Zoom 13+: 0.5x distance
    let zoomMultiplier;
    if (zoomLevel <= 5) {
      zoomMultiplier = 4; // Very zoomed out = very generalized
    } else if (zoomLevel <= 8) {
      zoomMultiplier = 2; // Moderately zoomed out = moderately generalized
    } else if (zoomLevel <= 12) {
      zoomMultiplier = 1; // Normal zoom = base distances
    } else {
      zoomMultiplier = 0.5; // Very zoomed in = less generalized
    }
    
    return baseDistance * zoomMultiplier;
  }
  
  // Cluster industries of the same type
  static clusterByType(industries, maxDistance) {
    const clusters = [];
    const processed = new Set();
    
    industries.forEach((industry, index) => {
      if (processed.has(index)) return;
      
      const cluster = [industry];
      processed.add(index);
      
      // Find nearby industries of same type
      industries.forEach((other, otherIndex) => {
        if (processed.has(otherIndex)) return;
        
        const distance = this.calculateDistance(
          industry.lat, industry.lon,
          other.lat, other.lon
        );
        
        if (distance <= maxDistance) {
          cluster.push(other);
          processed.add(otherIndex);
        }
      });
      
      clusters.push(cluster);
    });
    
    return clusters.map(cluster => this.createIndustrialZone(cluster));
  }
  
  // Create industrial zone from cluster of facilities
  static createIndustrialZone(facilities) {
    const lats = facilities.map(f => f.lat);
    const lons = facilities.map(f => f.lon);
    
    const bounds = [
      [Math.min(...lats) - 0.005, Math.min(...lons) - 0.005], // SW corner with padding
      [Math.max(...lats) + 0.005, Math.max(...lons) + 0.005]  // NE corner with padding
    ];
    
    const center = [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lons) + Math.max(...lons)) / 2
    ];
    
    const area = this.calculateBoundingBoxArea(bounds);
    const zoneType = this.determineZoneType(facilities);
    
    // Create stable ID based on facility coordinates
    const coordHash = facilities
      .map(f => `${f.lat.toFixed(4)}_${f.lon.toFixed(4)}`)
      .sort()
      .join('|');
    const stableId = `zone_${zoneType}_${this.hashString(coordHash)}`;
    
    return {
      id: stableId,
      type: 'industrial_zone',
      zoneType: zoneType,
      bounds: bounds,
      center: center,
      facilities: facilities.length,
      area: area,
      emissions: this.getZoneEmissions(zoneType),
      color: this.getZoneColor(zoneType),
      facilityList: facilities
    };
  }
  
  // Calculate distance between two points (Haversine formula)
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  // Calculate bounding box area in km²
  static calculateBoundingBoxArea(bounds) {
    const [[lat1, lon1], [lat2, lon2]] = bounds;
    const width = this.calculateDistance(lat1, lon1, lat1, lon2);
    const height = this.calculateDistance(lat1, lon1, lat2, lon1);
    return ((width * height) / 1000000).toFixed(2); // Convert to km²
  }
  
  // Determine zone type based on facilities
  static determineZoneType(facilities) {
    const types = facilities.map(f => f.type);
    const typeCounts = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const dominantType = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b
    );
    
    return dominantType;
  }
  
  // Get emissions description for zone type
  static getZoneEmissions(zoneType) {
    const emissions = {
      'industrial': 'Mixed Industrial Emissions',
      'mining': 'Particulate Matter, Dust',
      'agriculture': 'NH3, Pesticides',
      'urban': 'Vehicle Emissions, NO2',
      'mixed': 'Various Pollutants'
    };
    return emissions[zoneType] || 'Mixed Emissions';
  }
  
  // Get color for zone type
  static getZoneColor(zoneType) {
    const colors = {
      'industrial': '#ff6b6b',  // Red
      'mining': '#8b4513',      // Brown
      'agriculture': '#90ee90',  // Light green
      'urban': '#87ceeb',       // Sky blue
      'mixed': '#dda0dd'        // Plum
    };
    return colors[zoneType] || '#ff6b6b';
  }
  
  // Simple hash function for stable IDs
  static hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}
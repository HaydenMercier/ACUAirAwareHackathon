import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

const MapController = ({ selectedLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lon], 10, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedLocation, map]);

  return null;
};

export default MapController;
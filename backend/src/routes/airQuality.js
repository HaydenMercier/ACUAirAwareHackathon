const express = require('express');
const router = express.Router();
const airQualityService = require('../services/airQualityService');

router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    const data = await airQualityService.getCurrentAirQuality(parseFloat(lat), parseFloat(lon));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/historical', async (req, res) => {
  try {
    const { location, days } = req.query;
    const data = await airQualityService.getHistoricalData(location, days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const industryService = require('../services/industryService');

router.get('/', async (req, res) => {
  try {
    const bounds = req.query;
    const data = await industryService.getIndustriesInBounds(bounds);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/correlation', async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;
    const data = await industryService.getCorrelationData(lat, lon, radius);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/deaths', async (req, res) => {
  try {
    const { lat, lon, timeframe } = req.query;
    const data = await industryService.getDeathsData(parseFloat(lat), parseFloat(lon), timeframe);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/historical', async (req, res) => {
  try {
    const { lat, lon, interval, time } = req.query;
    const data = await industryService.getHistoricalData(parseFloat(lat), parseFloat(lon), interval, parseInt(time));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
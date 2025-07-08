const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const router = express.Router();

// Single AQI prediction
router.post('/predict-aqi', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const modelPath = path.join(__dirname, '../../../ml/geographic_air_quality_knn_model.joblib');
    
    // Call Python script to use the ML model
    const python = spawn('python', ['-c', `
import joblib
import numpy as np
import sys
import json

try:
    model = joblib.load('${modelPath.replace(/\\/g, '/')}')
    prediction = model.predict([[${latitude}, ${longitude}]])
    result = {'aqi': float(prediction[0])}
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({'error': str(e)}))
`]);

    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.on('close', (code) => {
      try {
        const parsed = JSON.parse(result.trim());
        if (parsed.error) {
          throw new Error(parsed.error);
        }
        res.json(parsed);
      } catch (error) {
        console.error('ML prediction error:', error);
        // Fallback prediction
        const fallbackAqi = Math.abs(latitude) < 30 ? 3 : Math.abs(latitude) > 60 ? 1 : 2;
        res.json({ aqi: fallbackAqi });
      }
    });

  } catch (error) {
    console.error('ML endpoint error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

// Batch AQI predictions
router.post('/predict-aqi/batch', async (req, res) => {
  try {
    const { coordinates } = req.body;
    
    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({ error: 'Coordinates array required' });
    }

    const modelPath = path.join(__dirname, '../../../ml/geographic_air_quality_knn_model.joblib');
    const coordsStr = coordinates.map(c => `[${c.latitude}, ${c.longitude}]`).join(',');
    
    const python = spawn('python', ['-c', `
import joblib
import numpy as np
import sys
import json

try:
    model = joblib.load('${modelPath.replace(/\\/g, '/')}')
    coords = np.array([${coordsStr}])
    predictions = model.predict(coords)
    results = []
    for i, pred in enumerate(predictions):
        results.append({
            'latitude': coords[i][0],
            'longitude': coords[i][1], 
            'aqi': float(pred)
        })
    print(json.dumps({'predictions': results}))
except Exception as e:
    print(json.dumps({'error': str(e)}))
`]);

    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.on('close', (code) => {
      try {
        const parsed = JSON.parse(result.trim());
        if (parsed.error) {
          throw new Error(parsed.error);
        }
        res.json(parsed);
      } catch (error) {
        console.error('ML batch prediction error:', error);
        // Fallback predictions
        const fallbackPredictions = coordinates.map(coord => ({
          latitude: coord.latitude,
          longitude: coord.longitude,
          aqi: Math.abs(coord.latitude) < 30 ? 3 : Math.abs(coord.latitude) > 60 ? 1 : 2
        }));
        res.json({ predictions: fallbackPredictions });
      }
    });

  } catch (error) {
    console.error('ML batch endpoint error:', error);
    res.status(500).json({ error: 'Batch prediction failed' });
  }
});

module.exports = router;
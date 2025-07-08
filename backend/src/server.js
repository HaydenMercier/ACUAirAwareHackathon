const express = require('express');
const cors = require('cors');
require('dotenv').config();

const airQualityRoutes = require('./routes/airQuality');
const industryRoutes = require('./routes/industry');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/air-quality', airQualityRoutes);
app.use('/api/industries', industryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
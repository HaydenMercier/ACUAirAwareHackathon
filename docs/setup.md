# Setup Instructions

## Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

### Data Processing
```bash
cd data/scripts
pip install requests
python fetch_air_quality.py
```

## API Keys Required
- OpenWeatherMap API key for air quality data
- Optional: EPA AirNow API key for US-specific data

## Database Setup
1. Install PostgreSQL
2. Create database: `createdb airaware`
3. Run schema: `psql airaware < data/schemas/database.sql`

## Development Workflow
1. Start backend server (port 3001)
2. Start frontend dev server (port 3000)
3. Run data fetching scripts as needed
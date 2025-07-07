-- Air Quality Readings Table
CREATE TABLE air_quality_readings (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    aqi INTEGER,
    pm2_5 DECIMAL(8, 3),
    pm10 DECIMAL(8, 3),
    o3 DECIMAL(8, 3),
    no2 DECIMAL(8, 3),
    so2 DECIMAL(8, 3),
    co DECIMAL(8, 3)
);

-- Industries Table
CREATE TABLE industries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    industry_type VARCHAR(100),
    size_category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_air_quality_location ON air_quality_readings(latitude, longitude);
CREATE INDEX idx_air_quality_timestamp ON air_quality_readings(timestamp);
CREATE INDEX idx_industries_location ON industries(latitude, longitude);
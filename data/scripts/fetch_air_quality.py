import requests
import json
import os
from datetime import datetime

class AirQualityFetcher:
    def __init__(self):
        self.api_key = os.getenv('OPENWEATHER_API_KEY')
        self.base_url = 'http://api.openweathermap.org/data/2.5/air_pollution'
    
    def fetch_current_data(self, lat, lon):
        url = f"{self.base_url}/current"
        params = {'lat': lat, 'lon': lon, 'appid': self.api_key}
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API request failed: {response.status_code}")
    
    def save_data(self, data, filename):
        with open(f"../raw/{filename}", 'w') as f:
            json.dump(data, f, indent=2)

if __name__ == "__main__":
    fetcher = AirQualityFetcher()
    # Example: Dallas, TX coordinates
    data = fetcher.fetch_current_data(32.7767, -96.7970)
    fetcher.save_data(data, f"air_quality_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
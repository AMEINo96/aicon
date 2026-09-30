import requests
from datetime import datetime, timedelta

def get_7_day_forecast(city: str, country: str, start_date: str = None) -> str:
    """Fetches a 7-day weather forecast for a city/country using Open-Meteo API."""
    try:
        # 1. Geocode the city to get Lat/Lon
        geocode_url = f'https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1'
        geo_res = requests.get(geocode_url, timeout=5).json()
        
        if not geo_res.get('results'):
            return f"Unknown weather for {city}, {country}. Assume moderate."
            
        lat = geo_res['results'][0]['latitude']
        lon = geo_res['results'][0]['longitude']
        
        # 2. Get 16-Day Forecast (Daily Max Temperatures)
        forecast_url = f'https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=16'
        weather_res = requests.get(forecast_url, timeout=5).json()
        
        daily = weather_res.get('daily', {})
        times = daily.get('time', [])
        max_temps = daily.get('temperature_2m_max', [])
        
        if not times or not max_temps:
            return "Forecast data unavailable"
            
        # 3. Align with start_date if possible
        start_idx = 0
        if start_date and start_date in times:
            start_idx = times.index(start_date)
            
        forecast_str = "7-Day Weather Forecast:\n"
        for i in range(7):
            idx = start_idx + i
            if idx < len(times):
                max_t = max_temps[idx]
                time_str = times[idx]
            else:
                max_t = max_temps[-1] if max_temps else 25
                time_str = (datetime.strptime(times[-1], "%Y-%m-%d") + timedelta(days=idx - len(times) + 1)).strftime("%Y-%m-%d") if times else "Unknown"
                
            if max_t > 32:
                condition = "Extremely Hot"
            elif max_t > 25:
                condition = "Hot"
            elif max_t > 15:
                condition = "Mild"
            elif max_t > 5:
                condition = "Cool"
            else:
                condition = "Cold"
                
            forecast_str += f"   - Day {i+1} ({time_str}): High of {max_t}°C ({condition})\n"
            
        return forecast_str
    except Exception as e:
        return "Weather fetch failed"

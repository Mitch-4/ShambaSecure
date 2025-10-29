# utils/dummy_data.py
import random
from datetime import datetime, timedelta

def random_in_range(min_val, max_val, decimals=1):
    """Generate random value within range"""
    value = random.uniform(min_val, max_val)
    return round(value, decimals)

def generate_dummy_data():
    """Generate single sensor reading"""
    return {
        'timestamp': datetime.utcnow().isoformat(),
        'temperature': random_in_range(18, 32),  # °C
        'humidity': random_in_range(40, 85),     # %
        'soilMoisture': random_in_range(30, 70), # %
        'status': 'active',
        'greenhouse': {
            'id': 'GH-001',
            'name': 'ShambaSecure Test Greenhouse',
            'location': 'Nairobi, Kenya'
        }
    }

def generate_historical_data(hours=24, interval='1h'):
    """Generate historical sensor data"""
    data = []
    
    # Parse interval
    if interval.endswith('h'):
        interval_minutes = int(interval[:-1]) * 60
    elif interval.endswith('m'):
        interval_minutes = int(interval[:-1])
    else:
        interval_minutes = 60  # Default to 1 hour
    
    # Calculate number of data points
    total_minutes = hours * 60
    num_points = int(total_minutes / interval_minutes) + 1
    
    # Base values for realistic trends
    base_temp = 25.0
    base_humidity = 65.0
    base_soil_moisture = 55.0
    
    current_time = datetime.utcnow()
    
    for i in range(num_points):
        # Calculate timestamp (going backwards from now)
        timestamp = current_time - timedelta(minutes=(num_points - i - 1) * interval_minutes)
        
        # Add slight variations for realistic trends
        base_temp += random_in_range(-1, 1, 2)
        base_humidity += random_in_range(-2, 2, 2)
        base_soil_moisture += random_in_range(-1.5, 1.5, 2)
        
        # Keep within realistic bounds
        base_temp = max(18, min(32, base_temp))
        base_humidity = max(40, min(85, base_humidity))
        base_soil_moisture = max(30, min(70, base_soil_moisture))
        
        data.append({
            'timestamp': timestamp.isoformat(),
            'temperature': round(base_temp, 1),
            'humidity': round(base_humidity, 1),
            'soilMoisture': round(base_soil_moisture, 1)
        })
    
    return data
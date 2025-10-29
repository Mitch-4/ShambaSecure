# routes/sensor_routes.py
from flask import Blueprint, request, jsonify
from middleware.auth_middleware import require_auth
from utils.dummy_data import generate_dummy_data, generate_historical_data

sensor_bp = Blueprint('sensors', __name__)

@sensor_bp.route('/latest', methods=['GET'])
@require_auth
def get_latest_readings(current_user):
    """Get latest sensor readings"""
    try:
        latest_data = generate_dummy_data()
        
        return jsonify({
            'success': True,
            'message': 'Latest sensor readings retrieved successfully',
            'data': latest_data
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting latest readings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve sensor data'
        }), 500


@sensor_bp.route('/history', methods=['GET'])
@require_auth
def get_historical_data_route(current_user):
    """Get historical sensor data with optional time range"""
    try:
        # Get query parameters
        time_range = request.args.get('range', '24h')
        interval = request.args.get('interval', '1h')
        
        # Parse range parameter (24h, 7d, 30d)
        hours = 24
        if time_range.endswith('h'):
            hours = int(time_range[:-1])
        elif time_range.endswith('d'):
            hours = int(time_range[:-1]) * 24
        
        historical_data = generate_historical_data(hours, interval)
        
        return jsonify({
            'success': True,
            'message': 'Historical data retrieved successfully',
            'data': {
                'range': time_range,
                'interval': interval,
                'readings': historical_data
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting historical data: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve historical data'
        }), 500


@sensor_bp.route('/stats', methods=['GET'])
@require_auth
def get_stats(current_user):
    """Get sensor statistics (min, max, avg)"""
    try:
        historical_data = generate_historical_data(24, '1h')
        
        # Extract values
        temperatures = [d['temperature'] for d in historical_data]
        humidities = [d['humidity'] for d in historical_data]
        soil_moistures = [d['soilMoisture'] for d in historical_data]
        
        # Calculate statistics
        def calculate_stats(arr):
            return {
                'min': round(min(arr), 1),
                'max': round(max(arr), 1),
                'avg': round(sum(arr) / len(arr), 1)
            }
        
        return jsonify({
            'success': True,
            'message': 'Statistics retrieved successfully',
            'data': {
                'temperature': {
                    **calculate_stats(temperatures),
                    'unit': '°C'
                },
                'humidity': {
                    **calculate_stats(humidities),
                    'unit': '%'
                },
                'soilMoisture': {
                    **calculate_stats(soil_moistures),
                    'unit': '%'
                },
                'period': '24 hours'
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error getting stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve statistics'
        }), 500
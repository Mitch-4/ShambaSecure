# app.py - FIXED VERSION
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

# Import routes
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.sensor_routes import sensor_bp

# Import Firebase initialization
from services.firebase_service import initialize_firebase

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
    app.config['DEBUG'] = os.getenv('FLASK_ENV') == 'development'
    
    # ✅ FIXED: Enable CORS for ALL routes
    CORS(app, 
         origins=["http://localhost:5173", "http://127.0.0.1:5173"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True,
         expose_headers=["Content-Type"])
    
    # Initialize Firebase
    initialize_firebase()
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'OK',
            'message': 'ShambaSecure API is running',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': '✅ ShambaSecure Backend API (Flask)',
            'version': '1.0.0',
            'endpoints': {
                'health': '/health',
                'auth': '/api/auth',
                'users': '/api/users',
                'sensors': '/api/sensors'
            }
        }), 200
    
    # ✅ Register blueprints with /api prefix
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(sensor_bp, url_prefix='/api/sensors')
    
    # ✅ Add OPTIONS handler for preflight requests
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Route not found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 ShambaSecure Backend running on port {port}")
    print(f"🌍 Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"💚 Health check: http://localhost:{port}/health")
    print(f"📡 CORS enabled for: http://localhost:5173")
    app.run(host='0.0.0.0', port=port, debug=True)
# middleware/auth_middleware.py
from functools import wraps
from flask import request, jsonify
from services.firebase_service import verify_id_token

def require_auth(f):
    """Decorator to protect routes - requires valid Firebase ID token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Get token from Authorization header
            auth_header = request.headers.get('Authorization')
            
            if not auth_header:
                return jsonify({
                    'success': False,
                    'error': 'No token provided. Authorization header required.'
                }), 401
            
            if not auth_header.startswith('Bearer '):
                return jsonify({
                    'success': False,
                    'error': 'Invalid token format. Use: Bearer <token>'
                }), 401
            
            # Extract token
            token = auth_header.split('Bearer ')[1].strip()
            
            if not token:
                return jsonify({
                    'success': False,
                    'error': 'Token is empty'
                }), 401
            
            # Verify token with Firebase
            decoded_token = verify_id_token(token)
            
            # Add user info to function arguments
            current_user = {
                'uid': decoded_token['uid'],
                'email': decoded_token.get('email'),
                'email_verified': decoded_token.get('email_verified', False)
            }
            
            return f(current_user, *args, **kwargs)
            
        except Exception as e:
            error_message = str(e)
            
            # Handle specific Firebase errors
            if 'Token expired' in error_message or 'expired' in error_message.lower():
                return jsonify({
                    'success': False,
                    'error': 'Token expired. Please login again.'
                }), 401
            
            print(f"❌ Token verification error: {error_message}")
            return jsonify({
                'success': False,
                'error': 'Invalid or expired token'
            }), 401
    
    return decorated_function
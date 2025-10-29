# routes/user_routes.py
from flask import Blueprint, request, jsonify
from config.firebaseConfig import db
from services.firebase_service import get_firestore, get_user_by_email, create_user
from services.email_service import send_welcome_email
from middleware.auth_middleware import require_auth
from datetime import datetime
from google.cloud import firestore

import re

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    """Register a new farmer"""
    try:
        data = request.get_json()
        
        full_name = data.get('fullName')
        email = data.get('email')
        phone = data.get('phone')
        farm_name = data.get('farmName')
        farm_location = data.get('farmLocation')
        farm_size = data.get('farmSize')
        
        # Basic validation
        if not full_name or not email or not phone:
            return jsonify({
                'success': False,
                'error': 'Full name, email, and phone are required'
            }), 400
        
        # Validate email format
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        email = email.lower().strip()
        
        # Check if user already exists
        existing_user = get_user_by_email(email)
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'This email is already registered. Please login instead.'
            }), 409
        
        # Create user in Firebase Auth
        user = create_user(email, full_name)
        
        # Save farmer data in Firestore
        db = get_firestore()
        farmer_data = {
            'uid': user.uid,
            'fullName': full_name.strip(),
            'email': email,
            'phone': phone.strip(),
            'farmName': farm_name.strip() if farm_name else None,
            'farmLocation': farm_location.strip() if farm_location else None,
            'farmSize': farm_size.strip() if farm_size else None,
            'role': 'farmer',
            'isRegistered': True,
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        db.collection('users').document(user.uid).set(farmer_data)
        print(f"✅ Farmer registered: {email}")
        
        # Send welcome email (non-critical)
        try:
            send_welcome_email(email, full_name)
            print(f"✅ Welcome email sent to: {email}")
        except Exception as email_error:
            print(f"⚠️ Welcome email failed (non-critical): {str(email_error)}")
        
        return jsonify({
            'success': True,
            'message': 'Registration successful! Check your email for a welcome message, then you can login.',
            'user': {
                'uid': user.uid,
                'email': user.email,
                'fullName': full_name
            }
        }), 201
        
    except Exception as e:
        print(f"❌ Registration error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Registration failed. Please try again.'
        }), 500


@user_bp.route('/profile', methods=['GET'])
@require_auth
def get_profile(current_user):
    """Get user profile (protected route)"""
    try:
        uid = current_user['uid']
        db = get_firestore()
        user_doc = db.collection('users').document(uid).get()
        
        if not user_doc.exists:
            return jsonify({
                'success': False,
                'error': 'User profile not found'
            }), 404
        
        user_data = user_doc.to_dict()
        
        return jsonify({
            'success': True,
            'user': {
                'uid': user_data.get('uid'),
                'fullName': user_data.get('fullName'),
                'email': user_data.get('email'),
                'phone': user_data.get('phone'),
                'farmName': user_data.get('farmName'),
                'farmLocation': user_data.get('farmLocation'),
                'farmSize': user_data.get('farmSize'),
                'role': user_data.get('role'),
                'emailVerified': current_user.get('email_verified', False),
                'createdAt': user_data.get('createdAt')
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching profile: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch profile'
        }), 500

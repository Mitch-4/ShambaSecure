# routes/auth_routes.py - Enhanced with Device Verification
from flask import Blueprint, request, jsonify
import secrets
import time
from datetime import datetime, timedelta
from services.firebase_service import (
    get_auth,
    get_firestore,
    get_user_by_email,
    create_custom_token
)
from services.email_service import (
    send_magic_link_email,
    send_registration_verification_email,
    send_new_device_alert_email,
    send_device_verification_email  # ✅ add this line
)


import os
import re
import hashlib
import user_agents

auth_bp = Blueprint('auth', __name__)

# In-memory token storage (use Redis in production)
login_tokens = {}
device_verification_tokens = {}
TOKEN_EXPIRY_MINUTES = 15
DEVICE_VERIFICATION_EXPIRY_MINUTES = 30

def get_device_fingerprint(request):
    """Generate device fingerprint from user agent and IP"""
    user_agent = request.headers.get('User-Agent', '')
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    # Create fingerprint
    fingerprint_string = f"{user_agent}|{ip_address}"
    fingerprint = hashlib.sha256(fingerprint_string.encode()).hexdigest()
    
    # Parse user agent for device info
    ua = user_agents.parse(user_agent)
    
    device_info = {
        'fingerprint': fingerprint,
        'device_type': ua.device.family,
        'os': f"{ua.os.family} {ua.os.version_string}",
        'browser': f"{ua.browser.family} {ua.browser.version_string}",
        'ip_address': ip_address,
        'is_mobile': ua.is_mobile,
        'is_tablet': ua.is_tablet,
        'is_pc': ua.is_pc,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    return device_info

def is_trusted_device(uid, device_fingerprint):
    """Check if device is trusted for this user"""
    try:
        db = get_firestore()
        user_doc = db.collection('users').document(uid).get()
        
        if not user_doc.exists:
            return False
        
        user_data = user_doc.to_dict()
        trusted_devices = user_data.get('trustedDevices', [])
        
        # Check if device fingerprint exists in trusted devices
        for device in trusted_devices:
            if device.get('fingerprint') == device_fingerprint:
                # Update last used timestamp
                device['lastUsed'] = datetime.utcnow().isoformat()
                db.collection('users').document(uid).update({
                    'trustedDevices': trusted_devices
                })
                return True
        
        return False
        
    except Exception as e:
        print(f"❌ Error checking trusted device: {str(e)}")
        return False

def add_trusted_device(uid, device_info):
    """Add device to trusted devices list"""
    try:
        db = get_firestore()
        user_doc = db.collection('users').document(uid).get()
        
        if not user_doc.exists:
            return False
        
        user_data = user_doc.to_dict()
        trusted_devices = user_data.get('trustedDevices', [])
        
        # Add new device
        device_info['addedAt'] = datetime.utcnow().isoformat()
        device_info['lastUsed'] = datetime.utcnow().isoformat()
        trusted_devices.append(device_info)
        
        # Keep only last 5 devices
        if len(trusted_devices) > 5:
            trusted_devices = sorted(trusted_devices, key=lambda x: x['lastUsed'], reverse=True)[:5]
        
        db.collection('users').document(uid).update({
            'trustedDevices': trusted_devices
        })
        
        return True
        
    except Exception as e:
        print(f"❌ Error adding trusted device: {str(e)}")
        return False

def cleanup_expired_tokens():
    """Remove expired tokens"""
    current_time = time.time()
    
    # Cleanup login tokens
    expired_login = [
        token for token, data in login_tokens.items()
        if current_time > data['expires_at']
    ]
    for token in expired_login:
        del login_tokens[token]
    
    # Cleanup device verification tokens
    expired_device = [
        token for token, data in device_verification_tokens.items()
        if current_time > data['expires_at']
    ]
    for token in expired_device:
        del device_verification_tokens[token]

@auth_bp.route('/send-magic-link', methods=['POST'])
def send_magic_link():
    """Send magic link with device verification"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({
                'success': False,
                'error': 'Email is required'
            }), 400
        
        email = email.lower().strip()
        
        # Validate email format
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # SECURITY CHECK: Verify user exists in Firebase Auth
        user = get_user_by_email(email)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Email not registered. Please register first.',
                'registered': False
            }), 404
        
        # Check if user completed registration in Firestore
        db = get_firestore()
        user_doc = db.collection('users').document(user.uid).get()
        
        if not user_doc.exists:
            return jsonify({
                'success': False,
                'error': 'Email not registered. Please complete registration first.',
                'registered': False
            }), 404
        
        user_data = user_doc.to_dict()
        
        if not user_data.get('isRegistered'):
            return jsonify({
                'success': False,
                'error': 'Registration incomplete. Please contact support.',
                'registered': False
            }), 403
        
        # Get device information
        device_info = get_device_fingerprint(request)
        
        # Check if device is trusted
        is_trusted = is_trusted_device(user.uid, device_info['fingerprint'])
        
        if not is_trusted:
            # NEW DEVICE DETECTED - Send verification email
            verification_token = secrets.token_urlsafe(32)
            
            current_time = time.time()
            device_verification_tokens[verification_token] = {
                'uid': user.uid,
                'email': user.email,
                'device_info': device_info,
                'created_at': current_time,
                'expires_at': current_time + (DEVICE_VERIFICATION_EXPIRY_MINUTES * 60)
            }
            
            # Send device verification email
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
            verification_link = f"{frontend_url}/auth/verify-device?token={verification_token}"
            
            send_device_verification_email(
                user.email,
                user_data.get('fullName', 'User'),
                device_info,
                verification_link
            )
            
            return jsonify({
                'success': True,
                'requiresDeviceVerification': True,
                'message': 'New device detected! Please check your email to verify this device before logging in.'
            }), 200
        
        # TRUSTED DEVICE - Send magic link directly
        token = secrets.token_urlsafe(32)
        
        current_time = time.time()
        login_tokens[token] = {
            'uid': user.uid,
            'email': user.email,
            'device_fingerprint': device_info['fingerprint'],
            'created_at': current_time,
            'expires_at': current_time + (TOKEN_EXPIRY_MINUTES * 60)
        }
        
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        magic_link = f"{frontend_url}/auth/verify?token={token}"
        
        send_magic_link_email(user.email, user_data.get('fullName', 'User'), magic_link)
        
        cleanup_expired_tokens()
        
        print(f"✅ Magic link sent to trusted device: {email}")
        
        return jsonify({
            'success': True,
            'message': 'Magic link sent! Please check your email inbox (and spam folder).'
        }), 200
        
    except Exception as e:
        print(f"❌ Error sending magic link: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to send magic link. Please try again.'
        }), 500


@auth_bp.route('/verify-device', methods=['POST'])
def verify_device():
    """Verify new device and send magic link"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({
                'success': False,
                'error': 'Verification token is required'
            }), 400
        
        # Check if token exists
        token_data = device_verification_tokens.get(token)
        
        if not token_data:
            return jsonify({
                'success': False,
                'error': 'Invalid or expired verification link'
            }), 401
        
        # Check if token has expired
        current_time = time.time()
        if current_time > token_data['expires_at']:
            del device_verification_tokens[token]
            return jsonify({
                'success': False,
                'error': 'Verification link has expired. Please request a new login link.'
            }), 401
        
        # Add device to trusted devices
        add_trusted_device(token_data['uid'], token_data['device_info'])
        
        # Delete verification token
        del device_verification_tokens[token]
        
        # Generate magic link
        magic_token = secrets.token_urlsafe(32)
        
        login_tokens[magic_token] = {
            'uid': token_data['uid'],
            'email': token_data['email'],
            'device_fingerprint': token_data['device_info']['fingerprint'],
            'created_at': current_time,
            'expires_at': current_time + (TOKEN_EXPIRY_MINUTES * 60)
        }
        
        # Get user data
        db = get_firestore()
        user_doc = db.collection('users').document(token_data['uid']).get()
        user_data = user_doc.to_dict()
        
        # Send magic link
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        magic_link = f"{frontend_url}/auth/verify?token={magic_token}"
        
        send_magic_link_email(
            token_data['email'],
            user_data.get('fullName', 'User'),
            magic_link
        )
        
        print(f"✅ Device verified and magic link sent: {token_data['email']}")
        
        return jsonify({
            'success': True,
            'message': 'Device verified! Magic link sent to your email.'
        }), 200
        
    except Exception as e:
        print(f"❌ Device verification error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Device verification failed. Please try again.'
        }), 500


@auth_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """Verify magic link token and return Firebase custom token"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({
                'success': False,
                'error': 'Token is required'
            }), 400
        
        # Check if token exists
        token_data = login_tokens.get(token)
        
        if not token_data:
            return jsonify({
                'success': False,
                'error': 'Invalid or expired token'
            }), 401
        
        # Check if token has expired
        current_time = time.time()
        if current_time > token_data['expires_at']:
            del login_tokens[token]
            return jsonify({
                'success': False,
                'error': 'Token has expired. Please request a new magic link.'
            }), 401
        
        # Verify device fingerprint matches
        current_device_info = get_device_fingerprint(request)
        if current_device_info['fingerprint'] != token_data['device_fingerprint']:
            return jsonify({
                'success': False,
                'error': 'Device mismatch. Please use the device that requested the login link.'
            }), 403
        
        # Create custom Firebase token
        custom_token = create_custom_token(token_data['uid'])
        
        # Delete used token (one-time use)
        del login_tokens[token]
        
        # Get user data
        db = get_firestore()
        user_doc = db.collection('users').document(token_data['uid']).get()
        user_data = user_doc.to_dict() if user_doc.exists else {}
        
        # Log login activity
        login_activity = {
            'timestamp': datetime.utcnow().isoformat(),
            'device_info': current_device_info,
            'status': 'success'
        }
        
        # Add to user's login history (keep last 10)
        login_history = user_data.get('loginHistory', [])
        login_history.append(login_activity)
        if len(login_history) > 10:
            login_history = login_history[-10:]
        
        db.collection('users').document(token_data['uid']).update({
            'loginHistory': login_history,
            'lastLogin': datetime.utcnow().isoformat()
        })
        
        print(f"✅ User authenticated: {token_data['email']}")
        
        return jsonify({
            'success': True,
            'message': 'Authentication successful',
            'customToken': custom_token,
            'user': {
                'uid': user_data.get('uid'),
                'email': user_data.get('email'),
                'fullName': user_data.get('fullName'),
                'role': user_data.get('role', 'farmer')
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Token verification error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Authentication failed. Please try again.'
        }), 500


@auth_bp.route('/trusted-devices', methods=['GET'])
def get_trusted_devices():
    """Get list of trusted devices for current user"""
    try:
        # Get user from authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                'success': False,
                'error': 'Authentication required'
            }), 401
        
        # This would need proper token verification
        # For now, expecting uid in request
        uid = request.args.get('uid')
        
        if not uid:
            return jsonify({
                'success': False,
                'error': 'User ID required'
            }), 400
        
        db = get_firestore()
        user_doc = db.collection('users').document(uid).get()
        
        if not user_doc.exists:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_data = user_doc.to_dict()
        trusted_devices = user_data.get('trustedDevices', [])
        
        return jsonify({
            'success': True,
            'devices': trusted_devices
        }), 200
        
    except Exception as e:
        print(f"❌ Error fetching trusted devices: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch trusted devices'
        }), 500


@auth_bp.route('/remove-device', methods=['POST'])
def remove_device():
    """Remove a trusted device"""
    try:
        data = request.get_json()
        uid = data.get('uid')
        device_fingerprint = data.get('deviceFingerprint')
        
        if not uid or not device_fingerprint:
            return jsonify({
                'success': False,
                'error': 'User ID and device fingerprint required'
            }), 400
        
        db = get_firestore()
        user_doc = db.collection('users').document(uid).get()
        
        if not user_doc.exists:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_data = user_doc.to_dict()
        trusted_devices = user_data.get('trustedDevices', [])
        
        # Remove device
        trusted_devices = [d for d in trusted_devices if d.get('fingerprint') != device_fingerprint]
        
        db.collection('users').document(uid).update({
            'trustedDevices': trusted_devices
        })
        
        return jsonify({
            'success': True,
            'message': 'Device removed successfully'
        }), 200
        
    except Exception as e:
        print(f"❌ Error removing device: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to remove device'
        }), 500


@auth_bp.route('/check-email', methods=['POST'])
def check_email():
    """Check if email is registered"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({
                'success': False,
                'error': 'Email is required'
            }), 400
        
        email = email.lower().strip()
        
        # Check Firebase Auth
        user = get_user_by_email(email)
        if not user:
            return jsonify({
                'success': False,
                'registered': False,
                'error': 'Email not registered. Please register first.'
            }), 404
        
        # Check Firestore
        db = get_firestore()
        user_doc = db.collection('users').document(user.uid).get()
        
        if not user_doc.exists:
            return jsonify({
                'success': False,
                'registered': False,
                'error': 'Email not registered. Please register first.'
            }), 404
        
        user_data = user_doc.to_dict()
        
        if not user_data.get('isRegistered'):
            return jsonify({
                'success': False,
                'registered': False,
                'error': 'Registration incomplete. Please contact support.'
            }), 403
        
        return jsonify({
            'success': True,
            'registered': True,
            'message': 'Email is registered',
            'user': {
                'email': user.email,
                'fullName': user_data.get('fullName')
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error checking email: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to check email'
        }), 500
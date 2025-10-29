# services/firebase_service.py
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os

# Global instances
firebase_app = None
db = None


def initialize_firebase():
    """Initialize Firebase Admin SDK safely and only once."""
    global firebase_app, db

    try:
        # Check if already initialized
        if firebase_admin._apps:
            firebase_app = firebase_admin.get_app()
            if db is None:
                db = firestore.client()
            print("ℹ️ Firebase Admin already initialized.")
            return firebase_app

        # Load service account credentials path
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase_credentials.json")

        if not os.path.exists(cred_path):
            raise FileNotFoundError(
                f"❌ Firebase credentials file not found at: {cred_path}\n"
                "Make sure your firebase_credentials.json file is in the backend directory "
                "and FIREBASE_CREDENTIALS_PATH is correctly set in .env."
            )

        # Initialize Firebase App
        cred = credentials.Certificate(cred_path)
        firebase_app = firebase_admin.initialize_app(cred)
        db = firestore.client()

        print("✅ Firebase Admin initialized successfully!")
        return firebase_app

    except Exception as e:
        print(f"❌ Firebase initialization error: {str(e)}")
        raise


def get_firestore():
    """Return Firestore client instance (auto-initialize if needed)."""
    global db
    if db is None:
        initialize_firebase()
    return db


def get_auth():
    """Return Firebase Auth instance."""
    if not firebase_admin._apps:
        initialize_firebase()
    return auth


def verify_id_token(id_token):
    """Verify Firebase ID token."""
    try:
        auth_instance = get_auth()
        decoded_token = auth_instance.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise Exception(f"Token verification failed: {str(e)}")


def get_user_by_email(email):
    """Retrieve Firebase user by email."""
    try:
        auth_instance = get_auth()
        user = auth_instance.get_user_by_email(email)
        return user
    except auth.UserNotFoundError:
        return None
    except Exception as e:
        raise Exception(f"Error getting user: {str(e)}")


def create_user(email, display_name=None):
    """Create a new Firebase user."""
    try:
        auth_instance = get_auth()
        user = auth_instance.create_user(
            email=email,
            display_name=display_name,
            email_verified=False
        )
        return user
    except Exception as e:
        raise Exception(f"Error creating user: {str(e)}")


def create_custom_token(uid):
    """Create custom Firebase token."""
    try:
        auth_instance = get_auth()
        custom_token = auth_instance.create_custom_token(uid)
        return custom_token.decode("utf-8") if isinstance(custom_token, bytes) else custom_token
    except Exception as e:
        raise Exception(f"Error creating custom token: {str(e)}")

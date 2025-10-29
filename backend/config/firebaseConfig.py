import firebase_admin
from firebase_admin import credentials, firestore
import os

# Get the credentials path from .env
firebase_credentials_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase_credentials.json")

# Initialize Firebase app only once
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_credentials_path)
    firebase_admin.initialize_app(cred)

# Firestore database client
db = firestore.client()

// backend/src/firebaseAdmin.js
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Check if private key exists
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.error('❌ FIREBASE_PRIVATE_KEY is missing in .env file');
  process.exit(1);
}

console.log('✅ FIREBASE_PRIVATE_KEY loaded (length):', process.env.FIREBASE_PRIVATE_KEY.length);

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Important!
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    })
  });
  
  console.log('✅ Firebase Admin initialized successfully!');
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  process.exit(1);
}

// Export auth, firestore, and admin
export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
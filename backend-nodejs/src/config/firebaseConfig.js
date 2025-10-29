// src/config/firebaseConfig.js
import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config(); // Load .env variables

// Diagnostic log — ensure .env variables are loaded
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.error("❌ Missing FIREBASE_PRIVATE_KEY in .env");
} else {
  console.log(
    "✅ FIREBASE_PRIVATE_KEY loaded (length):",
    process.env.FIREBASE_PRIVATE_KEY.length
  );
}

// Construct service account object from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  // 🔥 Fix: Convert escaped `\n` into actual newlines
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Get file path info for logging
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Initialize Firebase Admin SDK once
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin initialized successfully!");
  } else {
    console.log("ℹ️ Firebase Admin already initialized.");
  }
} catch (error) {
  console.error("❌ Firebase Admin initialization error:", error);
}

// ✅ Export the services you need elsewhere
export const auth = admin.auth();
export const db = admin.firestore();
export default admin;

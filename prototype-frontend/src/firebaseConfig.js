// frontend/src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxT84QL9dI81eCPtOBMCcB3gL9b8fLTC0",
  authDomain: "shamba-5333b.firebaseapp.com",
  projectId: "shamba-5333b",
  storageBucket: "shamba-5333b.firebasestorage.app",
  messagingSenderId: "975747984131",
  appId: "1:975747984131:web:c49f605a785aa1f74c5736",
  measurementId: "G-YH25XY7HRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
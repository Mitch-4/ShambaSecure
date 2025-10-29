// backend/src/routes/userRoutes.js
import express from 'express';
import admin from '../config/firebaseConfig.js';
import { db } from '../config/firebaseConfig.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// REGISTER NEW FARMER
// ==========================================
router.post('/register', async (req, res) => {
  const { fullName, email, phone, farmName, farmLocation, farmSize } = req.body;

  // Validation
  if (!fullName || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Full name, email, and phone are required'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }

  try {
    // Check if user already exists in Firebase Auth
    try {
      const existingUser = await admin.auth().getUserByEmail(email);
      return res.status(409).json({
        success: false,
        error: 'This email is already registered. Please login instead.'
      });
    } catch (error) {
      // User doesn't exist, continue with registration
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: email.toLowerCase().trim(),
      displayName: fullName,
      emailVerified: false, // Will be verified when they click magic link
    });

    // Save farmer data in Firestore
    const farmerData = {
      uid: userRecord.uid,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      farmName: farmName?.trim() || null,
      farmLocation: farmLocation?.trim() || null,
      farmSize: farmSize?.trim() || null,
      role: 'farmer',
      isRegistered: true, // Important flag!
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(userRecord.uid).set(farmerData);

    console.log('✅ Farmer registered:', email);

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login with your email.',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        fullName,
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==========================================
// CHECK IF EMAIL IS REGISTERED
// ==========================================
router.post('/check-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  try {
    // Check if user exists in Firebase Auth
    const userRecord = await admin.auth().getUserByEmail(email.toLowerCase().trim());
    
    // Check if user has completed registration in Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        registered: false,
        error: 'Email not registered. Please register first.'
      });
    }

    const userData = userDoc.data();
    
    if (!userData.isRegistered) {
      return res.status(403).json({
        success: false,
        registered: false,
        error: 'Registration incomplete. Please contact support.'
      });
    }

    res.status(200).json({
      success: true,
      registered: true,
      message: 'Email is registered',
      user: {
        email: userRecord.email,
        fullName: userData.fullName
      }
    });

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        registered: false,
        error: 'Email not registered. Please register first.'
      });
    }

    console.error('❌ Error checking email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check email'
    });
  }
});

// ==========================================
// GET USER PROFILE (Protected)
// ==========================================
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    const userData = userDoc.data();
    
    res.status(200).json({
      success: true,
      user: {
        uid: userData.uid,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        farmName: userData.farmName,
        farmLocation: userData.farmLocation,
        farmSize: userData.farmSize,
        role: userData.role,
        emailVerified: req.user.emailVerified,
        createdAt: userData.createdAt,
      }
    });

  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
});

export default router;
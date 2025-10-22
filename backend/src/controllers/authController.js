// src/controllers/authController.js
import { auth } from '../config/firebaseConfig.js';

// Send Magic Link to email
export const sendMagicLink = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Generate sign-in link
    const actionCodeSettings = {
      url: process.env.MAGIC_LINK_REDIRECT_URL || 'http://localhost:5173/verify-email',
      handleCodeInApp: true,
    };

    const link = await auth.generateSignInWithEmailLink(email, actionCodeSettings);

    // In production, you'd send this via email service (SendGrid, AWS SES, etc.)
    // For now, we'll return it in the response for testing
    console.log('🔗 Magic Link generated for:', email);
    console.log('🔗 Link:', link);

    res.json({
      success: true,
      message: 'Magic link sent successfully! Check your email.',
      // REMOVE THIS IN PRODUCTION - only for testing
      ...(process.env.NODE_ENV === 'development' && { link })
    });

  } catch (error) {
    console.error('Send magic link error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send magic link'
    });
  }
};

// Verify Firebase ID Token
export const verifyToken = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'ID token is required'
      });
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Get user details
    const user = await auth.getUser(decodedToken.uid);

    res.json({
      success: true,
      message: 'Token verified successfully',
      data: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        }
      }
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

// Get current user (requires auth middleware)
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by verifyToken middleware
    const user = await auth.getUser(req.user.uid);

    res.json({
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user information'
    });
  }
};
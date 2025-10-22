// src/routes/authRoutes.js
import express from 'express';
import { 
  sendMagicLink, 
  verifyToken, 
  getCurrentUser 
} from '../controllers/authController.js';
import { verifyToken as verifyAuthToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/send-magic-link', sendMagicLink);
router.post('/verify-token', verifyToken);

// Protected routes
router.get('/me', verifyAuthToken, getCurrentUser);

export default router;
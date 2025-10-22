// src/routes/sensorRoutes.js
import express from 'express';
import { 
  getLatestReadings, 
  getHistoricalData, 
  getStats 
} from '../controllers/sensorController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All sensor routes require authentication
router.use(verifyToken);

// GET /api/sensors/latest - Get latest sensor readings
router.get('/latest', getLatestReadings);

// GET /api/sensors/history - Get historical data with optional time range
router.get('/history', getHistoricalData);

// GET /api/sensors/stats - Get statistics (min, max, avg)
router.get('/stats', getStats);

export default router;
// src/controllers/sensorController.js
import { generateDummyData, generateHistoricalData } from '../utils/dummyData.js';

// Get latest sensor readings
export const getLatestReadings = async (req, res) => {
  try {
    const latestData = generateDummyData();

    res.json({
      success: true,
      message: 'Latest sensor readings retrieved successfully',
      data: latestData
    });

  } catch (error) {
    console.error('Get latest readings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve sensor data'
    });
  }
};

// Get historical sensor data
export const getHistoricalData = async (req, res) => {
  try {
    const { range = '24h', interval = '1h' } = req.query;

    // Parse range parameter (24h, 7d, 30d)
    let hours = 24;
    if (range.endsWith('h')) {
      hours = parseInt(range);
    } else if (range.endsWith('d')) {
      hours = parseInt(range) * 24;
    }

    const historicalData = generateHistoricalData(hours, interval);

    res.json({
      success: true,
      message: 'Historical data retrieved successfully',
      data: {
        range,
        interval,
        readings: historicalData
      }
    });

  } catch (error) {
    console.error('Get historical data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve historical data'
    });
  }
};

// Get sensor statistics
export const getStats = async (req, res) => {
  try {
    const historicalData = generateHistoricalData(24, '1h');

    // Calculate statistics
    const temperatures = historicalData.map(d => d.temperature);
    const humidities = historicalData.map(d => d.humidity);
    const soilMoistures = historicalData.map(d => d.soilMoisture);

    const calculateStats = (arr) => ({
      min: Math.min(...arr).toFixed(1),
      max: Math.max(...arr).toFixed(1),
      avg: (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
    });

    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        temperature: {
          ...calculateStats(temperatures),
          unit: '°C'
        },
        humidity: {
          ...calculateStats(humidities),
          unit: '%'
        },
        soilMoisture: {
          ...calculateStats(soilMoistures),
          unit: '%'
        },
        period: '24 hours'
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
};
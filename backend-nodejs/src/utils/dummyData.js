// src/utils/dummyData.js

// Generate random value within range
const randomInRange = (min, max, decimals = 1) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

// Generate single sensor reading
export const generateDummyData = () => {
  return {
    timestamp: new Date().toISOString(),
    temperature: randomInRange(18, 32), // °C
    humidity: randomInRange(40, 85),    // %
    soilMoisture: randomInRange(30, 70), // %
    status: 'active',
    greenhouse: {
      id: 'GH-001',
      name: 'ShambaSecure Test Greenhouse',
      location: 'Nairobi, Kenya'
    }
  };
};

// Generate historical data
export const generateHistoricalData = (hours = 24, interval = '1h') => {
  const data = [];
  const intervalMs = interval.endsWith('h') ? parseInt(interval) * 60 * 60 * 1000 : 60 * 60 * 1000;
  const now = Date.now();
  
  // Base values for more realistic trends
  let baseTemp = 25;
  let baseHumidity = 65;
  let baseSoilMoisture = 55;

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now - (i * intervalMs));
    
    // Add slight variations to simulate realistic trends
    baseTemp += randomInRange(-1, 1, 2);
    baseHumidity += randomInRange(-2, 2, 2);
    baseSoilMoisture += randomInRange(-1.5, 1.5, 2);

    // Keep within realistic bounds
    baseTemp = Math.max(18, Math.min(32, baseTemp));
    baseHumidity = Math.max(40, Math.min(85, baseHumidity));
    baseSoilMoisture = Math.max(30, Math.min(70, baseSoilMoisture));

    data.push({
      timestamp: timestamp.toISOString(),
      temperature: parseFloat(baseTemp.toFixed(1)),
      humidity: parseFloat(baseHumidity.toFixed(1)),
      soilMoisture: parseFloat(baseSoilMoisture.toFixed(1))
    });
  }

  return data;
};

// Generate data for specific time ranges
export const generateDataByRange = (range) => {
  const ranges = {
    '1h': { hours: 1, interval: '5m' },
    '6h': { hours: 6, interval: '15m' },
    '24h': { hours: 24, interval: '1h' },
    '7d': { hours: 168, interval: '6h' },
    '30d': { hours: 720, interval: '24h' }
  };

  const config = ranges[range] || ranges['24h'];
  return generateHistoricalData(config.hours, config.interval);
};
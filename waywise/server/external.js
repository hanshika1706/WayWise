import express from 'express';

const router = express.Router();

// ================= PARAMETER 1: EXTERNAL APIS CALLS =================
// Fetch live real-time commute weather & conditions along Delhi-NCR route via Open-Meteo
router.get('/api/external/weather', async (req, res) => {
  try {
    const lat = req.query.lat || 28.4595; // Gurugram / Delhi NCR
    const lon = req.query.lon || 77.0266;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    const externalResponse = await fetch(url);
    if (!externalResponse.ok) {
      throw new Error(`External service responded with status ${externalResponse.status}`);
    }

    const data = await externalResponse.json();
    const weather = data.current_weather || {};

    // Interpret WMO weather codes
    const weatherCodeMap = {
      0: 'Clear sky - Excellent driving visibility',
      1: 'Mainly clear - Smooth commute',
      2: 'Partly cloudy - Normal traffic flow',
      3: 'Overcast - Good visibility',
      45: 'Foggy - Caution recommended',
      51: 'Light drizzle - Slight traffic slowdown expected',
      61: 'Rainy - Commute times may increase by 10-15%',
      71: 'Snow - Extreme caution'
    };

    const conditionText = weatherCodeMap[weather.weathercode] || 'Normal driving conditions';

    res.json({
      success: true,
      provider: 'Open-Meteo REST API (External Public API)',
      location: 'Delhi-NCR Commute Corridor',
      coordinates: { latitude: Number(lat), longitude: Number(lon) },
      temperatureC: weather.temperature,
      windspeedKmh: weather.windspeed,
      weatherCode: weather.weathercode,
      commuteAdvisory: conditionText,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch from external weather API: ' + err.message
    });
  }
});

export default router;

const axios = require('axios');

// Helper to get mock coordinates if API fails or key is missing
function getMockCityCoordinates(city) {
  const mockDB = {
    'mumbai': [72.8777, 19.0760],
    'delhi': [77.2090, 28.6139],
    'bangalore': [77.5946, 12.9716],
    'chennai': [80.2707, 13.0827]
  };
  const key = city.toLowerCase().trim();
  return mockDB[key] || [78.9629, 20.5937]; // Default to center of India
}

async function getCoordinates(cityName) {
  try {
    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) return getMockCityCoordinates(cityName);

    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: { api_key: apiKey, text: cityName, size: 1 }
    });
    
    if (response.data.features && response.data.features.length > 0) {
      return response.data.features[0].geometry.coordinates; // [lng, lat]
    }
    return getMockCityCoordinates(cityName);
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    return getMockCityCoordinates(cityName);
  }
}

async function getRoutePolyline(startCoords, endCoords) {
  try {
    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      // Return a simple straight line between the two points for mock purposes
      return [[startCoords[1], startCoords[0]], [endCoords[1], endCoords[0]]];
    }

    const response = await axios.get('https://api.openrouteservice.org/v2/directions/driving-car', {
      params: {
        api_key: apiKey,
        start: `${startCoords[0]},${startCoords[1]}`,
        end: `${endCoords[0]},${endCoords[1]}`
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      const geometry = response.data.features[0].geometry;
      // ORS returns [lng, lat], Leaflet needs [lat, lng]
      return geometry.coordinates.map(coord => [coord[1], coord[0]]);
    }
    return [[startCoords[1], startCoords[0]], [endCoords[1], endCoords[0]]];
  } catch (error) {
    console.error("Routing Error:", error.message);
    return [[startCoords[1], startCoords[0]], [endCoords[1], endCoords[0]]];
  }
}

module.exports = { getCoordinates, getRoutePolyline };

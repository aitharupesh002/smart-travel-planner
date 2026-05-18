const { searchBuses } = require('../providers/mockBusProvider');
const { searchTrains } = require('../providers/mockTrainProvider');
const { searchFlights } = require('../providers/mockFlightProvider');

// Haversine formula to get rough distance between two coordinates
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

exports.aggregateTickets = async (startCoords, endCoords, travelDate, travelers, travelType) => {
  // startCoords/endCoords are [lng, lat]
  const distanceKm = getDistanceKm(startCoords[1], startCoords[0], endCoords[1], endCoords[0]);
  
  let allRoutes = [];

  const safeTravelers = parseInt(travelers) || 1;
  const safeDate = travelDate || new Date().toISOString();

  // Fetch from mock providers
  const buses = await searchBuses(distanceKm, safeDate, safeTravelers);
  const trains = await searchTrains(distanceKm, safeDate, safeTravelers);
  const flights = await searchFlights(distanceKm, safeDate, safeTravelers);

  allRoutes = [...buses, ...trains, ...flights];

  // Filter if user selected a specific type
  if (travelType && travelType !== "Any") {
    allRoutes = allRoutes.filter(r => r.mode.toLowerCase() === travelType.toLowerCase());
  }

  // Calculate scores
  allRoutes.forEach(route => {
    // Budget Efficiency Score: lower cost per person is better. (Base: max budget assumed 5000)
    let budgetScore = Math.max(0, 10 - (route.pricePerPerson / 500));
    budgetScore = Math.min(10, budgetScore);

    // Smart Route Score: Combination of comfort, time, and budget
    // Normalizing time (assuming max time 24h)
    let timeScore = Math.max(0, 10 - (route.timeHours / 2.4));
    timeScore = Math.min(10, timeScore);

    route.budgetScore = parseFloat(budgetScore.toFixed(1));
    route.smartScore = parseFloat(((budgetScore + timeScore + route.comfortScore) / 3).toFixed(1));
  });

  return allRoutes;
};

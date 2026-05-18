const { generateTravelRecommendation } = require('../services/geminiService');
const { getCoordinates, getRoutePolyline } = require('../services/mapService');
const { aggregateTickets } = require('../services/ticketAggregator');
const { analyzePricing } = require('../services/pricingIntelligenceService');
const { generateTransportOptions } = require('../services/transportEngine');

// Haversine formula
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

exports.calculateRoutes = async (req, res) => {
  try {
    const { 
      source, 
      destination, 
      travelDate, 
      returnDate, 
      travelers, 
      totalBudget, 
      budgetPriority, 
      timePriority, 
      comfortPriority,
      travelType 
    } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ error: "Source and Destination are required" });
    }

    const startCoords = await getCoordinates(source);
    const endCoords = await getCoordinates(destination);
    const routePolyline = await getRoutePolyline(startCoords, endCoords);

    // Dynamic ticket aggregation
    let routes = await aggregateTickets(startCoords, endCoords, travelDate, travelers, travelType);

    const distanceKm = getDistanceKm(startCoords[1], startCoords[0], endCoords[1], endCoords[0]);
    let newOptions = generateTransportOptions(distanceKm, travelers, travelDate);
    
    if (travelType && travelType !== "Any") {
      newOptions = newOptions.filter(r => r.mode.toLowerCase() === travelType.toLowerCase());
    }
    
    routes = [...routes, ...newOptions];

    // Ensure all routes have an ID
    routes.forEach((r, idx) => {
      if (!r.id) r.id = `ROUTE-${idx}-${Math.random().toString(36).substr(2, 9)}`;
    });

    // Scoring and Sorting
    const priority = budgetPriority === 'true' ? 'Lowest Budget' : (timePriority === 'true' ? 'Fastest Time' : (comfortPriority === 'true' ? 'Comfort' : 'Balanced'));
    
    routes.sort((a, b) => {
      if (priority === 'Lowest Budget') return a.totalCost - b.totalCost;
      if (priority === 'Fastest Time') return a.timeHours - b.timeHours;
      if (priority === 'Comfort') return b.comfortScore - a.comfortScore;
      return b.smartScore - a.smartScore; // default to best smart score
    });

    // Pricing Intelligence
    const insights = analyzePricing(routes, travelDate, totalBudget, travelers);

    // AI Explanation
    const travelDetails = { travelDate, travelers, totalBudget };
    const aiResponse = await generateTravelRecommendation(routes, priority, travelDetails);

    // Set isBest based on AI
    routes.forEach(r => r.isBest = false);
    if (aiResponse && aiResponse.bestOptionId) {
      const bestRoute = routes.find(r => r.id === aiResponse.bestOptionId);
      if (bestRoute) bestRoute.isBest = true;
      else if (routes.length > 0) routes[0].isBest = true;
    } else if (routes.length > 0) {
      routes[0].isBest = true;
    }

    res.json({
      success: true,
      mapData: {
        startCoords: [startCoords[1], startCoords[0]], 
        endCoords: [endCoords[1], endCoords[0]],
        polyline: routePolyline
      },
      routes,
      insights,
      aiExplanation: aiResponse.explanation || aiResponse
    });

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Failed to calculate routes", details: error.message });
  }
};

exports.bookTicket = async (req, res) => {
  try {
    const { routeId, passengers, contactInfo } = req.body;
    
    // Simulate booking delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({
      success: true,
      bookingId: "BKG" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      message: "Ticket booked successfully!",
      ticketStatus: "Confirmed",
      qrCodeData: "mock-qr-code-data-" + Date.now()
    });
  } catch (error) {
    res.status(500).json({ error: "Booking failed" });
  }
};

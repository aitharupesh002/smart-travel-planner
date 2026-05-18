const { generateTravelRecommendation } = require('../services/geminiService');
const { getCoordinates, getRoutePolyline } = require('../services/mapService');
const { aggregateTickets } = require('../services/ticketAggregator');
const { analyzePricing } = require('../services/pricingIntelligenceService');

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

    // Scoring and Sorting
    const priority = budgetPriority === 'true' ? 'Lowest Budget' : (timePriority === 'true' ? 'Fastest Time' : (comfortPriority === 'true' ? 'Comfort' : 'Balanced'));
    
    routes.sort((a, b) => {
      if (priority === 'Lowest Budget') return a.totalCost - b.totalCost;
      if (priority === 'Fastest Time') return a.timeHours - b.timeHours;
      if (priority === 'Comfort') return b.comfortScore - a.comfortScore;
      return b.smartScore - a.smartScore; // default to best smart score
    });

    if (routes.length > 0) {
      routes[0].isBest = true;
    }

    // Pricing Intelligence
    const insights = analyzePricing(routes, travelDate, totalBudget, travelers);

    // AI Explanation
    const travelDetails = { travelDate, travelers, totalBudget };
    const aiExplanation = await generateTravelRecommendation(routes, priority, travelDetails);

    res.json({
      success: true,
      mapData: {
        startCoords: [startCoords[1], startCoords[0]], 
        endCoords: [endCoords[1], endCoords[0]],
        polyline: routePolyline
      },
      routes,
      insights,
      aiExplanation
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

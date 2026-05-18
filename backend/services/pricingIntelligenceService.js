exports.analyzePricing = (routes, travelDate, totalBudget, travelers) => {
  if (!routes || routes.length === 0) return null;

  const date = new Date(travelDate);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
  // Find the cheapest route
  const cheapestRoute = [...routes].sort((a, b) => a.totalCost - b.totalCost)[0];
  
  // Predict future price increase (mock logic)
  const daysUntilTravel = Math.ceil(Math.abs(date - new Date()) / (1000 * 60 * 60 * 24));
  let predictedIncreasePct = 5;
  if (daysUntilTravel < 7) predictedIncreasePct = 25;
  else if (daysUntilTravel < 14) predictedIncreasePct = 15;

  // Total savings compared to average
  const avgCost = routes.reduce((acc, r) => acc + r.totalCost, 0) / routes.length;
  const totalSavings = Math.max(0, Math.round(avgCost - cheapestRoute.totalCost));

  // Budget efficiency
  const budgetUtilization = totalBudget ? Math.round((cheapestRoute.totalCost / totalBudget) * 100) : 0;
  let optimizationScore = Math.min(100, Math.max(0, 100 - budgetUtilization + 20)); // arbitrary formula

  let insight = "Prices are stable. Good time to book.";
  let alternateSuggestion = null;

  if (isWeekend) {
    insight = "You are traveling on a weekend. Fares are subject to a 20-25% surge.";
    const altDate = new Date(date);
    altDate.setDate(altDate.getDate() - (date.getDay() === 0 ? 2 : 1)); // Suggest Friday
    alternateSuggestion = `Consider traveling on ${altDate.toDateString()} to save up to 20% on bus and flight fares.`;
  } else if (daysUntilTravel < 7) {
    insight = "Last-minute booking detected. Flight prices are at their peak.";
    optimizationScore -= 20;
  }

  return {
    cheapestRouteId: cheapestRoute.id,
    totalSavings,
    budgetUtilization,
    optimizationScore,
    predictedIncreasePct,
    insight,
    alternateSuggestion
  };
};

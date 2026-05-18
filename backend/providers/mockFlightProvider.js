exports.searchFlights = async (distanceKm, travelDateStr, travelers) => {
  // Flights usually don't make sense for very short distances
  if (distanceKm < 300) return [];

  const travelDate = new Date(travelDateStr);
  const today = new Date();
  
  // Calculate days until travel
  const diffTime = Math.abs(travelDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Base flight price
  let basePrice = 2500 + (distanceKm * 2.5);

  // Dynamic pricing based on proximity to date
  if (diffDays <= 2) {
    basePrice *= 2.5; // Last minute surge
  } else if (diffDays <= 7) {
    basePrice *= 1.5;
  } else if (diffDays > 30) {
    basePrice *= 0.8; // Advance booking discount
  }

  const pricePerPerson = Math.round(basePrice);
  const timeHours = Math.max(1, Math.round(distanceKm / 600) + 2); // 2 hours for airport transit

  return [
    {
      id: "flight-" + Math.random().toString(36).substr(2, 5),
      mode: "Flight",
      subMode: "Economy Class",
      provider: "MakeMyTrip Mock",
      pricePerPerson,
      totalCost: pricePerPerson * travelers,
      timeHours,
      comfort: "High",
      comfortScore: 9,
      description: diffDays <= 7 ? "High demand. Fares are higher for close dates." : "Standard economy fare.",
      tags: diffDays <= 7 ? ["High Demand"] : ["Fastest Option"]
    }
  ];
};

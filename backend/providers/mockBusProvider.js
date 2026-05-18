exports.searchBuses = async (distanceKm, travelDateStr, travelers) => {
  const date = new Date(travelDateStr);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
  const baseRatePerKm = 1.5;
  let pricePerPerson = distanceKm * baseRatePerKm;
  
  if (isWeekend) {
    pricePerPerson *= 1.25; // 25% weekend surge
  }

  // Group discount
  if (travelers >= 4) {
    pricePerPerson *= 0.90; // 10% discount for 4+ people
  }

  // Formatting
  pricePerPerson = Math.round(pricePerPerson);
  const totalCost = pricePerPerson * travelers;
  
  // Calculate approx time (avg bus speed 50 km/h)
  const timeHours = Math.max(1, Math.round(distanceKm / 50));

  return [
    {
      id: "bus-" + Math.random().toString(36).substr(2, 5),
      mode: "Bus",
      subMode: "AC Sleeper",
      provider: "RedBus Mock",
      pricePerPerson,
      totalCost,
      timeHours,
      comfort: "Medium",
      comfortScore: 6,
      description: isWeekend ? "Weekend surge applied. AC Sleeper coach." : "Standard AC Sleeper coach.",
      tags: isWeekend ? ["Weekend Surge"] : ["Best Value"]
    },
    {
      id: "bus-" + Math.random().toString(36).substr(2, 5),
      mode: "Bus",
      subMode: "Non-AC Seater",
      provider: "State Transport",
      pricePerPerson: Math.round(pricePerPerson * 0.6),
      totalCost: Math.round(pricePerPerson * 0.6) * travelers,
      timeHours: timeHours + 2,
      comfort: "Low",
      comfortScore: 3,
      description: "Budget friendly state transport.",
      tags: ["Cheapest Option"]
    }
  ];
};

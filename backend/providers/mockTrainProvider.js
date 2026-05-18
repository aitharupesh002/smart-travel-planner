exports.searchTrains = async (distanceKm, travelDateStr, travelers) => {
  const baseRatePerKmSleeper = 0.8;
  const baseRatePerKm3AC = 2.0;
  
  let sleeperPrice = Math.round(distanceKm * baseRatePerKmSleeper);
  let ac3Price = Math.round(distanceKm * baseRatePerKm3AC);

  // Train prices are usually static but availability affects choice.
  // We'll mock a waitlist scenario randomly.
  const isWaitlisted = Math.random() > 0.5;

  const timeHours = Math.max(1, Math.round(distanceKm / 60));

  const routes = [
    {
      id: "train-" + Math.random().toString(36).substr(2, 5),
      mode: "Train",
      subMode: "Sleeper Class",
      provider: "IRCTC Mock",
      pricePerPerson: sleeperPrice,
      totalCost: sleeperPrice * travelers,
      timeHours,
      comfort: "Medium",
      comfortScore: 5,
      description: isWaitlisted ? "Tickets in waitlist (WL-12)." : "Confirmed tickets available.",
      tags: isWaitlisted ? ["Waitlisted"] : ["Confirmed"]
    },
    {
      id: "train-" + Math.random().toString(36).substr(2, 5),
      mode: "Train",
      subMode: "3 Tier AC",
      provider: "IRCTC Mock",
      pricePerPerson: ac3Price,
      totalCost: ac3Price * travelers,
      timeHours: timeHours - 1, // Superfast
      comfort: "High",
      comfortScore: 8,
      description: "Comfortable air-conditioned journey.",
      tags: ["High Comfort", "Confirmed"]
    }
  ];

  return routes;
};

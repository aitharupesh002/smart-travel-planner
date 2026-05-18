exports.generateTransportOptions = (distanceKm, travelers, travelDate) => {
  const options = [];
  const safeTravelers = parseInt(travelers) || 1;
  const isWeekend = new Date(travelDate).getDay() === 0 || new Date(travelDate).getDay() === 6;
  
  // Base rates per km
  const rates = {
    bus: 2,
    train: 1.2,
    auto: 7,
    bike: 5,
    cab: 10,
    flight: 6
  };

  const calculatePrice = (baseRatePerKm, isPerVehicle = false, additionalBase = 0) => {
    let cost = (baseRatePerKm * distanceKm) + additionalBase;
    if (isWeekend) cost *= 1.2;
    
    let totalCost = isPerVehicle ? cost : cost * safeTravelers;
    
    // Group discount
    if (safeTravelers > 3 && !isPerVehicle) {
      totalCost *= 0.85; // 15% discount for groups > 3
    }

    // Cab/Auto group logic
    if (isPerVehicle) {
       // A cab fits 4, auto fits 3, bike fits 1
       // We ignore exact capacity limits here for simplicity or scale linearly
       totalCost = cost;
    }

    return Math.round(totalCost);
  };

  const createOption = (mode, subMode, price, speed, comfort, baseTags = []) => {
    const timeHours = parseFloat((distanceKm / speed).toFixed(1));
    const pricePerPerson = Math.round(price / safeTravelers);
    
    const tags = [...baseTags];
    if (distanceKm > 500 && (mode === 'Train' || mode === 'Flight')) {
      tags.push("Long Distance Recommended");
    }
    if (safeTravelers > 3 && (mode === 'Car' || mode === 'Train')) {
      tags.push("Best for Group");
    }
    
    return {
      id: `TENG-${subMode.replace(/\s+/g, '-').toUpperCase()}-${Math.floor(Math.random()*10000)}`,
      mode,
      subMode,
      totalCost: price,
      pricePerPerson,
      timeHours: mode === 'Flight' ? timeHours + 2 : timeHours,
      comfortScore: comfort,
      tags
    };
  };

  if (distanceKm < 5) {
    // Only Auto and Bike
    options.push(createOption('Car', 'Auto', calculatePrice(rates.auto, true), 30, 3, ['Local']));
    if (safeTravelers === 1) {
      options.push(createOption('Bike', 'Bike Taxi', calculatePrice(rates.bike, true), 40, 2, ['Fastest']));
    }
  } else {
    // Standard long distance
    options.push(createOption('Bus', 'RTC Bus', calculatePrice(rates.bus), 50, 4, ['Budget']));
    options.push(createOption('Bus', 'Private Bus', calculatePrice(rates.bus * 1.5), 60, 7, ['Comfortable']));
    
    options.push(createOption('Train', 'Train (Passenger)', calculatePrice(rates.train), 40, 5, ['Cheapest']));
    options.push(createOption('Train', 'Train (Express)', calculatePrice(rates.train * 1.5), 80, 8, ['Value']));
    
    options.push(createOption('Car', 'Cab', calculatePrice(rates.cab, true), 65, 9, ['Private']));

    if (distanceKm >= 200) {
      options.push(createOption('Flight', 'Flight', calculatePrice(rates.flight, false, 1500), 500, 9, ['Fastest']));
    }
  }

  // Calculate generic scores to sort/filter
  options.forEach(opt => {
    let budgetScore = Math.max(0, 10 - (opt.pricePerPerson / 500));
    budgetScore = Math.min(10, budgetScore);

    let timeScore = Math.max(0, 10 - (opt.timeHours / 2.4));
    timeScore = Math.min(10, timeScore);

    opt.budgetScore = parseFloat(budgetScore.toFixed(1));
    opt.smartScore = parseFloat(((budgetScore + timeScore + opt.comfortScore) / 3).toFixed(1));
  });

  return options;
};

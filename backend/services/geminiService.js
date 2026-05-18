const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateTravelRecommendation(routes, priority, travelDetails) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("No GEMINI_API_KEY found, returning mock AI explanation");
      return "Based on your group size of " + travelDetails.travelers + " and budget of ₹" + travelDetails.totalBudget + ", we found optimal matches. The highlighted route offers the best balance of comfort and per-person cost. Booking today avoids the estimated 15% price surge.";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are an intelligent travel booking AI assistant.
    User's Travel Details:
    - Travelers: ${travelDetails.travelers}
    - Total Budget: ₹${travelDetails.totalBudget}
    - Priority: ${priority}
    - Date: ${travelDetails.travelDate}
    
    Here are the top routes calculated: 
    ${JSON.stringify(routes.slice(0, 5), null, 2)}
    
    Analyze the routes and recommend the absolute best one based on the user's priority.
    Provide a professional, insightful 3-sentence recommendation. Address:
    1. Which route is best for their group budget/priority.
    2. A specific cost-saving or comfort-enhancing tip.
    3. An urgency or booking insight based on the date.
    Make it sound like a premium startup AI assistant.

    Return the response EXCLUSIVELY in valid JSON format like this:
    {
      "bestOptionId": "<id of the recommended route>",
      "explanation": "<your 3-sentence recommendation>"
    }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    const bestRouteId = routes.length > 0 ? routes[0].id : null;
    return {
      bestOptionId: bestRouteId,
      explanation: "Our AI is currently analyzing data, but based on your budget and group size, the top recommended route is your most efficient choice."
    };
  }
}

module.exports = { generateTravelRecommendation };

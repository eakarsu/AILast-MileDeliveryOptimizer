const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-4.5';

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return {
      success: false,
      error: 'OpenRouter API key not configured. Set OPENROUTER_API_KEY in your .env file.',
      fallback: true,
    };
  }

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3001',
          'X-Title': 'Last Mile Delivery Optimizer',
        },
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    return { success: true, data: content };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

const openRouterService = {
  async optimizeRoute(addresses) {
    const systemPrompt = 'You are a logistics optimization AI. Analyze delivery addresses and return an optimized route order that minimizes total distance and time. Respond with JSON containing: optimizedOrder (array of addresses in optimal order), estimatedDistance, estimatedTime, fuelSavings, and reasoning.';
    const userPrompt = `Optimize the delivery route for these addresses:\n${JSON.stringify(addresses, null, 2)}`;
    return callOpenRouter(systemPrompt, userPrompt);
  },

  async predictDeliveryTime(deliveryDetails) {
    const systemPrompt = 'You are a delivery time prediction AI. Based on delivery details, predict accurate delivery times. Respond with JSON containing: estimatedMinutes, confidenceLevel, factors (array of factors affecting delivery), and bestTimeWindow.';
    const userPrompt = `Predict delivery time for:\n${JSON.stringify(deliveryDetails, null, 2)}`;
    return callOpenRouter(systemPrompt, userPrompt);
  },

  async forecastDemand(zoneData) {
    const systemPrompt = 'You are a demand forecasting AI for last-mile delivery. Analyze zone data and predict future delivery demand. Respond with JSON containing: predictedDeliveries, confidence, peakHours (array), recommendedDrivers, factors (array of factors), and trend (increasing/stable/decreasing).';
    const userPrompt = `Forecast demand for:\n${JSON.stringify(zoneData, null, 2)}`;
    return callOpenRouter(systemPrompt, userPrompt);
  },

  async analyzeCosts(costData) {
    const systemPrompt = 'You are a cost analysis AI for delivery operations. Analyze cost data and provide insights. Respond with JSON containing: totalCostBreakdown, savingsOpportunities (array), costTrend, recommendations (array), and projectedSavings.';
    const userPrompt = `Analyze delivery costs:\n${JSON.stringify(costData, null, 2)}`;
    return callOpenRouter(systemPrompt, userPrompt);
  },

  async suggestImprovements(performanceData) {
    const systemPrompt = 'You are a delivery operations improvement AI. Analyze performance data and suggest improvements. Respond with JSON containing: suggestions (array of objects with title, description, impact, priority), overallScore, keyMetrics, and actionPlan (array of steps).';
    const userPrompt = `Suggest improvements based on:\n${JSON.stringify(performanceData, null, 2)}`;
    return callOpenRouter(systemPrompt, userPrompt);
  },

  async analyzeIncident(incidentDetails) {
    const systemPrompt = 'You are an incident analysis AI for delivery operations. Analyze the incident and provide root cause analysis. Respond with JSON containing: rootCause, severity, preventionSteps (array), recommendedActions (array), estimatedImpact, and similarIncidentLikelihood.';
    const userPrompt = `Analyze this delivery incident:\n${JSON.stringify(incidentDetails, null, 2)}`;
    return callOpenRouter(systemPrompt, userPrompt);
  },

  async optimizeFleet(fleetData) {
    const systemPrompt = 'You are a fleet optimization AI. Analyze fleet data and recommend optimal vehicle allocation. Respond with JSON containing: recommendations (array), optimalFleetSize, vehicleUtilization, maintenanceSchedule (array), costSavings, and efficiency score.';
    const userPrompt = `Optimize fleet allocation:\n${JSON.stringify(fleetData, null, 2)}`;
    return callOpenRouter(systemPrompt, userPrompt);
  },

  async predictDriverPerformance(driverData) {
    const systemPrompt = 'You are a driver performance prediction AI. Analyze driver data and predict future performance. Respond with JSON containing: predictedRating, deliveryCapacity, strengths (array), improvementAreas (array), trainingRecommendations (array), and riskLevel.';
    const userPrompt = `Predict performance for driver:\n${JSON.stringify(driverData, null, 2)}`;
    return callOpenRouter(systemPrompt, userPrompt);
  },
};

module.exports = openRouterService;

const express = require('express');
const router = express.Router();
const openRouterService = require('../services/openrouter');
const { AIResult, RouteOptimizationHistory, Delivery, Driver, Zone, Route } = require('../models');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

router.use(auth);

/**
 * Helper: persist AI result to DB.
 * Returns the saved AIResult record.
 */
async function persistAIResult(endpointType, inputPayload, result, contextIds = {}) {
  try {
    return await AIResult.create({
      endpointType,
      inputPayload,
      rawResponse: result.data || null,
      parsedResult: result.parsed || null,
      success: result.success,
      errorMessage: result.success ? null : result.error,
      deliveryId: contextIds.deliveryId || null,
      driverId: contextIds.driverId || null,
      routeId: contextIds.routeId || null,
      zoneId: contextIds.zoneId || null,
      incidentId: contextIds.incidentId || null,
    });
  } catch (err) {
    // Persistence failure must not break the response
    console.error('Failed to persist AI result:', err.message);
    return null;
  }
}

// POST /api/ai/optimize-route
router.post('/optimize-route', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.optimizeRoute(req.body);

    // Persist to ai_results
    await persistAIResult('optimize-route', req.body, result, {
      driverId: req.body.driverId || null,
      routeId: req.body.routeId || null,
    });

    // Persist to route optimization history
    try {
      const parsed = result.parsed || {};
      await RouteOptimizationHistory.create({
        addresses: Array.isArray(req.body) ? req.body : req.body.addresses || [],
        optimizedOrder: parsed.optimizedOrder || null,
        estimatedDistance: parsed.estimatedDistance
          ? String(parsed.estimatedDistance)
          : null,
        estimatedTime: parsed.estimatedTime ? String(parsed.estimatedTime) : null,
        fuelSavings: parsed.fuelSavings ? String(parsed.fuelSavings) : null,
        reasoning: parsed.reasoning || null,
        rawResponse: result.data || null,
        parsedResult: result.parsed || null,
        success: result.success,
        driverId: req.body.driverId || null,
        routeId: req.body.routeId || null,
      });
    } catch (histErr) {
      console.error('Failed to persist route optimization history:', histErr.message);
    }

    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Optimize route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/predict-delivery-time
router.post('/predict-delivery-time', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.predictDeliveryTime(req.body);
    await persistAIResult('predict-delivery-time', req.body, result, {
      deliveryId: req.body.deliveryId || null,
      driverId: req.body.driverId || null,
    });
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Predict delivery time error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/forecast-demand
router.post('/forecast-demand', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.forecastDemand(req.body);
    await persistAIResult('forecast-demand', req.body, result, {
      zoneId: req.body.zoneId || null,
    });
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Forecast demand error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/analyze-costs
router.post('/analyze-costs', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.analyzeCosts(req.body);
    await persistAIResult('analyze-costs', req.body, result);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Analyze costs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/suggest-improvements
router.post('/suggest-improvements', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.suggestImprovements(req.body);
    await persistAIResult('suggest-improvements', req.body, result, {
      driverId: req.body.driverId || null,
    });
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Suggest improvements error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/analyze-incident
router.post('/analyze-incident', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.analyzeIncident(req.body);
    await persistAIResult('analyze-incident', req.body, result, {
      incidentId: req.body.incidentId || null,
      deliveryId: req.body.deliveryId || null,
    });
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Analyze incident error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/optimize-fleet
router.post('/optimize-fleet', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.optimizeFleet(req.body);
    await persistAIResult('optimize-fleet', req.body, result);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Optimize fleet error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/predict-performance
router.post('/predict-performance', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.predictDriverPerformance(req.body);
    await persistAIResult('predict-performance', req.body, result, {
      driverId: req.body.driverId || null,
    });
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Predict performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/sla-breach-predictor
router.post('/sla-breach-predictor', aiRateLimiter, async (req, res) => {
  try {
    const { deliveryId } = req.body;
    if (!deliveryId) return res.status(400).json({ error: 'deliveryId is required' });

    const delivery = await Delivery.findByPk(deliveryId, {
      include: [
        { model: Driver, as: 'driver' },
        { model: Zone, as: 'zone' },
      ],
    });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    const systemPrompt = 'You are a logistics SLA risk assessment AI. Given delivery data, predict SLA breach probability and recommend actions. Always respond with valid JSON only.';
    const userPrompt = `Given this delivery's current status, driver history, and zone demand, predict SLA breach probability (0-100) and recommended action. Return JSON: { "breach_probability": number, "risk_level": "low"|"medium"|"high"|"critical", "recommended_action": string, "reasoning": string }

Delivery data: ${JSON.stringify(delivery.toJSON(), null, 2)}`;

    const axios = require('axios');
    const apiKey = process.env.OPENROUTER_API_KEY;
    let parsed = null;
    let rawData = '';

    if (apiKey && apiKey !== 'your_openrouter_api_key_here') {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'anthropic/claude-3-5-sonnet-20241022',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1000,
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
      rawData = response.data.choices?.[0]?.message?.content || '';
      // Parse JSON from response
      try { parsed = JSON.parse(rawData); } catch (e) {}
      if (!parsed) {
        const stripped = rawData.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
        try { parsed = JSON.parse(stripped); } catch (e) {}
      }
      if (!parsed) {
        const s = rawData.indexOf('{'); const en = rawData.lastIndexOf('}');
        if (s !== -1 && en !== -1) { try { parsed = JSON.parse(rawData.slice(s, en + 1)); } catch (e) {} }
      }
    }

    // Persist to ai_results
    await persistAIResult('sla-breach-predictor', { deliveryId }, { success: !!parsed, data: rawData, parsed }, { deliveryId });

    if (!parsed) {
      return res.status(503).json({ error: 'AI service unavailable or API key not configured' });
    }
    res.json(parsed);
  } catch (error) {
    console.error('SLA breach predictor error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/driver-route-match
router.post('/driver-route-match', aiRateLimiter, async (req, res) => {
  try {
    const { routeId } = req.body;
    if (!routeId) return res.status(400).json({ error: 'routeId is required' });

    const route = await Route.findByPk(routeId, {
      include: [{ model: Driver, as: 'driver' }],
    });
    if (!route) return res.status(404).json({ error: 'Route not found' });

    // Fetch available drivers
    const availableDrivers = await Driver.findAll({ where: { status: 'active' } });

    const systemPrompt = 'You are a driver-route matching AI for logistics. Rank available drivers for a given route and provide reasoning. Always respond with valid JSON only.';
    const userPrompt = `Rank these available drivers for the given route, considering their performance and capabilities. Return JSON: { "ranked_drivers": [{"driver_id": number, "score": number, "reasoning": string}], "recommendation": string }

Route: ${JSON.stringify(route.toJSON(), null, 2)}

Available Drivers: ${JSON.stringify(availableDrivers.map(d => d.toJSON()), null, 2)}`;

    const axios = require('axios');
    const apiKey = process.env.OPENROUTER_API_KEY;
    let parsed = null;
    let rawData = '';

    if (apiKey && apiKey !== 'your_openrouter_api_key_here') {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'anthropic/claude-3-5-sonnet-20241022',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1500,
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
      rawData = response.data.choices?.[0]?.message?.content || '';
      try { parsed = JSON.parse(rawData); } catch (e) {}
      if (!parsed) {
        const stripped = rawData.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
        try { parsed = JSON.parse(stripped); } catch (e) {}
      }
      if (!parsed) {
        const s = rawData.indexOf('{'); const en = rawData.lastIndexOf('}');
        if (s !== -1 && en !== -1) { try { parsed = JSON.parse(rawData.slice(s, en + 1)); } catch (e) {} }
      }
    }

    // Persist to ai_results
    await persistAIResult('driver-route-match', { routeId }, { success: !!parsed, data: rawData, parsed }, { routeId });

    if (!parsed) {
      return res.status(503).json({ error: 'AI service unavailable or API key not configured' });
    }
    res.json(parsed);
  } catch (error) {
    console.error('Driver route match error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/anomaly-detection — flag unusual delivery patterns or customer behavior
router.post('/anomaly-detection', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.detectAnomalies(req.body);
    await persistAIResult('anomaly-detection', req.body, result, {
      driverId: req.body.driverId || null,
      zoneId: req.body.zoneId || null,
    });
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/customer-churn-predictor — identify at-risk high-value customers
router.post('/customer-churn-predictor', aiRateLimiter, async (req, res) => {
  try {
    const result = await openRouterService.predictCustomerChurn(req.body);
    await persistAIResult('customer-churn-predictor', req.body, result);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Customer churn predictor error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/dynamic-pricing-recommender — suggest zone/SLA price adjustments
router.post('/dynamic-pricing-recommender', aiRateLimiter, async (req, res) => {
  try {
    let payload = req.body || {};
    // Auto-enrich: if zoneId provided and no zone payload, fetch it.
    if (payload.zoneId && !payload.zone) {
      try {
        const z = await Zone.findByPk(payload.zoneId);
        if (z) payload.zone = z.toJSON();
      } catch (e) {}
    }

    const result = await openRouterService.recommendDynamicPricing(payload);
    await persistAIResult('dynamic-pricing-recommender', payload, result, {
      zoneId: payload.zoneId || null,
    });
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Dynamic pricing recommender error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/vehicle-maintenance-alert — predict maintenance needs / breakdown risk
router.post('/vehicle-maintenance-alert', aiRateLimiter, async (req, res) => {
  try {
    let payload = req.body || {};
    if (payload.vehicleId && !payload.vehicle) {
      try {
        const { Vehicle } = require('../models');
        if (Vehicle) {
          const v = await Vehicle.findByPk(payload.vehicleId);
          if (v) payload.vehicle = v.toJSON();
        }
      } catch (e) {}
    }

    const result = await openRouterService.vehicleMaintenanceAlert(payload);
    await persistAIResult('vehicle-maintenance-alert', payload, result);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.parsed || result.data });
  } catch (error) {
    console.error('Vehicle maintenance alert error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ai/history — paginated list of all AI results
router.get('/history', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.endpointType) where.endpointType = req.query.endpointType;
    const { count, rows } = await AIResult.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get AI history error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

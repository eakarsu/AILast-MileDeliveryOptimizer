const express = require('express');
const router = express.Router();
const openRouterService = require('../services/openrouter');

// POST /api/ai/optimize-route
router.post('/optimize-route', async (req, res) => {
  try {
    const result = await openRouterService.optimizeRoute(req.body);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.data });
  } catch (error) {
    console.error('Optimize route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/predict-delivery-time
router.post('/predict-delivery-time', async (req, res) => {
  try {
    const result = await openRouterService.predictDeliveryTime(req.body);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.data });
  } catch (error) {
    console.error('Predict delivery time error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/forecast-demand
router.post('/forecast-demand', async (req, res) => {
  try {
    const result = await openRouterService.forecastDemand(req.body);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.data });
  } catch (error) {
    console.error('Forecast demand error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/analyze-costs
router.post('/analyze-costs', async (req, res) => {
  try {
    const result = await openRouterService.analyzeCosts(req.body);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.data });
  } catch (error) {
    console.error('Analyze costs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/suggest-improvements
router.post('/suggest-improvements', async (req, res) => {
  try {
    const result = await openRouterService.suggestImprovements(req.body);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.data });
  } catch (error) {
    console.error('Suggest improvements error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/analyze-incident
router.post('/analyze-incident', async (req, res) => {
  try {
    const result = await openRouterService.analyzeIncident(req.body);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.data });
  } catch (error) {
    console.error('Analyze incident error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/optimize-fleet
router.post('/optimize-fleet', async (req, res) => {
  try {
    const result = await openRouterService.optimizeFleet(req.body);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.data });
  } catch (error) {
    console.error('Optimize fleet error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai/predict-performance
router.post('/predict-performance', async (req, res) => {
  try {
    const result = await openRouterService.predictDriverPerformance(req.body);
    if (!result.success) {
      return res.status(result.fallback ? 503 : 500).json({ error: result.error });
    }
    res.json({ result: result.data });
  } catch (error) {
    console.error('Predict performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

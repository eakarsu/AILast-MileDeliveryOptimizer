const express = require('express');
const router = express.Router();
const { Route, Driver, RouteOptimizationHistory } = require('../models');

// GET /api/routes/history — route optimization history (must be before /:id)
router.get('/history', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.driverId) where.driverId = req.query.driverId;
    if (req.query.routeId) where.routeId = req.query.routeId;
    if (req.query.success !== undefined) where.success = req.query.success === 'true';

    const { count, rows } = await RouteOptimizationHistory.findAndCountAll({
      where,
      include: [
        { model: Driver, as: 'driver', attributes: ['id', 'name'], required: false },
        { model: Route, as: 'route', attributes: ['id', 'name'], required: false },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get route optimization history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET all routes with pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.driverId) where.driverId = req.query.driverId;
    const { count, rows } = await Route.findAndCountAll({
      where,
      include: [{ model: Driver, as: 'driver', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id, {
      include: [{ model: Driver, as: 'driver' }],
    });
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || String(name).trim().length === 0) {
      return res.status(422).json({ error: 'name is required' });
    }
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    await route.update(req.body);
    res.json(route);
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    await route.destroy();
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

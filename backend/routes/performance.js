const express = require('express');
const router = express.Router();
const { PerformanceMetric, Driver } = require('../models');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.driverId) where.driverId = req.query.driverId;
    if (req.query.date) where.date = req.query.date;
    const { count, rows } = await PerformanceMetric.findAndCountAll({
      where,
      include: [{ model: Driver, as: 'driver', attributes: ['id', 'name'] }],
      order: [['date', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const metric = await PerformanceMetric.findByPk(req.params.id, {
      include: [{ model: Driver, as: 'driver' }],
    });
    if (!metric) return res.status(404).json({ error: 'Performance metric not found' });
    res.json(metric);
  } catch (error) {
    console.error('Get performance metric error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const metric = await PerformanceMetric.create(req.body);
    res.status(201).json(metric);
  } catch (error) {
    console.error('Create performance metric error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const metric = await PerformanceMetric.findByPk(req.params.id);
    if (!metric) return res.status(404).json({ error: 'Performance metric not found' });
    await metric.update(req.body);
    res.json(metric);
  } catch (error) {
    console.error('Update performance metric error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const metric = await PerformanceMetric.findByPk(req.params.id);
    if (!metric) return res.status(404).json({ error: 'Performance metric not found' });
    await metric.destroy();
    res.json({ message: 'Performance metric deleted successfully' });
  } catch (error) {
    console.error('Delete performance metric error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

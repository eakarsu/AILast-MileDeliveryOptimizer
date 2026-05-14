const express = require('express');
const router = express.Router();
const { DemandForecast, Zone } = require('../models');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.zoneId) where.zoneId = req.query.zoneId;
    if (req.query.date) where.date = req.query.date;
    const { count, rows } = await DemandForecast.findAndCountAll({
      where,
      include: [{ model: Zone, as: 'zone', attributes: ['id', 'name'] }],
      order: [['date', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get demand forecasts error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const forecast = await DemandForecast.findByPk(req.params.id, {
      include: [{ model: Zone, as: 'zone' }],
    });
    if (!forecast) return res.status(404).json({ error: 'Demand forecast not found' });
    res.json(forecast);
  } catch (error) {
    console.error('Get demand forecast error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const forecast = await DemandForecast.create(req.body);
    res.status(201).json(forecast);
  } catch (error) {
    console.error('Create demand forecast error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const forecast = await DemandForecast.findByPk(req.params.id);
    if (!forecast) return res.status(404).json({ error: 'Demand forecast not found' });
    await forecast.update(req.body);
    res.json(forecast);
  } catch (error) {
    console.error('Update demand forecast error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const forecast = await DemandForecast.findByPk(req.params.id);
    if (!forecast) return res.status(404).json({ error: 'Demand forecast not found' });
    await forecast.destroy();
    res.json({ message: 'Demand forecast deleted successfully' });
  } catch (error) {
    console.error('Delete demand forecast error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

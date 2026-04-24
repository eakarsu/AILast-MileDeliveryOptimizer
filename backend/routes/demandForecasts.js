const express = require('express');
const router = express.Router();
const { DemandForecast, Zone } = require('../models');

router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.zoneId) where.zoneId = req.query.zoneId;
    if (req.query.date) where.date = req.query.date;
    const forecasts = await DemandForecast.findAll({
      where,
      include: [{ model: Zone, as: 'zone', attributes: ['id', 'name'] }],
      order: [['date', 'DESC']],
    });
    res.json(forecasts);
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

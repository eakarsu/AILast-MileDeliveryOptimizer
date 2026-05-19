const express = require('express');
const router = express.Router();
const { CostAnalysis, Zone } = require('../models');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.zoneId) where.zoneId = req.query.zoneId;
    if (req.query.date) where.date = req.query.date;
    const { count, rows } = await CostAnalysis.findAndCountAll({
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
    console.error('Get cost analyses error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const analysis = await CostAnalysis.findByPk(req.params.id, {
      include: [{ model: Zone, as: 'zone' }],
    });
    if (!analysis) return res.status(404).json({ error: 'Cost analysis not found' });
    res.json(analysis);
  } catch (error) {
    console.error('Get cost analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const analysis = await CostAnalysis.create(req.body);
    res.status(201).json(analysis);
  } catch (error) {
    console.error('Create cost analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const analysis = await CostAnalysis.findByPk(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Cost analysis not found' });
    await analysis.update(req.body);
    res.json(analysis);
  } catch (error) {
    console.error('Update cost analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const analysis = await CostAnalysis.findByPk(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Cost analysis not found' });
    await analysis.destroy();
    res.json({ message: 'Cost analysis deleted successfully' });
  } catch (error) {
    console.error('Delete cost analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

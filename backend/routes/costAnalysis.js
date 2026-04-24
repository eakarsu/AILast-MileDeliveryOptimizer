const express = require('express');
const router = express.Router();
const { CostAnalysis, Zone } = require('../models');

router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.zoneId) where.zoneId = req.query.zoneId;
    if (req.query.date) where.date = req.query.date;
    const analyses = await CostAnalysis.findAll({
      where,
      include: [{ model: Zone, as: 'zone', attributes: ['id', 'name'] }],
      order: [['date', 'DESC']],
    });
    res.json(analyses);
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

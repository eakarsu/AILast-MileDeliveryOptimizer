const express = require('express');
const router = express.Router();
const { Zone } = require('../models');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.demandLevel) where.demandLevel = req.query.demandLevel;
    const { count, rows } = await Zone.findAndCountAll({ where, order: [['name', 'ASC']], limit, offset });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) return res.status(404).json({ error: 'Zone not found' });
    res.json(zone);
  } catch (error) {
    console.error('Get zone error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const zone = await Zone.create(req.body);
    res.status(201).json(zone);
  } catch (error) {
    console.error('Create zone error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) return res.status(404).json({ error: 'Zone not found' });
    await zone.update(req.body);
    res.json(zone);
  } catch (error) {
    console.error('Update zone error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) return res.status(404).json({ error: 'Zone not found' });
    await zone.destroy();
    res.json({ message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('Delete zone error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

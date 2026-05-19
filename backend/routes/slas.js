const express = require('express');
const router = express.Router();
const { SLA } = require('../models');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.priority) where.priority = req.query.priority;
    const { count, rows } = await SLA.findAndCountAll({ where, order: [['name', 'ASC']], limit, offset });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get SLAs error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sla = await SLA.findByPk(req.params.id);
    if (!sla) return res.status(404).json({ error: 'SLA not found' });
    res.json(sla);
  } catch (error) {
    console.error('Get SLA error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const sla = await SLA.create(req.body);
    res.status(201).json(sla);
  } catch (error) {
    console.error('Create SLA error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sla = await SLA.findByPk(req.params.id);
    if (!sla) return res.status(404).json({ error: 'SLA not found' });
    await sla.update(req.body);
    res.json(sla);
  } catch (error) {
    console.error('Update SLA error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const sla = await SLA.findByPk(req.params.id);
    if (!sla) return res.status(404).json({ error: 'SLA not found' });
    await sla.destroy();
    res.json({ message: 'SLA deleted successfully' });
  } catch (error) {
    console.error('Delete SLA error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

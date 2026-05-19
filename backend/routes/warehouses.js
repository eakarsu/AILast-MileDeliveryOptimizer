const express = require('express');
const router = express.Router();
const { Warehouse } = require('../models');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.city) where.city = req.query.city;
    const { count, rows } = await Warehouse.findAndCountAll({ where, order: [['name', 'ASC']], limit, offset });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
    res.json(warehouse);
  } catch (error) {
    console.error('Get warehouse error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json(warehouse);
  } catch (error) {
    console.error('Create warehouse error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
    await warehouse.update(req.body);
    res.json(warehouse);
  } catch (error) {
    console.error('Update warehouse error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) return res.status(404).json({ error: 'Warehouse not found' });
    await warehouse.destroy();
    res.json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    console.error('Delete warehouse error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

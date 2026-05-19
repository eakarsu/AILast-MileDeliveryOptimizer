const express = require('express');
const router = express.Router();
const { Vehicle } = require('../models');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.type) where.type = req.query.type;
    const { count, rows } = await Vehicle.findAndCountAll({ where, order: [['plateNumber', 'ASC']], limit, offset });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    await vehicle.destroy();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

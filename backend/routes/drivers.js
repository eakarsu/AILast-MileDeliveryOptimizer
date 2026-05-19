const express = require('express');
const router = express.Router();
const { Driver, Vehicle } = require('../models');

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;

    const { count, rows } = await Driver.findAndCountAll({
      where,
      include: [{ model: Vehicle, as: 'vehicle', attributes: ['id', 'plateNumber', 'type'] }],
      order: [['name', 'ASC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [{ model: Vehicle, as: 'vehicle' }],
    });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || String(name).trim().length === 0) {
      return res.status(422).json({ error: 'name is required' });
    }
    if (!email || String(email).trim().length === 0) {
      return res.status(422).json({ error: 'email is required' });
    }
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    await driver.update(req.body);
    res.json(driver);
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    await driver.destroy();
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

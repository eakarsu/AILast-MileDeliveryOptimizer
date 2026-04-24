const express = require('express');
const router = express.Router();
const { Delivery, Driver, Vehicle, Zone } = require('../models');

// GET all deliveries
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.priority) where.priority = req.query.priority;
    if (req.query.driverId) where.driverId = req.query.driverId;
    if (req.query.zoneId) where.zoneId = req.query.zoneId;

    const deliveries = await Delivery.findAll({
      where,
      include: [
        { model: Driver, as: 'driver', attributes: ['id', 'name', 'phone'] },
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'plateNumber', 'type'] },
        { model: Zone, as: 'zone', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(deliveries);
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET delivery by id
router.get('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id, {
      include: [
        { model: Driver, as: 'driver' },
        { model: Vehicle, as: 'vehicle' },
        { model: Zone, as: 'zone' },
      ],
    });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST create delivery
router.post('/', async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).json(delivery);
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update delivery
router.put('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    await delivery.update(req.body);
    res.json(delivery);
  } catch (error) {
    console.error('Update delivery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE delivery
router.delete('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    await delivery.destroy();
    res.json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    console.error('Delete delivery error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Delivery, Driver, Vehicle, Zone } = require('../models');

// GET all deliveries with pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.priority) where.priority = req.query.priority;
    if (req.query.driverId) where.driverId = req.query.driverId;
    if (req.query.zoneId) where.zoneId = req.query.zoneId;

    const { count, rows } = await Delivery.findAndCountAll({
      where,
      include: [
        { model: Driver, as: 'driver', attributes: ['id', 'name', 'phone'] },
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'plateNumber', 'type'] },
        { model: Zone, as: 'zone', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
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
    const { trackingNumber, customerName } = req.body;
    if (!trackingNumber || String(trackingNumber).trim().length === 0) {
      return res.status(422).json({ error: 'trackingNumber is required' });
    }
    if (!customerName || String(customerName).trim().length === 0) {
      return res.status(422).json({ error: 'customerName is required' });
    }
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

/**
 * POST /api/deliveries/:id/location
 * Real-time delivery tracking update.
 * Updates the assigned driver's currentLocation and recalculates estimated delivery time.
 * Body: { latitude, longitude, address (optional) }
 */
router.post('/:id/location', async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id, {
      include: [{ model: Driver, as: 'driver' }],
    });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    const { latitude, longitude, address } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(422).json({ error: 'latitude and longitude are required' });
    }
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(422).json({ error: 'latitude and longitude must be valid numbers' });
    }
    if (lat < -90 || lat > 90) {
      return res.status(422).json({ error: 'latitude must be between -90 and 90' });
    }
    if (lon < -180 || lon > 180) {
      return res.status(422).json({ error: 'longitude must be between -180 and 180' });
    }

    const locationString = address || `${lat},${lon}`;

    // Update driver's current location if delivery has an assigned driver
    if (delivery.driver) {
      await delivery.driver.update({ currentLocation: locationString });
    }

    // Simple ETA recalculation: use the stored estimatedDelivery or compute a naive +30min window
    // In production this would call a mapping API; here we use a heuristic
    const now = new Date();
    let newEta = delivery.estimatedDelivery;
    if (delivery.status === 'in_transit') {
      // Push ETA to at least 15 minutes from now if it has already passed
      if (!newEta || new Date(newEta) < now) {
        newEta = new Date(now.getTime() + 15 * 60 * 1000);
      }
    }

    // Store the updated ETA and mark as aiOptimized
    await delivery.update({
      estimatedDelivery: newEta,
      aiOptimized: true,
    });

    res.json({
      deliveryId: delivery.id,
      trackingNumber: delivery.trackingNumber,
      currentLocation: {
        latitude: lat,
        longitude: lon,
        address: locationString,
      },
      driverLocationUpdated: !!delivery.driver,
      estimatedDelivery: newEta,
      status: delivery.status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Update delivery location error:', error);
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

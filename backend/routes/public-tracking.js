// Apply pass 7: Public Customer-facing tracking endpoint (no auth)
// Allows end customers to look up shipment status by tracking number.
// Exposes only safe, non-PII fields.
const express = require('express');
const router = express.Router();
const { Delivery, Driver, Zone } = require('../models');

// GET /api/public-tracking/:trackingNumber
router.get('/:trackingNumber', async (req, res) => {
  try {
    const trackingNumber = String(req.params.trackingNumber || '').trim();
    if (!trackingNumber) return res.status(422).json({ error: 'trackingNumber is required' });

    const delivery = await Delivery.findOne({
      where: { trackingNumber },
      include: [
        { model: Driver, as: 'driver', attributes: ['name', 'currentLocation'] },
        { model: Zone, as: 'zone', attributes: ['name'] },
      ],
    });
    if (!delivery) return res.status(404).json({ error: 'Tracking number not found' });

    // Mask customer name to a single first-initial for privacy
    const masked = delivery.customerName
      ? `${String(delivery.customerName).trim().charAt(0)}. ${String(delivery.customerName).trim().split(' ').slice(-1).join('')}`
      : null;

    // Build a public-safe timeline based on known timestamps
    const events = [];
    if (delivery.createdAt) events.push({ at: delivery.createdAt, status: 'order_created' });
    if (delivery.status === 'picked_up' || delivery.status === 'in_transit' || delivery.status === 'delivered') {
      events.push({ at: delivery.updatedAt, status: 'picked_up' });
    }
    if (delivery.status === 'in_transit' || delivery.status === 'delivered') {
      events.push({ at: delivery.updatedAt, status: 'in_transit' });
    }
    if (delivery.actualDelivery) events.push({ at: delivery.actualDelivery, status: 'delivered' });

    res.json({
      trackingNumber: delivery.trackingNumber,
      status: delivery.status,
      priority: delivery.priority,
      recipient: masked,
      destinationZone: delivery.zone ? delivery.zone.name : null,
      driverName: delivery.driver ? delivery.driver.name : null,
      currentLocation: delivery.driver ? delivery.driver.currentLocation : null,
      estimatedDelivery: delivery.estimatedDelivery,
      actualDelivery: delivery.actualDelivery,
      lastUpdated: delivery.updatedAt,
      events,
    });
  } catch (error) {
    console.error('Public tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Incident, Delivery, Driver } = require('../models');

router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.type) where.type = req.query.type;
    if (req.query.severity) where.severity = req.query.severity;
    if (req.query.driverId) where.driverId = req.query.driverId;
    const incidents = await Incident.findAll({
      where,
      include: [
        { model: Delivery, as: 'delivery', attributes: ['id', 'trackingNumber'] },
        { model: Driver, as: 'driver', attributes: ['id', 'name'] },
      ],
      order: [['reportedAt', 'DESC']],
    });
    res.json(incidents);
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id, {
      include: [
        { model: Delivery, as: 'delivery' },
        { model: Driver, as: 'driver' },
      ],
    });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const incident = await Incident.create(req.body);
    res.status(201).json(incident);
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    await incident.update(req.body);
    res.json(incident);
  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    await incident.destroy();
    res.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Delete incident error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

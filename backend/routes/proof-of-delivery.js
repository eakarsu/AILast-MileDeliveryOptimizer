// Apply pass 7: Real Proof of Delivery (signature/photo capture)
// Stores POD records in proof_of_delivery table tied to a Delivery.
// No external services required — accepts base64 photo and signature data.
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sequelize, Delivery } = require('../models');

let _podTableReady = false;
async function ensurePodTable() {
  if (_podTableReady) return;
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS proof_of_delivery (
      id SERIAL PRIMARY KEY,
      delivery_id INTEGER,
      tracking_number VARCHAR(255),
      recipient_name VARCHAR(255),
      signature_data TEXT,
      photo_data TEXT,
      gps_lat DOUBLE PRECISION,
      gps_lon DOUBLE PRECISION,
      notes TEXT,
      captured_by INTEGER,
      captured_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  _podTableReady = true;
}

// POST /api/proof-of-delivery — record a new POD
router.post('/', auth, async (req, res) => {
  try {
    await ensurePodTable();
    const {
      deliveryId,
      trackingNumber,
      recipientName,
      signatureData,
      photoData,
      gpsLat,
      gpsLon,
      notes,
    } = req.body || {};

    if (!deliveryId && !trackingNumber) {
      return res.status(422).json({ error: 'deliveryId or trackingNumber is required' });
    }
    if (!recipientName || String(recipientName).trim().length === 0) {
      return res.status(422).json({ error: 'recipientName is required' });
    }
    if (!signatureData && !photoData) {
      return res.status(422).json({ error: 'signatureData or photoData is required' });
    }

    // Resolve delivery
    let delivery = null;
    if (deliveryId) {
      delivery = await Delivery.findByPk(deliveryId);
    } else if (trackingNumber) {
      delivery = await Delivery.findOne({ where: { trackingNumber } });
    }
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    const userId = (req.user && (req.user.id || req.user.userId)) || null;

    const [insertResult] = await sequelize.query(
      `INSERT INTO proof_of_delivery
       (delivery_id, tracking_number, recipient_name, signature_data, photo_data, gps_lat, gps_lon, notes, captured_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, captured_at`,
      {
        bind: [
          delivery.id,
          delivery.trackingNumber,
          recipientName,
          signatureData || null,
          photoData || null,
          gpsLat != null ? Number(gpsLat) : null,
          gpsLon != null ? Number(gpsLon) : null,
          notes || null,
          userId,
        ],
      }
    );

    // Mark delivery delivered
    await delivery.update({
      status: 'delivered',
      actualDelivery: new Date(),
    });

    const podRow = (insertResult && insertResult[0]) || {};
    return res.status(201).json({
      id: podRow.id,
      deliveryId: delivery.id,
      trackingNumber: delivery.trackingNumber,
      recipientName,
      capturedAt: podRow.captured_at || new Date().toISOString(),
      deliveryStatus: 'delivered',
    });
  } catch (error) {
    console.error('Create POD error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/proof-of-delivery — list (paginated, omits heavy base64 fields)
router.get('/', auth, async (req, res) => {
  try {
    await ensurePodTable();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const [rows] = await sequelize.query(
      `SELECT id, delivery_id, tracking_number, recipient_name, gps_lat, gps_lon, notes, captured_by, captured_at
       FROM proof_of_delivery ORDER BY id DESC LIMIT $1 OFFSET $2`,
      { bind: [limit, offset] }
    );
    const [countRows] = await sequelize.query('SELECT COUNT(*)::int AS c FROM proof_of_delivery');
    const total = (countRows && countRows[0] && countRows[0].c) || 0;

    res.json({
      data: rows || [],
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('List POD error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/proof-of-delivery/:id — full POD record (includes base64 fields)
router.get('/:id', auth, async (req, res) => {
  try {
    await ensurePodTable();
    const [rows] = await sequelize.query(
      'SELECT * FROM proof_of_delivery WHERE id = $1',
      { bind: [Number(req.params.id)] }
    );
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'POD not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Get POD error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/proof-of-delivery/by-delivery/:deliveryId — POD(s) for a delivery
router.get('/by-delivery/:deliveryId', auth, async (req, res) => {
  try {
    await ensurePodTable();
    const [rows] = await sequelize.query(
      'SELECT id, delivery_id, tracking_number, recipient_name, gps_lat, gps_lon, notes, captured_at FROM proof_of_delivery WHERE delivery_id = $1 ORDER BY id DESC',
      { bind: [Number(req.params.deliveryId)] }
    );
    res.json({ data: rows || [] });
  } catch (error) {
    console.error('Get POD by delivery error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

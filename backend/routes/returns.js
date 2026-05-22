// Apply pass 7: Real Return / Reverse Logistics workflow
// Defines a return request lifecycle: requested -> approved -> picked_up -> received -> refunded / rejected
// Backed by return_requests table.
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sequelize, Delivery } = require('../models');

const ALLOWED_STATUSES = ['requested', 'approved', 'picked_up', 'received', 'refunded', 'rejected'];
const ALLOWED_REASONS = ['damaged', 'wrong_item', 'not_needed', 'late_delivery', 'quality_issue', 'other'];

let _returnsTableReady = false;
async function ensureReturnsTable() {
  if (_returnsTableReady) return;
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS return_requests (
      id SERIAL PRIMARY KEY,
      delivery_id INTEGER,
      tracking_number VARCHAR(255),
      customer_name VARCHAR(255),
      customer_email VARCHAR(255),
      reason VARCHAR(64),
      description TEXT,
      status VARCHAR(32) DEFAULT 'requested',
      refund_amount DOUBLE PRECISION,
      pickup_address TEXT,
      requested_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  _returnsTableReady = true;
}

// POST /api/returns — create a return request
router.post('/', auth, async (req, res) => {
  try {
    await ensureReturnsTable();
    const {
      deliveryId,
      trackingNumber,
      customerName,
      customerEmail,
      reason,
      description,
      refundAmount,
      pickupAddress,
    } = req.body || {};

    if (!deliveryId && !trackingNumber) {
      return res.status(422).json({ error: 'deliveryId or trackingNumber is required' });
    }
    if (!reason || !ALLOWED_REASONS.includes(reason)) {
      return res.status(422).json({ error: `reason must be one of: ${ALLOWED_REASONS.join(', ')}` });
    }

    let delivery = null;
    if (deliveryId) delivery = await Delivery.findByPk(deliveryId);
    else delivery = await Delivery.findOne({ where: { trackingNumber } });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    const [insertRows] = await sequelize.query(
      `INSERT INTO return_requests
       (delivery_id, tracking_number, customer_name, customer_email, reason, description, status, refund_amount, pickup_address)
       VALUES ($1,$2,$3,$4,$5,$6,'requested',$7,$8) RETURNING *`,
      {
        bind: [
          delivery.id,
          delivery.trackingNumber,
          customerName || delivery.customerName || null,
          customerEmail || delivery.customerEmail || null,
          reason,
          description || null,
          refundAmount != null ? Number(refundAmount) : null,
          pickupAddress || delivery.deliveryAddress || null,
        ],
      }
    );
    res.status(201).json((insertRows && insertRows[0]) || {});
  } catch (error) {
    console.error('Create return error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/returns — list paginated
router.get('/', auth, async (req, res) => {
  try {
    await ensureReturnsTable();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const filters = [];
    const binds = [];
    let i = 1;
    if (req.query.status) { filters.push(`status = $${i++}`); binds.push(req.query.status); }
    if (req.query.reason) { filters.push(`reason = $${i++}`); binds.push(req.query.reason); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const [rows] = await sequelize.query(
      `SELECT * FROM return_requests ${where} ORDER BY id DESC LIMIT $${i++} OFFSET $${i++}`,
      { bind: [...binds, limit, offset] }
    );
    const [countRows] = await sequelize.query(
      `SELECT COUNT(*)::int AS c FROM return_requests ${where}`,
      { bind: binds }
    );
    const total = (countRows && countRows[0] && countRows[0].c) || 0;
    res.json({
      data: rows || [],
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('List returns error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/returns/:id
router.get('/:id', auth, async (req, res) => {
  try {
    await ensureReturnsTable();
    const [rows] = await sequelize.query('SELECT * FROM return_requests WHERE id = $1', { bind: [Number(req.params.id)] });
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Return not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Get return error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/returns/:id/status — advance workflow
router.put('/:id/status', auth, async (req, res) => {
  try {
    await ensureReturnsTable();
    const { status } = req.body || {};
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(422).json({ error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` });
    }
    const [updRows] = await sequelize.query(
      `UPDATE return_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      { bind: [status, Number(req.params.id)] }
    );
    if (!updRows || updRows.length === 0) return res.status(404).json({ error: 'Return not found' });
    res.json(updRows[0]);
  } catch (error) {
    console.error('Update return status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/returns/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await ensureReturnsTable();
    const [rows] = await sequelize.query('DELETE FROM return_requests WHERE id = $1 RETURNING id', { bind: [Number(req.params.id)] });
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Return not found' });
    res.json({ message: 'Return deleted successfully' });
  } catch (error) {
    console.error('Delete return error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

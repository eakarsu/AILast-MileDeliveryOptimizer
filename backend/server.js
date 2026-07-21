const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const { generalRateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalRateLimiter);

// GET /api/ai-results — alias for AI history, paginated AI results
const { AIResult } = require('./models');
const auth = require('./middleware/auth');
app.get('/api/ai-results', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await AIResult.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    res.json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/deliveries', require('./routes/deliveries'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/warehouses', require('./routes/warehouses'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/slas', require('./routes/slas'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/cost-analysis', require('./routes/costAnalysis'));
app.use('/api/demand-forecasts', require('./routes/demandForecasts'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Custom Views (mounted BEFORE 404/error handler)
app.use('/api/custom-views', require('./routes/customViews'));
app.use('/api/governed-last-mile-dispatch', require('./governance'));

// Apply pass 7: real backlog implementations (mounted BEFORE 404/error handler)
app.use('/api/proof-of-delivery', require('./routes/proof-of-delivery'));
app.use('/api/returns', require('./routes/returns'));
app.use('/api/public-tracking', require('./routes/public-tracking'));
app.use('/api/porch-piracy-risk-map', require('./routes/porchPiracyRiskMap'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    if (process.env.AUTO_INIT_SCHEMA === 'true') {
      await sequelize.sync({ alter: true });
      console.log('Database synced.');
    }

    if (process.env.AUTO_INIT_SCHEMA === 'true') {
      // Legacy schema setup remains opt-in; normal startup is read-only.
      await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ai_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        endpoint VARCHAR(100),
        input_data JSONB,
        result JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

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
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = app;

// Generated prototype routes are opt-in for isolated, non-production evaluation.
if (process.env.ENABLE_GENERATED_ROUTES === 'true' && process.env.NODE_ENV !== 'production') {
app.use('/api/delivery-planner-agent', require('./routes/delivery-planner-agent'));
app.use('/api/vision-pod', require('./routes/vision-pod'));
app.use('/api/anomaly-stream', require('./routes/anomaly-stream'));
app.use('/api/customer-comms-agent', require('./routes/customer-comms-agent'));
app.use('/api/carbon-tracker', require('./routes/carbon-tracker'));

}
// Generated gap routes remain deliberately unmounted.

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

    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    // Ensure ai_results table exists (safety net for raw queries)
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

// === BATCH 05 AUTO-MOUNT (custom feature suggestions) ===
app.use('/api/delivery-planner-agent', require('./routes/delivery-planner-agent'));
app.use('/api/vision-pod', require('./routes/vision-pod'));
app.use('/api/anomaly-stream', require('./routes/anomaly-stream'));
app.use('/api/customer-comms-agent', require('./routes/customer-comms-agent'));
app.use('/api/carbon-tracker', require('./routes/carbon-tracker'));

// === Batch 05 Gaps & Frontend Mounts ===
try { const _gap_anomaly_detection = require('./routes/gap-anomaly-detection'); app.use('/api/gap-anomaly-detection', _gap_anomaly_detection); } catch(e) { console.error('gap mount fail anomaly-detection:', e.message); }
try { const _gap_customer_churn_predictor = require('./routes/gap-customer-churn-predictor'); app.use('/api/gap-customer-churn-predictor', _gap_customer_churn_predictor); } catch(e) { console.error('gap mount fail customer-churn-predictor:', e.message); }
try { const _gap_dynamic_pricing_recommender = require('./routes/gap-dynamic-pricing-recommender'); app.use('/api/gap-dynamic-pricing-recommender', _gap_dynamic_pricing_recommender); } catch(e) { console.error('gap mount fail dynamic-pricing-recommender:', e.message); }
try { const _gap_vehicle_maintenance_alert = require('./routes/gap-vehicle-maintenance-alert'); app.use('/api/gap-vehicle-maintenance-alert', _gap_vehicle_maintenance_alert); } catch(e) { console.error('gap mount fail vehicle-maintenance-alert:', e.message); }
try { const _gap_real_time = require('./routes/gap-real-time'); app.use('/api/gap-real-time', _gap_real_time); } catch(e) { console.error('gap mount fail real-time:', e.message); }
try { const _gap_proof_of_delivery = require('./routes/gap-proof-of-delivery'); app.use('/api/gap-proof-of-delivery', _gap_proof_of_delivery); } catch(e) { console.error('gap mount fail proof-of-delivery:', e.message); }
try { const _gap_customer = require('./routes/gap-customer'); app.use('/api/gap-customer', _gap_customer); } catch(e) { console.error('gap mount fail customer:', e.message); }
try { const _gap_webhooks = require('./routes/gap-webhooks'); app.use('/api/gap-webhooks', _gap_webhooks); } catch(e) { console.error('gap mount fail webhooks:', e.message); }
try { const _gap_return = require('./routes/gap-return'); app.use('/api/gap-return', _gap_return); } catch(e) { console.error('gap mount fail return:', e.message); }
try { const _gap_mobile = require('./routes/gap-mobile'); app.use('/api/gap-mobile', _gap_mobile); } catch(e) { console.error('gap mount fail mobile:', e.message); }
// === End Batch 05 Mounts ===

const express = require('express');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');

const router = express.Router();

// Safe ipKeyGenerator helper
const ipKey = (req) => (req.ip || req.connection?.remoteAddress || 'anon').toString();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.user ? `user:${req.user.id || req.user.userId}` : ipKey(req)),
});

router.use(limiter);

// In-memory delivery rules store (time windows + zones)
let RULE_ID = 4;
const deliveryRules = [
  {
    id: 1,
    name: 'Downtown Morning Window',
    zoneCode: 'ZN-001',
    zoneName: 'Downtown Core',
    windowStart: '08:00',
    windowEnd: '11:00',
    priority: 'high',
    active: true,
    maxStops: 18,
  },
  {
    id: 2,
    name: 'Midtown Afternoon Window',
    zoneCode: 'ZN-002',
    zoneName: 'Midtown',
    windowStart: '12:00',
    windowEnd: '16:00',
    priority: 'medium',
    active: true,
    maxStops: 24,
  },
  {
    id: 3,
    name: 'Suburban Evening Window',
    zoneCode: 'ZN-003',
    zoneName: 'Suburban East',
    windowStart: '17:00',
    windowEnd: '20:30',
    priority: 'low',
    active: true,
    maxStops: 30,
  },
];

// ----------------------------------------------------------
// VIZ 1: Route optimization map (driver routes with stops)
// GET /api/custom-views/route-map
// ----------------------------------------------------------
router.get('/route-map', auth, async (req, res) => {
  try {
    // Anchored around NYC for demo coordinates
    const baseLat = 40.7128;
    const baseLng = -74.006;
    const routes = [
      {
        routeId: 'R-101',
        driverName: 'Carlos Rivera',
        vehicle: 'Van #12',
        color: '#3B82F6',
        distanceKm: 38.4,
        etaMinutes: 142,
        stops: [
          { seq: 1, address: '12 Wall St', lat: baseLat + 0.002, lng: baseLng + 0.004, status: 'delivered' },
          { seq: 2, address: '440 Broadway', lat: baseLat + 0.014, lng: baseLng + 0.001, status: 'delivered' },
          { seq: 3, address: '88 Greenwich Ave', lat: baseLat + 0.024, lng: baseLng - 0.012, status: 'in-transit' },
          { seq: 4, address: '210 W 14th St', lat: baseLat + 0.036, lng: baseLng - 0.006, status: 'pending' },
          { seq: 5, address: '500 5th Ave', lat: baseLat + 0.052, lng: baseLng + 0.008, status: 'pending' },
        ],
      },
      {
        routeId: 'R-102',
        driverName: 'Aisha Khan',
        vehicle: 'Van #07',
        color: '#10B981',
        distanceKm: 42.1,
        etaMinutes: 165,
        stops: [
          { seq: 1, address: '300 E 42nd St', lat: baseLat + 0.041, lng: baseLng + 0.022, status: 'delivered' },
          { seq: 2, address: '1200 6th Ave', lat: baseLat + 0.055, lng: baseLng + 0.012, status: 'in-transit' },
          { seq: 3, address: '770 Lexington Ave', lat: baseLat + 0.071, lng: baseLng + 0.027, status: 'pending' },
          { seq: 4, address: '99 Park Ave', lat: baseLat + 0.046, lng: baseLng + 0.016, status: 'pending' },
        ],
      },
      {
        routeId: 'R-103',
        driverName: 'Diego Park',
        vehicle: 'Truck #03',
        color: '#F59E0B',
        distanceKm: 51.7,
        etaMinutes: 198,
        stops: [
          { seq: 1, address: '55 Bowery', lat: baseLat - 0.008, lng: baseLng + 0.012, status: 'delivered' },
          { seq: 2, address: '180 Bedford Ave', lat: baseLat - 0.022, lng: baseLng + 0.038, status: 'in-transit' },
          { seq: 3, address: '720 5th Ave (Brooklyn)', lat: baseLat - 0.041, lng: baseLng + 0.024, status: 'pending' },
          { seq: 4, address: '85 4th Ave', lat: baseLat - 0.029, lng: baseLng + 0.011, status: 'pending' },
          { seq: 5, address: '255 Atlantic Ave', lat: baseLat - 0.036, lng: baseLng + 0.018, status: 'pending' },
        ],
      },
    ];
    res.json({
      generatedAt: new Date().toISOString(),
      center: { lat: baseLat + 0.02, lng: baseLng + 0.005 },
      zoom: 12,
      routes,
      summary: {
        totalRoutes: routes.length,
        totalStops: routes.reduce((s, r) => s + r.stops.length, 0),
        totalDistanceKm: +routes.reduce((s, r) => s + r.distanceKm, 0).toFixed(1),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------
// VIZ 2: Driver/zone performance heatmap
// GET /api/custom-views/performance-heatmap
// ----------------------------------------------------------
router.get('/performance-heatmap', auth, async (req, res) => {
  try {
    const drivers = ['Carlos R.', 'Aisha K.', 'Diego P.', 'Mei L.', 'Noah B.', 'Priya S.'];
    const zones = ['Downtown', 'Midtown', 'Uptown', 'Brooklyn', 'Queens', 'Bronx'];
    // metric = on-time delivery percentage (0-100); seeded deterministic-ish
    const matrix = drivers.map((driver, di) =>
      zones.map((zone, zi) => {
        const base = 70 + ((di * 7 + zi * 11) % 25);
        const jitter = ((di + zi) % 3) * 2;
        return Math.min(99, base + jitter);
      })
    );
    res.json({
      generatedAt: new Date().toISOString(),
      metric: 'on_time_delivery_pct',
      rows: drivers,
      cols: zones,
      matrix,
      legend: { min: 50, low: 70, mid: 82, high: 92, max: 100 },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------
// NON-VIZ 1: Route manifest PDF (HTML printable manifest)
// GET /api/custom-views/route-manifest?routeId=R-101
// ----------------------------------------------------------
router.get('/route-manifest', auth, async (req, res) => {
  try {
    const routeId = req.query.routeId || 'R-101';
    const manifest = {
      routeId,
      generatedAt: new Date().toISOString(),
      driver: 'Carlos Rivera',
      vehicle: 'Van #12 (Plate XYZ-4421)',
      depot: 'Warehouse W-01 (Jersey City)',
      departureTime: '07:30',
      stops: [
        { seq: 1, trackingId: 'TR-9001', recipient: 'Acme Co.', address: '12 Wall St, NY', window: '08:00-11:00', weightKg: 4.2, signature: true },
        { seq: 2, trackingId: 'TR-9002', recipient: 'Globex LLC', address: '440 Broadway, NY', window: '09:00-12:00', weightKg: 2.1, signature: false },
        { seq: 3, trackingId: 'TR-9003', recipient: 'Initech', address: '88 Greenwich Ave, NY', window: '10:00-13:00', weightKg: 7.8, signature: true },
        { seq: 4, trackingId: 'TR-9004', recipient: 'Hooli', address: '210 W 14th St, NY', window: '11:30-14:30', weightKg: 5.4, signature: true },
        { seq: 5, trackingId: 'TR-9005', recipient: 'Stark Industries', address: '500 5th Ave, NY', window: '13:00-16:00', weightKg: 12.6, signature: true },
      ],
      totals: { stops: 5, weightKg: 32.1, distanceKm: 38.4, etaMinutes: 142 },
      notes: 'Driver must capture signature for items > $200. Avoid 5th Ave construction 10-11AM.',
    };

    // Render a printable HTML "PDF" (browser print-to-PDF)
    const rows = manifest.stops
      .map(
        (s) => `
        <tr>
          <td>${s.seq}</td>
          <td>${s.trackingId}</td>
          <td>${s.recipient}</td>
          <td>${s.address}</td>
          <td>${s.window}</td>
          <td>${s.weightKg} kg</td>
          <td>${s.signature ? 'Yes' : 'No'}</td>
        </tr>`
      )
      .join('');

    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Manifest ${manifest.routeId}</title>
<style>
  body { font-family: -apple-system, Inter, Arial, sans-serif; color: #0f172a; padding: 24px; }
  h1 { margin: 0 0 4px 0; font-size: 22px; }
  .meta { color:#475569; margin-bottom: 16px; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
  th { background: #f1f5f9; }
  .totals { margin-top: 14px; font-size: 13px; }
  .notes { margin-top: 12px; padding: 10px; background: #fef3c7; border-left: 4px solid #f59e0b; font-size: 13px; }
  @media print { body { padding: 12px; } .noprint { display:none } }
  .actions { margin-bottom: 14px; }
  button { background:#3b82f6; color:white; border:none; padding:8px 14px; border-radius:6px; cursor:pointer; }
</style></head><body>
  <div class="actions noprint"><button onclick="window.print()">Print / Save as PDF</button></div>
  <h1>Route Manifest — ${manifest.routeId}</h1>
  <div class="meta">
    Driver: <b>${manifest.driver}</b> &nbsp;|&nbsp; Vehicle: <b>${manifest.vehicle}</b><br/>
    Depot: ${manifest.depot} &nbsp;|&nbsp; Departure: ${manifest.departureTime} &nbsp;|&nbsp; Generated: ${manifest.generatedAt}
  </div>
  <table>
    <thead><tr><th>#</th><th>Tracking</th><th>Recipient</th><th>Address</th><th>Window</th><th>Weight</th><th>Sig?</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <b>Totals:</b> ${manifest.totals.stops} stops &nbsp;•&nbsp; ${manifest.totals.weightKg} kg &nbsp;•&nbsp; ${manifest.totals.distanceKm} km &nbsp;•&nbsp; ETA ${manifest.totals.etaMinutes} min
  </div>
  <div class="notes"><b>Notes:</b> ${manifest.notes}</div>
</body></html>`;

    if (req.query.format === 'html') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    }
    res.json({ ...manifest, html });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------
// NON-VIZ 2: Delivery rules editor (CRUD time windows, zones)
// GET    /api/custom-views/delivery-rules
// POST   /api/custom-views/delivery-rules
// PUT    /api/custom-views/delivery-rules/:id
// DELETE /api/custom-views/delivery-rules/:id
// ----------------------------------------------------------
router.get('/delivery-rules', auth, (req, res) => {
  res.json({ count: deliveryRules.length, data: deliveryRules });
});

router.post('/delivery-rules', auth, (req, res) => {
  try {
    const body = req.body || {};
    if (!body.name || !body.zoneCode || !body.windowStart || !body.windowEnd) {
      return res.status(400).json({ error: 'name, zoneCode, windowStart, windowEnd are required' });
    }
    const rule = {
      id: RULE_ID++,
      name: body.name,
      zoneCode: body.zoneCode,
      zoneName: body.zoneName || body.zoneCode,
      windowStart: body.windowStart,
      windowEnd: body.windowEnd,
      priority: body.priority || 'medium',
      active: body.active !== false,
      maxStops: parseInt(body.maxStops, 10) || 20,
    };
    deliveryRules.push(rule);
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/delivery-rules/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = deliveryRules.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Rule not found' });
  deliveryRules[idx] = { ...deliveryRules[idx], ...req.body, id };
  res.json(deliveryRules[idx]);
});

router.delete('/delivery-rules/:id', auth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = deliveryRules.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Rule not found' });
  const [removed] = deliveryRules.splice(idx, 1);
  res.json({ deleted: removed });
});

module.exports = router;

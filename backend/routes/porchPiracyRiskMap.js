const express = require('express');
const router = express.Router();
function map(input = {}) {
  const stops = input.stops || [
    { stop: 'PKG-771', unattended_minutes: 120, theft_reports_30d: 4, value: 280 },
    { stop: 'PKG-812', unattended_minutes: 15, theft_reports_30d: 0, value: 42 },
  ];
  return { stops: stops.map(s => {
    const score = Math.min(100, Number(s.unattended_minutes) * 0.25 + Number(s.theft_reports_30d) * 14 + Number(s.value) / 25);
    return { ...s, risk_score: Math.round(score), action: score >= 60 ? 'signature_or_locker' : score >= 35 ? 'photo_plus_sms' : 'standard_drop' };
  }) };
}
router.get('/', (req, res) => res.json(map()));
router.post('/map', (req, res) => res.json(map(req.body || {})));
module.exports = router;

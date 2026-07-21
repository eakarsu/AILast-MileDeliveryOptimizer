'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluate } = require('../domain');

test('domain workflow accepts a grounded reviewable case', () => {
  const evaluation = evaluate({
  evaluatedAt: '2026-07-18T10:05:00Z',
  syncPolicy: { telemetryMaxAgeMs: 600000, maxRetryAttempts: 5, offlineFallback: 'manual dispatch manifest' },
  assets: [{ id: 'van1', capacityKg: 1000, telemetryAt: '2026-07-18T10:00:00Z', sitePermission: 'depot1', safetyLimitVersion: 's1' }],
  jobs: [{ id: 'j1', weightKg: 100, windowStart: '2026-07-18T11:00:00Z', windowEnd: '2026-07-18T12:00:00Z' }],
  plan: { version: 'plan-1', optimizerVersion: 'optimizer-1',
    stops: [{ jobId: 'j1', assetId: 'van1', decisionRuleVersion: 'r1', eta: '2026-07-18T11:30:00Z', operatorApprovalId: 'op1' }] },
  events: [{ source: 'tms', sourceVersion: 'tms-1', id: 'ev1', idempotencyKey: 'tms:ev1:2026',
    occurredAt: '2026-07-18T10:00:00Z', receivedAt: '2026-07-18T10:00:01Z' }],
  exceptions: [{ id: 'x1', ownerId: 'd1', manualFallback: 'phone dispatch', recoveryStatus: 'resolved' }],
  pricingPolicy: { version: 'p1', maxSurchargePct: 10, recommendations: [{ surchargePct: 5, ruleId: 'peak1', operatorApprovalId: 'op1' }] },
  replay: { fixtureVersion: 'fx1', metrics: { forecastError: 0.1, constraintViolations: 0, latencyMs: 20, missedEvents: 0, realizedOutcome: 1 } }
});
  assert.deepEqual(evaluation.errors, []);
  assert.equal(evaluation.result.decision, 'reviewable');
  assert.ok(Array.isArray(evaluation.assumptions));
  assert.equal(typeof evaluation.uncertainty, 'object');
});

test('domain workflow fails closed on incomplete or unsafe input', () => {
  const evaluation = evaluate({ assets: [], jobs: [{ id: 'j', weightKg: -1 }], plan: { stops: [] }, events: [], exceptions: [], pricingPolicy: {}, replay: {} });
  assert.ok(evaluation.errors.length > 0);
  assert.notEqual(evaluation.result.decision, 'reviewable');
});

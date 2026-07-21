'use strict';
function evaluate(input = {}) {
  const errors = [], assets = input.assets || [], jobs = input.jobs || [], plan = input.plan || {};
  const evaluatedAt = Date.parse(input.evaluatedAt);
  const telemetryMaxAgeMs = Number(input.syncPolicy?.telemetryMaxAgeMs);
  if (!Number.isFinite(evaluatedAt) || !(telemetryMaxAgeMs > 0) ||
      !(input.syncPolicy?.maxRetryAttempts > 0) || !input.syncPolicy?.offlineFallback) {
    errors.push('deterministic evaluation time and bounded offline/retry policy required');
  }
  const assetMap = new Map();
  for (const asset of assets) {
    if (!asset.id || !(asset.capacityKg > 0) || !asset.telemetryAt || !asset.sitePermission || !asset.safetyLimitVersion) errors.push(`asset ${asset.id || '?'} lacks live constraints/permission`);
    assetMap.set(String(asset.id), asset);
    if (Number.isFinite(evaluatedAt) && telemetryMaxAgeMs > 0 &&
        evaluatedAt - Date.parse(asset.telemetryAt) > telemetryMaxAgeMs) errors.push(`asset ${asset.id || '?'} telemetry is stale`);
  }
  const jobIds = new Set(), eventKeys = new Set();
  for (const job of jobs) {
    if (!job.id || jobIds.has(String(job.id)) || !(job.weightKg > 0) || !job.windowStart || !job.windowEnd || Date.parse(job.windowStart) >= Date.parse(job.windowEnd)) errors.push(`job ${job.id || '?'} invalid or duplicate`);
    jobIds.add(String(job.id));
  }
  const loads = new Map();
  const assignments = new Map();
  if (!plan.version || !plan.optimizerVersion) errors.push('versioned optimization plan required');
  for (const stop of plan.stops || []) {
    if (!jobIds.has(String(stop.jobId)) || !assetMap.has(String(stop.assetId))) errors.push('plan references unknown job or asset');
    const job = jobs.find((j) => String(j.id) === String(stop.jobId));
    loads.set(String(stop.assetId), (loads.get(String(stop.assetId)) || 0) + Number(job?.weightKg || 0));
    assignments.set(String(stop.jobId), (assignments.get(String(stop.jobId)) || 0) + 1);
    if (!stop.decisionRuleVersion || !stop.eta || !stop.operatorApprovalId) errors.push(`stop ${stop.jobId || '?'} lacks decision version, ETA, or approval`);
  }
  for (const jobId of jobIds) if (assignments.get(jobId) !== 1) errors.push(`job ${jobId} must be assigned exactly once`);
  for (const [assetId, load] of loads) if (load > Number(assetMap.get(assetId)?.capacityKg || 0)) errors.push(`asset ${assetId} exceeds capacity`);
  for (const event of input.events || []) {
    const key = `${event.source}|${event.id}`;
    if (!event.id || eventKeys.has(key)) errors.push('duplicate event');
    eventKeys.add(key);
    if (!event.occurredAt || !event.receivedAt || !event.sourceVersion || !event.idempotencyKey ||
        Date.parse(event.receivedAt) < Date.parse(event.occurredAt)) errors.push(`event ${event.id || '?'} timestamps/source/idempotency invalid`);
  }
  for (const exception of input.exceptions || []) if (!exception.ownerId || !exception.manualFallback || !exception.recoveryStatus) errors.push(`exception ${exception.id || '?'} lacks owned fallback`);
  const pricing = input.pricingPolicy || {};
  if (!pricing.version || !(pricing.maxSurchargePct >= 0) || (pricing.recommendations || []).some((r) => r.surchargePct > pricing.maxSurchargePct || !r.ruleId || !r.operatorApprovalId)) errors.push('bounded, versioned, approved pricing rules required');
  const replay = input.replay || {};
  if (!replay.fixtureVersion || !['forecastError','constraintViolations','latencyMs','missedEvents','realizedOutcome'].every((k) => Number.isFinite(Number(replay.metrics?.[k])))) errors.push('versioned replay metrics required');
  return { errors, result: { assignedJobs: (plan.stops || []).length, assetLoadsKg: Object.fromEntries(loads),
    exceptionCount: (input.exceptions || []).length, replay: replay.metrics || {}, decision: errors.length ? 'revise' : 'reviewable' },
    assumptions: ['telemetry and map snapshots may become stale after capturedAt'],
    uncertainty: { roadSafetyReviewRequired: true, liveTrafficNotConnected: true, realizedOutcomeRequiresOperationsReview: true } };
}
module.exports = { evaluate };

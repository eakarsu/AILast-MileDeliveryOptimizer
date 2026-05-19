# Audit Note — AILast-MileDeliveryOptimizer

Source audit: `_AUDIT/reports/batch_05.md` § 6

## Original audit recommendations

### Missing AI endpoints
- `/anomaly-detection`
- `/customer-churn-predictor`
- `/dynamic-pricing-recommender`
- `/vehicle-maintenance-alert`

### Missing non-AI features
- Real-time tracking map (customer-facing)
- Proof of delivery (signature/photo capture)
- Customer SMS/email notifications
- 3PL platform integrations (Flexport, Shippo)
- Return / reverse logistics workflows

### Custom feature suggestions
- Agentic delivery planner
- Vision-based delivery verification
- Streaming delivery anomaly detection
- Multi-modal demand forecasting
- Autonomous customer communication
- Carbon impact tracker

## Implemented in this pass
1. **POST `/api/ai/anomaly-detection`** — added service method `detectAnomalies` and corresponding route. Persists to `AIResult` like all other endpoints.
2. **POST `/api/ai/customer-churn-predictor`** — added service method `predictCustomerChurn` + route.

Both reuse existing `openRouterService.callOpenRouter`, `persistAIResult`, and `aiRateLimiter` patterns. JSON output schema documented in system prompt. Syntax checked.

## Backlog (priority order)

### Mechanical
- `/dynamic-pricing-recommender` (similar pattern; needs zone/SLA context)
- `/vehicle-maintenance-alert` (similar pattern; uses Vehicle model)

### Needs creds / external SDK
- 3PL integrations (Flexport, Shippo APIs)
- SMS/email notifications (Twilio, SendGrid)
- Real-time tracking map (mapping provider)
- Vision-based POD (image hosting + vision model)

### Needs product decision
- Reverse logistics workflow definition
- Carbon impact methodology (which emissions factors)
- Customer-facing tracking UX (out of scope for backend)

## Apply pass 3 (frontend)

LEFT-AS-IS. Frontend already wires the AI endpoints implemented in apply pass 2 (JWT Bearer auth from localStorage, 503-no-key handling via backend, existing styling). No changes required.

## Apply pass 4 (mechanical backlog)

NO CHANGES. Both mechanical backlog endpoints are already fully implemented:
- `POST /api/ai/dynamic-pricing-recommender` — present in `backend/routes/ai.js` with `recommendDynamicPricing` service helper and persisted via `persistAIResult`. Wired in `frontend/src/pages/AIToolsPage.js`.
- `POST /api/ai/vehicle-maintenance-alert` — present in `backend/routes/ai.js` with `vehicleMaintenanceAlert` service helper. Wired in `frontend/src/pages/AIToolsPage.js`.
Remaining backlog items are NEEDS-CREDS (3PL APIs, Twilio, SendGrid, vision model) or NEEDS-PRODUCT-DECISION (reverse logistics workflow, carbon methodology).

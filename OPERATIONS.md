# Governed last-mile dispatch operations

## Supported local boundary

The production-shaped path is `/api/governed-last-mile-dispatch`. Durable work items include timestamped assets, site permissions and safety limits, jobs/windows, versioned optimizer plans, exactly-once assignments, capacities, operator-approved stops, source-versioned events, owned exception fallbacks, bounded pricing rules, sync policy, and historical replay metrics.

Validation is deterministic at the caller-supplied evaluation time. It rejects stale telemetry, duplicate events/jobs, unassigned or multiply assigned jobs, capacity violations, unapproved dispatch/pricing, and incomplete offline/retry policy.

## Operational authority

A strong JWT and signed tenant claim are mandatory. Dispatcher, safety operator, fleet manager, or admin may independently approve; creators cannot approve their own work. Export/event access is creator/approver/admin scoped. Approved state is required before any connector operation. This local workflow is a decision packet, not authority to move a vehicle, charge a customer, or override road/site safety.

Canonical SHA-256 request binding prevents idempotency keys from being reused with changed plans or payloads. Credentials are never accepted in domain/provider payloads.

## Lifecycle

- `./start.sh check` validates configuration only.
- `./start.sh start` starts preinstalled application processes without installs, schema changes, seeds, port killing, or global services.
- `ALLOW_SCHEMA_MIGRATION=true DATABASE_URL=... ./start.sh migrate` is explicit and reviewed.
- Destructive demo seeding is isolated, forbidden in production, and requires explicit authorization and password.

The generated dynamic-pricing and other gap routes are unmounted. Generated prototype routes are opt-in outside production.

## External systems and failure

Telemetry, ERP, WMS, TMS, GIS, device, weather, maintenance, and notifications are outbox provider names, not connected adapters. A worker must validate site/asset mapping, timestamps, cursors, provider idempotency, offline queues, safety limits, and receipts. Retries are bounded and dead-letter after five failures. Dispatch, pricing, proof of delivery, customer notification, and deletion remain closed without credentials, safe test tenants, operator approval, and authoritative receipts.

## Verification

Run `node --test backend/governance/tests/*.test.js`, changed-code syntax checks, and `bash -n start.sh`. CI verifies planning constraints, replay metrics, tenant/RBAC, approval separation, migrations, idempotency mismatch, failure bounds, and safe lifecycle. It does not run vehicles, telemetry, maps, databases, providers, or optimization services.


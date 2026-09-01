# Design Focus

Use this reference only after `specx-plan` has decided that `design.md` is needed. It helps choose what design facts matter for the current implementation. Do not copy these checklists into `design.md`; use them to guide code inspection, design decisions, task boundaries, and verification planning.

Choose one dominant focus. Add at most one secondary focus only when the implementation genuinely crosses that boundary.

## Backend Focus

Use when the primary implementation surface is backend behavior.

Inspect:
- handlers, controllers, services, repositories, jobs, schemas, migrations, and tests
- request or job entry, validation, domain operation, persistence, side effects, and response
- endpoint fields, DTOs, events, database columns, config keys, permissions, transactions, rollback, not-found, validation, and partial-failure behavior
- migrations, backfills, old clients, defaults, and compatibility when data or contracts change

Design should answer:
- where the behavior enters the system
- which existing layer owns the change
- how data is validated, persisted, rolled back, and exposed
- what compatibility or migration path is needed

Avoid frontend detail unless it changes the backend contract.

## Frontend Focus

Use when the primary implementation surface is client behavior.

Inspect:
- routes, pages, components, hooks, stores, client services, and tests
- state owner, fetch, transform, render, submit, refresh, and navigation paths
- request and response fields, form fields, URL params, storage keys, validation, loading, empty, error, disabled, and navigation behavior
- accessibility and responsive behavior only when acceptance depends on it

Design should answer:
- where state is owned
- how data moves from fetch to render and from submit to refresh
- how loading, empty, error, disabled, and validation states behave
- what user-visible behavior must be verified at runtime

Avoid backend internals unless they change the client contract.

## Fullstack Focus

Use when frontend and backend changes must be coordinated.

Inspect:
- frontend route, component, state, and client service files
- backend handler, service, persistence, and validation files
- shared request, response, schema fields, and validation rules
- frontend action -> backend validation -> persistence -> response -> client update flow
- backend failure surfacing, invalid, empty, stale data behavior, compatibility, feature flags, defaults, rollout, and backout

Design should answer:
- what the shared contract is
- which side validates which rule
- how backend failures appear in the UI
- what order implementation tasks must follow across ends

Avoid duplicating full frontend and backend plans; record the shared contract once.

## Integration Focus

Use for service-to-service or third-party integration work.

Inspect:
- clients, gateways, adapters, handlers, jobs, queues, callbacks, config, and tests
- endpoints, payloads, headers, authentication, events, mapping rules, outbound path, inbound callback path, and reconciliation path
- timeout, retry, dedupe, idempotency, malformed response, partial failure, versioning, feature flags, rollout, and backout

Design should answer:
- how outbound and inbound integration paths are owned
- how auth, payload mapping, retries, dedupe, and idempotency work
- how partial failure and reconciliation are handled
- what versioning or rollout guard is needed

Avoid unrelated UI detail and generic integration advice not tied to current services.

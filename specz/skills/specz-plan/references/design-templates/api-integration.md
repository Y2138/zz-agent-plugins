# API Integration Design Hints

Use only for service-to-service or third-party integration work.

Include when relevant:

- clients/gateways/adapters/handlers/jobs/queues/callbacks/config/tests
- endpoints, payloads, headers, auth, events, mapping rules
- outbound path, inbound callback path, reconciliation path
- timeout, retry, dedupe, idempotency, malformed response, partial failure
- versioning, feature flags, rollout/backout

Avoid:

- unrelated UI detail
- generic integration advice not tied to current services

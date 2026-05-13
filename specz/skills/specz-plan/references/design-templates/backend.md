# Backend Design Hints

Use only when the primary end is backend.

Include when relevant:

- handlers/controllers/services/repos/jobs/schemas/migrations/tests
- request/job entry, validation, domain operation, persistence, side effects, response
- endpoint fields, DTOs, events, DB columns, config keys
- permissions, transactions, rollback, not-found/validation/partial-failure behavior
- migrations, backfills, old clients, defaults, compatibility

Avoid:

- frontend detail unless it changes backend contract
- DDD terms unless they clarify ownership or behavior

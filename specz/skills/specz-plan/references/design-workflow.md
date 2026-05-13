# Design Workflow

Use only when `specz-plan` decides `design.md` is needed.

# Rule

`design.md` removes executor guesswork. It is not a design essay.

# Create `design.md` For

- cross-module/system/end work
- contracts, schemas, storage, config, migrations, permissions
- async/stateful flows, compatibility, fallback, rollout
- large tasks or unclear implementation ownership

# Skip `design.md` For

- small local changes
- obvious existing-pattern edits
- text/content tweaks
- low-risk bug fixes with clear acceptance

# Required Shape

```markdown
# Implementation Design

## Codebase Facts
- DESIGN-FACT-01: ...

## Chosen Approach
- DESIGN-DECISION-01: ...

## Files / Modules
| Area | File / Module | Change |

## Contracts / Data Mapping
| ID | Source | Field / API / Config | Target | Rule |

## Flow / Fallback / Compatibility
- DESIGN-FLOW-01: ...
- DESIGN-FALLBACK-01: ...
- DESIGN-COMPAT-01: ...

## Non-Goals / Blockers
- DESIGN-NONGOAL-01: ...
- BLOCKER-01: ...
```

# Checks

- uses real codebase names
- no unresolved maybe/if branches except `BLOCKER-*`
- implementation mappings live here, not in `spec.md`
- scenarios are referenced by ID, not copied

# End Hints

- frontend: routes/components/hooks/state/client behavior
- backend: handlers/services/repos/schemas/jobs/permissions
- api-integration: clients/adapters/webhooks/retries/idempotency
- fullstack: frontend slice, backend slice, shared contract, rollout

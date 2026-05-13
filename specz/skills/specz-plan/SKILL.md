---
name: "specz-plan"
description: "Planning-stage Specz skill. It turns spec.md into the smallest sufficient execution baseline: optional design.md, tasks.md, and verification.md."
---

# Purpose

Prepare non-small work for execution without over-documenting. `spec.md` remains the behavior authority; planning adds only the implementation guidance and evidence plan the task actually needs.

# Outputs

- Required: `spec.md`, `tasks.md`, `verification.md`
- Optional: `design.md`
- Never: `requirements.md` or product code

# Must

- Read `spec.md` first and respect its `Size`.
- Inspect relevant code before writing tasks or design.
- Use ID references: `SPEC-*`, `DESIGN-*` when design exists, `TASK-*`, `VERIFY-*`.
- Keep artifacts short and executable.
- Run the applicable Bundle Lint before handoff.

# Must Not

- Do not expand scope beyond `spec.md`.
- Do not create `design.md` for small or obvious local changes unless a concrete implementation decision is needed.
- Do not create vague tasks.
- Do not duplicate mappings or implementation details across artifacts.

# Design Decision

Create `design.md` only when one is needed to avoid executor guesswork.

Use `design.md` for:

- cross-module, cross-system, frontend/backend, API, persistence, migration, permission, async, or stateful work
- new or changed contracts, schemas, config, storage, or data mapping
- meaningful compatibility, fallback, rollout, or error-handling decisions
- large tasks

Skip `design.md` for:

- local single-file or obvious pattern-following changes
- text/content tweaks
- small bug fixes with clear acceptance and low regression risk

If skipped, note this in `tasks.md`:

```markdown
> Design: skipped; local low-risk change executable from `spec.md`.
```

# Workflow

1. Resolve the bundle and read `spec.md`.
2. If `Size: small`, prefer handing directly to `specz-exec`; only continue if the user asked for planning or the code inspection reveals hidden risk.
3. Inspect relevant repository files.
4. Decide whether `design.md` is needed.
5. Write optional `design.md`.
6. Write `tasks.md`.
7. Write `verification.md`.
8. Run Bundle Lint and repair only the failing parts.

# `design.md` Contract

When design is needed, keep this compact:

```markdown
# Implementation Design

## Codebase Facts
- DESIGN-FACT-01: ...

## Chosen Approach
- DESIGN-DECISION-01: ...

## Files / Modules
| Area | File / Module | Change |
|---|---|---|

## Contracts / Data Mapping
| ID | Source | Field / API / Config | Target | Rule |
|---|---|---|---|---|

## Flow / Fallback / Compatibility
- DESIGN-FLOW-01: ...
- DESIGN-FALLBACK-01: ...
- DESIGN-COMPAT-01: ...

## Non-Goals / Blockers
- DESIGN-NONGOAL-01: ...
- BLOCKER-01: ...
```

Rules:

- Reference real files, modules, contracts, config, or data structures.
- Put implementation mappings here, not in `spec.md`.
- No unresolved "maybe/if" branches unless listed as `BLOCKER-*`.

# `tasks.md` Contract

```markdown
# Tasks

> Design: `design.md` | skipped; [reason]

- [ ] TASK-01 [P] [Concrete task title]
  - Covers: SPEC-SCENARIO-01
  - Design: DESIGN-DECISION-01 | none
  - Files: `path/or/module`
  - Done when: ...

## Dependencies
- TASK-03 depends on TASK-01
```

Rules:

- Each task has `Covers`, `Design`, `Files`, and `Done when`.
- Each task is concrete enough to execute without another planning pass.
- Mark independent tasks with `[P]`.
- Include implementation-side test edits only when code must add or update tests.

# `verification.md` Contract

```markdown
# Verification Plan

## Matrix
| Evidence | Covers Spec | Covers Tasks | Method | Type |
|---|---|---|---|---|
| VERIFY-01 | SPEC-SCENARIO-01 | TASK-01 | test/browser/API/manual | positive |

## Evidence Details
- [ ] VERIFY-01: ...
  - Covers: SPEC-SCENARIO-01, TASK-01
  - Method:
  - Expected evidence:
  - Negative / regression case:

## Latest Verification Result
- Status: NOT RUN
- Verified at: none
- Evidence: none
- Remaining repair tasks: none
```

Rules:

- Every `SPEC-SCENARIO-*` has evidence.
- Key tasks have evidence.
- Add negative/regression evidence only where risk justifies it.
- UI behavior needs runtime/browser evidence.

# Bundle Lint

Required checks:

- `spec.md` has no implementation details.
- `tasks.md` tasks include `Covers`, `Design`, `Files`, and `Done when`.
- `verification.md` maps evidence to spec scenarios and key tasks.
- If `design.md` exists, it references real codebase surfaces and has no unresolved branches.
- If `design.md` is skipped, `tasks.md` explains why and tasks are still executable.
- Repeated content is replaced with ID references.

# Handoff

When lint passes, hand to `specz-exec` or `specz-auto-run`.

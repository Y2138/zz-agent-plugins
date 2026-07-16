---
name: "specz-plan"
description: "Planning-stage Specz skill. Use when specz-flow routes a bundle to planning. It turns spec.md into the smallest sufficient execution baseline: optional design.md, tasks.md, and verification.md."
---

# Purpose

Prepare non-small work for execution without over-documenting. `spec.md` remains the behavior authority; planning adds only the implementation guidance and evidence plan the task actually needs.

# 🔴 Activation Gate / 🛑 STOP

- Proceed only when this `specz-plan` skill is loaded as the active stage contract, either because the user invoked it directly or because `specz-flow` routed here.
- If only `specz-flow` is loaded, stop and load `specz-plan` before writing `design.md`, `tasks.md`, or `verification.md`.
- If the platform cannot load this skill, stop and report that the planning stage skill is unavailable.

# Outputs

- Required: `spec.md`, `tasks.md`, `verification.md`
- Optional: `design.md`
- Never: product code

# Must

- Read `spec.md` first and respect its `Size`.
- Inspect relevant project context and code before writing tasks or design.
- Use clearly relevant archive records only as low-priority historical context.
- If `design.md` is created, include a concise existing-code analysis table.
- Use ID references: `SPEC-*`, `DESIGN-*` when design exists, `TASK-*`, `VERIFY-*`.
- Keep artifacts short and executable.
- Run the applicable Bundle Lint before handoff.
- After planning non-small work, present a concise review summary so the user can request adjustments before execution.

# Must Not

- Do not expand scope beyond `spec.md`.
- Do not create `design.md` for small or obvious local changes unless a concrete implementation decision is needed.
- Do not create vague tasks.
- Do not duplicate mappings or implementation details across artifacts.

# Checkpoints

- 🔴 CHECKPOINT / 🛑 STOP before planning: if `spec.md` is missing, has unresolved blocking `QUESTION-*`, or `Size: small` with no hidden risk and no explicit planning request, route back instead of writing planning artifacts.
- 🔴 CHECKPOINT / 🛑 STOP before writing `design.md` or `tasks.md`: confirm the Context Evidence Gate below has enough real code evidence for the declared size and risk.
- 🔴 CHECKPOINT / 🛑 STOP before handoff: Bundle Lint must pass, every non-obvious task must cite real files/modules or a `BLOCKER-*`, and no product code was modified by this skill.

# Design Decision

Create `design.md` only when one is needed to avoid executor guesswork.

Use `design.md` for:

- cross-module, cross-system, frontend/backend, API, persistence, migration, permission, async, or stateful work
- new or changed contracts, schemas, config, storage, or data mapping
- meaningful compatibility, fallback, rollout, or error-handling decisions
- large tasks

Skip `design.md` for:

- one coherent, low-risk, obvious pattern-following change, even when the same edit spans multiple files
- text/content tweaks
- small bug fixes with clear acceptance and low regression risk

If skipped, note this in `tasks.md`:

```markdown
> Design: skipped; local low-risk change executable from `spec.md`.
```

# Workflow

1. Resolve the bundle and read `spec.md`.
2. If `Size: small`, prefer handing directly to `specz-run`; only continue if the user asked for planning or the code inspection reveals hidden risk.
3. Inspect relevant project context, repository files, and impact surfaces using the Context Collection Protocol below.
4. Decide whether `design.md` is needed.
5. Write optional `design.md`.
6. Write `tasks.md`.
7. Write `verification.md`.
8. Run Bundle Lint and repair only the failing parts.
9. Report the planning result with key design, task, and verification points for user review.

# Context Collection Protocol

Use this protocol to keep planning grounded in real code while avoiding broad exploration.

Priority:

1. Entry points: user actions, commands, APIs, components, hooks, jobs, or config entry points.
2. Impact relationships: callers, callees, dependents, and cross-module boundaries.
3. Data and state: types, schemas, state machines, cache, config, and persistence.
4. Existing patterns: naming, module shape, validation, error handling, and test style near the change.
5. Verification surface: existing tests, fixtures, scripts, runtime entry points, or manual checks.

Tool strategy:

- Prefer structured code context, call/dependency information, or impact analysis when available.
- If no structural index is available, use the smallest useful file list and text search, then read only the relevant files.
- If the relevant file is already known, read it directly instead of searching broadly.
- Use text search for literal strings, messages, config keys, or command names.
- Use official docs or project-pinned references for external APIs or libraries.

Depth by size:

- Small: collect only enough context to confirm the change is local and low-risk.
- Standard: cover entry points, existing patterns, and verification surface.
- Large or high-risk: cover entry points, impact relationships, data/state, and verification surface.

If a needed entry point or contract cannot be found, record a `BLOCKER-*` or a narrow assumption rather than designing from unverifiable facts.

# Context Evidence Gate

Before writing planning artifacts, record enough evidence to prevent generic plans:

- Standard work: at least one entry point, one existing pattern or adjacent module, and one verification surface must be identified.
- Large or high-risk work: at least one entry point, one impact relationship or data/state surface, one compatibility or fallback concern, and one verification surface must be identified.
- For each changed surface named by `spec.md` or the user, such as API, UI, state, permissions, persistence, migration, config, or external integration, identify at least one real code surface or record a `BLOCKER-*`.
- If an evidence item cannot be found after the smallest useful search, record `BLOCKER-*` or a narrow assumption in `design.md` or `tasks.md`; do not invent file paths, contracts, or test commands.
- If `design.md` is skipped, `tasks.md` must state the concrete context that made the work local and low-risk.

# `design.md` Contract

When design is needed, keep this compact:

```markdown
# Implementation Design

## Existing Code Analysis
| Surface | Location | Role | Callers / Dependents | Existing Pattern | Handling |
|---|---|---|---|---|---|
| ... | `path/or/module` | ... | ... | ... | reuse \| extend \| build new \| leave unchanged \| remove |

## Design Decisions
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

- Existing-code analysis must reference real files, modules, contracts, config, or data structures.
- Keep the existing-code table short; include only facts that affect the design.
- Follow the Context Collection Protocol; prefer structured code context and call/dependency information when available, otherwise inspect the smallest relevant code surface directly.
- Prefer reuse or extension when maintainable; use build-new only when existing capability is absent or unsuitable.
- Put implementation mappings here, not in `spec.md`.
- No unresolved "maybe/if" branches unless listed as `BLOCKER-*`.
- For standard/large work, identify affected entry points, dependents, existing patterns, and testability surfaces when they influence the implementation.

# `tasks.md` Contract

```markdown
# Tasks

> Design: `design.md` | skipped; [reason]

- [ ] TASK-01 [P] [new|fix|refactor|test|verify-repair] [Concrete task title]
  - Covers: SPEC-SCENARIO-01
  - Design: DESIGN-DECISION-01 | none
  - Files: `path/or/module`
  - Parallel safety: [required when [P]]
    - Write set: `files/this/task/writes`
    - Shared state: none | list
    - Conflict risk: low | medium | high
    - Fallback: run after TASK-XX if overlap is found
  - Done when: ...

## Dependencies
- TASK-03 depends on TASK-01
```

Rules:

- Each task has `Covers`, `Design`, `Files`, and `Done when`.
- Each task is concrete enough to execute without another planning pass.
- Each task has one type tag: `[new]`, `[fix]`, `[refactor]`, `[test]`, or `[verify-repair]`.
- Mark independent tasks with `[P]`. Each `[P]` task must declare a `Parallel safety` block with a `Write set`; two `[P]` tasks' `Write set`s must not overlap. A `[P]` task writing a shared surface (schema/migration/config/public API/persistence/auth/global UI) must drop `[P]` or split into parallel leaf tasks plus a serial integration task.
- Include implementation-side test edits only when code must add or update tests.
- Use `[verify-repair]` only for tasks created from failed verification evidence.

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
- Standard/large verification should include risk-based architecture quality evidence where applicable: scope fit, existing-pattern fit, boundary integrity, contract compatibility, state/data flow, testability, cleanup, or blast radius.
- Do not add every architecture quality check by default; select only checks justified by the design risk.

# Bundle Lint

Required checks:

- `spec.md` has no implementation details.
- `tasks.md` tasks include `Covers`, `Design`, `Files`, and `Done when`.
- `tasks.md` tasks include a task type tag.
- Task titles are concrete actions, not vague labels such as "update related logic" or "handle edge cases".
- `verification.md` maps evidence to spec scenarios and key tasks.
- Verification entries include an expected result, not only a command name.
- If `design.md` exists, it has `Existing Code Analysis`, references real codebase surfaces, and has no unresolved branches.
- If `design.md` exists, design decisions cite or derive from real code context instead of restating `spec.md`.
- If `design.md` is skipped, `tasks.md` explains why and tasks are still executable.
- Repeated content is replaced with ID references.
- The plan has no internal contradictions: a later task consuming an interface or file an earlier task does not produce is flagged before handoff.
- The plan does not mandate something a review would flag as a defect, such as an assertionless test or verbatim duplication of a logic block.

# Handoff

When lint passes, report a review summary before execution.

Report:

- active bundle
- created or updated artifacts
- key design decisions or `design.md` skipped reason
- evidence surfaces used for planning, plus any `BLOCKER-*`
- task breakdown summary
- verification approach summary
- any assumptions, blockers, or tradeoffs that deserve user review

If the user requests adjustments, update the planning artifacts before execution. If the user has already explicitly asked to continue through execution, hand to `specz-run` after the review summary.

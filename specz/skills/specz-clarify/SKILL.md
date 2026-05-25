---
name: "specz-clarify"
description: "Clarification-stage Specz skill. Use when specz-flow routes a bundle to clarification, or when the user explicitly asks to create/update a behavior-focused spec.md with task-size routing."
---

# Purpose

Create or update `spec.md` as the WHAT/WHY baseline, then decide whether the work needs planning or can run directly.

# Outputs

- Always: `specs/<summary-name>/spec.md`
- Never: `design.md`, `tasks.md`, `verification.md`, or product code

# Must

- Keep `spec.md` behavior-focused and implementation-free.
- Use the user's/project's natural language for bundle names and artifact content.
- Classify task size before handoff.
- Ask only questions that affect scope, behavior, acceptance, or task size.
- Preserve stable `SPEC-*` IDs when updating.
- Keep top metadata current.
- Use related archive records only as low-priority historical context.

# Must Not

- Do not put file paths, module names, API fields, storage keys, config structures, implementation order, or test commands in `spec.md`.
- Do not choose architecture or write implementation tasks.
- Do not let archive records override the current user request.

# Size Routing

Classify the work in `spec.md`:

- `Size: small` when the change is local, low-risk, clearly described, and likely executable from `spec.md` alone.
- `Size: standard` when the change touches multiple files/modules, needs task breakdown, or has moderate regression risk.
- `Size: large` when the change crosses systems, contracts, persistence, migrations, permissions, or user-critical flows.

Handoff:

- small -> `specz-run` may execute from `spec.md` directly; `specz-plan` is optional.
- standard/large -> use `specz-plan`.
- unclear -> ask or mark `QUESTION-*`.

# Workflow

1. Resolve `specs/<summary-name>/`.
2. Read the request, existing `spec.md`, and only relevant archive records.
3. Clarify missing product intent if it affects behavior or acceptance.
4. Write or update `spec.md`.
5. Run the quality gate and hand off by size.

# `spec.md` Contract

```markdown
# [Feature Name] Spec

> Source: [PRD path/link | user request | mixed]
> Size: small | standard | large
> Status: draft | planned | running | verifying | passed | blocked
> Priority: P0 | P1 | P2 | P3
> Created: YYYY-MM-DD
> Updated: YYYY-MM-DD
> Related archives: [short list or none]

## Context
- Problem:
- Goal:
- Users / Actors:

## Scope
- In:
- Out:

## Business Rules
- SPEC-RULE-01: ...

## Requirements

### SPEC-REQ-01: [Requirement Name]
The system SHALL ...

#### SPEC-SCENARIO-01: [Scenario Name]
- GIVEN ...
- WHEN ...
- THEN ...

## Acceptance Criteria
- SPEC-AC-01: ...

## Assumptions / Open Questions
- ASSUMPTION-01: ...
- QUESTION-01: ...
```

# Quality Gate

- `spec.md` has `Size`, `Status`, `Priority`, `Created`, and `Updated`.
- `spec.md` has no implementation details.
- Every `SPEC-REQ-*` has at least one `SPEC-SCENARIO-*`.
- Acceptance criteria are observable.
- Scope in/out is explicit enough for the chosen size.

# Handoff

- `Size: small`: hand to `specz-run` unless the user wants full planning.
- `Size: standard` or `Size: large`: hand to `specz-plan`.

---
name: "specz-clarify"
description: "Specz clarification skill. It creates a behavior-focused spec.md and routes the work as small, standard, or large before planning or execution."
---

# Purpose

Create or update `spec.md` as the WHAT/WHY baseline, then decide whether the work needs the full Specz planning flow.

# Outputs

- Always: `specs/<summary-slug>/spec.md`
- Never: `requirements.md`, `design.md`, `tasks.md`, `verification.md`, or product code

# Must

- Keep `spec.md` behavior-focused and implementation-free.
- Classify task size before handoff.
- Ask only questions that affect scope, behavior, acceptance, or task size.
- Preserve stable `SPEC-*` IDs when updating.

# Must Not

- Do not put file paths, module names, API fields, storage keys, config structures, implementation order, or test commands in `spec.md`.
- Do not choose architecture or write implementation tasks.

# Size Routing

Classify the work in `spec.md`:

- `Size: small` when the change is local, low-risk, clearly described, and likely executable from `spec.md` alone.
- `Size: standard` when the change touches multiple files/modules, needs task breakdown, or has moderate regression risk.
- `Size: large` when the change crosses systems, contracts, persistence, migrations, permissions, or user-critical flows.

Handoff:

- small -> `specz-exec` may execute from `spec.md` directly; `specz-plan` is optional.
- standard/large -> use `specz-plan`.
- unclear -> ask or mark `QUESTION-*`.

# Workflow

1. Resolve `specs/<summary-slug>/`.
2. Read the request, existing `spec.md`, and only relevant archive records.
3. Clarify missing product intent if it affects behavior or acceptance.
4. Write or update `spec.md`.
5. Run the quality gate and hand off by size.

# `spec.md` Contract

```markdown
# [Feature Name] Spec

> Source: [PRD path/link | user request | mixed]
> Size: small | standard | large
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

- `spec.md` has `Size`.
- `spec.md` has no implementation details.
- Every `SPEC-REQ-*` has at least one `SPEC-SCENARIO-*`.
- Acceptance criteria are observable.
- Scope in/out is explicit enough for the chosen size.

# Handoff

- `Size: small`: hand to `specz-exec` unless the user wants full planning.
- `Size: standard` or `Size: large`: hand to `specz-plan`.

---
name: "specx-clarify"
description: "Clarification-stage Specx skill. Use when specx-flow routes a bundle to clarification, or when the user explicitly asks to create/update a behavior-focused spec.md with task-size routing."
---

# Purpose

Create or update `spec.md` as the WHAT/WHY baseline, then decide whether the work needs planning or can run directly. Clarify before writing; after `spec.md` is written, it should have no unresolved blocking questions.

# 🔴 Activation Gate / 🛑 STOP

- Proceed only when this `specx-clarify` skill is loaded as the active stage contract, either because the user invoked it directly or because `specx-flow` routed here.
- If only `specx-flow` is loaded, stop and load `specx-clarify` before writing or updating `spec.md`.
- If the platform cannot load this skill, stop and report that the clarification stage skill is unavailable.

# Outputs

- Always: `specs/<summary-name>/spec.md`
- Never: `design.md`, `tasks.md`, `verification.md`, or product code

# Must

- Keep `spec.md` behavior-focused and implementation-free.
- Use Chinese for bundle directory names and artifact content.
- Classify task size before handoff.
- Ask only questions that affect scope, behavior, acceptance, or task size.
- Before asking, self-check available project context and existing code when it can answer factual questions.
- Ask at most 1-3 high-value questions at a time, each with a clear reason it blocks scope, behavior, acceptance, or size. When the request has a decision fork (multiple design branches, ambiguous terms, or product/business judgment), ask one question at a time, and each question must carry a recommended answer the user can confirm or correct; only batch questions when they are independent and non-forking.
- Preserve stable `SPEC-*` IDs when updating.
- Keep top metadata current.
- Use related archive records only as low-priority historical context.

# Must Not

- Do not put file paths, module names, API fields, storage keys, config structures, implementation order, or test commands in `spec.md`.
- Do not choose architecture or write implementation tasks.
- Do not let archive records override the current user request.
- Do not proceed to planning or execution with unresolved `QUESTION-*`.

# Checkpoints

- 🔴 CHECKPOINT / 🛑 STOP before asking: if the request already states scope, behavior, acceptance, and size enough to write `spec.md`, do not ask clarification questions; write the spec and record non-blocking defaults as `ASSUMPTION-*`.
- 🔴 CHECKPOINT / 🛑 STOP before updating an existing spec: preserve stable `SPEC-*` IDs, touch only sections affected by the new request, and leave unrelated requirements and acceptance criteria unchanged.
- 🔴 CHECKPOINT / 🛑 STOP before handoff: if any blocking `QUESTION-*` remains, stop at clarification and do not route to `specx-plan` or `specx-run`.

# Failure Modes

| Trigger | Required action | Forbidden action |
|---|---|---|
| Existing `spec.md` has broken required metadata | Repair only the broken metadata before handoff | Do not rewrite unrelated requirements |
| User does not answer blocking `QUESTION-*` | Stop with the question and why it blocks | Do not convert the blocker into an assumption |
| Archive record conflicts with current request | Prefer the current request and current code context | Do not let archive history override behavior |
| Requested detail is an implementation choice | Leave it for planning or record a non-blocking assumption | Do not ask the user for architecture preferences from clarify |
| Factual answer is available in existing project context | Read the minimal context and use it | Do not ask the user to restate project facts |

# Clarification Discipline

Use a short self-check before writing questions:

- Read only the context needed to avoid asking the user about facts already available in the project.
- Check existing terminology, user-facing behavior, adjacent flows, and likely impact surface when they affect scope or size.
- Identify whether the user has already specified the target outcome, non-goals, acceptance criteria, and preferred tradeoffs.
- When the request is clear enough, write or update `spec.md` without asking; do not add questions for implementation details or stylistic preferences.
- Prefer `ASSUMPTION-*` for non-blocking interpretations and defaults.
- Use `QUESTION-*` only for decisions that would change scope, behavior, acceptance, priority, or task size.
- For each `QUESTION-*`, state why the answer is blocking.
- When the request is ambiguous, propose a default interpretation the user can confirm or correct.
- When there are blocking questions, ask the user directly and wait before writing `spec.md`.
- Do not ask implementation-choice questions that belong in planning.
- Do not ask for facts already available from the active bundle, current code, or project instructions.
- Do not turn a preference, style choice, or implementation detail into a blocking `QUESTION-*`.
- When updating an existing `spec.md`, make the smallest behavior-focused diff: keep existing IDs, update only related rules, scenarios, acceptance, assumptions, and metadata.
- Keep scenarios minimally verifiable: each key `SPEC-SCENARIO-*` should make clear who or what acts, what condition triggers the behavior, and what observable result proves correctness.
- Add boundary, failure, permission, empty-state, rollback, or compatibility scenarios only when risk or size justifies them.

# Size Routing

Classify by the highest triggered coordination or risk level, not by file count or changed lines:

- `Size: small` when the work has one coherent behavior goal, is low-risk and clearly described, follows an obvious existing pattern, needs no task decomposition or design decision, and is executable from `spec.md` alone. It may span multiple files.
- `Size: standard` when the work needs task decomposition, coordination between independently changing modules, a meaningful implementation decision, or has moderate regression risk.
- `Size: large` when the work has high-risk cross-system or contract coordination, persistence or migration concerns, permission changes, compatibility/rollback requirements, or affects a user-critical flow.

Examples:

- Adding the same simple form field across several pattern-following components can remain `small`.
- Adding a field that coordinates UI state, validation, and an API contract is usually `standard`.
- Adding a field that requires persistence migration, permission changes, or backward-compatibility handling is `large`.

Handoff:

- small -> `specx-run` may execute from `spec.md` directly; `specx-plan` is optional.
- standard/large -> use `specx-plan`.
- unclear -> ask or mark `QUESTION-*`.

# Workflow

1. Resolve `specs/<summary-name>/`.
2. Read the request, existing `spec.md`, and only relevant archive records.
3. Run the clarification self-check.
4. If any blocking question exists, ask 1-3 concise questions and wait for the user.
5. Write or update `spec.md` only after blocking questions are answered or the request is already clear.
6. Run the quality gate and hand off by size.

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
- `Size: small` has at least one main-path scenario.
- `Size: standard | large` covers main-path behavior and includes risk-based boundary, failure, permission, empty-state, rollback, or compatibility scenarios where applicable.
- Acceptance criteria are observable.
- Scope in/out is explicit enough for the chosen size.
- Blocking `QUESTION-*` entries explain why they block progress.
- No unresolved blocking `QUESTION-*` remains before handoff to `specx-plan` or `specx-run`.
- Key scenarios have the minimum actor/trigger/observable-result shape.

# Handoff

- `Size: small`: hand to `specx-run` unless the user wants full planning.
- `Size: standard` or `Size: large`: hand to `specx-plan`.

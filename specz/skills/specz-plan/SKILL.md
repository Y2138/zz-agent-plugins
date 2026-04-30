---
name: "specz-plan"
description: "Planning-stage Specz skill. It creates or updates the active spec bundle, writes spec.md as the shared source of truth, adds codebase-grounded design.md when needed, derives tasks.md, and writes a pre-implementation verification.md evidence plan."
---

# Constraints

1. **Planning Only.** Use this skill only for planning and implementation-preparation. Create or update files inside the active specs bundle, but do not write product code.
2. **Spec Bundle Authority.** `spec.md` is the only source of scope and acceptance truth. Maintain spec bundles in `$(cwd)/specs/<summary-slug>/`. Each bundle MUST contain `spec.md`, `tasks.md`, and `verification.md`; add `design.md` when needed. Do not create `checklist.md`, `issues.md`, or `test-cases.md`.
3. **Clarify Before Planning.** Before writing any documents, identify critical gaps that affect result definition, scope, or execution direction. Ask 1-5 focused questions to confirm what to do, what constitutes completion, and what is out of scope. Skip only for obviously small tasks or when missing information would not materially affect the outcome.

# Purpose

`specz-plan` is the planning-stage Specz skill. It converts a PRD, feature request, or change idea into one synchronized spec bundle that later execution and verification stages must follow. Planning defines the shared truth for development and pre-implementation evidence expectations without preempting the verifier's independent final judgment.

# Workflow

## 1. Reuse or Create the Active Bundle

1. Inspect `$(cwd)/specs/` for bundles that match the request topic or current task summary.
2. If the user specifies a bundle, use it directly.
3. Otherwise, derive `<summary-slug>` from the current task summary and prefer `$(cwd)/specs/<summary-slug>/`.
4. If that bundle already exists, update it instead of creating a versioned copy.
5. If no aligned bundle exists, create `$(cwd)/specs/<summary-slug>/`.

## 2. Brainstorm and Converge

Before writing any spec or design documents, do a short convergence pass to align on direction:

1. **Identify Critical Gaps.** Check if key information affecting result definition, scope boundaries, success criteria, or execution direction is missing.
2. **Clarify First.** If critical gaps exist, ask the user 1-5 focused questions to confirm: what to do, what constitutes completion, and what is out of scope. Do not fill gaps with assumptions.
3. **State the Decision Need.** Explain what implementation decision actually needs guidance.
4. **Compare Directions (when non-trivial).** For non-trivial changes, compare 2-3 plausible implementation directions based on codebase fit, reuse points, complexity, and verification cost.
5. **Converge and Proceed.** Choose one direction and proceed. Skip this entire step only when the task is obviously small, follows existing patterns, or missing information would not materially affect the outcome.

## 3. Draft `spec.md` First

### `spec.md`

Use this structure:

```markdown
# [Feature Name] Spec

> PRD Reference: [path or link]

## Why
[1-2 sentences on problem or opportunity]

## What Changes
- [Bullet list of changes]
- [Mark breaking changes with **BREAKING**]

## Scope
- In scope: [short bullets]
- Out of scope: [short bullets]

## Impact
- Affected specs: [list capabilities]
- Affected code: [key files or systems]

## Requirements
### Requirement: New Feature
The system SHALL provide...

#### Scenario: Success case
- **WHEN** user performs action
- **THEN** expected result

## Acceptance
- [Observable result that must be true]

## Risks / Edge Cases
- [Key boundary or risk only]
```

Rules:
- Do not copy large PRD sections into `spec.md`; only reference the source PRD at the top.
- Add enough scope, acceptance, and edge-case detail to guide execution and independent verification.
- Write Acceptance so a separate verify agent can decide pass or fail without needing executor narration.
- Do not turn `spec.md` into a design document.

## 4. Write `design.md` When Needed

Create `design.md` when the change crosses modules, depends on repository-specific reuse points, needs design pattern choices, or involves data flow, domain modeling, state, or interface decisions that the executor would otherwise need to improvise. Skip when the change is local, obvious, and fits an existing pattern.

When needed, load `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-workflow.md`, route to the matching end-specific template, and use that for the final `design.md`.

## 5. Choose Design Representations

When `design.md` is created, it MUST include enough structured representation to make the intended implementation direction unambiguous.

Choose the smallest representation that makes execution and verification reliable. For representation choice, placement, and templates, follow `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-workflow.md`, the end-specific templates under `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-templates/`, and the diagram templates under `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/diagrams-templates/` only when needed.

Rules:
- Only include representations that materially help execution or verification.
- For backend or domain-heavy changes, include DDD-style domain modeling when it is needed to remove ambiguity around bounded contexts, aggregates, entities, value objects, domain services, repositories, or domain events.

## 6. Derive `tasks.md` After Planning and Design

### `tasks.md`

- Write an ordered list of small, verifiable implementation tasks.
- Mark initial implementation tasks with `[source: requirement]`.
- Break tasks into subtasks only when it genuinely improves execution clarity.
- Include validation work where needed.
- Use `tasks.md` as the shared execution loop surface between `specz-exec` and `specz-verify`. Verification may later reopen, append, or reprioritize tasks based on discovered defects.
- Avoid overdesign and avoid speculative tasks.
- Every task must remain inside the current `spec.md` scope.
- When `design.md` exists, tasks must reflect its module boundaries, sequencing, and key decisions.
- Do not pre-create testing tasks whose only purpose is to tell the verifier how to test. Verification should derive its own validation steps directly from `spec.md` and `design.md`.

Template:

```markdown
# Tasks
- [ ] [source: requirement] Task 1: [Describe the user-visible implementation goal]
  - [ ] Subtask 1.1: [Concrete implementation step]

# Task Dependencies
- [Task 2] depends on [Task 1]
```

## 7. Write `verification.md` After Tasks

Create `verification.md` as the pre-implementation evidence plan. It defines what observable evidence should prove the acceptance items before implementation begins, so final verification is not reverse-engineered from the completed code.

Rules:
- Derive evidence from `spec.md` first, then `design.md` when present.
- Read `tasks.md` only to understand planned implementation shape.
- Do not inspect current implementation diffs or adapt the plan around already-written code.
- Do not add requirements beyond `spec.md`.
- Plan evidence that can be executed or observed. Do not use code review, diff inspection, executor claims, or static reasoning as the primary acceptance evidence.
- For UI behavior, layout, or end-user flows, plan browser-capable runtime evidence. Prefer `playwright-cli` for page flows, interactions, assertions, screenshots, and viewport checks; prefer `chrome-devtools` CLI when DevTools-level DOM, console, network, performance, storage, or runtime inspection is the stronger proof. Treat `agent-browser`, direct Playwright code, Chrome CDP, or equivalent tools as fallbacks.
- Use API, CLI, integration, data assertions, generated artifact inspection, logs, or automated tests when those are the most suitable evidence for the requirement.
- Do not force every requirement into a unit test.
- `verification.md` is not an execution queue. `specz-exec` may read it as acceptance-evidence context, but must not mark its items complete.
- The final pass/fail decision still belongs to `specz-verify`, which must execute concrete checks and may adapt the plan when a different proof path better validates the same acceptance item.

Template:

```markdown
# Verification Plan

## Source
- Derived from: `spec.md`
- Design context: `design.md` present / not present
- Planned before implementation: yes

## Evidence Plan

- [ ] Evidence 1: [Acceptance item or scenario being proven]
  - Method: [unit test | integration test | browser check | API request | CLI command | artifact inspection | other]
  - Expected evidence: [observable pass condition]
  - Notes: [optional constraints, fixtures, viewport, command target, or risk]

## Gaps
- [Ambiguities, missing prerequisites, or requirements that cannot be verified yet]
```

## 8. Do Not Write Extra Verification Trackers During Planning

- Do not create `checklist.md`.
- Do not create `issues.md`.
- Do not create `test-cases.md`.
- Do not create separate verification tracker files beyond `verification.md`.
- Keep `verification.md` focused on evidence expectations. Do not turn it into a second task list or final verification result.

## 9. Handoff Rule

When the bundle is ready, stop at the planning boundary and direct the workflow to:

- `specz-exec` for task implementation
- `specz-verify` for independent testing and task-state repair
- `specz-archive` after verification is complete and the workflow should be summarized and cleaned up
- `specz-auto-run` when the user wants a bounded executor/verifier loop

Do not implement product code inside the `specz-plan` skill.

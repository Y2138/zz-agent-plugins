---
name: "specz-plan"
description: "Planning-stage Specz skill. It creates or updates the active spec bundle, writes spec.md as the shared source of truth, adds codebase-grounded design.md when needed, and derives tasks.md as the only shared execution loop document."
---

# Constraints

1. **Planning Only.** Use this skill only for planning and implementation-preparation. Create or update files inside the active specs bundle, but do not write product code.
2. **Spec Authority.** `spec.md` is the only source of scope and acceptance truth. This is the only stage that may materially change `spec.md` unless the user explicitly reopens planning.
3. **Shared Spec Workspace.** Spec bundles live in `$(cwd)/specs/<summary-slug>/`, where `<summary-slug>` comes from the current task summary. Reuse the matching bundle unless the user specifies another one.
4. **Required Bundle Files.** Each new or repaired bundle MUST contain `spec.md` and `tasks.md`. Add `design.md` whenever implementation design is needed to produce trustworthy execution. Do not create `checklist.md`, `issues.md`, or `test-cases.md`.
5. **Local Spec State.** `specs/` is local planning state and MUST NOT be committed to git. Respect existing ignore rules and add `specs/` to ignore rules when missing.

# Purpose

`specz-plan` is the planning-stage Specz skill. It converts a PRD, feature request, or change idea into one synchronized spec bundle that later execution and verification stages must follow. Planning defines the shared truth for development and testing without preempting the verifier's independent judgment.

# Workflow

## 1. Reuse or Create the Active Bundle

1. Inspect `$(cwd)/specs/` for bundles that match the request topic or current task summary.
2. If the user specifies a bundle, use it directly.
3. Otherwise, derive `<summary-slug>` from the current task summary and prefer `$(cwd)/specs/<summary-slug>/`.
4. If that bundle already exists, update it instead of creating a versioned copy.
5. If no aligned bundle exists, create `$(cwd)/specs/<summary-slug>/`.

## 2. Draft `spec.md` First

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

## 3. Write `design.md` When Needed

Create `design.md` when the change crosses modules, depends on repository-specific reuse points, needs design pattern choices, or involves data flow, domain modeling, state, or interface decisions that the executor would otherwise need to improvise. Skip when the change is local, obvious, and fits an existing pattern.

When needed, load `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-workflow.md`, route to the matching end-specific template, and use that for both the lightweight brainstorming pass, including any needed user questions, and the final `design.md`.

## 4. Choose Design Representations

When `design.md` is created, it MUST include enough structured representation to make the intended implementation direction unambiguous.

Choose the smallest representation that makes execution and verification reliable. For representation choice, placement, and templates, follow `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-workflow.md`, the end-specific templates under `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-templates/`, and the diagram templates under `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/diagrams-templates/` only when needed.

Rules:
- Only include representations that materially help execution or verification.
- For backend or domain-heavy changes, include DDD-style domain modeling when it is needed to remove ambiguity around bounded contexts, aggregates, entities, value objects, domain services, repositories, or domain events.

## 5. Derive `tasks.md` After Planning and Design

### `tasks.md`

- Write an ordered list of small, verifiable implementation tasks.
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
- [ ] Task 1: [Describe the user-visible implementation goal]
  - [ ] Subtask 1.1: [Concrete implementation step]

# Task Dependencies
- [Task 2] depends on [Task 1]
```

## 6. Do Not Write Verification-Owned Files During Planning

- Do not create `checklist.md`.
- Do not create `issues.md`.
- Do not create `test-cases.md`.
- Do not try to script the verifier's testing process during planning unless the spec itself contains an explicit verification constraint.
- If a feature has unusual verification risk, capture that risk in `spec.md` Acceptance or `design.md` notes instead of inventing a separate planning-owned verification document.

## 7. Handoff Rule

When the bundle is ready, stop at the planning boundary and direct the workflow to:

- `specz-exec` for task implementation
- `specz-verify` for independent testing and task-state repair
- `specz-archive` after verification is complete and the workflow should be summarized and cleaned up
- `specz-auto-run` when the user wants a bounded executor/verifier loop

Do not implement product code inside the `specz-plan` skill.

---
name: "add"
description: "Planning-stage Specz skill. It creates or updates the active spec bundle and defines the authoritative spec.md before deriving tasks.md, checklist.md, and test-cases.md."
---

# Constraints

<constraint>
    <name>Planning Only</name>
    <content>Use this skill for the spec drafting stage only. During this stage, ONLY create or update files inside the active .specs bundle and do NOT write product code.</content>
</constraint>
<constraint>
    <name>Shared Spec Workspace</name>
    <content>Spec bundles live in $(cwd)/.specs/&lt;slug&gt;.v&lt;index&gt;. The default target is the highest unfinished matching version unless the user specifies another bundle.</content>
</constraint>
<constraint>
    <name>Required Bundle Files</name>
    <content>Each new or repaired bundle MUST contain spec.md, tasks.md, checklist.md, and test-cases.md.</content>
</constraint>
<constraint>
    <name>Local Spec State</name>
    <content>.specs is local planning state and MUST NOT be committed to git. Respect existing ignore rules and add .specs/ to ignore rules when missing.</content>
</constraint>
<constraint>
    <name>Spec Authority</name>
    <content>spec.md is the only source of scope and acceptance truth. This skill is the only stage that may materially change spec.md unless the user explicitly reopens planning.</content>
</constraint>

# Purpose

`add` is the planning-stage Specz skill. It converts a PRD, feature request, or change idea into one synchronized spec bundle that later execution and verification stages must follow.

This skill defines the relationship between the four bundle documents:

- `spec.md`: authoritative scope, requirements, and acceptance
- `tasks.md`: implementation work derived from `spec.md`
- `checklist.md`: observable outcomes derived from Acceptance
- `test-cases.md`: independent validation evidence derived from `spec.md` and Acceptance

# Workflow

## 1. Reuse or Create the Active Bundle

1. Inspect `$(cwd)/.specs/` for bundles that match the request topic.
2. If the user specifies a bundle, use it directly.
3. Otherwise, prefer the highest unfinished matching version such as `user-login.v2`.
4. If only completed matches exist and the user is starting a new iteration of the same topic, create the next version.
5. If no aligned bundle exists, create `$(cwd)/.specs/<slug>.v1/`.

## 2. Write the Four Planning Documents

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

- Keep `spec.md` lightweight and close to the current style.
- Do not copy large PRD sections into `spec.md`; only reference the source PRD at the top.
- Add enough scope, acceptance, and edge-case detail to guide execution and independent verification.
- Do not turn `spec.md` into a full design doc.

### `tasks.md`

- Write an ordered list of small, verifiable implementation tasks.
- Break tasks into subtasks only when it genuinely improves execution clarity.
- Include validation work where needed.
- Avoid overdesign and avoid speculative tasks.
- Every task must remain inside the current `spec.md` scope.

Template:

```markdown
# Tasks
- [ ] Task 1: [Describe the user-visible implementation goal]
  - [ ] Subtask 1.1: [Concrete implementation step]

# Task Dependencies
- [Task 2] depends on [Task 1]
```

### `checklist.md`

- Title must be `# Checklist`.
- Derive every item from `spec.md` Acceptance.
- Group by verification area such as module, page, API, data flow, or tooling.
- Every item must describe an observable outcome rather than an implementation step.

### `test-cases.md`

- Title must be `# Test Cases`.
- Derive every case from `spec.md` Requirements and Acceptance.
- For each case include level, purpose, setup, steps, assertions, and edge cases.
- Do not treat executor self-reported success as evidence.

## 3. Handoff Rule

When the bundle is ready, stop at the planning boundary and direct the workflow to:

- `exec` for task implementation
- `verify` for testing and final verification
- `auto-run` when the user wants a bounded executor/verifier loop

Do not implement product code inside the `add` skill.

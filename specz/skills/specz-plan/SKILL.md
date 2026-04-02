---
name: "specz-plan"
description: "Planning-stage Specz skill. It creates or updates the active spec bundle, optionally adds implementation design that is grounded in the current codebase, and then derives tasks, checklist, and test cases."
---

# Constraints

<constraint>
    <name>Planning Only</name>
    <content>Use this skill for planning and implementation-preparation only. During this stage, ONLY create or update files inside the active .specs bundle and do NOT write product code.</content>
</constraint>
<constraint>
    <name>Shared Spec Workspace</name>
    <content>Spec bundles live in $(cwd)/.specs/&lt;slug&gt;_v&lt;index&gt;. The default target is the highest unfinished matching version unless the user specifies another bundle.</content>
</constraint>
<constraint>
    <name>Required Bundle Files</name>
    <content>Each new or repaired bundle MUST contain spec.md, tasks.md, checklist.md, and test-cases.md. Add design.md whenever implementation design is needed to produce trustworthy tasks.</content>
</constraint>
<constraint>
    <name>Local Spec State</name>
    <content>.specs is local planning state and MUST NOT be committed to git. Respect existing ignore rules and add .specs/ to ignore rules when missing.</content>
</constraint>
<constraint>
    <name>Spec Authority</name>
    <content>spec.md is the only source of scope and acceptance truth. This skill is the only stage that may materially change spec.md unless the user explicitly reopens planning.</content>
</constraint>
<constraint>
    <name>Codebase-Grounded Design</name>
    <content>When design.md is needed, it MUST be grounded in the current project structure, reuse points, layering, data flow, and runtime boundaries. Do not invent architecture that ignores the codebase that actually exists.</content>
</constraint>
<constraint>
    <name>Do Not Repeat Existing Standards</name>
    <content>Do not copy project-wide coding standards, naming rules, lint rules, or design-system guidance into design.md unless this change requires an explicit exception or an additional local constraint.</content>
</constraint>
<constraint>
    <name>Design Without Overbuilding</name>
    <content>design.md must capture only the decisions that materially shape implementation, such as design pattern choices, module boundaries, key abstractions, UI layout, state ownership, data flow, and interface changes. Do not turn it into a long architecture treatise and do not write large amounts of business code or pseudocode.</content>
</constraint>
<constraint>
    <name>Selective Sections</name>
    <content>All sections in design.md are optional by default. Include a section only when it adds meaningful implementation guidance for this change.</content>
</constraint>
<constraint>
    <name>Directional Design</name>
    <content>The purpose of design.md is to keep later execution aligned with the intended implementation direction and avoid repository-specific drift or mismatched expectations. Favor concrete guidance over exhaustive analysis.</content>
</constraint>
<constraint>
    <name>Design Deliberation</name>
    <content>Before writing design.md, think through multiple plausible implementation approaches and compare them against the current codebase, reuse points, complexity, and risk. The full comparison does not need to appear in the document unless it materially helps execution.</content>
</constraint>

# Purpose

`specz-plan` is the planning-stage Specz skill. It converts a PRD, feature request, or change idea into one synchronized spec bundle that later execution and verification stages must follow.

This skill defines the relationship between the bundle documents:

- `spec.md`: authoritative scope, requirements, and acceptance
- `design.md`: optional implementation design grounded in the current repository and focused on the key details that guide implementation direction
- `tasks.md`: implementation work derived from `spec.md` and, when present, `design.md`
- `checklist.md`: observable outcomes derived from Acceptance
- `test-cases.md`: independent validation evidence derived from `spec.md` and Acceptance

# Workflow

## 1. Reuse or Create the Active Bundle

1. Inspect `$(cwd)/.specs/` for bundles that match the request topic.
2. If the user specifies a bundle, use it directly.
3. Otherwise, prefer the highest unfinished matching version such as `user-login_v2`.
4. If only completed matches exist and the user is starting a new iteration of the same topic, create the next version.
5. If no aligned bundle exists, create `$(cwd)/.specs/<slug>_v1/`.

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

- Keep `spec.md` lightweight and close to the current style.
- Do not copy large PRD sections into `spec.md`; only reference the source PRD at the top.
- Add enough scope, acceptance, and edge-case detail to guide execution and independent verification.
- Do not turn `spec.md` into a design document.

## 3. Decide Whether `design.md` Is Needed

Create `design.md` when implementation cannot be planned responsibly from `spec.md` alone. Common triggers include:

- the change crosses multiple modules, services, pages, or layers
- the work depends on repository-specific reuse or extension points
- design pattern choice, component boundaries, or interaction states need deliberate shaping
- data flow, state ownership, async coordination, caching, persistence, or consistency choices matter
- API contracts, schemas, or model boundaries materially affect implementation
- the executor would otherwise need to improvise structure while coding

Skip `design.md` or keep it minimal when the change is local, obvious, and fits an existing pattern without meaningful architectural choice.

## 4. Write `design.md` Only When It Improves Direction

When `design.md` is needed, keep it short and specific to this repository. It should explain how the feature should be implemented here, with enough detail to guide execution choices such as design patterns, module responsibilities, data flow, state ownership, interface shape, and UI structure when needed.

Before writing it, compare multiple plausible implementation directions internally and then choose the one that best fits the current repository.

Do not include alternatives analysis unless it materially helps explain the chosen implementation direction. If needed, a short `Why This Approach` note is enough.

Use `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-workflow.md` as the design-specific reference.

## 5. Derive `tasks.md` After Planning and Design

### `tasks.md`

- Write an ordered list of small, verifiable implementation tasks.
- Break tasks into subtasks only when it genuinely improves execution clarity.
- Include validation work where needed.
- Avoid overdesign and avoid speculative tasks.
- Every task must remain inside the current `spec.md` scope.
- When `design.md` exists, tasks must reflect its module boundaries, sequencing, and key decisions.

Template:

```markdown
# Tasks
- [ ] Task 1: [Describe the user-visible implementation goal]
  - [ ] Subtask 1.1: [Concrete implementation step]

# Task Dependencies
- [Task 2] depends on [Task 1]
```

## 6. Write `checklist.md`

### `checklist.md`

- Title must be `# Checklist`.
- Derive every item from `spec.md` Acceptance.
- Group by verification area such as module, page, API, data flow, or tooling.
- Every item must describe an observable outcome rather than an implementation step.

## 7. Write `test-cases.md`

### `test-cases.md`

- Title must be `# Test Cases`.
- Derive every case from `spec.md` Requirements and Acceptance.
- Absorb high-risk verification concerns from `design.md` when they materially affect how the feature should be tested.
- For each case include level, purpose, setup, steps, assertions, and edge cases.
- Do not treat executor self-reported success as evidence.

## 8. Handoff Rule

When the bundle is ready, stop at the planning boundary and direct the workflow to:

- `specz-exec` for task implementation
- `specz-verify` for testing and final verification
- `specz-auto-run` when the user wants a bounded executor/verifier loop

Do not implement product code inside the `specz-plan` skill.

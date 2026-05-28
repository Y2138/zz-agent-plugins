---
name: "specz-brief"
description: "Optional Specz brief stage. Use after specz-plan and before specz-run when the user asks for a human-readable brief, review packet, alignment doc, stakeholder summary, or product/engineering/QA handoff for a planned Specz bundle. It turns spec.md, optional design.md, tasks.md, and verification.md into brief.md without replacing execution artifacts."
---

# Purpose

Create a human-readable `brief.md` from one planned Specz bundle for product, engineering, and QA alignment.

This skill is optional. It helps people quickly understand requirements, functional scope, flows, key design decisions, coverage, boundaries, and risks. It does not approve the plan, replace implementation artifacts, or block `specz-run`.

# Inputs

- Required: `spec.md`
- Recommended: `tasks.md`, `verification.md`
- Optional: `design.md`

# Output

- `specs/<summary-name>/brief.md`

# Must

- Operate on one bundle only.
- Read `spec.md` first; it is the source of product behavior, scope, business rules, scenarios, acceptance, assumptions, and questions.
- Use `design.md` only for confirmed design decisions, flows, fallback, compatibility, blockers, and code-context facts that affect human understanding.
- Use `verification.md` for coverage, testing focus, boundary risks, and confidence gaps.
- Use `tasks.md` only to understand implementation scope and dependencies; do not copy task lists.
- Write in the user's/project's natural language.
- Make the document readable by product, engineering, and QA.
- Mark key conclusions with `★`.
- Mark unresolved questions, blockers, or assumptions that need human alignment with `【待确认】`.
- Generate at least one readable flow or representation when it helps people understand the feature.

# Must Not

- Do not modify product code.
- Do not modify `spec.md`, `design.md`, `tasks.md`, or `verification.md`.
- Do not use `brief.md` as execution authority.
- Do not copy `TASK-*` checklists, `Done when`, or full implementation task lists.
- Do not copy `design.md` Files / Modules tables, import names, or long code paths into the brief.
- Do not include large code snippets.
- Do not invent requirements, acceptance criteria, or implementation decisions not supported by the bundle.
- Do not run broad code searches unless the bundle artifacts are contradictory and a minimal check is needed to avoid misleading humans.

# Reference Use

Use these references only when they improve the brief.

- Design emphasis: read `references/design-focus.md` when you need to choose how to present backend, frontend, fullstack, or integration concerns for people.
- Flow or diagram shape: read the relevant `references/diagrams-templates/*.md` file when a diagram or structured representation would be clearer than prose.

Diagram guidance:

- Use Mermaid `flowchart` for business flows and UI interaction flows.
- Use Mermaid `sequenceDiagram` for ordered multi-party interactions.
- Use Mermaid `stateDiagram` for lifecycle states.
- Use Mermaid `erDiagram` or a table for entity relationships.
- Use tables for API contracts, fields, rules, coverage, and risks.
- Use ASCII for static UI layout; do not use Mermaid for UI layout.
- Prefer no diagram when a short table or bullet flow is clearer.

# Workflow

1. Resolve the active bundle.
2. Read `spec.md`; read `design.md`, `tasks.md`, and `verification.md` if present.
3. Identify the brief focus:
   - backend: data, permissions, state changes, compatibility, rollback, failure handling
   - frontend: pages/modules, user path, UI states, form rules, loading/empty/error/disabled behavior
   - fullstack: shared contract, validation split, error surfacing, end-to-end flow
   - integration: external systems, auth, request/callback, retry, idempotency, partial failure, reconciliation
4. Decide which one or two visual representations will make the brief easier to read.
5. Write `brief.md` using `references/template.md`.
6. Run the self-check and repair the brief only.
7. Report the absolute path, sections generated, and count of `【待确认】` items.

# Missing Artifacts

- If `spec.md` is missing, stop. Do not build a brief from tasks, code, or external notes.
- If `design.md` is missing, still create the brief when `spec.md` is sufficient, but make the key design section a planning summary and mark design gaps as `【待确认】` when they affect alignment.
- If `verification.md` is missing, still create the brief when useful, but mark testing coverage as `【待确认】尚未形成验证计划`.
- If bundle artifacts conflict, prefer `spec.md` for behavior, `design.md` for implementation decisions, and `verification.md` for evidence planning. If the conflict changes scope or acceptance, mark it as `【待确认】`.

# `brief.md` Contract

Use `references/template.md` as the shape. Adapt section titles to the user's/project's language, but preserve the intent:

- background and goals
- functional scope
- overall design conclusions
- key flows or diagrams
- key design details
- coverage and QA focus
- boundaries and risks
- open questions

# Self-Check

- `brief.md` exists in the active bundle.
- The brief is readable without opening `tasks.md`.
- Key conclusions use `★`.
- Open questions use `【待确认】`.
- No task checklist, `TASK-*` implementation queue, or `Done when` details are copied.
- No Files / Modules table or long implementation path list is copied.
- Diagrams or ASCII layouts are used only where they improve readability.
- Static UI layout, if present, is ASCII rather than Mermaid.
- Coverage and QA focus come from `verification.md` or are clearly marked as pending.

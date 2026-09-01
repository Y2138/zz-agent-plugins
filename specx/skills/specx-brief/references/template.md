# Brief Template

This template is for generating `brief.md`. Replace placeholders with real bundle content; do not copy placeholder text into the output.

```markdown
# {Feature Name} Brief

> Audience: Product, Engineering, QA
> Source: {bundle path or source}

## 1. Background and Goal

- Problem:
- Goal:
- Users / Actors:
- Scope:

## 2. Functional Scope

| Capability | Description | Primary Actor | Acceptance Signal |
|---|---|---|---|
| ... | ... | ... | ... |

## 3. Overall Design

- ★ ...
- ★ ...

## 4. Key Flow

Use one readable representation when it helps:

- Mermaid flowchart for business or interaction flow
- Mermaid sequence diagram for ordered multi-party interaction
- Mermaid state diagram for lifecycle
- Table for API/field/rule details
- ASCII for static UI layout

## 5. Key Design Details

Organize by the dominant focus:

- backend: data, permission, state changes, compatibility, rollback, failure handling
- frontend: pages/modules, user path, UI states, form rules, loading/empty/error/disabled behavior
- fullstack: shared contract, validation split, error surfacing, end-to-end flow
- integration: external systems, auth, request/callback, retry, idempotency, partial failure, reconciliation

## 6. Coverage and QA Focus

| Coverage Area | Verification Method | Risk |
|---|---|---|
| ... | ... | ... |

## 7. Boundaries and Risks

- ...

## 8. Open Questions

### Product

- 【待确认】...

### Engineering

- 【待确认】...

### QA

- 【待确认】...
```

## Source Mapping

| Bundle Source | Brief Use |
|---|---|
| `spec.md` Context / Goal | Background and Goal |
| `spec.md` Scope | Scope and boundaries |
| `spec.md` Business Rules | Overall Design and Key Design Details |
| `spec.md` Requirements / Scenarios | Functional Scope and Key Flow |
| `design.md` Design Decisions | Overall Design and Key Design Details |
| `design.md` Flow / Fallback / Compatibility | Key Flow, Boundaries, Risks |
| `verification.md` Matrix / Details | Coverage and QA Focus |
| `QUESTION-*`, `ASSUMPTION-*`, `BLOCKER-*` | Open Questions |

## Keep Out

- `TASK-*` implementation checklist
- `Done when` lines
- Files / Modules implementation table
- long file path lists
- code snippets
- internal IDs unless needed for traceability in a pending question

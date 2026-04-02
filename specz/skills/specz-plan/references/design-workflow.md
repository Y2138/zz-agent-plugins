# Specz Design Workflow

Use this document only for the `design.md` part of `specz-plan`.

## Goal

Produce a lightweight implementation design that keeps execution aligned with the intended direction without turning planning into a full design review packet.

## When `design.md` Is Needed

Create `design.md` when execution would otherwise need to guess repository-specific implementation details. Common triggers include:

- the change crosses multiple modules, services, pages, or layers
- repository-specific reuse or extension points materially affect the implementation
- the design pattern choice matters
- data flow, state ownership, side effects, or async coordination need an explicit direction
- interfaces, schemas, or model boundaries need definition
- UI layout, component responsibilities, or interaction states need deliberate shaping

Skip `design.md` or keep it minimal when the change is local, obvious, and fits an existing pattern without meaningful architectural choice.

## Deliberation Before Writing

Before writing `design.md`, deliberately compare multiple plausible implementation approaches. This comparison is part of the planning process even when the final document stays short.

At minimum, think through:

- which existing modules, abstractions, or extension points could be reused
- whether the change should extend an existing pattern or introduce a new local abstraction
- where state, side effects, orchestration, and ownership should live
- which approach keeps the implementation simplest without fighting the current codebase

You do not need to document every rejected option. Record only the chosen direction unless the alternatives are important for execution clarity.

## `design.md`

`design.md` is a guidance document, not a full design review packet. Its purpose is to keep execution aligned and avoid the wrong implementation direction.

Every section is optional. Add a section only when it helps later implementation or verification.

Suggested structure:

```markdown
# Implementation Design

## Codebase Context
- Relevant modules, layers, entry points, and reuse points
- Existing patterns or constraints that shape this change

## Implementation Boundary
- What will change
- What will stay unchanged

## Design Approach
- Chosen design pattern, abstraction, or composition approach

## Why This Approach
- Short rationale for the chosen direction

## Module / Component Responsibilities
- Which module, service, component, or layer owns what

## Data Flow / State Flow
- Input source, transformation path, state owner, triggers, side effects, and failure handling

## Interfaces and Models
- API, schema, storage, model, or event changes when needed

## UI / Interaction
- Required layout, component roles, loading/error/empty states when applicable

## Validation / Runtime / Security Notes
- Only when needed: high-risk behaviors, observability hooks, permission boundaries, or sensitive data handling
```

Rules:

- Tie every section to the current codebase.
- Prefer module responsibilities, boundaries, state ownership, and interaction flow over pseudocode.
- Frontend and backend are both valid; only include UI sections when the feature actually needs them.
- If the project already defines a standard pattern, reference the existing location or pattern briefly instead of repeating it.
- Keep validation, observability, and security notes short. Skip them when they are not relevant to the change.
- Do not write large blocks of business code.

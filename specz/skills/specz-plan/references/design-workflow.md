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

## Constraints

1. **Codebase-Grounded Design.** design.md MUST be grounded in the current project structure, reuse points, layering, data flow, and runtime boundaries. Do not invent architecture that ignores the codebase that actually exists.
2. **Do Not Repeat Existing Standards.** Do not copy project-wide coding standards, naming rules, lint rules, or design-system guidance into design.md unless this change requires an explicit exception or an additional local constraint.
3. **Design Without Overbuilding.** design.md must capture only the decisions that materially shape implementation, such as design pattern choices, module boundaries, key abstractions, UI layout, state ownership, data flow, and interface changes. Do not turn it into a long architecture treatise and do not write large amounts of business code or pseudocode.
4. **Selective Sections.** All sections in design.md are optional by default. Include a section only when it adds meaningful implementation guidance for this change.
5. **Directional Design.** The purpose of design.md is to keep later execution aligned with the intended implementation direction and avoid repository-specific drift or mismatched expectations. Favor concrete guidance over exhaustive analysis.
6. **Design Deliberation.** Before writing design.md, think through multiple plausible implementation approaches and compare them against the current codebase, reuse points, complexity, and risk. The full comparison does not need to appear in the document unless it materially helps execution.
7. **Core Design Representations.** When design.md is created, it MUST include enough structured representation to remove ambiguity from the implementation direction. Choose the representation format that best fits the design problem instead of defaulting everything to Mermaid.
8. **Minimum Expression.** Use the smallest representation that makes the decision clear. Do not add diagrams, tables, or sketches that only restate surrounding prose.

## Deliberation Before Writing

Before writing `design.md`, deliberately compare multiple plausible implementation approaches. This comparison is part of the planning process even when the final document stays short.

At minimum, think through:

- which existing modules, abstractions, or extension points could be reused
- whether the change should extend an existing pattern or introduce a new local abstraction
- where state, side effects, orchestration, and ownership should live
- which approach keeps the implementation simplest without fighting the current codebase

You do not need to document every rejected option. Record only the chosen direction unless the alternatives are important for execution clarity.

## design.md Structure

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

Choose the most suitable representation for the question you need to answer:

- Architecture boundaries or cross-module dependencies: Mermaid architecture diagram or layered list
- Module responsibilities: structured list first, Mermaid component diagram when dependency direction matters
- Data flow or state flow: Mermaid data-flow or state-machine diagram
- Ordered interactions: Mermaid sequence diagram or a numbered text flow
- Frontend UI layout: ASCII sketch first
- Frontend interaction flow: Mermaid flow diagram or arrow-based text flow
- API, schema, or model contract: Markdown table, field list, and JSON request/response examples

Place each representation inside the most relevant section. For example, a data-flow diagram belongs under Data Flow / State Flow, and an ASCII UI layout belongs under UI / Interaction.

Rules:

- Tie every section to the current codebase.
- Prefer module responsibilities, boundaries, state ownership, and interaction flow over pseudocode.
- Frontend and backend are both valid; only include UI sections when the feature actually needs them.
- If the project already defines a standard pattern, reference the existing location or pattern briefly instead of repeating it.
- Keep validation, observability, and security notes short. Skip them when they are not relevant to the change.
- Do not write large blocks of business code.
- Prefer ASCII for static UI layout because containment and spatial grouping are easier to read there than in a generic flowchart.
- Prefer tables or JSON examples for contracts because field shape matters more than node connectivity.
- Every diagram, sketch, table, or example MUST use concrete names from the codebase. Avoid abstract labels like "Component A" or "Service B".

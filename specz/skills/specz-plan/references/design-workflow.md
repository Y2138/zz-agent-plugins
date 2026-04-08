# Specz Design Workflow

Use this document for the full design stage of `specz-plan`, including the short brainstorming pass that happens before `design.md` is written.

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

1. **Directional Design.** The purpose of design.md is to keep later execution aligned with the intended implementation direction and avoid repository-specific drift or mismatched expectations. Favor concrete guidance over exhaustive analysis.
2. **Codebase-Grounded Design.** design.md MUST be grounded in the current project structure, reuse points, layering, data flow, and runtime boundaries. Do not invent architecture that ignores the codebase that actually exists.
3. **Ask Before Assuming.** When purpose, constraints, success criteria, or key tradeoffs are still unclear after inspecting the project context, ask the user clarifying questions before settling on a design direction.
4. **One Question at a Time.** Ask clarifying questions one at a time and wait for the user's answer before asking the next. Prefer multiple choice when that makes the decision easier to answer.
5. **Brainstorm Before Writing.** Before writing design.md, run a short comparison pass so the chosen direction is the result of deliberate comparison rather than first-idea bias.
6. **Design Deliberation.** Before writing design.md, compare multiple plausible implementation approaches when the change is non-trivial. The full comparison does not need to appear in the document unless it materially helps execution.
7. **Design Without Overbuilding.** design.md must capture only the decisions that materially shape implementation, such as design pattern choices, module boundaries, key abstractions, UI layout, state ownership, data flow, and interface changes. Do not turn it into a long architecture treatise and do not write large amounts of business code or pseudocode.
8. **Do Not Repeat Existing Standards.** Do not copy project-wide coding standards, naming rules, lint rules, or design-system guidance into design.md unless this change requires an explicit exception or an additional local constraint.
9. **Selective Sections.** All sections in design.md are optional by default. Include a section only when it adds meaningful implementation guidance for this change.
10. **Core Design Representations.** When design.md is created, it MUST include enough structured representation to remove ambiguity from the implementation direction. Choose the representation format that best fits the design problem instead of defaulting everything to Mermaid.
11. **Minimum Expression.** Use the smallest representation that makes the decision clear. Do not add diagrams, tables, or sketches that only restate surrounding prose.

## Brainstorm and Converge

Before writing `design.md`, frame the design question and compare realistic directions when the change is non-trivial.

Use a lightweight pass:

1. State what decision actually needs to be made.
2. If purpose, constraints, success criteria, or a key tradeoff is still unclear, ask the user one focused clarifying question and wait for the answer before continuing.
3. Generate 2-3 plausible directions only when the change is non-trivial.
4. Compare them against the current codebase, reuse points, complexity, verification cost, and likely drift.
5. Choose one direction explicitly.
6. Write `design.md` from that chosen direction rather than from the raw option list.

At minimum, think through:

- which existing modules, abstractions, or extension points could be reused
- whether the change should extend an existing pattern or introduce a new local abstraction
- where state, side effects, orchestration, and ownership should live
- which approach keeps the implementation simplest without fighting the current codebase

You do not need to document every rejected option. Record only the chosen direction unless alternatives materially improve implementation safety.

Use a comparison table only when it helps:

```markdown
| Direction | Fit With Current Codebase | Main Benefit | Main Cost | Verdict |
|---|---|---|---|---|
| Extend existing orders page flow | High | Reuses existing fetch/state pattern | Makes page component heavier | Candidate |
| Add new orders orchestration hook | Medium | Cleaner separation of state and UI | Introduces new abstraction | Candidate |
| Introduce shared store slice | Low | Reusable across pages | Too heavy for current scope | Reject |
```

Questioning rules:

- Ask questions one at a time rather than sending a laundry list.
- Prefer multiple choice when possible, but use open-ended questions when the answer cannot be constrained usefully.
- Focus questions on purpose, constraints, success criteria, decomposition, and major tradeoffs.
- If the request is too broad for one design, use questions to help decompose it before writing `design.md`.

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

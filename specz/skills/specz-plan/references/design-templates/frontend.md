# Frontend Design Template

Use this template when the primary end is frontend.

## Purpose

Generate a `design.md` that directly guides later implementation of UI, component, interaction, and client-state work.

## Keep

- page, route, view, or component boundaries
- data source and state ownership
- key interaction behavior
- implementation order
- explicit "do not do" constraints when later agents might drift

## Avoid

- backend-only architecture detail
- domain modeling that does not affect the client implementation
- generic design-system reminders already obvious from the codebase
- long prose about visual styling unless the task actually changes it

## Suggested Structure

```markdown
# Implementation Design

## Execution Goal
- What UI capability or page behavior this change should deliver

## Files / Modules to Touch
- Real files, routes, components, hooks, stores, or client services likely to change

## UI Structure
- Which component or page owns which responsibility
- Any new child components, composition changes, or layout boundaries

## State / Data Flow
- Where state lives
- Who fetches, transforms, and submits data
- Loading, error, empty, and success ownership when relevant

## Interaction Rules
- Key user interactions and response behavior
- Validation, disabled states, optimistic updates, modal flow, or navigation behavior when relevant

## Implementation Order
- Recommended step-by-step execution order

## Avoid
- Explicit paths the executor should not take
```

## Representation Guidance

- Prefer structured lists
- Use ASCII only when layout containment matters
- Use Mermaid only when interaction or state flow is hard to explain in plain text

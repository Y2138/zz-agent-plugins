# Fullstack Design Template

Use this template when the task requires meaningful frontend and backend work that must be coordinated.

## Purpose

Generate a `design.md` that directly guides later implementation across both ends without dumping the full frontend and backend templates into one file.

## Keep

- the slice of frontend work
- the slice of backend work
- the contract between them
- recommended execution order across ends
- explicit "do not do" constraints that prevent drift

## Avoid

- fully expanding both end templates unless the task truly requires it
- duplicating details that already live clearly in `spec.md`
- low-value architecture prose

## Suggested Structure

```markdown
# Implementation Design

## Execution Goal
- What end-to-end capability this change should deliver

## Frontend Slice
- Routes, pages, components, client state, and interaction behavior that matter

## Backend Slice
- Handlers, services, persistence, workflows, or domain logic that matter

## Contract Between Them
- API, event, payload, or schema shape that both sides must follow

## Implementation Order
- Recommended cross-end sequence so later agents can execute without thrashing

## Avoid
- Explicit paths the executor should not take
```

## Representation Guidance

- Prefer structured lists
- Use one table for contract shape when needed
- Use one Mermaid diagram only when cross-end flow is otherwise ambiguous

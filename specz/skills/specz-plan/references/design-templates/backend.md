# Backend Design Template

Use this template when the primary end is backend.

## Purpose

Generate a `design.md` that directly guides later implementation of server-side logic, persistence, workflows, and domain behavior.

## Keep

- concrete implementation path through real modules and services
- write path and read path when they matter
- contracts or persistence changes that later agents must follow
- DDD concepts only when they are necessary to remove implementation ambiguity
- implementation order

## Avoid

- frontend interaction detail unless it directly changes backend contracts
- full architectural essays
- DDD terminology when the change is simple and does not need it
- speculative abstractions that the current codebase does not need

## Suggested Structure

```markdown
# Implementation Design

## Execution Goal
- What backend capability or behavior this change should deliver

## Files / Modules to Touch
- Real handlers, services, repositories, jobs, schemas, or persistence modules likely to change

## Execution Path
- Where requests, commands, or jobs enter
- Where orchestration lives
- Where persistence or side effects happen

## Domain / Data Decisions
- Only include the domain concepts that matter for this change
- Bounded context, aggregate, entity, value object, repository, or domain service only when they materially affect implementation

## Contracts / Storage Changes
- API shape, event shape, schema, table, or model changes when needed

## Implementation Order
- Recommended step-by-step execution order

## Avoid
- Explicit paths the executor should not take
```

## Representation Guidance

- Prefer structured lists
- Use tables for contracts, schemas, or storage changes
- Use Mermaid only for workflow, state, or dependency direction that prose cannot explain cleanly
- Use ER or aggregate boundary sketches only when relationships are central to the change

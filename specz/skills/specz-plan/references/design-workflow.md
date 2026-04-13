# Specz Design Workflow

Use this document for the design stage of `specz-plan`.

## Goal

Produce a `design.md` that works like an execution brief for later agents:

- concrete enough that `specz-exec` can follow it directly
- scoped enough that `specz-verify` can validate against it when needed
- small enough that it does not bloat context with cross-end or low-value design detail

## When `design.md` Is Needed

Create `design.md` only when execution would otherwise need to guess a meaningful implementation direction. Common triggers include:

- the change crosses multiple modules, services, pages, or layers
- repository-specific reuse points materially affect the implementation
- the implementation path is not obvious from `spec.md` alone
- state ownership, orchestration, contracts, or domain boundaries need an explicit direction
- the change spans more than one end and later agents need a coordinated execution order

Skip `design.md` when the change is local, obvious, and fits an existing pattern without meaningful implementation ambiguity.

## Core Rules

1. **Execution Brief, Not Design Essay.** Write `design.md` as direct implementation guidance, not as a full design review packet.
2. **Route By End.** First determine the primary end for this task, then use only that template unless a secondary end is truly necessary.
3. **Keep Cross-End Noise Out.** Do not include frontend-only rules in backend designs, backend-only rules in frontend designs, or multi-end detail unless the task actually spans them.
4. **Use Real Codebase Names.** Reference actual files, modules, components, services, routes, handlers, tables, or schemas from the repository.
5. **Prefer Decisions Over Discussion.** Record the chosen path and the concrete execution guidance. Do not spend tokens on long alternative analysis unless the tradeoff is genuinely necessary.
6. **Minimum Useful Shape.** Only include sections that directly help later execution or verification decide what to change, in what order, and what to avoid.
7. **No Large Pseudocode Blocks.** Avoid long pseudocode and boilerplate implementation sketches.

## End Routing

Choose one primary end before writing `design.md`:

- `frontend`: UI, page, component, interaction, client state, browser behavior
- `backend`: domain logic, data model, services, persistence, jobs, workflows
- `api-integration`: API contracts, third-party integrations, service-to-service flows, idempotency, retries
- `fullstack`: meaningful frontend and backend work that must be coordinated together

Use only the matching template:

- frontend: `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-templates/frontend.md`
- backend: `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-templates/backend.md`
- api-integration: `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-templates/api-integration.md`
- fullstack: `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-plan/references/design-templates/fullstack.md`

If the task spans multiple ends, choose one primary end and add only the minimum supporting sections needed from the secondary end.

## What `design.md` Should Usually Help With

For later agents, `design.md` should make these points easy to answer:

- which real files, modules, or surfaces are likely to change
- what implementation path should be followed
- what execution order is recommended
- which reuse points or architectural constraints must be preserved
- what should explicitly be avoided

## Representation Guidance

Only use structured representations when they materially reduce ambiguity:

- ASCII: simple UI layout or hierarchy
- Mermaid: flow, sequence, state, or dependency direction only when prose is not enough
- Tables: contracts, schema changes, field mapping
- Structured lists: preferred default for execution guidance

Default to structured lists first. Add at most one diagram or one table unless the task genuinely needs more.

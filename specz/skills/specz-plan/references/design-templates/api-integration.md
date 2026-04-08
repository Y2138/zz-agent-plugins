# API Integration Design Template

Use this template when the primary end is API integration or service-to-service work.

## Purpose

Generate a `design.md` that directly guides later implementation of contracts, external integrations, retries, and cross-service coordination.

## Keep

- systems involved
- contract changes
- request and response flow
- error handling, retry, timeout, and idempotency rules when relevant
- implementation order

## Avoid

- unrelated UI detail
- broad backend structure that does not affect the integration path
- generic integration advice not tied to the current services

## Suggested Structure

```markdown
# Implementation Design

## Execution Goal
- What integration capability or contract outcome this change should deliver

## Systems / Modules to Touch
- Real clients, gateways, handlers, jobs, or integration modules likely to change

## Contract Changes
- Request, response, headers, payload fields, events, or mapping changes

## Flow Rules
- Request path, callback path, retry path, or reconciliation path when relevant

## Failure / Idempotency Rules
- How to handle retries, deduplication, timeout, partial failure, or fallback behavior

## Implementation Order
- Recommended step-by-step execution order

## Avoid
- Explicit paths the executor should not take
```

## Representation Guidance

- Prefer tables for contract mapping
- Prefer structured lists for failure handling and execution order
- Use Mermaid only when a multi-step interaction flow is hard to explain in text

# Sequence / Flow Diagram

Show the ordered interaction between participants for the core business process.

## Good For

- multi-step interaction between components or services
- async coordination, retries, or external system calls
- branching or error handling paths matter

## Avoid When

- only structure or ownership matters, not ordering
- a simple linear bullet list is enough

## Alternative Representations

- numbered request/response steps
- arrow-based text flow

## Template

```mermaid
sequenceDiagram
    participant OrdersPage
    participant OrdersController
    participant OrdersService
    participant OrdersRepository
    OrdersPage->>OrdersController: GET /orders?status=open
    OrdersController->>OrdersService: listOrders(filters)
    OrdersService->>OrdersRepository: findOpenOrders(filters)
    OrdersRepository-->>OrdersService: orders
    OrdersService-->>OrdersController: ordersDto
    OrdersController-->>OrdersPage: 200 OrdersResponse
```

Replace the example participants and messages with actual runtime participants from the current codebase. Add `alt` or `else` blocks when retries, branching, or error paths matter.

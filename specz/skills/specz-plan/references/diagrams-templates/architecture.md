# Architecture Diagram

Show the system layering and the boundary between changed and unchanged parts.

## Good For

- the change crosses multiple modules, services, pages, or layers
- deployment topology or service boundaries shift

## Avoid When

- one file or one local module changes without boundary movement
- a short bullet list already makes the boundary obvious

## Alternative Representations

- layered module list
- changed/unchanged responsibility table

## Template

```mermaid
graph TB
    subgraph "Changed"
        OrdersController["src/orders/OrdersController.ts"]
        OrdersService["src/orders/OrdersService.ts"]
    end
    subgraph "Unchanged"
        PaymentsGateway["src/payments/PaymentsGateway.ts"]
    end
    OrdersController --> OrdersService
    OrdersService --> PaymentsGateway
```

Replace the example paths with the real changed and unchanged boundaries from the current codebase. Keep the graph focused on the modules that matter for this change.

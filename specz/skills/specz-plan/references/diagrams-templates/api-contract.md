# API Contract Representation

Show new or changed endpoints, request and response shapes, validation rules, and compatibility constraints. Prefer tables and examples over diagrams.

## Good For

- new API endpoints are introduced
- existing API contracts change

## Avoid When

- there is no meaningful contract boundary change
- a local internal function signature change is better described inline in prose

## Alternative Representations

- field list grouped by request and response
- schema diff summary

## Template

```markdown
## Endpoint

- Method: `POST`
- Path: `/api/orders/search`
- Auth: `session user`

## Request

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | `string[]` | no | Accepted values match `OrderStatus` |
| `page` | `number` | no | Defaults to `1` |
| `pageSize` | `number` | no | Max `100` |

Example request JSON:
`{"status":["open","pending_review"],"page":1,"pageSize":20}`

## Response

| Field | Type | Notes |
|---|---|---|
| `items` | `OrderSummary[]` | Paginated order rows |
| `total` | `number` | Total matching rows |
| `nextPage` | `number \| null` | Null when there is no next page |

Example response JSON:
`{"items":[{"id":"ord_123","status":"open"}],"total":1,"nextPage":null}`
```

Replace the example fields and examples with the actual contract from the current codebase. Include only fields, validation rules, auth requirements, and compatibility notes that matter for this change.

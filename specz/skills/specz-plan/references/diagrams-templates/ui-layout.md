# UI Layout Representation

Show static page, panel, and component containment when layout structure matters. Prefer ASCII because containment and spatial grouping are easier to read there than in a generic flowchart.

## Good For

- frontend page layout changes
- component containment or section boundaries matter
- sidebar, header, panel, modal, or split-view structure affects implementation

## Avoid When

- the main question is user interaction or runtime state flow, in which case use `ui-interaction-flow.md`
- layout is unchanged and only behavior changes

## Alternative Representations

- hierarchical component list
- section responsibility list

## Template

```text
OrdersPage
├── PageHeader
│   ├── Title
│   └── OrdersFiltersButton
├── OrdersFiltersPanel
│   ├── StatusFilter
│   ├── DateRangeFilter
│   └── ApplyFiltersButton
└── OrdersContent
    ├── OrdersSummaryBar
    └── OrdersTable
```

Replace the example nodes with the actual pages, sections, panels, and components from the current codebase. Keep the sketch focused on containment and layout hierarchy rather than runtime transitions.

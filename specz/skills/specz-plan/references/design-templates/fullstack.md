# Fullstack Design Hints

Use only when frontend and backend work must be coordinated.

Include when relevant:

- frontend route/component/state files
- backend handler/service/persistence files
- shared request/response/schema fields and validation rules
- frontend action -> backend validation -> persistence -> response -> client update flow
- backend failure surfacing, invalid/empty/stale data behavior
- compatibility, feature flags, defaults, rollout/backout
- execution order across ends

Avoid:

- duplicating full frontend/backend templates
- letting shared contract fields appear in multiple conflicting places

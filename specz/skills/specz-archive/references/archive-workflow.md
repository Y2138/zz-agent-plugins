# Archive Workflow

Write one concise workflow record. It is low-priority historical context, not an authoritative current code reference.

Path:

- `specs/archive/YYYY-MM-DD--<summary-name>.md`

Rules:

- summarize actual result and strongest evidence
- capture only the design rationale future agents may need to understand the decision
- rewrite design notes to match implementation when plan/code diverged
- preserve only important `SPEC-* -> TASK-* -> VERIFY-*` links
- state unfinished/deferred work when relevant
- do not copy full bundle contents

Template:

```markdown
# [Feature / Change Name] Archive

- Source bundle: `specs/<summary-name>/`
- Archived at: `YYYY-MM-DD`

## Request Summary
- ...

## What Was Completed
- ...

## Final Design Notes
- ...

## Historical Design Rationale
- ...

## Traceability
- `SPEC-SCENARIO-*` -> `TASK-*` -> `VERIFY-*`

## Verification Summary
- ...

## Learning Candidates
- Project memory candidate: none | ...
- Verification gotcha: none | ...
- Code quality lesson: none | ...

## Remaining Notes
- ...
```

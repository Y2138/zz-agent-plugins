# Archive Workflow

Write one concise workflow record, not a permanent code reference.

Path:

- `specs/archive/YYYY-MM-DD--<summary-slug>.md`

Rules:

- summarize actual result and strongest evidence
- rewrite design notes to match implementation when plan/code diverged
- preserve only important `SPEC-* -> TASK-* -> VERIFY-*` links
- state unfinished/deferred work when relevant
- do not copy full bundle contents

Template:

```markdown
# [Feature / Change Name] Archive

- Source bundle: `specs/<summary-slug>/`
- Archived at: `YYYY-MM-DD`

## Request Summary
- ...

## What Was Completed
- ...

## Final Design Notes
- ...

## Traceability
- `SPEC-SCENARIO-*` -> `TASK-*` -> `VERIFY-*`

## Verification Summary
- ...

## Remaining Notes
- ...
```

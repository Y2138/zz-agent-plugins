---
name: "specz-status"
description: "Read-only Specz lifecycle audit skill. It reports active bundle state without modifying files."
---

# Purpose

Scan `specs/*/` except `specs/archive/` and report the next Specz skill for each bundle.

# Must Not

- Do not create, edit, move, delete, or repair files.

# Classification

Check each bundle for `spec.md`, optional `design.md`, `tasks.md`, `verification.md`, and legacy `requirements.md`.

- **Needs clarification:** no `spec.md`, but request notes or legacy `requirements.md` exist.
- **Small ready:** `spec.md` has `Size: small` and no planning artifacts are required.
- **Needs planning:** `spec.md` is standard/large and `tasks.md` or `verification.md` is missing.
- **Needs execution:** `tasks.md` has unchecked tasks.
- **Needs verification:** tasks are complete and latest verification is not `PASS`.
- **Needs archive:** tasks are complete and latest verification is `PASS`.
- **Structural issues:** files are missing/malformed/contradictory, task fields are invalid, or status cannot be classified.

Rules:

- Missing `design.md` is not structural by itself.
- Planned tasks must use `TASK-*`, `Covers`, `Design`, `Files`, and `Done when`.
- `verification.md` should have `VERIFY-*` and `Matrix` unless the bundle still needs planning.
- `FAIL` or `BLOCKED` needs execution when repair tasks exist; otherwise structural attention.

# Output

```markdown
# Specz Status

## Needs Clarification
## Small Ready
## Needs Planning
## Needs Execution
## Needs Verification
## Needs Archive
## Structural Issues
```

Write `None` for empty categories. End with next skill names:

- clarify -> `specz-clarify`
- small/execution -> `specz-exec`
- planning/structural planning gaps -> `specz-plan`
- verification -> `specz-verify`
- archive -> `specz-archive`

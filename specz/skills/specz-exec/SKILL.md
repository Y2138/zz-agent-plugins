---
name: "specz-exec"
description: "Execution-stage Specz skill. It implements small specs directly or open TASK-* items from a planned bundle, while leaving final acceptance to verification."
---

# Purpose

Implement the active Specz bundle without expanding `spec.md`. Small work may execute from `spec.md`; planned work executes open `TASK-*`.

# Inputs

- Required: `spec.md`
- Optional: `tasks.md`, `design.md`, `verification.md`

# Must

- Read `spec.md` first.
- If `tasks.md` exists, use it as the execution queue.
- If no `tasks.md` exists, proceed only when `spec.md` has `Size: small`.
- Treat `design.md` as binding when present.
- Keep `tasks.md` current when it exists.
- Use only implementation-side checks: targeted compile/lint/typecheck/narrow tests.
- Hand final acceptance to `specz-verify`.

# Must Not

- Do not redefine scope or expand `spec.md`.
- Do not use `verification.md` as a task queue.
- Do not run broad acceptance/regression proof here.
- Do not mark unfinished or unverified work complete.

# Workflow

1. Resolve the active bundle.
2. Read `spec.md`; read `tasks.md`, `design.md`, and `verification.md` only if present.
3. If no `tasks.md` and size is not small, return to `specz-plan`.
4. For planned work, ensure open tasks have `Covers`, `Design`, `Files`, and `Done when`; repair obvious omissions or return to `specz-plan`.
5. Execute open tasks in dependency order. Parallelize only disjoint, dependency-safe work with explicit ownership.
6. For small direct execution, keep the plan in working memory; create planning artifacts only if hidden complexity appears.
7. If implementation discovers missing in-scope work, update `tasks.md` when present; otherwise return to `specz-plan`.
8. Run only targeted implementation-side checks needed to continue safely.
9. Handoff to `specz-verify` or `specz-auto-run`.

# Task Contract

```markdown
- [ ] TASK-01 [P] [Concrete task title]
  - Covers: SPEC-SCENARIO-01
  - Design: DESIGN-DECISION-01 | none
  - Files: `path/or/module`
  - Done when: ...
```

Verifier-created repair tasks may include `[source: verify]` when the bundle already uses that marker.

# Exit Gate

- Small direct path: implementation stays inside `spec.md`; targeted checks are recorded in handoff.
- Planned path: open in-scope tasks are checked or blocked; task fields remain traceable.

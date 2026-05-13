---
name: "specz-auto-run"
description: "Orchestration Specz skill. It runs bounded exec/verify repair loops with separate execution and verification contexts."
---

# Purpose

Coordinate `specz-exec` and `specz-verify` for one active bundle. Do not replace either skill.

# Must

- Operate on one bundle only.
- Keep execution and verification in separate contexts.
- Run verification in the main context.
- Stop after 3 rounds.
- Stop on scope ambiguity, requirement conflict, destructive action, or missing critical environment.
- Use `tasks.md` as the repair surface when it exists.

# Workflow

1. Resolve the bundle and read `spec.md`.
2. If `Size: small` and no `tasks.md`, run direct exec then verify from `spec.md`.
3. Otherwise require `tasks.md` and `verification.md`; return to `specz-plan` if missing.
4. For planned work, ensure open tasks have `TASK-*`, `Covers`, `Design`, `Files`, and `Done when`.
5. Repeat up to 3 rounds:
   - dispatch `specz-exec` in executor context
   - run `specz-verify` in main context
   - if verify passes, stop
   - if verify fails, continue only when repair tasks are actionable
6. Report pass/fail, route used, remaining tasks, and whether `design.md` was used.

# Must Not

- Do not create another bundle.
- Do not delegate final verification.
- Do not accept executor checks as final proof.

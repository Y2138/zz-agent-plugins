---
name: "specz-verify"
description: "Verification-stage Specz skill. It independently validates implementation against spec.md, optional VERIFY-* evidence, and task state."
---

# Purpose

Own final acceptance. Verify observable behavior independently from executor claims, then update `verification.md` and repair tasks when needed.

# Inputs

- Required: `spec.md`
- Optional: `verification.md`, `tasks.md`, `design.md`

# Must

- Run in a separate context from `specz-exec`.
- Ground verification in `spec.md`; use `verification.md`, `tasks.md`, and `design.md` when present.
- Use concrete executed evidence: tests, browser/runtime checks, API/CLI checks, logs, or artifact inspection.
- For UI behavior, use browser-capable runtime proof.
- Update `verification.md` `Latest Verification Result` when the file exists or when planned verification is needed.
- Add/reopen repair tasks in `tasks.md` when planned work is incomplete.

# Must Not

- Do not trust executor narration or unrun tests.
- Do not accept code review or static reasoning as primary proof.
- Do not silently change `spec.md`; return scope ambiguity to planning/user.

# Workflow

1. Read `spec.md`.
2. Read `verification.md`, `tasks.md`, and `design.md` if present.
3. Choose the smallest decisive evidence set:
   - start from `verification.md` matrix when present
   - otherwise derive checks from `spec.md`
4. Execute checks. Use targeted tests first; broaden only when risk requires it.
5. If behavior fails, update task state:
   - reopen the related `TASK-*`, or add a focused repair task
   - include `Covers`, `Design`, `Files`, and `Done when`
   - update `design.md` only when design drift/gaps caused the failure
6. Update or create the latest verification result.
7. Return to `specz-exec`/`specz-auto-run` on fail; hand to `specz-archive` on pass.

# Result Block

```markdown
## Latest Verification Result
- Status: PASS | FAIL | BLOCKED
- Verified at: YYYY-MM-DD
- Evidence:
  - [command/check/observation]
- Remaining repair tasks:
  - [TASK-* or none]
```

# Pass Gate

- implemented behavior satisfies `spec.md`
- concrete evidence was executed and observed
- `tasks.md`, when present, has no verifier-opened repair work
- `VERIFY-*`, when present, is checked or marked not applicable with reason

---
name: "specz-run"
description: "Execution and verification Specz skill. It runs one active bundle by executing open tasks or a small spec, then independently verifies in the main context with up to 3 repair rounds."
---

# Purpose

Implement and prove one active Specz bundle. `specz-run` combines execution, verification, and bounded repair loops while preserving role separation.

# Inputs

- Required: `spec.md`
- Optional: `design.md`, `tasks.md`, `verification.md`

# Must

- Operate on one bundle only.
- Read `spec.md` first.
- If `tasks.md` exists, execute unchecked `TASK-*` in dependency order.
- If no `tasks.md` exists, proceed only when `spec.md` has `Size: small`.
- Treat `design.md` as binding when present.
- Treat `tasks.md` as the execution state surface: update task checkboxes after execution and leave blocked work unchecked with reason.
- Treat `verification.md` as the verification state surface for planned bundles.
- Respect task type tags when present: `[new]`, `[fix]`, `[refactor]`, `[test]`, `[verify-repair]`.
- Run at most 3 `execute -> verify` rounds.
- Use concrete evidence: tests, typecheck, lint, browser/runtime checks, API/CLI checks, logs, or artifact inspection.
- For UI behavior, use runtime/browser evidence.
- For planned bundles, verify from `verification.md` and update it before running changed evidence.
- Update `verification.md` latest result after each verification round when it exists or when planned verification is needed.
- Reopen or add focused repair tasks in `tasks.md` when verification fails.
- Delete verification-only test files after verification when they are not needed permanently.

# Must Not

- Do not expand `spec.md` scope.
- Do not bypass `verification.md` for planned bundles.
- Do not change verification method, expected evidence, or applicability without updating `verification.md` first.
- Do not trust executor narration or unrun tests as final proof.
- Do not use broad checks when targeted evidence is decisive.
- Do not exceed 3 repair rounds.
- Do not mark unfinished or unverified work complete.
- Do not leave temporary instrumentation, debug output, or verification-only files unless they are intentionally part of the permanent change.

# Execution Context

- Use a sub-agent/sub-run for implementation work whenever the platform supports it.
- Sub-agents must use `gpt-5.4` when model selection is available.
- Pass only the active bundle path, relevant artifacts, and the implementation request to the sub-agent.
- Do not pass verifier conclusions, expected failures, or hidden acceptance answers into the sub-agent prompt.
- The main context owns routing, gate checks, final verification, and user-facing results.

# Gate

Run this gate before each execution round and before final pass:

- Active bundle is resolved and only one bundle is in scope.
- `spec.md` exists, has `Size`, and has no blocking unresolved `QUESTION-*`.
- If `Size: standard | large`, `tasks.md` and `verification.md` exist.
- If `design.md` exists, its decisions are treated as binding.
- Open tasks, repair tasks, or small-spec scope are actionable.
- For planned bundles, `verification.md` has a matrix entry for each spec scenario.
- Required environment or credentials are available; otherwise stop as `BLOCKED`.
- No destructive action is required unless the user explicitly approved it.

# Execution State

- Execute unchecked `TASK-*` from `tasks.md`; do not use `verification.md` as the task queue.
- For `[fix]` and `[verify-repair]` tasks, identify the failure signal or regression evidence before changing code when it is available.
- For `[fix]` and `[verify-repair]` tasks, state the root-cause hypothesis in the task note or execution result when the cause is not obvious from the code change.
- After implementation, update `tasks.md`:
  - check completed tasks
  - leave blocked or partial tasks unchecked with reason
  - add newly discovered in-scope implementation tasks only when needed
- When verification fails, reopen the related `TASK-*` or add a focused `[source: verify]` repair task.

# Verification State

- For planned bundles, start from the `verification.md` matrix.
- Do not replace planned `VERIFY-*` evidence with ad hoc checks.
- If evidence, method, expected result, or applicability must change, update `verification.md` first, then verify.
- Mark unrun or not-applicable `VERIFY-*` entries with a reason.
- After every verification round, update `Latest Verification Result`.
- For small specs without `verification.md`, derive the smallest decisive evidence from `spec.md`; if `verification.md` is created later, use it as the verification authority.
- For `[fix]` and `[verify-repair]`, include regression evidence when feasible.
- For standard/large planned bundles, include selected architecture quality evidence from `verification.md`.
- Confirm temporary verification files and debug instrumentation were removed unless they are intentionally retained.

# Workflow

1. Resolve the active bundle.
2. Read `spec.md`; read `design.md`, `tasks.md`, and `verification.md` if present.
3. Run Gate; if planned artifacts are required but missing, return to `specz-plan`.
4. Repeat up to 3 rounds:
   - run Gate
   - execute open tasks or the small spec in sub-agent/sub-run when available
   - run targeted implementation-side checks needed to continue safely
   - update `tasks.md` execution state
   - verify independently in the main context using `verification.md` for planned bundles
   - update `verification.md` verification state
   - if verification passes, stop
   - if verification fails, add or reopen actionable `TASK-*` repair work and continue
5. Update task states and latest verification result.
6. Route to `specz-archive` on pass, or report remaining blocked/failed tasks.

# Repair Task Contract

```markdown
- [ ] TASK-99 [verify-repair] [Repair title] [source: verify]
  - Covers: SPEC-SCENARIO-01
  - Design: DESIGN-DECISION-01 | none
  - Files: `path/or/module`
  - Done when: ...
```

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

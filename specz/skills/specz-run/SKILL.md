---
name: "specz-run"
description: "Execution and verification Specz skill. It runs one active bundle by executing open tasks or a small spec, then independently verifies in the main context with up to 3 repair rounds."
---

# Purpose

Implement and prove one active Specz bundle. `specz-run` combines execution, verification, and bounded repair loops while preserving role separation.

# 🔴 Activation Gate / 🛑 STOP

- Proceed only when this `specz-run` skill is loaded as the active stage contract, either because the user invoked it directly, `specz-flow` routed here, or another Specz stage handed off to run.
- If only `specz-flow` is loaded, stop and load `specz-run` before changing product code, updating task state, or running verification.
- If the platform cannot load this skill, stop and report that the run stage skill is unavailable.

# Project Memory Context

Project memory is general project context, similar in role to project instruction files such as `AGENTS.md`; it is not a Specz artifact and not proof of correctness.

- Load relevant platform/project memory and project instructions before execution when available.
- Use memory for durable conventions, known hazards, preferred verification surfaces, cleanup rules, and project-specific workflow constraints.
- Do not treat memory as verification evidence. Current code, bundle artifacts, executed checks, runtime observations, and logs are the evidence.
- Active user instructions, system/developer instructions, project instructions, `spec.md`, `design.md`, `tasks.md`, `verification.md`, and current code facts override memory.
- Do not create, update, or delete project memory from this stage. If execution reveals durable memory candidates, report them separately instead of silently writing them.

# Inputs

- Required: `spec.md`
- Optional: `design.md`, `tasks.md`, `verification.md`, `brief.md`

# Must

- Operate on one bundle only.
- Read `spec.md` first.
- Load relevant project memory/instructions when available before execution, without using memory as verification evidence.
- If `tasks.md` exists, execute unchecked `TASK-*` in dependency order.
- If no `tasks.md` exists, proceed only when `spec.md` has `Size: small`.
- Treat `design.md` as binding when present.
- Treat `brief.md` as human-readable context only; never use it as execution authority.
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
- Do not execute from `brief.md`; use `spec.md`, `design.md`, `tasks.md`, and `verification.md`.
- Do not change verification method, expected evidence, or applicability without updating `verification.md` first.
- Do not trust executor narration or unrun tests as final proof.
- Do not use broad checks when targeted evidence is decisive.
- Do not exceed 3 repair rounds.
- Do not mark unfinished or unverified work complete.
- Do not leave temporary instrumentation, debug output, or verification-only files unless they are intentionally part of the permanent change.

# Checkpoints

- 🔴 CHECKPOINT / 🛑 STOP before execution: if the active bundle is ambiguous, `spec.md` is missing, `Size` is missing, or blocking `QUESTION-*` remains, stop at the owning stage instead of executing.
- 🔴 CHECKPOINT / 🛑 STOP before sub-agent work: confirm open tasks or small-spec scope are actionable, `design.md` decisions are binding when present, and the implementation prompt contains no verifier conclusions or hidden acceptance answers.
- 🔴 CHECKPOINT / 🛑 STOP before PASS/archive: all in-scope tasks are checked or explicitly blocked, verification uses concrete evidence, `Latest Verification Result` is updated when present, and temporary verification files or debug instrumentation are removed.

# Execution Context

- Use a sub-agent/sub-run for implementation work whenever the platform supports it.
- Sub-agents must use `gpt-5.4` when model selection is available.
- Pass only the active bundle path, relevant artifacts, and the implementation request to the sub-agent.
- Do not pass verifier conclusions, expected failures, or hidden acceptance answers into the sub-agent prompt.
- The main context owns routing, gate checks, final verification, and user-facing results.

# Subagent Result Contract

When a sub-agent/sub-run performs implementation, require this result shape back:

- Status: `DONE` | `DONE_WITH_CONCERNS` | `PARTIAL` | `BLOCKED`
- Tasks attempted / files changed / commands run -> exit code or result summary
- Evidence produced / risks or doubts / temporary artifacts (`none` | paths or processes)
- Suggested next action

Main-context handling:

- `DONE` only means the sub-agent claims it finished execution; it is not a Specz PASS. The main context re-reads key outputs or re-runs necessary verification before accepting.
- `DONE_WITH_CONCERNS`: read the concerns first; correctness or scope concerns must be addressed before verification, observations may be noted.
- Do not paste a long sub-agent report back into the main context. The sub-agent's final response stays to status, a short commit/file summary, a one-line verification summary, concerns, and a report path when one exists.
- Do not hand an accumulated history of prior tasks to a later sub-agent; each gets only its current task, the interfaces it touches, global constraints, and relevant file paths.
- A sub-agent that does not return the contract is treated as incomplete: ask for the missing parts or treat the round as not finished.

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
- Before parallel dispatch of `[P]` tasks, check `Write set` overlap; if any two overlap or touch a shared surface, run them sequentially.

# State Recovery

- If `Size: standard | large` is missing `tasks.md` or `verification.md`, route to `specz-plan`; do not execute from partial planning state.
- If `tasks.md` and `verification.md` disagree about task IDs, spec coverage, or repair state, reconcile the state surfaces first or add a focused `[verify-repair]` task before changing product code.
- If `verification.md` lacks matrix coverage for a key `SPEC-SCENARIO-*`, update `verification.md` before running evidence.
- If a small spec lacks decisive verification evidence, derive the minimum evidence from `spec.md` and record it in the final Result Block; do not invent broad checks to compensate for missing planning artifacts.

# Execution State

- Execute unchecked `TASK-*` from `tasks.md`; do not use `verification.md` as the task queue.
- For `[fix]` and `[verify-repair]` tasks, identify the failure signal or regression evidence before changing code when it is available.
- For `[fix]` and `[verify-repair]` tasks, state the root-cause hypothesis in the task note or execution result when the cause is not obvious from the code change.
- For regression repair work, keep the repair focused on the recorded failure signal; do not broaden scope without updating the active bundle.
- After implementation, update `tasks.md`:
  - check completed tasks
  - leave blocked or partial tasks unchecked with reason
  - add newly discovered in-scope implementation tasks only when needed
- When verification fails, reopen the related `TASK-*` or add a focused `[source: verify]` repair task.
- Repair tasks created from verification failures must name the failed evidence or regression signal they address.

# Verification State

- For planned bundles, start from the `verification.md` matrix.
- Do not replace planned `VERIFY-*` evidence with ad hoc checks.
- If evidence, method, expected result, or applicability must change, update `verification.md` first, then verify.
- Mark unrun or not-applicable `VERIFY-*` entries with a reason.
- After every verification round, update `Latest Verification Result`.
- For small specs without `verification.md`, derive the smallest decisive evidence from `spec.md`; if `verification.md` is created later, use it as the verification authority.
- For `[fix]` and `[verify-repair]`, include regression evidence when feasible.
- For standard/large planned bundles, include selected architecture quality evidence from `verification.md`.
- Verify behavior through the key `SPEC-SCENARIO-*` evidence, not only by marking implementation tasks done.
- Confirm temporary verification files and debug instrumentation were removed unless they are intentionally retained.

# Workflow

1. Resolve the active bundle.
2. Read `spec.md`; read `design.md`, `tasks.md`, and `verification.md` if present. Read `brief.md` only for human context, not execution instructions.
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

# PASS Audit

Run this final-consistency audit before writing `Status: PASS`. Do not write PASS until every box is checked.

- [ ] All in-scope `SPEC-SCENARIO-*` have evidence.
- [ ] All completed `TASK-*` have implementation evidence or verification coverage.
- [ ] No unchecked in-scope task remains unless explicitly marked `BLOCKED` and out of PASS scope.
- [ ] `Latest Verification Result` is `PASS` when present.
- [ ] Evidence is fresh from this run/round, not executor narration or stale output.
- [ ] Temporary verification files and debug instrumentation are removed, or intentionally retained with a reason.
- [ ] If a review gate is required, its findings are resolved or explicitly accepted as non-blocking.

On a failed audit, route by the gap type:

- Implementation gap: add or reopen a `[verify-repair]` task.
- Evidence gap: re-run verification or update `verification.md`.
- Scope contradiction: stop and report `BLOCKED`.

The PASS Audit is a final consistency check; it does not replace the `verification.md` matrix.

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

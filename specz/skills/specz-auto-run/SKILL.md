---
name: "specz-auto-run"
description: "Orchestration Specz skill. It chains the exec and verify skills through separate agent contexts, ensures design.md is honored when present, allows executor-side subagent parallelism for independent tasks, repairs the bundle after failed verification, and stops after a bounded number of rounds."
---

# Constraints

1. **Controller Only.** This skill is a controller. It must not directly replace the execution or verification responsibilities of the exec or verify skills.
2. **Bundle Scope.** Operate on the current active bundle only. Do not automatically create another bundle or change `spec.md`.
3. **Separate Agent Contexts.** Use one agent context for execution and a separate agent context for verification. The verifier must not inherit the executor's narrative as authority.
4. **Design Context Propagation.** When `design.md` exists, pass only the needed sections to each execution and verification round as binding context.
5. **Bounded Loop.** Run at most 3 full execution-verification rounds. Never loop indefinitely.
6. **Stop Conditions.** Stop immediately on scope ambiguity, requirement conflict, destructive actions, or missing critical environment prerequisites.

# Purpose

`specz-auto-run` is the bounded orchestration skill for Specz. It resolves the active bundle, asks one execution context to run the `specz-exec` skill, asks another independent context to run the `specz-verify` skill, and repeats only when verification writes back actionable repair work. The execution context may itself use multiple subagents for dependency-safe parallel tasks.

# Workflow

## 1. Resolve the Bundle

1. Use the bundle explicitly named by the user if present.
2. Otherwise choose the bundle in `specs/<summary-slug>/` that matches the current task summary.
3. Confirm the bundle contains `spec.md`, `tasks.md`, `checklist.md`, and `test-cases.md`.
4. If `design.md` exists, pass only the needed sections for the current exec and verify rounds.

## 2. Run the Loop

1. Start round 1.
2. Run the `specz-exec` skill in executor context, allowing it to use multiple subagents for tasks that are independent by dependency and write scope.
3. Require the executor context to keep `tasks.md` synchronized as subagents claim and complete work.
4. Run the `specz-verify` skill in verifier context.
5. If verification passes, stop with success.
6. If verification fails, require the verifier to update `tasks.md`, `checklist.md`, `test-cases.md`, and `design.md` when design drift or design gaps were part of the failure.
7. Return the repaired bundle to the executor for the next round.
8. Stop after round 3 if the bundle still fails verification.

## 3. Exit Rules

- On success, report that the bundle satisfies `spec.md`, Acceptance, checklist outcomes, and required test evidence.
- On success, also report whether `design.md` was present and whether execution stayed aligned with it.
- On success, recommend `specz-archive` when the workflow should be summarized into one archive file and the original bundle should be removed.
- On failure, report:
  - unmet acceptance items
  - reopened or newly added tasks
  - design drift or missing design decisions when relevant
  - recommended next action for the user
- Never create another bundle automatically.

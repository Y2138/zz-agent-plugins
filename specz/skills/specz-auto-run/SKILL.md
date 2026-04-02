---
name: "specz-auto-run"
description: "Orchestration Specz skill. It chains the exec and verify skills through separate agent contexts, ensures design.md is honored when present, allows executor-side subagent parallelism for independent tasks, repairs the bundle after failed verification, and stops after a bounded number of rounds."
---

# Constraints

<constraint>
    <name>Controller Only</name>
    <content>This skill is a controller. It must not directly replace the execution or verification responsibilities of the exec or verify skills.</content>
</constraint>
<constraint>
    <name>Separate Agent Contexts</name>
    <content>Use one agent context for execution and a separate agent context for verification. The verifier must not inherit the executor's narrative as authority.</content>
</constraint>
<constraint>
    <name>Bounded Loop</name>
    <content>Run at most 3 full execution-verification rounds. Never loop indefinitely.</content>
</constraint>
<constraint>
    <name>Bundle Scope</name>
    <content>Operate on the current active bundle only. Do not automatically create a new version or change spec.md.</content>
</constraint>
<constraint>
    <name>Stop Conditions</name>
    <content>Stop immediately on scope ambiguity, requirement conflict, destructive actions, or missing critical environment prerequisites.</content>
</constraint>
<constraint>
    <name>Design Context Propagation</name>
    <content>When design.md exists, pass it to every execution and verification round as required context. Both stages must read, understand, and follow it.</content>
</constraint>

# Purpose

`specz-auto-run` is the bounded orchestration skill for Specz. It resolves the active bundle, asks one execution context to run the `specz-exec` skill, asks another independent context to run the `specz-verify` skill, and repeats only when verification writes back actionable repair work. The execution context may itself use multiple subagents for dependency-safe parallel tasks.

# Workflow

## 1. Resolve the Bundle

1. Use the bundle explicitly named by the user if present.
2. Otherwise choose the highest unfinished matching version in `.specs/<slug>_v<index>/`.
3. Confirm the bundle contains `spec.md`, `tasks.md`, `checklist.md`, and `test-cases.md`.
4. Treat `design.md` as optional but required context whenever the planning stage created it.

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
- On failure, report:
  - unmet acceptance items
  - reopened or newly added tasks
  - design drift or missing design decisions when relevant
  - recommended next action for the user
- Never create a new bundle version automatically.

---
name: "specz-auto-run"
description: "Orchestration Specz skill. It chains the exec and verify skills through separate agent contexts, repairs the bundle after failed verification, and stops after a bounded number of rounds."
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

# Purpose

`auto-run` is the bounded orchestration skill for Specz. It resolves the active bundle, asks one agent to execute the `exec` skill, asks another independent agent to run the `verify` skill, and repeats only when verification writes back actionable repair work.

# Workflow

## 1. Resolve the Bundle

1. Use the bundle explicitly named by the user if present.
2. Otherwise choose the highest unfinished matching version in `.specs/<slug>.v<index>/`.
3. Confirm the bundle contains `spec.md`, `tasks.md`, `checklist.md`, and `test-cases.md`.

## 2. Run the Loop

1. Start round 1.
2. Run the `specz-exec` skill in executor context.
3. Run the `specz-verify` skill in verifier context.
4. If verification passes, stop with success.
5. If verification fails, require the verifier to update `tasks.md`, `checklist.md`, and `test-cases.md`.
6. Return the repaired bundle to the executor for the next round.
7. Stop after round 3 if the bundle still fails verification.

## 3. Exit Rules

- On success, report that the bundle satisfies `spec.md`, Acceptance, checklist outcomes, and required test evidence.
- On failure, report:
  - unmet acceptance items
  - reopened or newly added tasks
  - recommended next action for the user
- Never create a new bundle version automatically.

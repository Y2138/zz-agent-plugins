---
name: "specz-exec"
description: "Execution-stage Specz skill. It implements tasks from the active bundle without changing scope or self-certifying final acceptance."
---

# Constraints

<constraint>
    <name>Execution Input</name>
    <content>Always read spec.md before acting, then use tasks.md as the execution queue. Read checklist.md and test-cases.md as needed to understand expected outcomes and verification evidence.</content>
</constraint>
<constraint>
    <name>Execution Focus</name>
    <content>This skill only executes implementation tasks from the spec bundle. It must not redefine scope, reinterpret requirements, or change spec.md.</content>
</constraint>
<constraint>
    <name>Immediate Task Sync</name>
    <content>Every completed task or subtask MUST be reflected in tasks.md immediately. Never check a box for work that is still in progress, blocked, or unverified.</content>
</constraint>
<constraint>
    <name>Gap Handling</name>
    <content>If implementation reveals missing work, add or refine tasks in tasks.md before continuing, but only when the new work is still inside the current spec.md scope.</content>
</constraint>
<constraint>
    <name>Separate Agent Context</name>
    <content>This skill must run in a different agent context from the verify skill. The executor must not reuse the verifier's judgment context.</content>
</constraint>

# Purpose

`exec` is the implementation-stage Specz skill. It takes an approved spec bundle and executes the tasks in `tasks.md`, with a narrow focus on shipping the defined work and preparing it for independent verification.

# Workflow

## 1. Load the Active Bundle

1. Resolve the active bundle using the highest unfinished matching version unless the user names a different bundle.
2. Read `spec.md` first to confirm scope and acceptance.
3. Read `tasks.md` as the implementation queue.
4. Read `checklist.md` and `test-cases.md` only to understand what the verifier will later require.

## 2. Execute Tasks in Order

1. Respect task dependencies.
2. Prefer small, complete chunks of progress.
3. When independent tasks exist, they may be delegated or parallelized.
4. Keep implementation aligned with the spec. Do not add new product features outside the defined change.
5. If new implementation work is discovered, update `tasks.md` without expanding beyond `spec.md`.

## 3. Keep `tasks.md` Honest

- Check a task only after the code change and required validation for that task are complete.
- Leave items unchecked when verification is still pending.
- If verification reopens work, uncheck or rewrite the affected task.
- Do not claim final acceptance based only on executor-authored tests or local confidence.

# Exit Condition

When implementation is complete, hand the bundle to the `specz-verify` skill or the `specz-auto-run` skill for independent validation.

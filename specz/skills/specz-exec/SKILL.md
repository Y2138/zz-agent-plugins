---
name: "specz-exec"
description: "Execution-stage Specz skill. It implements tasks from the active bundle, follows design.md whenever present, and may use multiple subagents for independent work without changing scope or self-certifying final acceptance."
---

# Constraints

<constraint>
    <name>Execution Input</name>
    <content>Always read spec.md before acting, then use tasks.md as the execution queue. If design.md exists, read it before implementation and treat it as binding implementation guidance for repository-specific decisions. Read checklist.md and test-cases.md as needed to understand expected outcomes and verification evidence.</content>
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
    <name>Design Compliance</name>
    <content>When design.md exists, follow its stated module boundaries, design approach, data flow, interface shape, and other explicit implementation guidance unless planning is repaired first. Do not silently drift away from the design.</content>
</constraint>
<constraint>
    <name>Gap Handling</name>
    <content>If implementation reveals missing work, add or refine tasks in tasks.md before continuing, but only when the new work is still inside the current spec.md scope.</content>
</constraint>
<constraint>
    <name>Separate Agent Context</name>
    <content>This skill must run in a different agent context from the verify skill. The executor must not reuse the verifier's judgment context.</content>
</constraint>
<constraint>
    <name>Parallel Task Safety</name>
    <content>Independent tasks may be delegated to different subagents only when their dependencies are already satisfied and their write scopes can be kept disjoint or safely coordinated. Do not parallelize tasks that depend on the same unfinished design decision or shared file ownership without a clear coordination plan.</content>
</constraint>
<constraint>
    <name>Task Ownership Sync</name>
    <content>When subagents are used, assign each one explicit task ownership. Update tasks.md as work is claimed, completed, or reopened so the shared task state remains accurate.</content>
</constraint>

# Purpose

`specz-exec` is the implementation-stage Specz skill. It takes an approved spec bundle and executes the tasks in `tasks.md`, with a narrow focus on shipping the defined work and preparing it for independent verification. When the bundle contains `design.md`, the executor must use it as the implementation direction for code structure, design patterns, data flow, state ownership, and interface behavior.

# Workflow

## 1. Load the Active Bundle

1. Resolve the active bundle using the highest unfinished matching version unless the user names a different bundle.
2. Read `spec.md` first to confirm scope and acceptance.
3. If present, read `design.md` to understand and obey module boundaries, design approach, data flow, state ownership, interface changes, and other repository-specific implementation constraints.
4. Read `tasks.md` as the implementation queue.
5. Read `checklist.md` and `test-cases.md` only to understand what the verifier will later require.

## 2. Plan Execution Order and Parallelism

1. Respect task dependencies.
2. Prefer small, complete chunks of progress.
3. Use `design.md` when present to identify module boundaries and decide which tasks can be implemented safely in parallel.
4. Group tasks by dependency and file ownership before delegating.
5. Only parallelize tasks that are independent in both dependency order and likely write scope.

## 3. Execute Tasks

1. Keep implementation aligned with the spec and any explicit `design.md` decisions. Do not add new product features outside the defined change.
2. If implementation reveals that `design.md` is missing a material repository-specific decision, pause and repair the planning bundle before continuing.
3. If new implementation work is discovered, update `tasks.md` without expanding beyond `spec.md`.

## 4. Use Multiple Subagents When It Helps

1. When several tasks have no dependency relationship, they may be assigned to different subagents.
2. Give each subagent:
   - the active bundle path
   - the specific task or subtask it owns
   - the relevant `spec.md` and `design.md` context
   - clear file or module ownership when possible
3. Do not give two subagents overlapping responsibility for the same unfinished task unless one is strictly blocked on the other.
4. After each subagent finishes, review its result and update `tasks.md` immediately.
5. If a subagent uncovers a design conflict or shared blocking issue, stop parallel execution for the affected tasks and repair the bundle before resuming.

## 5. Keep `tasks.md` Honest

- Check a task only after the code change and required validation for that task are complete.
- Mark work in progress or ownership explicitly when that helps coordinate multiple subagents.
- Leave items unchecked when verification is still pending.
- If verification reopens work, uncheck or rewrite the affected task.
- Do not claim final acceptance based only on executor-authored tests or local confidence.

# Exit Condition

When implementation is complete, hand the bundle to the `specz-verify` skill or the `specz-auto-run` skill for independent validation.

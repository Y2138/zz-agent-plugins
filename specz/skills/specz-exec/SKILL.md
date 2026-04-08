---
name: "specz-exec"
description: "Execution-stage Specz skill. It implements and repairs tasks from the active bundle, follows design.md whenever present, and may use multiple subagents for independent work without taking over testing."
---

# Constraints

1. **Execution Only.** This skill only executes implementation tasks from the active spec bundle. It must not redefine scope, reinterpret requirements, or change `spec.md`.
2. **Binding Inputs.** Read `spec.md` first, use `tasks.md` as the execution queue, and treat `design.md` as binding implementation guidance when present. Do not depend on any separate issue or test-case file.
3. **Task State Sync.** Keep `tasks.md` accurate as work is claimed, completed, reopened, or refined. Do not mark work complete while it is still in progress, blocked, or unverified.
4. **Scope-Safe Gap Handling.** If implementation reveals missing work, add or refine tasks before continuing, but only when the new work is still inside the current `spec.md` scope.
5. **Separate Agent Context.** This skill must run in a different agent context from the verify skill. The executor must not reuse the verifier's judgment context.
6. **Parallel Safety.** Delegate work to subagents only when task dependencies are satisfied and write scopes can stay disjoint or safely coordinated. Assign explicit task ownership when subagents are used.
7. **Implementation-Side Validation Only.** This skill may run only the minimum local checks needed to safely continue implementation, such as a targeted compile, lint, typecheck, or a narrowly scoped test for the code being edited. It must not take ownership of final acceptance, broad regression coverage, end-to-end checks, or user-flow proof.

# Purpose

`specz-exec` is the implementation-stage Specz skill. It takes an approved spec bundle and executes the tasks in `tasks.md`, with a narrow focus on shipping the defined work, repairing verification findings, keeping the task list honest, and preparing the result for independent verification.

# Workflow

## 1. Load the Active Bundle

1. Resolve the active bundle from `specs/<summary-slug>/` unless the user names a different bundle.
2. Read `spec.md` to confirm scope and acceptance.
3. Read `tasks.md` as the implementation queue.
4. If `design.md` exists, read the sections that constrain the current implementation decisions.

## 2. Plan Execution Order and Parallelism

1. Respect task dependencies.
2. Prefer small, complete chunks of progress.
3. Use binding context (design.md, if present) to identify module boundaries and decide which tasks can be implemented safely in parallel.
4. Group tasks by dependency and file ownership before delegating.
5. Only parallelize tasks that are independent in both dependency order and likely write scope.
6. Use `tasks.md` as the loop contract: finish open implementation tasks, repair verifier-reopened tasks, and ignore already verified-complete work.
7. Plan implementation work so acceptance proof can be deferred to `specz-verify` instead of re-created here.

## 3. Execute Tasks

1. Keep implementation aligned with spec.md and any binding context. Do not add new product features outside the defined change.
2. If implementation reveals that binding context is missing a material repository-specific decision, pause and repair the planning bundle before continuing.
3. If new implementation work is discovered, update `tasks.md` without expanding beyond `spec.md`.
4. Prefer code changes and local sanity checks over full verification. Only run a check here when it reduces implementation risk or confirms the edited code still compiles or behaves locally.
5. If a needed automated test does not exist, the executor may add or update that test as implementation work, but should not rely on broad test execution here as proof of completion.
6. When repairing verification findings, update the related task state and implementation notes in `tasks.md` so the verifier can see what was addressed without inheriting your full development narrative.

## 4. Use Multiple Subagents When It Helps

1. When several tasks have no dependency relationship, they may be assigned to different subagents.
2. Give each subagent:
   - the active bundle path
   - the specific task or subtask it owns
   - only the relevant `spec.md` and `design.md` context
   - clear file or module ownership when possible
3. Do not give two subagents overlapping responsibility for the same unfinished task unless one is strictly blocked on the other.
4. After each subagent finishes, review its result and update `tasks.md` immediately.
5. If a subagent uncovers a design conflict or shared blocking issue, stop parallel execution for the affected tasks and repair the bundle before resuming.

## 5. Keep `tasks.md` Honest

- Check a task only after the code change and any implementation-side sanity checks for that task are complete.
- Mark work in progress or ownership explicitly when that helps coordinate multiple subagents.
- Leave acceptance-sensitive items unchecked when verification evidence is still pending.
- If verification reopens work, uncheck or rewrite the affected task.
- Do not claim final acceptance based on executor-authored tests, targeted local checks, or local confidence.

## 6. Validation Boundary

- Allowed in `specz-exec`: targeted compile/build checks, focused lint or type checks, and narrow tests needed to unblock implementation of the touched area.
- Avoid in `specz-exec`: full test suites, broad regression runs, browser acceptance flows, cross-system verification, and any attempt to prove the whole spec is done.
- If uncertain, bias toward less validation here and hand the result to `specz-verify`.

# Exit Condition

When implementation is complete, hand the bundle to the `specz-verify` skill or the `specz-auto-run` skill for independent validation.

---
name: "specz-auto-run"
description: "Orchestration Specz skill. It chains the exec and verify skills through separate agent contexts, uses tasks.md as the shared repair surface, keeps implementation-side sanity checks separate from acceptance verification, and stops after a bounded number of rounds."
---

# Constraints

1. **Controller Only.** This skill is a controller. It must not directly replace the execution or verification responsibilities of the exec or verify skills.
2. **Bundle Scope.** Operate on the current active bundle only. Do not automatically create another bundle or change `spec.md`.
3. **Separate Agent Contexts.** Use one agent context for execution and a separate agent context for verification. The verifier must not inherit the executor's narrative as authority.
4. **Design Context Propagation.** When `design.md` exists, pass only the needed sections to each execution and verification round as binding context.
5. **Bounded Loop.** Run at most 3 full execution-verification rounds. Never loop indefinitely.
6. **Stop Conditions.** Stop immediately on scope ambiguity, requirement conflict, destructive actions, or missing critical environment prerequisites.
7. **No Duplicate Test Ownership.** Treat executor-side checks as implementation sanity checks only. Treat verifier-side checks as the primary acceptance and regression evidence. Do not intentionally rerun the same broad test scope in both stages unless a verifier-identified failure requires confirmation after repair.
8. **Loop Contract.** `tasks.md` is the shared execution loop contract. Verification must communicate failed logic, missing behavior, and regression work by reopening or adding tasks instead of creating parallel tracker files.
9. **Verify Skill Delegation.** The verifier context must invoke the `specz-verify` skill, or read `specz/skills/specz-verify/SKILL.md` before acting when direct skill invocation is unavailable. The controller must not replace the verifier's workflow by embedding ad hoc verification instructions in the sub-agent prompt.
10. **Planning Completeness.** Before execution, confirm the bundle contains `verification.md`. If it is missing, return to `specz-plan` to create it instead of generating it inside this controller.

# Purpose

`specz-auto-run` is the bounded orchestration skill for Specz. It resolves the active bundle, confirms planning artifacts are complete, asks one execution context to run the `specz-exec` skill, asks another independent context to run the `specz-verify` skill, and repeats only when verification writes back actionable repair work through `tasks.md`. The execution context may itself use multiple subagents for dependency-safe parallel tasks, but acceptance proof stays in verification.

# Workflow

## 1. Resolve the Bundle

1. Use the bundle explicitly named by the user if present.
2. Otherwise choose the bundle in `specs/<summary-slug>/` that matches the current task summary.
3. Confirm the bundle contains `spec.md`, `tasks.md`, and `verification.md`.
4. If `verification.md` is missing, stop and return the bundle to `specz-plan` so planning can add the pre-implementation evidence plan.
5. If `design.md` exists, pass only the needed sections for the current exec and verify rounds.

## 2. Run the Loop

1. Start round 1.
2. Run the `specz-exec` skill in executor context, allowing it to use multiple subagents for tasks that are independent by dependency and write scope.
3. Require the executor context to keep `tasks.md` synchronized as subagents claim and complete work.
4. Require the executor context to avoid broad acceptance testing and to stop after implementation plus targeted sanity checks.
5. Run the `specz-verify` skill in verifier context. If the runtime cannot directly invoke named skills in sub-agents, require the verifier context to first read `specz/skills/specz-verify/SKILL.md` and follow it as the authoritative verification workflow.
6. Require the verifier context to derive its verification work from the `specz-verify` skill instructions and `verification.md`, not from executor claims or controller-authored test prompts.
7. If verification finds defects or missing behavior, require the verifier to reopen or add tasks in `tasks.md` with `[source: verify]` and enough detail for the next execution round.
8. If verification passes, stop with success.
9. If verification fails, require the verifier to update `design.md` when design drift or design gaps were part of the failure.
10. Return the repaired bundle to the executor for the next round, where the executor focuses only on open tasks from `[source: verify]` plus any still-open `[source: requirement]` tasks.
11. Stop after round 3 if the bundle still fails verification.

## 3. Exit Rules

- On success, report that the bundle satisfies `spec.md`, Acceptance, and required test evidence.
- On success, also report whether `design.md` was present and whether execution stayed aligned with it.
- On success, recommend `specz-archive` when the workflow should be summarized into one archive file and the original bundle should be removed.
- On failure, report:
  - unmet acceptance items
  - reopened or newly added tasks
  - verifier-reopened tasks
  - design drift or missing design decisions when relevant
  - recommended next action for the user
- Never create another bundle automatically.

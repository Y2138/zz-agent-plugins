---
name: "specz-verify"
description: "Verification-stage Specz skill. It independently validates the active bundle, updates tasks.md when implementation is incomplete, and keeps acceptance judgment separate from execution context."
---

# Constraints

1. **Independent Verification.** This skill must run in an agent context separate from the exec skill. Do not trust executor claims without independent evidence.
2. **Verification Grounding.** Ground verification in `spec.md` first, then `design.md` when it materially constrains implementation direction, real test results, observed behavior, and current task state.
3. **Trustworthy Evidence.** Use the most suitable verification method for the requirement and do not mark work complete unless the expected result is demonstrably satisfied.
4. **Repair Bundle State.** If verification reveals missing, weak, or incomplete behavior, update `tasks.md` so the execution loop reflects the real repair work. Mark verifier-created or verifier-reopened tasks with `[source: verify]`. Update `design.md` when design drift or missing design decisions caused the failure.
5. **Spec Is Read Only.** Do not silently modify `spec.md`. If verification reveals scope ambiguity or a requirement conflict, return the issue to planning or the user.
6. **Acceptance Owner.** This skill owns final acceptance proof. Prefer running the broadest and most decision-relevant tests here instead of repeating tests already used only as implementation-side sanity checks in `specz-exec`.
7. **Observed Verification Required.** Final acceptance requires at least one concrete, executed verification action that observes behavior, output, or artifacts relevant to the spec. Code review, diff inspection, static reasoning, executor claims, or the existence of unrun tests are never sufficient by themselves.
8. **UI Runtime Proof.** For UI behavior, layout, or end-user flows, use a browser-capable runtime check to observe rendered behavior. Prefer `playwright-cli` for page flows, interactions, assertions, screenshots, and viewport checks; prefer `chrome-devtools` CLI when DevTools-level DOM, console, network, performance, storage, or runtime inspection is the stronger proof. Use `agent-browser`, direct Playwright code, Chrome CDP, or equivalent tools only as fallbacks when the preferred CLIs are unavailable or insufficient. Build, typecheck, lint, or code inspection alone cannot prove UI acceptance.

# Purpose

`specz-verify` is the final verification-stage Specz skill. It is responsible for proving that the implementation satisfies `spec.md` and, when present, respects the intended implementation direction captured in `design.md`. This stage owns acceptance evidence, broader automated test execution, end-user behavior proof, and the task-state feedback that drives the next execution round.

# Workflow

## 1. Read the Verification Inputs

1. Load the active bundle from `specs/<summary-slug>/` unless the user specifies another bundle.
2. Read `spec.md` to confirm scope and acceptance.
3. Read `tasks.md` to understand intended scope, claimed completion, and any reopened work.
4. If `verification.md` exists, read it as the pre-execution evidence plan, but adapt when a different concrete check would better prove the same acceptance item.
5. If `design.md` exists, read the parts that materially constrain implementation direction.

## 2. Verify the Result

Choose the right mix of evidence for the change:

- Reuse targeted implementation-side checks from `specz-exec` only as weak supporting context, not as final proof by themselves.
- Write or refine unit tests when automated coverage is missing.
- Run the smallest set of automated tests that can prove the spec, preferring targeted suites before broad full-suite reruns.
- Run integration or end-to-end checks when the spec requires system-level proof.
- For UI behavior or end-user flows, prefer `playwright-cli` first, then `chrome-devtools` CLI when DevTools-level inspection is needed. Use `agent-browser`, direct Playwright code, Chrome CDP, or equivalent tools as fallbacks.
- Inspect runtime output, logs, or generated artifacts when that is the most reliable proof.
- If binding context (`design.md`) exists, verify that the code structure and behavior do not materially violate its explicit commitments.
- Do not accept executor self-reporting or executor-authored tests alone as proof of completion.
- Do not mark acceptance complete from code review, diff inspection, or reasoning-only analysis. These may explain a finding, but they do not replace executed evidence.
- If a required verification action cannot run because the environment is missing, blocked, or unsafe, report verification as blocked or failed and add the missing prerequisite or repair work to `tasks.md` when it is inside scope.

Verification order:

1. Start from spec acceptance and identify the smallest decisive evidence set.
2. Reuse any existing test files before creating new ones.
3. Run only the tests or checks that map to unresolved acceptance questions.
4. Escalate to broader regression coverage only when targeted evidence is insufficient or the change risk is high.
5. Record what was actually executed and what was observed. If no concrete verification action was executed for an acceptance item, that item is not verified.

## 3. Repair the Planning Artifacts When Gaps Appear

If verification finds a defect, missing behavior, or insufficient evidence:

1. Update `tasks.md` by reopening the related task, revising the task description, or adding a new repair task when no existing task covers the defect.
   - Preserve `[source: requirement]` on initial requirement tasks when reopening them because implementation is incomplete.
   - Add `[source: verify]` to newly discovered repair tasks, regression tasks, or verifier-created missing-behavior tasks.
   - If a verifier finding substantially rewrites a requirement task, split it when helpful: keep the original `[source: requirement]` task for scope traceability and add a focused `[source: verify]` repair task.
2. Write enough concrete detail into the affected task so `specz-exec` can repair it from shared bundle docs alone.
3. Update `design.md` when the gap comes from missing, ignored, or incorrect implementation design, without changing scope.
4. Do not change `spec.md`; escalate ambiguity back to planning.

## 4. Completion Rule

The spec is complete only when:

- required tests exist and pass
- the implemented behavior matches the spec requirements
- acceptance evidence is stronger than executor-local sanity checks alone
- acceptance evidence includes concrete executed checks, runtime observations, command output, generated artifact inspection, or equivalent observable proof
- `tasks.md` has no verifier-reopened or newly added repair work for the requested scope

Do not complete verification when the only evidence is source review, diff review, executor narration, or unexecuted test code.

If verification fails, return the workflow to the `specz-exec` skill or the `specz-auto-run` skill with the repaired bundle.

If verification passes and the workflow should be closed out, hand the bundle to `specz-archive` so the result is summarized into one archive file and the original bundle can be removed.

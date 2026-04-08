---
name: "specz-verify"
description: "Verification-stage Specz skill. It independently validates the active bundle, updates tasks.md when implementation is incomplete, and keeps acceptance judgment separate from execution context."
---

# Constraints

1. **Independent Verification.** This skill must run in an agent context separate from the exec skill. Do not trust executor claims without independent evidence.
2. **Verification Grounding.** Ground verification in `spec.md` first, then `design.md` when it materially constrains implementation direction, real test results, observed behavior, and current task state.
3. **Trustworthy Evidence.** Use the most suitable verification method for the requirement and do not mark work complete unless the expected result is demonstrably satisfied.
4. **Repair Bundle State.** If verification reveals missing, weak, or incomplete behavior, update `tasks.md` so the execution loop reflects the real repair work. Update `design.md` when design drift or missing design decisions caused the failure.
5. **Spec Is Read Only.** Do not silently modify `spec.md`. If verification reveals scope ambiguity or a requirement conflict, return the issue to planning or the user.
6. **Acceptance Owner.** This skill owns final acceptance proof. Prefer running the broadest and most decision-relevant tests here instead of repeating tests already used only as implementation-side sanity checks in `specz-exec`.

# Purpose

`specz-verify` is the final verification-stage Specz skill. It is responsible for proving that the implementation satisfies `spec.md` and, when present, respects the intended implementation direction captured in `design.md`. This stage owns acceptance evidence, broader automated test execution, end-user behavior proof, and the task-state feedback that drives the next execution round.

# Workflow

## 1. Read the Verification Inputs

1. Load the active bundle from `specs/<summary-slug>/` unless the user specifies another bundle.
2. Read `spec.md` to confirm scope and acceptance.
3. Read `tasks.md` to understand intended scope, claimed completion, and any reopened work.
4. If `design.md` exists, read the parts that materially constrain implementation direction.

## 2. Verify the Result

Choose the right mix of evidence for the change:

- Reuse targeted implementation-side checks from `specz-exec` only as weak supporting context, not as final proof by themselves.
- Write or refine unit tests when automated coverage is missing.
- Run the smallest set of automated tests that can prove the spec, preferring targeted suites before broad full-suite reruns.
- Run integration or end-to-end checks when the spec requires system-level proof.
- Use `agent-browser` when UI behavior or end-user flows need runtime verification.
- Inspect runtime output, logs, or generated artifacts when that is the most reliable proof.
- If binding context (`design.md`) exists, verify that the code structure and behavior do not materially violate its explicit commitments.
- Do not accept executor self-reporting or executor-authored tests alone as proof of completion.

Verification order:

1. Start from spec acceptance and identify the smallest decisive evidence set.
2. Reuse any existing test files before creating new ones.
3. Run only the tests or checks that map to unresolved acceptance questions.
4. Escalate to broader regression coverage only when targeted evidence is insufficient or the change risk is high.

## 3. Repair the Planning Artifacts When Gaps Appear

If verification finds a defect, missing behavior, or insufficient evidence:

1. Update `tasks.md` by reopening the related task, revising the task description, or adding a new repair task when no existing task covers the defect.
2. Write enough concrete detail into the affected task so `specz-exec` can repair it from shared bundle docs alone.
3. Update `design.md` when the gap comes from missing, ignored, or incorrect implementation design, without changing scope.
4. Do not change `spec.md`; escalate ambiguity back to planning.

## 4. Completion Rule

The spec is complete only when:

- required tests exist and pass
- the implemented behavior matches the spec requirements
- acceptance evidence is stronger than executor-local sanity checks alone
- `tasks.md` has no verifier-reopened or newly added repair work for the requested scope

If verification fails, return the workflow to the `specz-exec` skill or the `specz-auto-run` skill with the repaired bundle.

If verification passes and the workflow should be closed out, hand the bundle to `specz-archive` so the result is summarized into one archive file and the original bundle can be removed.

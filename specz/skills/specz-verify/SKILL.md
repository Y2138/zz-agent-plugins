---
name: "specz-verify"
description: "Verification-stage Specz skill. It independently validates the active bundle, distrusts executor self-reporting, and writes back repair tasks when the implementation is incomplete."
---

# Constraints

1. **Independent Verification.** This skill must run in an agent context separate from the exec skill. Do not trust executor claims without independent evidence.
2. **Verification Grounding.** Ground verification in `spec.md` first, then `checklist.md`, `test-cases.md`, real test results, observed behavior, and `design.md` when it materially constrains implementation direction.
3. **Trustworthy Evidence.** Use the most suitable verification method for the requirement and do not mark tasks or checklist items complete unless the expected result is demonstrably satisfied.
4. **Repair Bundle State.** If verification reveals missing, weak, or incomplete coverage, update `tasks.md`, `checklist.md`, `test-cases.md`, and `design.md` when needed so the repaired bundle reflects the real gap.
5. **Spec Is Read Only.** Do not silently modify `spec.md`. If verification reveals scope ambiguity or a requirement conflict, return the issue to planning or the user.

# Purpose

`specz-verify` is the final verification-stage Specz skill. It is responsible for proving that the implementation satisfies `spec.md` and, when present, respects the intended implementation direction captured in `design.md`.

# Workflow

## 1. Read the Verification Inputs

1. Load the active bundle from `specs/<summary-slug>/` unless the user specifies another bundle.
2. Read `spec.md` to confirm scope and acceptance.
3. Read `checklist.md` and `test-cases.md`.
4. Read `tasks.md` only as needed to understand intended scope, claimed completion, and any reopened work.
5. If `design.md` exists, read the parts that materially constrain implementation direction.

## 2. Verify the Result

Choose the right mix of evidence for the change:

- Write or refine unit tests when automated coverage is missing.
- Run integration or end-to-end checks when the spec requires system-level proof.
- Use `agent-browser` when UI behavior or end-user flows need runtime verification.
- Inspect runtime output, logs, or generated artifacts when that is the most reliable proof.
- If binding context (`design.md`) exists, verify that the code structure and behavior do not materially violate its explicit commitments.
- Do not accept executor self-reporting or executor-authored tests alone as proof of completion.

## 3. Repair the Planning Artifacts When Gaps Appear

If any checklist item or test case is incomplete, incorrect, or newly discovered:

1. Update `tasks.md` by adding a new task or revising the existing task description.
2. Correct the completion state of the related task or subtask.
3. Update `checklist.md` so it reflects the actual observable outcome that still needs verification.
4. Update `test-cases.md` when validation evidence is missing, weak, or misaligned with Acceptance.
5. If the gap comes from missing, ignored, or incorrect implementation design, repair or request repair of `design.md` without changing scope.
6. Do not change `spec.md`; escalate ambiguity back to planning.

## 4. Completion Rule

The spec is complete only when:

- required tests exist and pass
- checklist outcomes are verified
- the implemented behavior matches the spec requirements

If verification fails, return the workflow to the `specz-exec` skill or the `specz-auto-run` skill with the repaired bundle.

If verification passes and the workflow should be closed out, hand the bundle to `specz-archive` so the result is summarized into one archive file and the original bundle can be removed.

---
name: "specz-verify"
description: "Verification-stage Specz skill. It independently validates the active bundle, distrusts executor self-reporting, and writes back repair tasks when the implementation is incomplete."
---

# Constraints

1. **Verification Sources.** Verification MUST be grounded in spec.md first, then checklist.md, test-cases.md, real test results, and observed behavior from the implemented system. If design.md exists, treat it as additional binding context for implementation direction.
2. **Verification Methods.** Use the most suitable verification method for the requirement, including unit tests, integration tests, agent-browser checks, manual runtime inspection, or other trustworthy evidence.
3. **Case and Checklist Sync.** If verification reveals a missing or incomplete test case, update tasks.md, checklist.md, and test-cases.md immediately by adding a new task or editing the original task description and completion state.
4. **No False Completion.** Do not mark checklist items or tasks complete unless the expected result is demonstrably satisfied.
5. **Separate Agent Context.** This skill must run in an agent context separate from the exec skill. Do not trust executor claims without independent evidence.
6. **Spec Is Read Only.** Do not silently modify spec.md. If verification reveals scope ambiguity or a requirement conflict, return the issue to the plan skill or the user.

# Purpose

`specz-verify` is the final verification-stage Specz skill. It is responsible for proving that the implementation satisfies `spec.md` and, when present, respects the intended implementation direction captured in `design.md`.

# Workflow

## 1. Read the Verification Inputs

1. Load the active bundle using the highest unfinished matching version unless the user specifies another bundle.
2. Read `spec.md` to confirm scope and acceptance.
3. Read `checklist.md` and `test-cases.md`.
4. Read `tasks.md` to understand the intended implementation scope and current completion state.
5. If `design.md` exists, read it as binding context for verifying implementation direction.

## 2. Verify the Result

Choose the right mix of evidence for the change:

- Write or refine unit tests when automated coverage is missing.
- Run integration or end-to-end checks when the spec requires system-level proof.
- Use `agent-browser` when UI behavior or end-user flows need runtime verification.
- Inspect runtime output, logs, or generated artifacts when that is the most reliable proof.
- If binding context (design.md) exists, verify that the code structure and behavior do not materially violate its explicit commitments.
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

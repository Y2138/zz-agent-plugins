---
name: "specz-verify"
description: "Verification-stage Specz skill. It independently validates the active bundle, distrusts executor self-reporting, and writes back repair tasks when the implementation is incomplete."
---

# Constraints

<constraint>
    <name>Verification Sources</name>
    <content>Verification MUST be grounded in spec.md first, then design.md when present, checklist.md, test-cases.md, real test results, and observed behavior from the implemented system.</content>
</constraint>
<constraint>
    <name>Design Compliance Check</name>
    <content>When design.md exists, verification must check not only whether the feature works, but also whether the implementation materially follows the intended design direction where the design makes explicit commitments.</content>
</constraint>
<constraint>
    <name>Verification Methods</name>
    <content>Use the most suitable verification method for the requirement, including unit tests, integration tests, agent-browser checks, manual runtime inspection, or other trustworthy evidence.</content>
</constraint>
<constraint>
    <name>Case and Checklist Sync</name>
    <content>If verification reveals a missing or incomplete test case, update tasks.md, checklist.md, and test-cases.md immediately by adding a new task or editing the original task description and completion state.</content>
</constraint>
<constraint>
    <name>No False Completion</name>
    <content>Do not mark checklist items or tasks complete unless the expected result is demonstrably satisfied.</content>
</constraint>
<constraint>
    <name>Separate Agent Context</name>
    <content>This skill must run in an agent context separate from the exec skill. Do not trust executor claims without independent evidence.</content>
</constraint>
<constraint>
    <name>Spec Is Read Only</name>
    <content>Do not silently modify spec.md. If verification reveals scope ambiguity or a requirement conflict, return the issue to the plan skill or the user.</content>
</constraint>

# Purpose

`specz-verify` is the final verification-stage Specz skill. It is responsible for proving that the implementation satisfies `spec.md` and, when present, respects the intended implementation direction captured in `design.md`.

# Workflow

## 1. Read the Verification Inputs

1. Load the active bundle using the highest unfinished matching version unless the user specifies another bundle.
2. Read `spec.md` first to confirm scope and acceptance.
3. If present, read `design.md` to understand and verify implementation-sensitive risks, data flow, state ownership, interface decisions, and other repository-specific expectations.
4. Read `checklist.md` and `test-cases.md`.
5. Read `tasks.md` to understand the intended implementation scope and current completion state.

## 2. Verify the Result

Choose the right mix of evidence for the change:

- Write or refine unit tests when automated coverage is missing.
- Run integration or end-to-end checks when the spec requires system-level proof.
- Use `agent-browser` when UI behavior or end-user flows need runtime verification.
- Inspect runtime output, logs, or generated artifacts when that is the most reliable proof.
- When design.md exists, verify that the chosen code structure and behavior do not materially violate explicit design commitments.
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

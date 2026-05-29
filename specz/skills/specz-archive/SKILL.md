---
name: "specz-archive"
description: "Closeout-stage Specz skill. Use when specz-flow or specz-run routes a passed bundle to archive. It writes one concise archive record, then removes the original bundle."
---

# Purpose

Preserve what actually happened in one low-priority historical record under `specs/archive/`.

# Must

- Ground the archive in actual result and verification evidence, not plan intent alone.
- Write one file: `specs/archive/YYYY-MM-DD--<summary-name>.md`.
- Use the user's/project's natural language for archive content.
- Keep only request intent, delivered result, historical design rationale, final design notes, key code context or design tradeoffs, brief/handoff summary when useful, key traceability, verification summary, and remaining gaps.
- Summarize the decisive context and evidence; do not copy quality checklists, full task lists, or full verification plans.
- Delete the original `specs/<summary-name>/` only after the archive is accurate.
- Stop instead of archiving when final verification is missing, not `PASS`, or contradicts the delivered result.

# Must Not

- Do not keep the archive as an authoritative current code reference.
- Do not write an archive or delete the bundle from plan intent alone.
- Do not delete the original bundle while evidence is missing, ambiguous, or failed.
- Do not copy the full task list or evidence plan.
- Do not copy `brief.md` in full; summarize only what helped human alignment.
- Do not copy short-checklist or lint process details unless they explain a meaningful final decision.
- Do not leave stale bundle files after successful archive.

# Stop Conditions

- If the target bundle is missing or multiple bundles match equally, ask one concise question and stop.
- If latest verification is not clearly `PASS`, report the missing or failed evidence and stop before writing an archive file.
- If the archive cannot be checked against the actual delivered result, keep the bundle in place and stop.

# Workflow

1. Resolve the target bundle.
2. Read `spec.md`, plus only useful parts of `design.md`, `tasks.md`, `verification.md`, and `brief.md` if present.
3. Inspect actual code/evidence enough to summarize truthfully.
4. Use `references/archive-workflow.md` for the compact archive shape.
5. Write the archive file.
6. 🔴 CHECKPOINT / 🛑 STOP before deletion: verify the archive matches the final result, latest verification evidence, remaining gaps, and source bundle path.
7. Remove the original bundle directory only after the checkpoint passes.

# Exit Gate

- one archive file exists
- archive matches delivered result
- original bundle is removed

---
name: "specz-archive"
description: "Closeout-stage Specz skill. It writes one concise archive record, then removes the original bundle."
---

# Purpose

Preserve what actually happened in one archive file under `specs/archive/`.

# Must

- Ground the archive in actual result and verification evidence, not plan intent alone.
- Write one file: `specs/archive/YYYY-MM-DD--<summary-slug>.md`.
- Keep only request intent, delivered result, final design notes, key traceability, verification summary, and remaining gaps.
- Delete the original `specs/<summary-slug>/` only after the archive is accurate.

# Must Not

- Do not keep the archive as a living code reference.
- Do not copy the full task list or evidence plan.
- Do not leave stale bundle files after successful archive.

# Workflow

1. Resolve the target bundle.
2. Read `spec.md`, plus only useful parts of `design.md`, `tasks.md`, and `verification.md`.
3. Inspect actual code/evidence enough to summarize truthfully.
4. Use `references/archive-workflow.md` for the compact archive shape.
5. Write the archive file.
6. Verify it matches the final result.
7. Remove the original bundle directory.

# Exit Gate

- one archive file exists
- archive matches delivered result
- original bundle is removed

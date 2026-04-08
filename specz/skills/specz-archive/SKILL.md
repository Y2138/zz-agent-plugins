---
name: "specz-archive"
description: "Closeout-stage Specz skill. It compresses a finished or partially finished spec bundle into one concise archive record aligned with the actual implementation, then removes the original bundle files."
---

# Constraints

1. **Archive Is Workflow History.** The archive document is a record of this workflow run at archive time. It is not a living reference that must stay aligned with future code changes.
2. **Ground In Actual Result.** Read the minimum bundle context needed to understand intent, delivered behavior, and verification evidence. The archive must reflect what was really delivered, not just what was planned.
3. **Single File Output.** Archive each bundle into one Markdown file only.
4. **Meaningful Filename.** Write the archive under `$(cwd)/docs/specz-archive/` as `YYYY-MM-DD--<summary-slug>.md`, where `<summary-slug>` comes from the task summary and stays concrete and scan-friendly.
5. **High-Value Summary Only.** Preserve concise request intent, delivered result, key final design decisions, verification outcome, and any remaining gaps. If delivery differs from the original spec, say so clearly.
6. **Cleanup After Archiving.** Delete the original `specs/<summary-slug>/` bundle only after the archive file is written and reflects the final implementation truth.

# Purpose

`specz-archive` is the closeout-stage Specz skill. It turns a completed or partially completed spec bundle into one concise archive record that captures what the workflow actually produced, then removes the original bundle files so the active spec workspace stays clean.

# Workflow

## 1. Load the Bundle and Actual Result

1. Resolve the target bundle from `$(cwd)/specs/<summary-slug>/`.
2. Read `spec.md` first, then only the sections of `tasks.md` and `design.md` that are needed to explain the final result truthfully.
3. Inspect the actual code, strongest validation evidence, and current task state so the archive reflects delivered behavior rather than planning intent alone.

## 2. Choose the Archive Filename

Write the archive to:

- `$(cwd)/docs/specz-archive/YYYY-MM-DD--<summary-slug>.md`

Filename rules:

- Use the current local date.
- Reuse the task summary slug, for example `user-login` or `orders-filter-panel`.
- Keep it aligned with the summary name used for the bundle unless a small refinement makes the archived result clearer.
- Keep the filename readable and scan-friendly.

## 3. Write the Archive Document

Use `/Users/staff/Documents/zz-agent-plugins/specz/skills/specz-archive/references/archive-workflow.md` for the detailed template and section rules.

The archive must be concise and should preserve:

- what the request was trying to achieve
- what was actually completed
- which final design choices were really implemented
- what verification evidence exists
- what remains unfinished or intentionally deferred, if anything

## 4. Remove the Original Bundle

After the archive file is written and checked for accuracy:

1. Delete the original bundle directory under `specs/`.
2. Do not leave stale `spec.md`, `design.md`, or `tasks.md` behind.
3. Keep only the single archive record as the workflow summary artifact.

# Exit Condition

The archive stage is complete only when:

- one archive file exists under `docs/specz-archive/`
- the archive matches the actual delivered result
- the original bundle directory has been removed

# Specz Archive Workflow

Use this document when writing the archive file for `specz-archive`.

## Goal

Preserve the useful outcome of a spec workflow in one concise document that is easy to scan later, while removing the original planning bundle.

## Archive Location

Write archive files to:

- `$(cwd)/docs/specz-archive/`

Filename format:

- `YYYY-MM-DD--<summary-slug>.md`

Filename rules:

- `YYYY-MM-DD` uses the local archive date.
- `<summary-slug>` comes from this task's summary name and should match the source bundle directory name.
- `<summary-slug>` should describe the dominant delivered result in 2-6 hyphenated words.
- Prefer concrete capability words like `invoice-export-api`, `search-filter-panel`, or `retryable-webhook-handler`.
- Avoid generic names like `final`, `done`, `completed`, `archive`, or `misc-update`.

## Archive Writing Rules

1. Use the archive as a workflow record, not as a permanent description of the latest codebase.
2. Base the archive on the actual implemented result and verification evidence.
3. Keep only the parts of `spec.md` and other bundle docs that help a future reader understand the original intent, task evolution, and final result.
4. Rewrite design conclusions to match the final implementation when planning and code diverged.
5. Summarize task completion rather than copying the full task list.
6. If work is incomplete, say what remains or was deferred, but keep the archive concise.

## Suggested Template

```markdown
# [Feature / Change Name] Archive

- Source bundle: `specs/<summary-slug>/`
- Archived at: `YYYY-MM-DD`

## Request Summary
- Why this work existed
- The core requested change

## What Was Completed
- The shipped or implemented result
- Any important scope adjustments reflected in the final code

## Final Design Notes
- The key design choices that were actually implemented
- Final module boundaries, data flow, UI structure, or contract shape that matter for understanding the delivered result

## Verification Summary
- The strongest evidence that the result works
- Important checks that passed

## Remaining Notes
- Deferred work, known limitations, or intentional non-goals if they still matter
```

## Section Guidance

### Request Summary

Keep only the smallest useful slice of `spec.md`:

- the original problem or opportunity
- the core requested behavior
- any acceptance point that materially explains the delivered result

### What Was Completed

This is the most important section.

It should answer:

- what changed in the delivered code
- what capability now exists
- whether the delivered result is narrower or different than the original request

### Final Design Notes

Preserve only the design that survived implementation:

- module or component boundaries
- actual data flow or state ownership
- final contract shape
- final UI structure

Do not preserve rejected design options or exploratory ideas here.

### Verification Summary

Keep this short and concrete:

- tests run
- manual checks
- runtime evidence
- important acceptance points that were verified
- major verification failures and how the task list evolved when that history matters

### Remaining Notes

Only include this section when there is still meaningful unfinished context, such as:

- intentionally deferred scope
- known limitations
- follow-up items that matter to future work

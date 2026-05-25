---
name: "specz-flow"
description: "Primary Specz orchestration skill for efficient, lightweight spec-driven workflow. Use before implementing, enhancing, fixing, refactoring, resuming, planning, verifying, or archiving non-trivial code changes; use when a repository has specs/ bundles or the user asks for Specz/spec-driven workflow. It selects or creates the active bundle from bundle files and routes to clarify, plan, run, or archive."
---

# Purpose

Choose the active Specz bundle and route to the next Specz stage. Keep this skill as the efficient, lightweight entry point; do not duplicate stage contracts here.

# Must

- Scan `specs/*/` except `specs/archive/`.
- Treat each bundle's own files as the source of truth; do not create a global status file.
- Use the user's/project's natural language for bundle names and Specz artifact content.
- Prefer continuing an existing relevant bundle over creating a duplicate.
- Route to exactly one next skill unless the user explicitly asks for a status summary.

# Must Not

- Do not read general repository instructions as a Specz-specific responsibility.
- Do not implement product code.
- Do not create `design.md`, `tasks.md`, or `verification.md` directly.
- Do not maintain `清单.md`, index files, or synchronized state mirrors.

# Bundle Selection

1. If the user names a bundle, use that bundle.
2. If the user asks to continue, resume the most recently updated unfinished bundle.
3. If the request matches an unfinished bundle's intent, update that bundle.
4. Otherwise create a new short bundle path: `specs/<summary-name>/`.
5. If multiple unfinished bundles match equally, ask one concise question.

# State Detection

Use the files, not only metadata hints:

- No `spec.md` -> `specz-clarify`.
- `spec.md` has unresolved `QUESTION-*` that blocks scope -> `specz-clarify`.
- `Size: small` and no planned artifacts are needed -> `specz-run`.
- `Size: standard | large` and `tasks.md` or `verification.md` is missing -> `specz-plan`.
- `tasks.md` has unchecked tasks -> `specz-run`.
- Tasks are complete and latest verification is not `PASS` -> `specz-run`.
- Latest verification is `PASS` -> `specz-archive`.
- Missing or contradictory required fields -> route to the stage that owns the broken file.

# Output

Report only:

- active bundle
- detected state
- next skill
- one-sentence reason

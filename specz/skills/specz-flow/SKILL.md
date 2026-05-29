---
name: "specz-flow"
description: "Primary Specz orchestration skill for efficient, lightweight spec-driven workflow. Use for non-trivial coding development work: implementing, enhancing, fixing, refactoring, resuming, planning, verifying, or archiving code/runtime changes. It selects or creates the active bundle from bundle files and routes to clarify, plan, run, or archive."
---

# Purpose

Choose the active Specz bundle and route to the next Specz stage. Keep this skill as the efficient, lightweight entry point; do not duplicate stage contracts here.

Specz flow is for coding work that can move toward implementation, verification, and archive. For docs-only, skill/prompt editing, design-only, research, critique, or consultation tasks, handle the task directly unless the user explicitly asks to use Specz.

# Entry Gate

Before scanning bundles or creating a new bundle, confirm the request is coding work: code/runtime behavior, tests, build/dev tooling, CI, schemas, APIs, persistence, permissions, migrations, infrastructure, bugs, regressions, or an explicit Specz request.

If the request is only docs, skills/prompts, design, critique, research, or consultation, do not create a bundle by default. If the fit is ambiguous, ask one concise question before continuing.

# Checkpoints

- 🔴 CHECKPOINT / 🛑 STOP before bundle work: if the request fails the Entry Gate, do not scan bundles or create a bundle; handle it directly or ask one concise fit question.
- 🔴 CHECKPOINT / 🛑 STOP before routing: if zero or multiple unfinished bundles match equally, ask one concise question and stop before creating a duplicate.
- 🔴 CHECKPOINT / 🛑 STOP before output: confirm exactly one active bundle, exactly one next skill, and no product code or stage artifacts were modified by this skill.

# Must

- Scan `specs/*/` except `specs/archive/`.
- Treat each bundle's own files as the source of truth; do not create a global status file.
- Use the user's/project's natural language for bundle names and Specz artifact content.
- Prefer continuing an existing relevant bundle over creating a duplicate.
- Route to exactly one next skill unless the user explicitly asks for a status summary.
- Route to `specz-brief` only when the bundle is planned and the user explicitly asks for a human-readable brief, review packet, alignment doc, stakeholder summary, or product/engineering/QA handoff.
- Only create or continue a bundle after the Entry Gate passes.
- When helpful, report one lightweight execution strategy: local fast path, standard plan path, high-risk plan path, or regression repair path.

# Must Not

- Do not read general repository instructions as a Specz-specific responsibility.
- Do not implement product code.
- Do not create `design.md`, `tasks.md`, or `verification.md` directly.
- Do not maintain `清单.md`, index files, or synchronized state mirrors.

# Bundle Selection

Only run this section after the Entry Gate passes.

1. If the user names an existing bundle, use that bundle.
2. If the user names a bundle that does not exist, ask one concise question and stop; do not silently create a similarly named bundle.
3. If the user asks to continue and an unfinished bundle exists, resume the most recently updated relevant unfinished bundle.
4. If the user asks to continue and no unfinished bundle exists, ask one concise question and stop; do not create a new bundle from a continuation request.
5. If the request matches an unfinished bundle's intent, update that bundle.
6. Otherwise create a new short bundle path: `specs/<summary-name>/`.
7. If multiple unfinished bundles match equally, ask one concise question.

# State Detection

Use the files, not only metadata hints:

- No `spec.md` -> `specz-clarify`.
- `spec.md` has unresolved `QUESTION-*` that blocks scope -> `specz-clarify`.
- `Size: small` and no planned artifacts are needed -> `specz-run`.
- `Size: standard | large` and `tasks.md` or `verification.md` is missing -> `specz-plan`.
- Planned artifacts exist and user explicitly asks for a human-readable brief or review packet -> `specz-brief`.
- `tasks.md` has unchecked tasks -> `specz-run`.
- Tasks are complete and latest verification is not `PASS` -> `specz-run`.
- Latest verification is `PASS` -> `specz-archive`.
- Missing or contradictory required fields -> route to the stage that owns the broken file.

# Execution Strategy

This is advisory context only; it must not become a second state machine.

- Local fast path: small, local, low-risk work executable from existing `spec.md`; route directly to `specz-run` and keep the reason to one sentence.
- Standard plan path: multi-file or moderate-risk work; route through `specz-plan`.
- High-risk plan path: contracts, permissions, persistence, migrations, compatibility, or user-critical flows; expect `design.md` and stronger verification.
- Regression repair path: failed verification, tests, CI, review feedback, or production failure; preserve the failure signal and create focused repair work.

# Optional Brief

`specz-brief` is an optional human-readable handoff stage between planning and execution. It writes `brief.md` for product, engineering, and QA alignment. It does not replace `spec.md`, `design.md`, `tasks.md`, or `verification.md`, and it must not block `specz-run` when the user did not ask for it.

# Output

Report only:

- active bundle
- detected state
- execution strategy, when useful
- next skill
- one-sentence reason

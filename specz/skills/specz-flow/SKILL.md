---
name: "specz-flow"
description: "Primary Specz orchestration skill for efficient, lightweight spec-driven workflow. Use for non-trivial coding development work: implementing, enhancing, fixing, refactoring, resuming, planning, verifying, or archiving code/runtime changes. It selects or creates the active bundle from bundle files and routes to clarify, plan, run, or archive."
---

# Purpose

Choose the active Specz bundle and route to the next Specz stage. Keep this skill as the efficient, lightweight entry point; do not duplicate stage contracts here.

Specz flow is for coding work that can move toward implementation, verification, and archive. For docs-only, skill/prompt editing, design-only, research, critique, or consultation tasks, handle the task directly unless the user explicitly asks to use Specz.

`specz-flow` is a router only. A route to a stage is not permission to perform that stage from this skill.

# Entry Gate

Before scanning bundles or creating a new bundle, confirm the request is coding work: code/runtime behavior, tests, build/dev tooling, CI, schemas, APIs, persistence, permissions, migrations, infrastructure, bugs, regressions, or an explicit Specz request.

If the request is only docs, skills/prompts, design, critique, research, or consultation, do not create a bundle by default. If the fit is ambiguous, ask one concise question before continuing.

# Checkpoints

- 🔴 CHECKPOINT / 🛑 STOP before bundle work: if the request fails the Entry Gate, do not scan bundles or create a bundle; handle it directly or ask one concise fit question.
- 🔴 CHECKPOINT / 🛑 STOP before routing: if zero or multiple unfinished bundles match equally, ask one concise question and stop before creating a duplicate.
- 🔴 CHECKPOINT / 🛑 STOP before output: confirm exactly one active bundle, exactly one next skill, the handoff block names that skill, and no product code or stage artifacts were modified by this skill.

# Stage Handoff Contract

When this skill routes to `specz-clarify`, `specz-plan`, `specz-brief`, `specz-run`, or `specz-archive`, stop after reporting the route unless the named stage skill is loaded and active.

- Before doing stage work, load and follow the named stage skill's `SKILL.md`.
- If the platform cannot load or find the named stage skill, stop and report the missing skill instead of continuing from `specz-flow`.
- Do not perform stage-owned work from this skill: no `spec.md` authoring, no planning artifacts, no product code, no verification, and no archive deletion.
- The stage skill owns its own gates, context loading, outputs, and stop conditions.
- Handoff output must include a block in this shape:

```text
Required next skill: specz-run
Load required: yes
Stage work allowed from specz-flow: no
If unavailable: stop and report missing stage skill
```

Failure modes:

| Trigger | Required action | Forbidden action |
|---|---|---|
| Target stage skill is not discoverable | Stop and report `missing stage skill: <name>` | Do not continue from `specz-flow` |
| Target stage skill exists but is not loaded | Load the stage skill before stage work | Do not write stage artifacts or product code |
| Handoff block and detected state disagree | Stop and resolve the contradiction before routing | Do not guess a stage |
| Multiple unfinished bundles match equally | Ask one concise question before routing | Do not create a duplicate bundle |
| Entry Gate fails | Handle directly or ask one concise fit question | Do not scan bundles or create a Specz bundle |

# Project Memory Context

Project memory is a general agent/project responsibility, similar in authority to project instruction files such as `AGENTS.md`, not a Specz-owned bundle artifact.

- Use platform-provided memory and project instruction context when available before choosing or creating a bundle.
- Treat memory as contextual guidance only; active user instructions, system/developer instructions, project instructions, active bundle artifacts, and current code facts override stale memory.
- Do not create, update, or delete project memory from `specz-flow`.
- If relevant memory is unavailable, continue with current project context; do not block routing only because memory is missing.

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
- Do not execute a routed stage unless that stage skill is loaded and active.

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

State authority order:

1. `spec.md` existence, `Size`, and blocking `QUESTION-*`.
2. Required planned artifacts for `Size: standard | large`.
3. `tasks.md` unchecked tasks when `tasks.md` exists.
4. `verification.md` `Latest Verification Result` when `verification.md` exists.
5. Small-spec final Result Block only when no `verification.md` exists.
6. Contradictions between these sources route to the owner of the broken file, not to archive.

Decision examples:

| Input state | Next skill | Reason |
|---|---|---|
| User names missing bundle | stop | Ask one concise question; do not create a similar bundle |
| Continue request and no unfinished bundle | stop | Ask for target work; do not create a new continuation bundle |
| `verification.md` says `PASS` but `tasks.md` has unchecked tasks | `specz-run` | Task state and verification state contradict; run owns repair/reconciliation |
| Small spec has final PASS Result Block and no `verification.md` | `specz-archive` | Small-spec proof is complete and no planned verification surface exists |
| `spec.md` has blocking `QUESTION-*` and `tasks.md` exists | `specz-clarify` | Clarification owns blocking scope/behavior questions |

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

```text
Active bundle: specs/<summary-name>/
Detected state: [one file-based state from State Detection]
Execution strategy: [local fast path | standard plan path | high-risk plan path | regression repair path | none]
Next skill: specz-<stage>
Required next skill: specz-<stage>
Load required: yes
Stage work allowed from specz-flow: no
If unavailable: stop and report missing stage skill
Reason: [one sentence tied to the state authority order]
```

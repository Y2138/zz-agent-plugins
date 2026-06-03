#!/usr/bin/env bash

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Specz reminder: use specz-flow only for non-trivial coding development work: code/runtime changes, tests, bugs, CI failures, refactors, schemas, APIs, migrations, infra, or resuming an existing Specz bundle. Do not use Specz for docs-only edits, skill/prompt edits, design-only work, critique, research, or consultation unless the user explicitly asks for Specz. If scope or acceptance is unclear, ask before creating a bundle. After specz-flow routes, load the required next stage skill before doing stage work. Use available general project memory and project instructions as context, but do not let memory override current instructions, active bundle artifacts, code facts, or verification evidence."
  }
}
EOF

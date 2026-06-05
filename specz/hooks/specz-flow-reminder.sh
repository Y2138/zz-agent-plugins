#!/usr/bin/env bash

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Specz reminder: Use specz-flow as the entry for coding development work involving code/runtime behavior, tests, bugs, CI, refactors, schemas, APIs, migrations, infra, or resuming an existing Specz bundle. Keep docs-only, skill/prompt edits, design-only work, critique, research, and consultation outside Specz unless explicitly requested. Let specz-flow decide whether the bundle needs clarify, plan, run, brief, or archive; after it routes, load the required stage skill before stage work. Use project memory and instructions as context; when memory conflicts with current task instructions, active bundle artifacts, code facts, or verification evidence, surface the conflict and ask the user to resolve it."
  }
}
EOF

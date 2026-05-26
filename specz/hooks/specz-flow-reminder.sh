#!/usr/bin/env bash

cat << 'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Specz reminder: for feature work, enhancements, bug fixes, refactors, or resuming development tasks, first consider using specz-flow to select or create the active specs/ bundle and route to clarify, plan, run, or archive. Keep this lightweight; skip only when the request is clearly trivial or non-code."
  }
}
EOF

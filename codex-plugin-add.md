# Codex Plugin Install Instructions

Use this document when asking a Codex agent to install the `specz` plugin into a project.

## Goal

Install `specz` as a project-level plugin for Codex without overwriting unrelated existing plugins.

The installation must:

- copy the repository's `specz` plugin directory into the target project
- merge this repository's Codex marketplace entry into the target project's marketplace
- merge the optional Specz session-start hook into the target project's Codex hooks
- keep the plugin usable as a dual-platform plugin by preserving both `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json` inside `specz/`

Source files:

- `<repo_root>/.agents/plugins/marketplace.json`
- `<repo_root>/specz/`
- `<repo_root>/specz/hooks/codex-hooks.json`

Target location:

- `<project_root>/.agents/plugins/marketplace.json`
- `<project_root>/specz/`
- `<project_root>/.codex/hooks.json`

## Required Behavior

1. **Read the source data first**
   - Read `<repo_root>/.agents/plugins/marketplace.json`
   - Confirm that it contains a plugin entry with `name: "specz"`
   - Read the `specz` plugin directory and preserve its full contents, including:
     - `<repo_root>/specz/.codex-plugin/plugin.json`
     - `<repo_root>/specz/.claude-plugin/plugin.json`
     - `<repo_root>/specz/skills/`
     - `<repo_root>/specz/hooks/`

2. **Copy the `specz` plugin directory**
   - Copy the entire `<repo_root>/specz/` directory to `<project_root>/specz/`
   - If `<project_root>/specz/` already exists, update it in place so the installed plugin matches the source plugin
   - Do not drop hidden files or hidden directories during the copy

3. **Merge the Codex marketplace**
   - Target file: `<project_root>/.agents/plugins/marketplace.json`
   - If the target marketplace does not exist, create it with the same top-level schema expected by Codex
   - If the target marketplace already exists, merge plugin entries by plugin `name`
   - Do not remove, reorder, or overwrite unrelated existing plugins
   - If a plugin with `name: "specz"` already exists, replace only that plugin entry with the source `specz` entry
   - Preserve unrelated top-level metadata when possible
   - Append `specz` only if it is missing
   - Keep the merged result valid JSON
   - Keep the installed plugin path project-relative, for example `"./specz"`

4. **Merge the Codex hook reminder**
   - Source file: `<project_root>/specz/hooks/codex-hooks.json`
   - Target file: `<project_root>/.codex/hooks.json`
   - If the target hooks file does not exist, create it from the source template
   - If the target hooks file exists, merge only the `SessionStart` hook entry for Specz
   - Do not remove or overwrite unrelated hooks
   - Do not add file-edit, tool-use, or commit guards; this hook is only a lightweight session-start reminder
   - Keep the command project-relative: `bash "./specz/hooks/specz-flow-reminder.sh"`
   - Keep the merged result valid JSON

## Install Scope

This installation is only for project-level usage.

- Do not modify `~/.agents/plugins/marketplace.json`
- Do not suggest replacing the user's existing marketplace with this repository's marketplace
- Use merge behavior only

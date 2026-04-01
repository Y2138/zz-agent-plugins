# Codex Plugin Install Instructions

Use this document when asking a Codex agent to install this plugin marketplace.

## Goal

Merge the plugin entries from this repository into Codex marketplace files without overwriting existing plugins.

Source marketplace:

- `<repo_root>/.agents/plugins/marketplace.json`

Target marketplaces to update:

- `~/.agents/plugins/marketplace.json` for the user-level marketplace
- `<worktree_root>/.agents/plugins/marketplace.json` for the repository-level marketplace when the current repository uses one

## Required Behavior

- Read the source marketplace from this repository first.
- If a target marketplace does not exist, create it with the same top-level schema expected by Codex.
- If a target marketplace already exists, merge plugin entries by plugin `name`.
- Do not remove or overwrite unrelated existing plugins in the target marketplace.
- If a plugin with the same `name` already exists, update that plugin entry in place using the source marketplace entry.
- Preserve unrelated top-level metadata when possible.
- Preserve existing plugin order, and append new plugin entries to the end.
- Keep the merged result valid JSON.
- Keep repository plugin paths relative to the source marketplace root, for example `./specz`.

## Merge Scope

Merge every plugin entry from:

- `<repo_root>/.agents/plugins/marketplace.json`

into:

- `~/.agents/plugins/marketplace.json`
- `<worktree_root>/.agents/plugins/marketplace.json`

Only update `<worktree_root>/.agents/plugins/marketplace.json` when the active repository is meant to consume this plugin marketplace.

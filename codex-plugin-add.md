# Codex Plugin Install Instructions

Use this document when asking a Codex agent to install this plugin marketplace.

## Goal

Add the plugin entries from this repository to the project-level Codex marketplace without overwriting existing plugins. Also copy the specz plugin directory to the project.

Source files:

- `<repo_root>/.agents/plugins/marketplace.json`
- `<repo_root>/specz/`

Target location:

- `<project_root>/.agents/plugins/marketplace.json` for the project-level marketplace
- `<project_root>/specz/` for the plugin directory

## Required Behavior

1. **Copy the specz plugin directory**:
   - Copy the entire `<repo_root>/specz/` directory to `<project_root>/specz/`
   - Overwrite existing files if they exist

2. **Update the project-level marketplace**:
   - Read the source marketplace from this repository first
   - If the target marketplace does not exist, create it with the same top-level schema expected by Codex
   - If the target marketplace already exists, merge plugin entries by plugin `name`
   - Do not remove or overwrite unrelated existing plugins in the target marketplace
   - If a plugin with the same `name` already exists, update that plugin entry in place using the source marketplace entry
   - Preserve unrelated top-level metadata when possible
   - Preserve existing plugin order, and append new plugin entries to the end
   - Keep the merged result valid JSON
   - Keep repository plugin paths relative to the project root, for example `./specz`

## Install Scope

This installation is only for project-level usage. Do not modify the user-level marketplace (`~/.agents/plugins/marketplace.json`).

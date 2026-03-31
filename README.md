# Plugins Workspace

`plugins/` is the single source of truth for local plugins that must work in both Codex and Claude Code.

## Layout

```text
plugins/
  .agents/plugins/marketplace.json
  .claude-plugin/marketplace.json
  scripts/
    sync-marketplaces.py
    validate-plugins.py
  <plugin-name>/
    .codex-plugin/plugin.json
    .claude-plugin/plugin.json
    skills/
```

## Rules

- Add every plugin under `plugins/<plugin-name>/`.
- Keep both `plugins/<plugin-name>/.codex-plugin/plugin.json` and `plugins/<plugin-name>/.claude-plugin/plugin.json`.
- Treat the plugin manifests as the editable metadata source for `name`, `version`, `description`, `keywords`, and `skills`.
- Do not hand-edit `.agents/plugins/marketplace.json` or `.claude-plugin/marketplace.json`. They are generated files.
- Regenerate the marketplace files after changing plugin metadata or adding/removing a plugin.

## Installation

Assume this repository is cloned to:

```bash
~/code/plugins
```

Run the generators first:

```bash
cd ~/code/plugins
python3 scripts/sync-marketplaces.py
python3 scripts/validate-plugins.py
```

### Codex

Codex should install this marketplace by merging it into existing marketplace files instead of replacing them.

Use [codex-plugin-add.md](/Users/staff/Documents/agent-workspace/plugins/codex-plugin-add.md) as the instruction document for a Codex agent.

The agent should read this repository marketplace:

```text
~/code/plugins/.agents/plugins/marketplace.json
```

and merge its plugin entries into:

- `~/.agents/plugins/marketplace.json` for user-level installation
- `<repo_root>/.agents/plugins/marketplace.json` for repository-level installation when needed

This keeps existing Codex plugins intact and only adds or updates this repository's plugin entries.

### Claude Code

Claude Code should also add this marketplace without replacing existing plugin sources.

Use the Claude Code marketplace add flow:

```bash
/plugin marketplace add ~/code/plugins/.claude-plugin/marketplace.json
```

This adds the marketplace as another source, so existing Claude Code plugins are not overwritten.

### Update Flow

When pulling new changes from this repository:

```bash
cd ~/code/plugins
git pull
python3 scripts/sync-marketplaces.py
python3 scripts/validate-plugins.py
```

## Workflow

From the repository root:

```bash
python3 scripts/sync-marketplaces.py
python3 scripts/validate-plugins.py
```

`sync-marketplaces.py` scans direct plugin folders inside `plugins/`, validates Codex/Claude manifest parity, and writes:

- `.agents/plugins/marketplace.json`
- `.claude-plugin/marketplace.json`

`validate-plugins.py` checks:

- every plugin has both manifests
- key metadata is consistent across both manifests
- marketplace entries resolve to real plugin folders
- every plugin folder appears in both marketplaces

## Standalone Repo

This directory is intended to be maintained as its own repository. The plugin marketplaces live inside the repository itself, so the whole directory can be cloned and installed without relying on any parent workspace structure.
# zz-agent-plugins

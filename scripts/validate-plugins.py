#!/usr/bin/env python3

from __future__ import annotations

import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
CODEX_MARKETPLACE_PATH = REPO_ROOT / ".agents" / "plugins" / "marketplace.json"
CLAUDE_MARKETPLACE_PATH = REPO_ROOT / ".claude-plugin" / "marketplace.json"
MANIFEST_PARITY_KEYS = (
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "repository",
    "license",
    "keywords",
    "skills",
    "interface",
)


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"Missing required file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc


def iter_plugin_dirs() -> list[Path]:
    plugin_dirs: list[Path] = []
    for path in sorted(REPO_ROOT.iterdir()):
        if not path.is_dir():
            continue
        if path.name.startswith("."):
            continue
        if path.name == "scripts":
            continue
        if (path / ".codex-plugin" / "plugin.json").is_file() or (path / ".claude-plugin" / "plugin.json").is_file():
            plugin_dirs.append(path)
    return plugin_dirs


def validate_manifest_pair(plugin_dir: Path) -> None:
    codex_manifest_path = plugin_dir / ".codex-plugin" / "plugin.json"
    claude_manifest_path = plugin_dir / ".claude-plugin" / "plugin.json"

    if not codex_manifest_path.is_file():
        raise SystemExit(f"Missing Codex manifest: {codex_manifest_path}")
    if not claude_manifest_path.is_file():
        raise SystemExit(f"Missing Claude manifest: {claude_manifest_path}")

    codex_manifest = load_json(codex_manifest_path)
    claude_manifest = load_json(claude_manifest_path)

    if codex_manifest.get("name") != plugin_dir.name:
        raise SystemExit(
            f"Plugin directory '{plugin_dir.name}' does not match Codex manifest name "
            f"'{codex_manifest.get('name')}'"
        )

    if claude_manifest.get("name") != plugin_dir.name:
        raise SystemExit(
            f"Plugin directory '{plugin_dir.name}' does not match Claude manifest name "
            f"'{claude_manifest.get('name')}'"
        )

    for key in MANIFEST_PARITY_KEYS:
        if codex_manifest.get(key) != claude_manifest.get(key):
            raise SystemExit(
                f"Manifest mismatch for plugin '{plugin_dir.name}' on key '{key}'"
            )


def validate_codex_marketplace(plugin_names: set[str]) -> None:
    marketplace = load_json(CODEX_MARKETPLACE_PATH)
    marketplace_names: set[str] = set()

    for entry in marketplace.get("plugins", []):
        name = entry.get("name")
        source = entry.get("source", {})
        source_path = source.get("path")
        if not name or source.get("source") != "local" or not source_path:
            raise SystemExit("Codex marketplace contains an invalid plugin source entry")

        resolved = (REPO_ROOT / source_path).resolve()
        if not resolved.is_dir():
            raise SystemExit(
                f"Codex marketplace path does not exist for plugin '{name}': {source_path}"
            )
        marketplace_names.add(name)

    if marketplace_names != plugin_names:
        raise SystemExit(
            f"Codex marketplace plugins {sorted(marketplace_names)} do not match plugin directories {sorted(plugin_names)}"
        )


def validate_claude_marketplace(plugin_names: set[str]) -> None:
    marketplace = load_json(CLAUDE_MARKETPLACE_PATH)
    marketplace_names: set[str] = set()

    for entry in marketplace.get("plugins", []):
        name = entry.get("name")
        source = entry.get("source")
        if not name or not isinstance(source, str):
            raise SystemExit("Claude marketplace contains an invalid plugin source entry")

        resolved = (REPO_ROOT / source).resolve()
        if not resolved.is_dir():
            raise SystemExit(
                f"Claude marketplace path does not exist for plugin '{name}': {source}"
            )
        marketplace_names.add(name)

    if marketplace_names != plugin_names:
        raise SystemExit(
            f"Claude marketplace plugins {sorted(marketplace_names)} do not match plugin directories {sorted(plugin_names)}"
        )


def main() -> int:
    plugin_dirs = iter_plugin_dirs()
    if not plugin_dirs:
        raise SystemExit(f"No plugins found under {REPO_ROOT}")

    for plugin_dir in plugin_dirs:
        validate_manifest_pair(plugin_dir)

    plugin_names = {path.name for path in plugin_dirs}
    validate_codex_marketplace(plugin_names)
    validate_claude_marketplace(plugin_names)

    print("Plugin validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

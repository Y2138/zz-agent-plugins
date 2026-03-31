#!/usr/bin/env python3

from __future__ import annotations

import json
import sys
from pathlib import Path


PLUGIN_ROOT = Path(__file__).resolve().parents[1]
CODEX_MARKETPLACE_PATH = PLUGIN_ROOT / ".agents" / "plugins" / "marketplace.json"
CLAUDE_MARKETPLACE_PATH = PLUGIN_ROOT / ".claude-plugin" / "marketplace.json"
MANIFEST_KEYS = ("name", "version", "description", "keywords", "skills")


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"Missing required file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc


def iter_plugin_dirs() -> list[Path]:
    return [
        path
        for path in sorted(PLUGIN_ROOT.iterdir())
        if path.is_dir() and not path.name.startswith(".") and path.name != "scripts"
    ]


def validate_manifest_pair(plugin_dir: Path) -> None:
    codex_manifest_path = plugin_dir / ".codex-plugin" / "plugin.json"
    claude_manifest_path = plugin_dir / ".claude-plugin" / "plugin.json"
    codex_manifest = load_json(codex_manifest_path)
    claude_manifest = load_json(claude_manifest_path)

    if codex_manifest.get("name") != plugin_dir.name:
        raise SystemExit(
            f"Plugin directory '{plugin_dir.name}' does not match Codex manifest name "
            f"'{codex_manifest.get('name')}'"
        )

    for key in MANIFEST_KEYS:
        if codex_manifest.get(key) != claude_manifest.get(key):
            raise SystemExit(
                f"Manifest mismatch for plugin '{plugin_dir.name}' on key '{key}'"
            )


def validate_marketplace_paths() -> None:
    plugin_names = {path.name for path in iter_plugin_dirs()}
    codex_marketplace = load_json(CODEX_MARKETPLACE_PATH)
    claude_marketplace = load_json(CLAUDE_MARKETPLACE_PATH)

    codex_names = set()
    for entry in codex_marketplace.get("plugins", []):
        name = entry.get("name")
        source_path = entry.get("source", {}).get("path")
        if not name or not source_path:
            raise SystemExit("Codex marketplace contains an entry without name or source.path")
        resolved = (PLUGIN_ROOT / source_path).resolve()
        if not resolved.is_dir():
            raise SystemExit(f"Codex marketplace path does not exist for plugin '{name}': {source_path}")
        codex_names.add(name)

    claude_names = set()
    for entry in claude_marketplace.get("plugins", []):
        name = entry.get("name")
        source_path = entry.get("source")
        if not name or not source_path:
            raise SystemExit("Claude marketplace contains an entry without name or source")
        resolved = (PLUGIN_ROOT / source_path).resolve()
        if not resolved.is_dir():
            raise SystemExit(f"Claude marketplace path does not exist for plugin '{name}': {source_path}")
        claude_names.add(name)

    if codex_names != plugin_names:
        raise SystemExit(
            f"Codex marketplace plugins {sorted(codex_names)} do not match plugin directories {sorted(plugin_names)}"
        )
    if claude_names != plugin_names:
        raise SystemExit(
            f"Claude marketplace plugins {sorted(claude_names)} do not match plugin directories {sorted(plugin_names)}"
        )


def main() -> int:
    plugin_dirs = iter_plugin_dirs()
    if not plugin_dirs:
        raise SystemExit(f"No plugins found under {PLUGIN_ROOT}")

    for plugin_dir in plugin_dirs:
        validate_manifest_pair(plugin_dir)

    validate_marketplace_paths()
    print("Plugin validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

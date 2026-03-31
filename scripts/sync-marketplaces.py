#!/usr/bin/env python3

from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path


PLUGIN_ROOT = Path(__file__).resolve().parents[1]
CODEX_MARKETPLACE_PATH = PLUGIN_ROOT / ".agents" / "plugins" / "marketplace.json"
CLAUDE_MARKETPLACE_PATH = PLUGIN_ROOT / ".claude-plugin" / "marketplace.json"

CODEX_MARKETPLACE_META = {
    "name": "agent-workspace-local",
    "interface": {
        "displayName": "Zzy Local Plugins",
    },
}

CLAUDE_MARKETPLACE_META = {
    "name": "zzy-local",
    "owner": {
        "name": "zzy",
    },
    "metadata": {
        "description": "Local Claude Code marketplace for agent-workspace shared plugins.",
    },
}

MANIFEST_KEYS = ("name", "version", "description", "keywords", "skills")
DEFAULT_CATEGORY_CODEX = "Productivity"
DEFAULT_CATEGORY_CLAUDE = "productivity"


@dataclass(frozen=True)
class PluginMetadata:
    directory_name: str
    manifest: dict


def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SystemExit(f"Missing required file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Invalid JSON in {path}: {exc}") from exc


def discover_plugin_dirs() -> list[Path]:
    plugin_dirs: list[Path] = []
    for path in sorted(PLUGIN_ROOT.iterdir()):
        if not path.is_dir():
            continue
        if path.name.startswith("."):
            continue
        if path.name == "scripts":
            continue
        plugin_dirs.append(path)
    return plugin_dirs


def load_plugin(plugin_dir: Path) -> PluginMetadata:
    codex_manifest_path = plugin_dir / ".codex-plugin" / "plugin.json"
    claude_manifest_path = plugin_dir / ".claude-plugin" / "plugin.json"

    codex_manifest = load_json(codex_manifest_path)
    claude_manifest = load_json(claude_manifest_path)

    for key in MANIFEST_KEYS:
        if codex_manifest.get(key) != claude_manifest.get(key):
            raise SystemExit(
                f"Manifest mismatch for plugin '{plugin_dir.name}' on key '{key}': "
                f"{codex_manifest_path} != {claude_manifest_path}"
            )

    manifest_name = codex_manifest.get("name")
    if manifest_name != plugin_dir.name:
        raise SystemExit(
            f"Plugin directory '{plugin_dir.name}' must match manifest name '{manifest_name}'"
        )

    return PluginMetadata(directory_name=plugin_dir.name, manifest=codex_manifest)


def build_codex_marketplace(plugins: list[PluginMetadata]) -> dict:
    return {
        **CODEX_MARKETPLACE_META,
        "plugins": [
            {
                "name": plugin.manifest["name"],
                "source": {
                    "source": "local",
                    "path": f"./{plugin.directory_name}",
                },
                "policy": {
                    "installation": "AVAILABLE",
                    "authentication": "ON_INSTALL",
                },
                "category": DEFAULT_CATEGORY_CODEX,
            }
            for plugin in plugins
        ],
    }


def build_claude_marketplace(plugins: list[PluginMetadata]) -> dict:
    return {
        **CLAUDE_MARKETPLACE_META,
        "plugins": [
            {
                "name": plugin.manifest["name"],
                "source": f"./{plugin.directory_name}",
                "description": plugin.manifest["description"],
                "category": DEFAULT_CATEGORY_CLAUDE,
                "keywords": plugin.manifest.get("keywords", []),
            }
            for plugin in plugins
        ],
    }


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    plugin_dirs = discover_plugin_dirs()
    plugins = [load_plugin(plugin_dir) for plugin_dir in plugin_dirs]

    if not plugins:
        raise SystemExit(f"No plugins found under {PLUGIN_ROOT}")

    codex_marketplace = build_codex_marketplace(plugins)
    claude_marketplace = build_claude_marketplace(plugins)

    write_json(CODEX_MARKETPLACE_PATH, codex_marketplace)
    write_json(CLAUDE_MARKETPLACE_PATH, claude_marketplace)

    print(f"Wrote {CODEX_MARKETPLACE_PATH.relative_to(PLUGIN_ROOT)}")
    print(f"Wrote {CLAUDE_MARKETPLACE_PATH.relative_to(PLUGIN_ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

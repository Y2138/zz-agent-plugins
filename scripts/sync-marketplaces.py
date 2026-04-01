#!/usr/bin/env python3

from __future__ import annotations

import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
CODEX_MARKETPLACE_PATH = REPO_ROOT / ".agents" / "plugins" / "marketplace.json"
CLAUDE_MARKETPLACE_PATH = REPO_ROOT / ".claude-plugin" / "marketplace.json"

CODEX_MARKETPLACE_META = {
    "name": "zz-agent-plugins",
    "description": "A dual-platform local plugin marketplace for Codex and Claude Code, focused on reusable agent workflows and productivity tooling.",
    "interface": {
        "displayName": "ZZ Agent Plugins Marketplace",
        "shortDescription": "Dual-platform marketplace for reusable Codex and Claude Code plugins.",
        "longDescription": "This marketplace distributes local plugins from the zz-agent-plugins repository. Each plugin is maintained with matching Codex and Claude Code manifests so the same workflow can be installed consistently across both platforms.",
    },
}

CLAUDE_MARKETPLACE_META = {
    "name": "zz-agent-plugins",
    "owner": {
        "name": "zz",
    },
    "metadata": {
        "description": "Local Claude Code marketplace for zz-agent-plugins.",
    },
}

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


def discover_plugin_dirs() -> list[Path]:
    plugin_dirs: list[Path] = []
    for path in sorted(REPO_ROOT.iterdir()):
        if not path.is_dir():
            continue
        if path.name.startswith("."):
            continue
        if path.name == "scripts":
            continue
        if not (path / ".codex-plugin" / "plugin.json").is_file():
            continue
        if not (path / ".claude-plugin" / "plugin.json").is_file():
            continue
        plugin_dirs.append(path)
    return plugin_dirs


def load_plugin_manifest_pair(plugin_dir: Path) -> dict:
    codex_manifest_path = plugin_dir / ".codex-plugin" / "plugin.json"
    claude_manifest_path = plugin_dir / ".claude-plugin" / "plugin.json"
    codex_manifest = load_json(codex_manifest_path)
    claude_manifest = load_json(claude_manifest_path)

    manifest_name = codex_manifest.get("name")
    if manifest_name != plugin_dir.name:
        raise SystemExit(
            f"Plugin directory '{plugin_dir.name}' must match manifest name '{manifest_name}'"
        )

    for key in MANIFEST_PARITY_KEYS:
        if codex_manifest.get(key) != claude_manifest.get(key):
            raise SystemExit(
                f"Manifest mismatch for plugin '{plugin_dir.name}' on key '{key}': "
                f"{codex_manifest_path} != {claude_manifest_path}"
            )

    return codex_manifest


def build_codex_marketplace(plugin_manifests: list[dict]) -> dict:
    return {
        **CODEX_MARKETPLACE_META,
        "plugins": [
            {
                "name": manifest["name"],
                "displayName": manifest.get("interface", {}).get("displayName", manifest["name"]),
                "description": manifest["description"],
                "source": {
                    "source": "local",
                    "path": f"./{manifest['name']}",
                },
                "policy": {
                    "installation": "AVAILABLE",
                    "authentication": "ON_INSTALL",
                },
                "category": manifest.get("interface", {}).get("category", "Productivity"),
                "keywords": manifest.get("keywords", []),
            }
            for manifest in plugin_manifests
        ],
    }


def build_claude_marketplace(plugin_manifests: list[dict]) -> dict:
    return {
        **CLAUDE_MARKETPLACE_META,
        "plugins": [
            {
                "name": manifest["name"],
                "source": f"./{manifest['name']}",
                "description": manifest["description"],
                "category": manifest.get("interface", {}).get("category", "Productivity").lower(),
                "keywords": manifest.get("keywords", []),
            }
            for manifest in plugin_manifests
        ],
    }


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    plugin_dirs = discover_plugin_dirs()
    if not plugin_dirs:
        raise SystemExit(f"No plugins found under {REPO_ROOT}")

    manifests = [load_plugin_manifest_pair(plugin_dir) for plugin_dir in plugin_dirs]

    write_json(CODEX_MARKETPLACE_PATH, build_codex_marketplace(manifests))
    write_json(CLAUDE_MARKETPLACE_PATH, build_claude_marketplace(manifests))

    print(f"Wrote {CODEX_MARKETPLACE_PATH.relative_to(REPO_ROOT)}")
    print(f"Wrote {CLAUDE_MARKETPLACE_PATH.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

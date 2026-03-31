# 插件工作区

`plugins/` 是本地插件的唯一事实来源，这些插件需要同时支持 Codex 和 Claude Code。

## 目录结构

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

## 约定

- 所有插件都放在 `plugins/<plugin-name>/` 下。
- 每个插件都必须同时包含 `plugins/<plugin-name>/.codex-plugin/plugin.json` 和 `plugins/<plugin-name>/.claude-plugin/plugin.json`。
- 可编辑的元数据以插件 manifest 为准，包括 `name`、`version`、`description`、`keywords`、`skills`。
- 不要手动编辑 `.agents/plugins/marketplace.json` 和 `.claude-plugin/marketplace.json`，它们都是生成文件。
- 新增插件、删除插件或修改插件元数据后，都需要重新生成 marketplace 文件。

## 安装

假设这个仓库被 clone 到：

```bash
~/code/plugins
```

先执行生成与校验：

```bash
cd ~/code/plugins
python3 scripts/sync-marketplaces.py
python3 scripts/validate-plugins.py
```

### Codex

Codex 的安装方式必须是“合并”，不能直接替换已有 marketplace。

使用 [codex-plugin-add.md](/Users/staff/Documents/agent-workspace/plugins/codex-plugin-add.md) 作为给 Codex agent 的安装指令文档。

Codex agent 应先读取当前仓库里的：

```text
~/code/plugins/.agents/plugins/marketplace.json
```

然后将其中的插件条目合并到：

- `~/.agents/plugins/marketplace.json`，用于用户维度安装
- `<repo_root>/.agents/plugins/marketplace.json`，用于仓库维度安装

合并规则是“保留原有插件，只新增或更新同名条目”，不能覆盖无关插件。

### Claude Code

Claude Code 也应采用“添加 marketplace”而不是覆盖文件的方式安装：

```bash
/plugin marketplace add ~/code/plugins/.claude-plugin/marketplace.json
```

这种方式会把当前仓库的 marketplace 作为一个新的来源加入 Claude Code，不会覆盖已有插件来源。

### 更新流程

后续拉取仓库更新后，执行：

```bash
cd ~/code/plugins
git pull
python3 scripts/sync-marketplaces.py
python3 scripts/validate-plugins.py
```

## 维护流程

在仓库根目录执行：

```bash
python3 scripts/sync-marketplaces.py
python3 scripts/validate-plugins.py
```

`sync-marketplaces.py` 会扫描仓库根目录下的插件目录，校验 Codex/Claude manifest 的关键字段是否一致，并生成：

- `.agents/plugins/marketplace.json`
- `.claude-plugin/marketplace.json`

`validate-plugins.py` 会检查：

- 每个插件是否同时存在两端 manifest
- 两端 manifest 的关键元数据是否一致
- marketplace 中的插件路径是否都能解析到真实目录
- marketplace 中的插件列表是否和实际插件目录一一对应

## 独立仓库说明

这个目录就是一个可独立维护的插件仓库形态。插件 marketplace 和插件源码都放在仓库内部，因此可以单独 clone、单独维护，而不依赖父工作区的目录结构。

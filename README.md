# zz-agent-plugins

双端兼容的插件仓库，所有插件支持 Codex 和 Claude Code；Specz 额外提供 Pi Coding Agent 原生 package 与 extension。

## 仓库结构

```
zz-agent-plugins/
├── .agents/plugins/marketplace.json    # Codex 插件市场入口
├── .claude-plugin/marketplace.json     # Claude Code 插件市场入口
├── package.json                         # Pi package 入口（当前暴露 Specz）
├── specz/                              # Specz 插件目录
├── prd-designz/                        # PRD 设计与 UI 原型插件目录
├── media-prompt/                       # Media Prompt 插件目录
├── codex-plugin-add.md                 # Codex 安装说明
└── README.md                           # 本文件
```

## 插件说明

- **specz**: 文档驱动的规范工作流插件，包含规划、执行、验证和自动运行技能
- **prd-designz**: 产品设计与 UI 原型插件，包含新项目设计规格原型、存量项目 UI skill 生成、项目规范原型生成能力
- **media-prompt**: 媒体提示插件，用于生成和处理媒体相关的提示和内容

## 安装方法

### Codex

1. 复制需要的插件目录到项目根目录
2. 复制 `.agents/plugins/marketplace.json` 到项目的 `.agents/plugins/` 目录
3. 参考 `codex-plugin-add.md` 获取详细安装步骤

### Claude Code

```
/plugin marketplace add https://github.com/Y2138/zz-agent-plugins
```

### Pi Coding Agent（Specz）

直接从代码仓库安装：

```bash
pi install git:github.com/Y2138/zz-agent-plugins
```

这会向 Pi 的既有 package 列表新增本仓库，不会覆盖其他 package 或设置。项目级安装在命令末尾添加 `-l`。完整的本地安装、临时试运行、验证、重载和卸载说明见 `specz/README.md`。

## 核心特性

- **双平台支持**: 同时兼容 Codex 和 Claude Code
- **Pi 原生适配**: Specz 可作为 Pi package 加载，共享同一组 skills，并通过轻量 extension 注入工作流提醒
- **项目级别安装**: 支持在项目中独立使用
- **结构化工作流**: 提供规范的规划、执行、验证流程
- **版本化规范包**: 支持版本化的规范文档管理

## 许可证

MIT

# zz-agent-plugins

双端兼容的插件仓库，所有插件同时支持 Codex 和 Claude Code；Specz 与 Specx 也可作为 Pi Coding Agent skills 使用。

## 仓库结构

```text
zz-agent-plugins/
├── .agents/plugins/marketplace.json    # Codex 插件市场入口
├── .claude-plugin/marketplace.json     # Claude Code 插件市场入口
├── package.json                        # Pi package 入口
├── specz/                              # 高能力模型的轻量状态协议
├── specx/                              # 轻量模型的完整规范工作流
├── prd-designz/                        # PRD 设计与 UI 原型插件
├── html-agent/                        # 本地多页 HTML 只读问答助手
├── media-prompt/                       # 媒体提示插件
├── codex-plugin-add.md                 # Codex 合并安装说明
└── README.md
```

## 插件说明

- **specz**：面向高能力编码模型。普通任务直接执行，只在恢复、协作、审批或审计确有收益时维护单文件状态账本；需要人读评审材料时按固定模板生成《评审说明》。
- **specx**：面向需要更多流程约束的轻量模型。保留 clarify、plan、run、archive 等完整阶段和结构化 artifacts。
- **prd-designz**：产品设计与 UI 原型插件，包含新项目设计规格原型、存量项目 UI skill 生成和项目规范原型生成能力。
- **html-agent**：为授权目录中的多个本地 HTML 提供页面内问答、资料搜索与修改建议，不修改文件。运行方式见 `html-agent/README.md`。
- **media-prompt**：生成和处理媒体相关提示与内容。

## 如何选择

| 模型与任务 | 推荐插件 |
|---|---|
| 高能力模型，任务可在当前上下文完成 | `specz`，走直接执行路径 |
| 高能力模型，需要跨会话、多智能体、审批或审计 | `specz`，启用检查点或治理路径 |
| 高能力模型，需要将方案沉淀为人读评审材料 | `specz-brief`，按固定模板生成《评审说明》 |
| 轻量模型，需要明确阶段、模板和验证闭环 | `specx` |

## 安装方法

### Codex

按 `codex-plugin-add.md` 复制所选插件目录，并将对应 marketplace 条目合并到项目配置。不要覆盖已有 marketplace。

### Claude Code

```text
/plugin marketplace add https://github.com/Y2138/zz-agent-plugins
```

### Pi Coding Agent

从仓库安装两个 skill 树：

```bash
pi install git:github.com/Y2138/zz-agent-plugins
```

根 package 不注入全局 workflow reminder。需要 Specx reminder extension 时，单独安装 `specx/` 目录；项目级安装在命令末尾添加 `-l`。

## 共同约束

- 双端 manifest 的关键元数据保持一致。
- 插件源码位于仓库根目录一级目录。
- marketplace 通过合并方式安装，不覆盖用户已有配置。
- Spec bundle 的目录名和正文使用中文。

## 许可证

MIT

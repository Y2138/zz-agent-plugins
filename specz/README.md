# Specz 插件

当前版本：`0.2.0`

文档驱动的规范工作流插件，具有独立的执行和验证代理、有限的修复循环和版本化的规范包。

## 概述

Specz 帮助代理执行文档驱动的任务，通过有限的修复循环支持明确的工作流程。它通过专门的技能提供了结构化的规划、设计、实现和验证方法，并在执行阶段支持基于任务依赖的多 agent 并行实现。`design.md` 不要求固定图集，而是要求用最适合的问题表达方式把实现方向讲清楚。

## 0.2.0 更新

- `specz-add` 已升级并重命名为 `specz-plan`
- 新增按需的 `design.md` 阶段，后续阶段会将其作为正式输入读取并遵守
- `design.md` 的表达方式改为按问题选择最佳形式，不再默认强制输出 Mermaid 图
- 前端 `UI 布局` 优先使用 ASCII，数据流、时序、状态流优先使用 Mermaid，接口契约优先使用表格和 JSON 示例
- `specz-exec` 支持在依赖安全和写入范围可控时，将无依赖任务分配给不同 subagent 并行执行

## 技能

- **specz-plan**：规划阶段技能，用于创建或更新活动规范包，先定义权威的 spec.md，再按需补充与代码库强相关的 design.md，并据此生成任务
- **specz-exec**：执行阶段技能，读取并遵守 `spec.md` 与 `design.md`，并可将无依赖任务分配给不同 subagent 并行执行
- **specz-verify**：验证阶段技能，独立验证实现是否同时满足 `spec.md` 与 `design.md`
- **specz-auto-run**：编排技能，通过独立的代理上下文链接执行和验证，并允许执行阶段在安全前提下并行化任务

## 目录结构

```
specz/
├── .claude-plugin/      # Claude Code 插件清单
├── .codex-plugin/       # Codex 插件清单
├── skills/              # 技能定义
│   ├── specz-plan/      # 规划技能
│   │   └── references/  # design 工作流参考
│   ├── specz-exec/      # 执行技能
│   ├── specz-verify/    # 验证技能
│   └── specz-auto-run/  # 编排技能
└── README.md            # 本文件
```

## 安装

### 对于 Codex

1. 将 `specz` 目录复制到项目根目录
2. 将 `.agents/plugins/marketplace.json` 复制到项目的 `.agents/plugins/` 目录
3. 使用 `codex-plugin-add.md` 中的安装说明获取详细步骤

### 对于 Claude Code

使用市场添加命令：

```
/plugin marketplace add https://github.com/Y2138/zz-agent-plugins/tree/main/specz
```

## 使用方法

1. **规划**：使用 `specz-plan` 为任务创建新的规范包，并在需要时补充开发细节设计
2. **执行**：使用 `specz-exec` 读取 `spec.md`、`design.md`、`tasks.md` 后执行任务；无依赖任务可以交给不同 subagent 并行完成
3. **验证**：使用 `specz-verify` 独立验证实现是否满足需求与设计约束
4. **自动运行**：使用 `specz-auto-run` 进行有限的执行/验证循环，并在适合时触发执行阶段并行化

## 规范包结构

每个规范包包含：
- `spec.md`：权威的范围、要求和验收标准
- `design.md`：按需提供、用于指导实现方向的轻量设计文档，重点关注设计模式、模块职责、数据流、状态管理、接口形态与必要的 UI 结构；表达形式可按问题选择 Mermaid、ASCII、表格、JSON 示例或结构化列表
- `tasks.md`：从 `spec.md` 与 `design.md` 联合派生的实现任务
- `checklist.md`：从验收标准派生的可观察结果
- `test-cases.md`：独立的验证证据

当 `design.md` 存在时，`specz-exec`、`specz-verify`、`specz-auto-run` 都必须读取、理解并遵守它。

`design.md` 的常见表达建议：
- `UI 布局`：优先 ASCII 布局草图或层级列表
- `数据流 / 时序 / 状态`：优先 Mermaid
- `接口契约 / schema / model`：优先 Markdown 表格、字段清单和 JSON 示例
- `模块职责`：优先结构化列表，必要时再补轻量依赖图

## 约束

- **双平台支持**：同时适用于 Codex 和 Claude Code
- **仅规划**：`specz-plan` 仅用于规划与实现准备阶段，不进行产品代码更改
- **按需设计**：只有在任务需要仓库级实现决策时才补充 `design.md`，避免重复项目既有规范；各章节都按需添加
- **表达方式按问题选择**：`design.md` 需要的是足够清晰的指导表达，而不是固定格式图集
- **设计约束贯穿全流程**：当 `design.md` 存在时，后续所有阶段都必须将其视为正式输入并遵守
- **多 agent 执行**：`specz-exec` 可并行执行无依赖任务，但必须遵守依赖关系、文件所有权和 `tasks.md` 同步规则
- **独立代理上下文**：执行和验证技能在不同的代理上下文中运行
- **有限循环**：自动运行在 3 轮执行-验证后停止
- **规范权威**：spec.md 是范围和验收的唯一真实来源

## 许可证

MIT

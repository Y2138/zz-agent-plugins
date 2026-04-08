# Specz 插件

当前版本：`0.5.0`

文档驱动的规范工作流插件，具有独立的执行和验证代理、有限的修复循环，以及基于任务 summary 的规范包。

## 概述

Specz 帮助代理执行文档驱动的任务，通过有限的修复循环支持明确的工作流程。它通过专门的技能提供结构化的规划、设计、实现和验证方法，并在执行阶段支持基于任务依赖的多 agent 并行实现。主 skill 保持可直接阅读执行，详细参考文档只承接必要的补充说明。`design.md` 不要求固定图集，而是要求用最适合的问题表达方式把实现方向讲清楚。

## 0.4.0 更新

- `specz-plan` 的 design 阶段整合了 brainstorming 与 design workflow，减少跨文档跳转
- 在写 `design.md` 前，先结合项目上下文做简短的提问与方案比较，再收敛到最终方案
- 主 skill 保持可直接执行，参考文档只承接设计阶段的必要补充

## 0.3.0 更新

- 新增 `specz-archive`，用于将完成或部分完成的 bundle 归档为单文件工作记录，并删除原始 bundle
- 归档文档以实际完成结果为准，保留精简后的需求摘要、最终设计结论、验证结果与剩余事项
- 归档文件名采用可扫描的代表性命名，便于快速识别本次任务涉及内容

## 0.2.0 更新

- `specz-add` 已升级并重命名为 `specz-plan`
- 新增按需的 `design.md` 阶段，后续阶段会将其作为正式输入读取并遵守
- `design.md` 的表达方式改为按问题选择最佳形式，不再默认强制输出 Mermaid 图
- 前端 `UI 布局` 优先使用 ASCII，数据流、时序、状态流优先使用 Mermaid，接口契约优先使用表格和 JSON 示例
- `specz-exec` 支持在依赖安全和写入范围可控时，将无依赖任务分配给不同 subagent 并行执行

## 技能

- **specz-plan**：规划阶段技能，用于创建或更新活动规范包，先定义权威的 spec.md，再按需进入包含简短方案比较的 design 阶段，并据此生成任务
- **specz-exec**：执行阶段技能，读取并遵守 `spec.md` 与 `design.md`，并可将无依赖任务分配给不同 subagent 并行执行
- **specz-verify**：验证阶段技能，独立验证实现是否同时满足 `spec.md` 与 `design.md`
- **specz-archive**：归档阶段技能，将 bundle 压缩为单文件工作记录，并删除原始 bundle 文档
- **specz-auto-run**：编排技能，通过独立的代理上下文链接执行和验证，并允许执行阶段在安全前提下并行化任务

## 目录结构

```
specz/
├── .claude-plugin/      # Claude Code 插件清单
├── .codex-plugin/       # Codex 插件清单
├── skills/              # 技能定义
│   ├── specz-plan/      # 规划技能
│   │   └── references/  # design 工作流参考与图示模板
│   ├── specz-exec/      # 执行技能
│   ├── specz-verify/    # 验证技能
│   ├── specz-archive/   # 归档技能
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

1. **规划**：使用 `specz-plan` 为任务创建或复用以任务 summary 命名的规范包；当需要 design 时，先做简短提问和方案比较，再补充开发细节设计
2. **执行**：使用 `specz-exec` 读取 `spec.md`、`design.md`、`tasks.md` 后执行任务；无依赖任务可以交给不同 subagent 并行完成
3. **验证**：使用 `specz-verify` 独立验证实现是否满足需求与设计约束
4. **归档**：使用 `specz-archive` 将本次 workflow 归档为单文件总结，并删除原始 bundle
5. **自动运行**：使用 `specz-auto-run` 进行有限的执行/验证循环；完成后可再交给 `specz-archive` 收尾

## 规范包结构

每个规范包包含：
- `spec.md`：权威的范围、要求和验收标准
- `design.md`：按需提供、用于指导实现方向的轻量设计文档，重点关注设计模式、模块职责、数据流、状态管理、接口形态与必要的 UI 结构；表达形式可按问题选择 Mermaid、ASCII、表格、JSON 示例或结构化列表
- `tasks.md`：从 `spec.md` 与 `design.md` 联合派生的实现任务
- `checklist.md`：从验收标准派生的可观察结果
- `test-cases.md`：独立的验证证据

归档完成后，原始 bundle 会被删除，只保留一个单文件 archive 记录。archive 是 workflow 历史记录，不作为未来代码变更后的持续参考文档。bundle 与 archive 默认都使用本次任务 summary 的 slug 命名，不再使用 `_vN` 版本后缀。

当 `design.md` 存在时，`specz-exec`、`specz-verify`、`specz-auto-run` 都必须读取、理解并遵守它。

`design.md` 的常见表达建议：
- `UI 布局`：优先 ASCII 布局草图或层级列表
- `数据流 / 时序 / 状态`：优先 Mermaid
- `接口契约 / schema / model`：优先 Markdown 表格、字段清单和 JSON 示例
- `模块职责`：优先结构化列表，必要时再补轻量依赖图

在 `design.md` 之前，`specz-plan` 会先做一次简短的设计收敛：
- 先结合项目上下文判断是否需要向用户补问关键澄清问题
- 非 trivial 变更先比较多个可行实现方向
- 结合当前代码库的复用点、模块边界和复杂度进行判断
- 选出最适合当前仓库的一种设计方向，再进入 `design.md`

## 约束

- **双平台支持**：同时适用于 Codex 和 Claude Code
- **仅规划**：`specz-plan` 仅用于规划与实现准备阶段，不进行产品代码更改
- **按需设计**：只有在任务需要仓库级实现决策时才补充 `design.md`，避免重复项目既有规范；各章节都按需添加
- **先提问和比较再设计**：当 design 阶段存在时，应先结合上下文补齐关键澄清问题；非 trivial 变更再比较多个可行实现方向，然后收敛成最终设计
- **表达方式按问题选择**：`design.md` 需要的是足够清晰的指导表达，而不是固定格式图集
- **设计约束贯穿全流程**：当 `design.md` 存在时，后续所有阶段都必须将其视为正式输入并遵守
- **多 agent 执行**：`specz-exec` 可并行执行无依赖任务，但必须遵守依赖关系、文件所有权和 `tasks.md` 同步规则
- **单文件归档**：`specz-archive` 会把 bundle 压缩成单文件工作记录，并删除原始 workflow 文档
- **独立代理上下文**：执行和验证技能在不同的代理上下文中运行
- **有限循环**：自动运行在 3 轮执行-验证后停止
- **规范权威**：spec.md 是范围和验收的唯一真实来源

## 许可证

MIT

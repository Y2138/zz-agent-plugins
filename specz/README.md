# Specz 插件

当前版本：`1.4.1`

Specz 是面向 Codex、Claude Code 与 Pi Coding Agent 的高效轻量规范驱动工程 workflow 插件。它只面向非平凡 coding development work：代码/运行时行为、测试、bug、CI、重构、schema、API、迁移、infra 或继续已有 Specz bundle。它用 `spec.md` 作为行为基线，通过 `specz-flow` 自动选择当前 bundle 和下一阶段，在减少用户手动决断和 agent 上下文负担的同时提高执行闭环效率。

## 1.4.1 更新

- **Runtime 中立性修复**：移除 `specz-run` 中硬编码的 `gpt-5.4` 子 agent 模型指定，改为厂商中立措辞——这是双端兼容（Codex + Claude Code）的强制约束，原措辞在 Claude Code（Sonnet/Opus/Haiku）下会派发不存在的模型
- **Archive 输出契约对齐**：`specz-archive` 新增机器可读 `Output` 块，与 `specz-flow` 的 stage-handoff 契约一致，让归档结果可被下游解析（`Status: archived | blocked`）

## 1.4.0 更新

- **执行闭环收紧**：`specz-run` 在写 `Status: PASS` 前必须完成 `PASS Audit`，逐条核对 `SPEC-SCENARIO-*` 证据、任务完成度、证据新鲜度和临时件清理；audit 失败按缺口类型分流（实现缺口 / 证据缺口 / scope 矛盾）
- **子 agent 输出契约**：`specz-run` 要求子 agent 返回固定结构（状态 / 改动文件 / 命令 / 证据 / 疑虑 / 建议下一步）；`DONE` 仅表示声称执行完，不等于 PASS；长报告不得贴回主上下文，后续子 agent 不接收历史任务累计总结
- **并行安全**：`[P]` 任务必须声明 `Parallel safety`（`Write set` / `Shared state` / `Conflict risk` / `Fallback`）；plan lint 检查 Write set 重叠；`specz-run` 派并行前再做一次 overlap check
- **澄清提问更准**：需求存在设计分叉时一次只问一个问题，且每个问题必须带推荐答案
- **归档候选**：`specz-archive` 归档模板新增结构化 `Learning Candidates`（验证 gotcha / 代码质量教训），默认 `none`
- **计划预检**：plan lint 增加计划内部矛盾检查和“计划要求了 reviewer 会判为缺陷的内容”检查
- 不新增阶段、不新增 skill

## 1.3.0 更新

- 使用 Darwin Skill 完整流程复评并优化 Specz：覆盖测试 prompt 设计、双 judge baseline、bounded optimization、复评和 ratchet 决策。
- 为六个 Specz skills 增加 `test-prompts.json`，覆盖 happy path、歧义路径和关键失败路径。
- 强化 `specz-flow` 状态判定：新增状态权威顺序、决策例子和固定输出模板。
- 强化 `specz-clarify`：新增 Failure Modes 表和“不该问什么”的硬边界。
- 记录 Darwin 结果到 `results.tsv`，并生成结果卡片。
- 按 ratchet 规则回滚未严格胜出的 archive 输出契约尝试，只保留已证明增益。

## 1.2.0 更新

- 新增 **阶段加载交接协议**：`specz-flow` 只负责路由，进入 `specz-clarify`、`specz-plan`、`specz-brief`、`specz-run` 或 `specz-archive` 前必须加载对应阶段 skill。
- 各阶段 skill 新增 Activation Gate，防止 agent 只凭 `specz-flow` 流程执行阶段职责。
- 更新 hook reminder 和接入说明，强调路由后必须加载阶段 skill。
- 修正接入说明中的 skill 数量，包含 `specz-brief` 在内共六个 Specz skills。

## 1.1.0 更新

- 新增 **specz-flow** 作为 coding 工作入口：通过 Entry Gate 后才扫描 `specs/*/`，选择或创建 bundle，并路由到下一阶段
- 新增 SessionStart hook reminder：新会话开始时轻量提示 agent 只对非平凡 coding 任务考虑 `specz-flow`
- 合并 `specz-exec`、`specz-verify`、`specz-auto-run` 为 **specz-run**
- 移除独立 `specz-status`；状态由 bundle 内文件即时判断，不维护 `清单.md`
- `specz-clarify` 增加自查式澄清纪律：先按需读取项目上下文；当目标、范围、验收或优先级不清时，先向用户提问并等待确认
- `design.md` 按需出现；一旦出现，必须包含简洁的 Existing Code Analysis 表格
- `specz-plan` 增强影响面分析，覆盖入口、依赖方、既有模式与可验证表面
- `specz-plan` 完成非小任务规划后列出关键设计、任务和验证点，方便用户 review 并按需调整
- 新增可选 **specz-brief**：在 plan 后、run 前按需生成面向产品、研发、测试共读的 `brief.md`
- `tasks.md` 支持轻量任务类型标签：`new`、`fix`、`refactor`、`test`、`verify-repair`
- `verification.md` 可按风险纳入架构质量证据，例如范围、边界、契约、状态流和 blast radius
- 小任务仍可从 `spec.md` 直接进入 `specz-run`
- 验证保持独立：执行可在子上下文完成，最终验证必须由主上下文完成

## 技能

- **specz-flow**：主入口，选择 active bundle 并路由到 clarify / plan / run / archive
- **specz-clarify**：生成或更新行为规格 `spec.md`，完成规模分流
- **specz-plan**：为非小任务生成最小充分规划产物：可选 `design.md`、`tasks.md`、`verification.md`；完成后输出 review 摘要
- **specz-brief**：可选步骤，将 planned bundle 转成给产品、研发、测试共读的 `brief.md`
- **specz-run**：执行、独立验证，并最多进行 3 轮修复闭环
- **specz-archive**：归档通过验证的 bundle

## 进入边界

默认进入 Specz：

- 代码或运行时行为变更
- 测试、bug、CI failure、回归修复
- 重构、schema、API、权限、迁移、infra
- 继续、验证或归档已有 Specz bundle

默认不进入 Specz，直接处理：

- README、docs、guide、example、changelog、安装说明等文档编辑
- `SKILL.md`、agent prompt、hook reminder、marketplace、plugin metadata 等 skill/prompt 文本编辑
- 纯设计探索、原型、产品审查、研究、咨询或总结

如果任务看起来介于 coding 和 docs/skill 编辑之间，先问用户是否要走 Specz；不要先创建 bundle。

## 使用流程

优先使用：

```text
specz-flow
```

`specz-flow` 会根据 bundle 文件判断下一步：

0. Entry Gate 不通过：不创建/继续 bundle，直接处理或交给更合适的 skill。

1. 没有 `spec.md` 或规格待澄清：交给 `specz-clarify`
2. `Size: small` 且无需规划：交给 `specz-run`
3. `Size: standard | large` 且缺少规划产物：交给 `specz-plan`
4. 规划产物已存在，且用户明确要求简报/评审材料/对齐文档：交给 `specz-brief`
5. 有未完成任务或验证未通过：交给 `specz-run`
6. 验证已通过：交给 `specz-archive`

### 阶段加载交接

`specz-flow` 是路由器，不是阶段执行器。它输出下一阶段后，agent 必须加载对应阶段 skill 的 `SKILL.md`，并按该阶段的 Activation Gate、Must、Workflow 和 checkpoints / gates 执行。

交接输出必须包含：

```text
Required next skill: specz-run
Load required: yes
Stage work allowed from specz-flow: no
If unavailable: stop and report missing stage skill
```

如果平台无法加载目标阶段 skill，agent 必须停止并报告缺失 skill，不能只凭 `specz-flow` 的状态判断继续写规格、规划、改代码、验证或归档。

## Bundle Artifacts

- `spec.md`：WHAT/WHY。行为、范围、业务规则和验收事实源
- `design.md`：HOW。按需出现；包含影响设计的 existing-code analysis
- `tasks.md`：DO。standard/large 的执行 checklist
- `verification.md`：PROVE。standard/large 的证据计划和最新验证结果
- `brief.md`：READ。可选的人读简报；服务产品、研发、测试对齐，不作为执行依据

不维护全局 `清单.md`。新会话从 `specs/*/` 的 bundle 文件恢复状态。

## spec.md

```markdown
# [Feature Name] Spec

> Source: [PRD path/link | user request | mixed]
> Size: small | standard | large
> Status: draft | planned | running | verifying | passed | blocked
> Priority: P0 | P1 | P2 | P3
> Created: YYYY-MM-DD
> Updated: YYYY-MM-DD
> Related archives: [short list or none]

## Context
## Scope
## Business Rules
## Requirements
### SPEC-REQ-01: ...
#### SPEC-SCENARIO-01: ...
## Acceptance Criteria
## Assumptions / Open Questions
```

`spec.md` 不写文件路径、API 字段、storage key、组件/函数名、实现顺序或测试命令。

`specz-clarify` 提问前会按需自查项目上下文，优先自己解决事实性问题；当范围、行为、验收、优先级或任务规模不清时，先向用户提出 1-3 个阻塞性问题并等待确认。非阻塞解释写成 `ASSUMPTION-*`；会改变最终结果的问题不能用 assumption 跳过。

## Size Routing

按命中的最高协调复杂度或风险分级，不按文件数或改动行数分级：

- `small`：单一行为目标、低风险、现有模式明确，不需要任务拆分或设计决策，可从 `spec.md` 直接执行；允许同一种修改分布在多个文件中
- `standard`：需要任务拆分、多个独立模块协调、存在有意义的实现决策，或有中等回归风险
- `large`：存在高风险的跨系统或契约协调、持久化或迁移、权限、兼容/回滚要求，或影响用户关键路径

例如，给多个遵循相同模式的表单组件增加同一个简单字段仍可判为 `small`；如果同时需要协调 API 契约，通常升级为 `standard`；如果涉及数据迁移、权限或兼容处理，则升级为 `large`。

## design.md

`design.md` 只在需要减少执行猜测时出现。一旦出现，必须包含：

```markdown
# Implementation Design

## Existing Code Analysis
| Surface | Location | Role | Callers / Dependents | Existing Pattern | Handling |
|---|---|---|---|---|---|
| ... | `path/or/module` | ... | ... | ... | reuse \| extend \| build new \| leave unchanged \| remove |
```

要求：

- 只记录影响设计决策的代码表面
- 对 standard/large 工作，按需覆盖入口、依赖方、既有模式、边界和可验证表面
- 优先复用或扩展现有能力
- `build new` 需要有明确理由

## tasks.md

```markdown
# Tasks

> Design: `design.md` | skipped; [reason]

- [ ] TASK-01 [P] [new|fix|refactor|test|verify-repair] [Concrete task title]
  - Covers: SPEC-SCENARIO-01
  - Design: DESIGN-DECISION-01 | none
  - Files: `path/or/module`
  - Parallel safety: [required when [P]]
    - Write set: `files/this/task/writes`
    - Shared state: none | list
    - Conflict risk: low | medium | high
    - Fallback: run after TASK-XX if overlap is found
  - Done when: ...
```

`[P]` 任务必须声明 `Parallel safety`，两个 `[P]` 任务的 `Write set` 不得重叠；触碰共享面（schema/迁移/配置/公共 API/持久化/权限）的任务默认不并行，或拆出串行 integration task。

`fix` 和 `verify-repair` 任务需要尽量保留失败信号、根因假设和回归证据；验证失败产生的修复任务使用 `verify-repair`。

## verification.md

```markdown
# Verification Plan

## Matrix
| Evidence | Covers Spec | Covers Tasks | Method | Type |
|---|---|---|---|---|
| VERIFY-01 | SPEC-SCENARIO-01 | TASK-01 | test/browser/API/manual | positive |

## Latest Verification Result
- Status: NOT RUN
```

## brief.md

`brief.md` 是可选产物，只在用户要求简报、评审材料、对齐文档或面向产品/研发/测试的说明时生成。它帮助人快速理解需求功能点、关键流程、设计结论、覆盖面、边界和风险。

`brief.md` 不替代 `spec.md`、`design.md`、`tasks.md` 或 `verification.md`，也不阻塞 `specz-run`。

默认位置：

```text
specs/<summary-name>/brief.md
```

`specz-brief` 可按需要使用自身 `references/design-focus.md` 和图示模板来选择表达方式。静态 UI 布局使用 ASCII，不使用 Mermaid。

## 约束

- 双平台 manifest 和 marketplace 元数据保持一致
- hook reminder 只做新会话提示，不做写文件 guard、提交检查或自动流程执行
- Specz flow 只用于非平凡 coding development work；docs-only、skill/prompt 编辑、纯设计、研究、咨询默认不进入
- `specz-flow` 只负责路由；阶段工作必须在对应阶段 skill 加载后执行
- bundle 名和 Specz artifact 内容使用用户/项目的自然语言
- `spec.md` 是行为权威
- `specz-clarify` 先自查上下文；存在阻塞性歧义时必须先问并等待用户确认
- `design.md` 按需出现，但出现时必须有 existing-code analysis
- `tasks.md` 是 planned work 的执行面
- `tasks.md` 使用轻量任务类型标签，不拆分新的执行阶段
- `verification.md` 是 planned work 的证据面
- `brief.md` 是可选的人读对齐文档，不作为执行依据
- standard/large 的验证按风险选择架构质量证据，不默认堆满 checklist
- 非小任务规划完成后输出 review 摘要，用户可要求调整设计、任务或验证计划
- `specz-run` 最多 3 轮执行/验证修复
- 执行和验证保持角色隔离，最终验证由主上下文完成
- 验证后测试文件如非必要直接删除，避免测试膨胀

## 安装

Codex：合并 `.agents/plugins/marketplace.json`，不要覆盖用户已有 marketplace。

Codex hook reminder：支持插件根目录 `specz/hooks.json`；如目标 Codex 环境未自动加载插件 hooks，将 `specz/hooks/codex-hooks.json` 合并到项目 `.codex/hooks.json`，不要覆盖已有 hooks。

Claude Code：

```text
/plugin marketplace add https://github.com/Y2138/zz-agent-plugins/tree/main/specz
```

Claude Code 会通过插件内 `hooks/hooks.json` 加载 SessionStart reminder。

Pi Coding Agent：

```bash
# 直接从代码仓库安装到用户级配置
pi install git:github.com/Y2138/zz-agent-plugins

# 或从已 clone 的仓库安装 Specz 目录
pi install /absolute/path/to/zz-agent-plugins/specz

# 项目级安装：在 install 命令末尾添加 -l
pi install /absolute/path/to/zz-agent-plugins/specz -l
```

安装命令只向 Pi 的既有 package 列表添加来源，不会覆盖其他 package 或设置。直接安装代码仓库时，根目录 Pi package 会加载 `specz/extensions/` 和现有 `specz/skills/`；安装 `specz/` 子目录时，Pi 使用同名约定目录发现相同资源。

不写入配置的临时试运行：

```bash
pi -e /absolute/path/to/zz-agent-plugins/specz
```

验证与重新加载：

```bash
pi list
pi config
```

`pi list` 应显示已安装来源，`pi config` 应能看到一个 Specz extension 与六个 Specz skills。交互会话中输入 `/reload` 可重新加载自动发现的资源；输入 `/skill:specz-flow` 可显式展开入口 skill。Pi extension 只在每次 agent 任务开始前幂等追加 Specz reminder，不注册工具或命令，不拦截工具调用，也不写项目文件。

按原安装来源卸载，不要编辑或覆盖整个 Pi 配置：

```bash
pi remove git:github.com/Y2138/zz-agent-plugins
pi remove /absolute/path/to/zz-agent-plugins/specz

# 若使用项目级安装，在 remove 命令末尾同样添加 -l
```

不支持插件机制的 agent：让 agent 阅读 `AI-AGENT-INTEGRATION.md`，按其所在平台的 skills、hooks 或 agent 指令文件机制自行接入。

## 许可证

MIT

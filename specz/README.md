# Specz 插件

当前版本：`1.0.0`

Specz 是面向 Codex 与 Claude Code 的高效轻量规范驱动工程 workflow 插件。它用 `spec.md` 作为行为基线，通过 `specz-flow` 自动选择当前 bundle 和下一阶段，在减少用户手动决断和 agent 上下文负担的同时提高执行闭环效率。

## 1.0.0 更新

- 新增 **specz-flow** 作为高效轻量默认入口：扫描 `specs/*/`，选择或创建 bundle，并路由到下一阶段
- 新增 SessionStart hook reminder：新会话开始时轻量提示 agent 对非平凡开发任务优先考虑 `specz-flow`
- 合并 `specz-exec`、`specz-verify`、`specz-auto-run` 为 **specz-run**
- 移除独立 `specz-status`；状态由 bundle 内文件即时判断，不维护 `清单.md`
- `specz-clarify` 增加自查式澄清纪律：先按需读取项目上下文，再提出少量阻塞性问题
- `design.md` 按需出现；一旦出现，必须包含简洁的 Existing Code Analysis 表格
- `specz-plan` 增强影响面分析，覆盖入口、依赖方、既有模式与可验证表面
- `specz-plan` 完成非小任务规划后列出关键设计、任务和验证点，方便用户 review 并按需调整
- `tasks.md` 支持轻量任务类型标签：`new`、`fix`、`refactor`、`test`、`verify-repair`
- `verification.md` 可按风险纳入架构质量证据，例如范围、边界、契约、状态流和 blast radius
- 小任务仍可从 `spec.md` 直接进入 `specz-run`
- 验证保持独立：执行可在子上下文完成，最终验证必须由主上下文完成

## 技能

- **specz-flow**：主入口，选择 active bundle 并路由到 clarify / plan / run / archive
- **specz-clarify**：生成或更新行为规格 `spec.md`，完成规模分流
- **specz-plan**：为非小任务生成最小充分规划产物：可选 `design.md`、`tasks.md`、`verification.md`；完成后输出 review 摘要
- **specz-run**：执行、独立验证，并最多进行 3 轮修复闭环
- **specz-archive**：归档通过验证的 bundle

## 使用流程

优先使用：

```text
specz-flow
```

`specz-flow` 会根据 bundle 文件判断下一步：

1. 没有 `spec.md` 或规格待澄清：交给 `specz-clarify`
2. `Size: small` 且无需规划：交给 `specz-run`
3. `Size: standard | large` 且缺少规划产物：交给 `specz-plan`
4. 有未完成任务或验证未通过：交给 `specz-run`
5. 验证已通过：交给 `specz-archive`

## Bundle Artifacts

- `spec.md`：WHAT/WHY。行为、范围、业务规则和验收事实源
- `design.md`：HOW。按需出现；包含影响设计的 existing-code analysis
- `tasks.md`：DO。standard/large 的执行 checklist
- `verification.md`：PROVE。standard/large 的证据计划和最新验证结果

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

`specz-clarify` 提问前会按需自查项目上下文，优先自己解决事实性问题；只向用户提出影响范围、行为、验收、优先级或任务规模的阻塞性问题。非阻塞解释写成 `ASSUMPTION-*`，阻塞问题写成 `QUESTION-*` 并说明原因。

## Size Routing

- `small`：局部、低风险、行为明确，可从 `spec.md` 直接执行
- `standard`：多文件/多模块、需要任务拆分或有中等回归风险
- `large`：跨系统、契约、持久化、迁移、权限或用户关键路径

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
  - Done when: ...
```

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

## 约束

- 双平台 manifest 和 marketplace 元数据保持一致
- hook reminder 只做新会话提示，不做写文件 guard、提交检查或自动流程执行
- bundle 名和 Specz artifact 内容使用用户/项目的自然语言
- `spec.md` 是行为权威
- `specz-clarify` 先自查上下文，再问少量阻塞性问题
- `design.md` 按需出现，但出现时必须有 existing-code analysis
- `tasks.md` 是 planned work 的执行面
- `tasks.md` 使用轻量任务类型标签，不拆分新的执行阶段
- `verification.md` 是 planned work 的证据面
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

## 许可证

MIT

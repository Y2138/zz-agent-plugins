# Specz 插件

当前版本：`0.9.0`

Specz 是面向 Codex 与 Claude Code 的高效轻量规范驱动工程 workflow 插件。它用 `spec.md` 作为行为基线，通过 `specz-flow` 自动选择当前 bundle 和下一阶段，在减少用户手动决断和 agent 上下文负担的同时提高执行闭环效率。

## 0.9.0 更新

- 新增 **specz-flow** 作为高效轻量默认入口：扫描 `specs/*/`，选择或创建 bundle，并路由到下一阶段
- 合并 `specz-exec`、`specz-verify`、`specz-auto-run` 为 **specz-run**
- 移除独立 `specz-status`；状态由 bundle 内文件即时判断，不维护 `清单.md`
- `design.md` 按需出现；一旦出现，必须包含简洁的 Existing Code Analysis 表格
- 小任务仍可从 `spec.md` 直接进入 `specz-run`
- 验证保持独立：执行可在子上下文完成，最终验证必须由主上下文完成

## 技能

- **specz-flow**：主入口，选择 active bundle 并路由到 clarify / plan / run / archive
- **specz-clarify**：生成或更新行为规格 `spec.md`，完成规模分流
- **specz-plan**：为非小任务生成最小充分规划产物：可选 `design.md`、`tasks.md`、`verification.md`
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

## Size Routing

- `small`：局部、低风险、行为明确，可从 `spec.md` 直接执行
- `standard`：多文件/多模块、需要任务拆分或有中等回归风险
- `large`：跨系统、契约、持久化、迁移、权限或用户关键路径

## design.md

`design.md` 只在需要减少执行猜测时出现。一旦出现，必须包含：

```markdown
# Implementation Design

## Existing Code Analysis
| Surface | Location | Current Capability | Handling |
|---|---|---|---|
| ... | `path/or/module` | ... | reuse \| extend \| build new \| leave unchanged \| remove |
```

要求：

- 只记录影响设计决策的代码表面
- 优先复用或扩展现有能力
- `build new` 需要有明确理由

## tasks.md

```markdown
# Tasks

> Design: `design.md` | skipped; [reason]

- [ ] TASK-01 [P] [Concrete task title]
  - Covers: SPEC-SCENARIO-01
  - Design: DESIGN-DECISION-01 | none
  - Files: `path/or/module`
  - Done when: ...
```

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
- bundle 名和 Specz artifact 内容使用用户/项目的自然语言
- `spec.md` 是行为权威
- `design.md` 按需出现，但出现时必须有 existing-code analysis
- `tasks.md` 是 planned work 的执行面
- `verification.md` 是 planned work 的证据面
- `specz-run` 最多 3 轮执行/验证修复
- 执行和验证保持角色隔离，最终验证由主上下文完成
- 验证后测试文件如非必要直接删除，避免测试膨胀

## 安装

Codex：合并 `.agents/plugins/marketplace.json`，不要覆盖用户已有 marketplace。

Claude Code：

```text
/plugin marketplace add https://github.com/Y2138/zz-agent-plugins/tree/main/specz
```

## 许可证

MIT

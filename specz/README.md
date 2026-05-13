# Specz 插件

当前版本：`0.8.0`

Specz 是面向 Codex 与 Claude Code 的规范驱动工程 workflow 插件。它用 `spec.md` 作为行为基线，并按任务大小决定是否进入完整规划、执行、验证和归档流程。

## 0.8.0 更新

- `requirements.md` 不再作为独立 artifact；行为规格统一进入 `spec.md`
- `specz-clarify` 负责创建/更新 `spec.md`，并标记 `Size: small | standard | large`
- 小任务可直接从 `spec.md` 进入执行，不强制生成 `design.md/tasks.md/verification.md`
- standard/large 任务由 `specz-plan` 生成 `tasks.md`、`verification.md`，并按需生成 `design.md`
- `design.md` 改为按需实现合同，只在复杂度、影响范围或实现决策需要时出现
- `tasks.md` 使用 `TASK-*`，关键任务包含 `Covers`、`Design`、`Files`、`Done when`
- `verification.md` 使用 `VERIFY-*` evidence，覆盖 spec 场景和关键任务

## 技能

- **specz-clarify**：澄清行为规格，输出 `spec.md` 并完成大小分流
- **specz-plan**：为非小任务生成最小充分规划产物：可选 `design.md`、`tasks.md`、`verification.md`
- **specz-exec**：执行 small `spec.md` 或 planned `TASK-*`
- **specz-verify**：独立验证实现，必要时通过 `tasks.md` 回写修复
- **specz-auto-run**：最多 3 轮 `exec -> verify -> exec`
- **specz-status**：只读报告 bundle 状态
- **specz-archive**：归档完成或部分完成的 bundle

## 使用流程

1. 使用 `specz-clarify` 生成 `spec.md`
2. 如果 `Size: small`，直接交给 `specz-exec`
3. 如果 `Size: standard | large`，交给 `specz-plan`
4. 执行后用 `specz-verify` 验证
5. 需要闭环时用 `specz-auto-run`
6. 完成后用 `specz-archive`

## Bundle Artifacts

- `spec.md`：WHAT/WHY。行为、范围、业务规则和验收事实源
- `design.md`：HOW。按需出现，用于复杂实现决策
- `tasks.md`：DO。standard/large 的执行 checklist
- `verification.md`：PROVE。standard/large 的证据计划和最新验证结果

## spec.md

```markdown
# [Feature Name] Spec

> Source: [PRD path/link | user request | mixed]
> Size: small | standard | large
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

## Planning Lint

`specz-plan` 结束前只检查适用项：

- `spec.md` 无实现细节
- `tasks.md` 可直接执行
- `verification.md` 映射 spec 场景和关键 task
- 如果有 `design.md`，它引用真实代码库表面且没有悬空分支
- 如果跳过 `design.md`，`tasks.md` 说明原因

## 安装

Codex：合并 `.agents/plugins/marketplace.json`，不要覆盖用户已有 marketplace。

Claude Code：

```text
/plugin marketplace add https://github.com/Y2138/zz-agent-plugins/tree/main/specz
```

## 约束

- 双平台 manifest 和 marketplace 元数据保持一致
- `spec.md` 是行为权威
- `design.md` 按需出现
- `tasks.md` 是 planned work 的执行面
- `verification.md` 是 planned work 的证据面
- 执行和验证保持角色隔离

## 许可证

MIT

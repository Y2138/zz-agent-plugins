# Specz 插件

文档驱动的规范工作流插件，具有独立的执行和验证代理、有限的修复循环和版本化的规范包。

## 概述

Specz 帮助代理执行文档驱动的任务，通过有限的修复循环支持明确的工作流程。它通过专门的技能提供了结构化的规划、实现和验证方法。

## 技能

- **specz-add**：规划阶段技能，用于创建或更新活动规范包并定义权威的 spec.md
- **specz-exec**：执行阶段技能，用于实现活动包中的任务
- **specz-verify**：验证阶段技能，用于独立验证活动包
- **specz-auto-run**：编排技能，通过独立的代理上下文链接执行和验证

## 目录结构

```
specz/
├── .claude-plugin/      # Claude Code 插件清单
├── .codex-plugin/       # Codex 插件清单
├── skills/              # 技能定义
│   ├── specz-add/       # 规划技能
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

1. **规划**：使用 `specz-add` 为任务创建新的规范包
2. **执行**：使用 `specz-exec` 实现规范中定义的任务
3. **验证**：使用 `specz-verify` 验证实现
4. **自动运行**：使用 `specz-auto-run` 进行有限的执行/验证循环

## 规范包结构

每个规范包包含：
- `spec.md`：权威的范围、要求和验收标准
- `tasks.md`：从规范派生的实现任务
- `checklist.md`：从验收标准派生的可观察结果
- `test-cases.md`：独立的验证证据

## 约束

- **双平台支持**：同时适用于 Codex 和 Claude Code
- **仅规划**：`specz-add` 仅用于规划阶段，不进行产品代码更改
- **独立代理上下文**：执行和验证技能在不同的代理上下文中运行
- **有限循环**：自动运行在 3 轮执行-验证后停止
- **规范权威**：spec.md 是范围和验收的唯一真实来源

## 许可证

MIT

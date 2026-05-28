# Specz AI Agent 接入说明

本文档供 AI agent 阅读和执行。目标是在不依赖 Codex / Claude Code 插件机制的情况下，把 Specz skills 和轻量 reminder 接入到当前 agent 平台。

如果当前平台已经支持本仓库的插件格式，优先使用插件安装方式；只有在平台不支持插件、但支持 skills / hooks / 指令文件时，才使用本文档。

## 接入目标

完成后，agent 应能做到：

- 发现并调用 `specz-flow`、`specz-clarify`、`specz-plan`、`specz-run`、`specz-archive`
- 在新会话或开发任务开始时收到 Specz reminder
- 若平台不支持 hooks，则从可识别的 agent 指令文件中获得同等约束
- 不覆盖用户已有 skills、hooks、AGENTS.md、SYSTEM.md 或其他平台指令

## 先识别平台能力

开始前先判断当前 agent 平台支持哪些机制：

1. 是否支持 skill 目录或 skill 注册机制
2. 是否支持会话开始、任务开始或类似生命周期 hooks
3. 若不支持 hooks，是否读取项目级 `AGENTS.md`、`SYSTEM.md` 或其他固定指令文件
4. 是否有专门的配置合并规则、manifest、索引文件或缓存刷新命令

只使用当前平台明确支持的机制。无法确认时，读取平台文档或当前项目已有配置；不要猜测并覆盖用户文件。

## 安装 Skills

Specz skills 位于本插件目录的 `skills/` 下：

```text
specz/skills/specz-flow/SKILL.md
specz/skills/specz-clarify/SKILL.md
specz/skills/specz-plan/SKILL.md
specz/skills/specz-run/SKILL.md
specz/skills/specz-archive/SKILL.md
```

如果当前平台支持目录式 skills：

1. 找到该平台要求的项目级或用户级 skills 目录
2. 将 `specz/skills/` 下的五个 skill 目录复制到目标 skills 目录
3. 保留每个目录内的 `SKILL.md` 文件名和 front matter
4. 如果目标目录已存在同名 skill，只更新 Specz 同名 skill，不删除其他 skills
5. 若平台需要刷新 skill 索引或重载会话，按平台要求执行

如果当前平台支持 manifest 注册而不是直接复制目录：

1. 使用平台规定的注册格式指向上述五个 skill
2. 保留每个 skill 的 `name` 与 `description`
3. 注册时按名称合并，不覆盖无关 skill 条目
4. 注册后确认 `specz-flow` 是默认入口或最容易被发现的入口

如果当前平台完全不支持 skills：

1. 不要把五个 `SKILL.md` 机械拼接进系统提示
2. 优先把本文档和 `specz/README.md` 提供给该 agent 的长期上下文或项目知识库
3. 在 agent 指令文件中加入“优先阅读并遵循 Specz skills 文档”的约束
4. 明确指出 `specz-flow` 是非平凡开发任务的入口

## 安装 Hook Reminder

Specz 的 hook 只做新会话提示，不做文件写入 guard、提交检查或自动执行。

标准 reminder 内容为：

```text
Specz reminder: use specz-flow only for non-trivial coding development work: code/runtime changes, tests, bugs, CI failures, refactors, schemas, APIs, migrations, infra, or resuming an existing Specz bundle. Do not use Specz for docs-only edits, skill/prompt edits, design-only work, critique, research, or consultation unless the user explicitly asks for Specz. If scope or acceptance is unclear, ask before creating a bundle.
```

如果当前平台支持会话开始或任务开始 hook：

1. 选择最接近 `SessionStart` 的生命周期事件
2. 将上述 reminder 作为该事件注入给 agent 的附加上下文
3. 若平台支持命令式 hook，可复用 `specz/hooks/specz-flow-reminder.sh`
4. 若平台要求 JSON 配置，可参考：
   - `specz/hooks.json`
   - `specz/hooks/codex-hooks.json`
   - `specz/hooks/hooks.json`
5. 合并 hook 配置时只新增 Specz reminder，不删除或改写其他 hooks

## Hooks 不可用时的降级

如果当前平台不支持 hooks，则把 reminder 写入该 agent 实际会读取的项目级指令文件。

选择文件时按以下顺序决策：

1. 如果平台明确读取 `AGENTS.md`，写入 `AGENTS.md`
2. 否则如果平台明确读取 `SYSTEM.md`，写入 `SYSTEM.md`
3. 否则使用平台文档指定的项目级 instruction 文件
4. 如果无法确认任何指令文件，停止并向用户说明缺少可识别的约束入口

追加以下约束，不要覆盖原有内容：

```markdown
## Specz

Use `specz-flow` only for non-trivial coding development work: code/runtime changes, tests, bugs, CI failures, refactors, schemas, APIs, migrations, infra, or resuming an existing Specz bundle. Do not use Specz for docs-only edits, skill/prompt edits, design-only work, critique, research, or consultation unless the user explicitly asks for Specz. If scope or acceptance is unclear, ask before creating a bundle.
```

如果目标文件已经存在等价 Specz 约束，不要重复添加；如需更新，只替换 Specz 小节。

## 保守合并规则

执行接入时必须遵守：

- 先读取目标文件，再修改
- 只新增或更新 Specz 相关条目
- 不覆盖用户已有 marketplace、skills、hooks、指令文件或平台配置
- 不删除无关插件、skills、hooks 或说明
- 不把用户级全局配置作为默认目标，除非用户明确要求
- 保留 `specz/.codex-plugin/plugin.json` 与 `specz/.claude-plugin/plugin.json`，不要破坏双端插件能力

## 验证

接入完成后执行以下检查：

1. 当前平台能发现五个 Specz skills
2. `specz-flow` 可作为入口被调用或被 agent 明确识别
3. 支持 hooks 的平台能在会话开始或任务开始时注入 reminder
4. 不支持 hooks 的平台，其 `AGENTS.md`、`SYSTEM.md` 或等价指令文件包含 Specz 约束
5. 原有非 Specz 配置仍然存在

若任一检查失败，只修复对应接入点；不要重装或覆盖整个配置。

## Codex 与 Claude Code

Codex 与 Claude Code 仍优先使用插件方式接入：

- Codex：按仓库 `codex-plugin-add.md` 合并 marketplace 与可选 hook
- Claude Code：使用 `/plugin marketplace add https://github.com/Y2138/zz-agent-plugins/tree/main/specz`

本文档主要服务于不支持插件机制的 agent。

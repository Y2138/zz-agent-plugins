# Pi Coding Agent 适配归档

- 来源 bundle：`specs/pi-coding-agent适配/`
- 归档日期：`2026-07-14`

## 请求摘要

- 基于 Pi Coding Agent 最新官方扩展与包规范，为 Specz 增加原生 package、extension 和安装说明，同时保持 Codex 与 Claude Code 现有能力不变。

## 已完成内容

- 新增仓库级 Pi package 入口，直接代码仓库加载时只暴露一个 Specz extension 与现有六个阶段技能。
- 新增任务前 extension，幂等追加 Specz 路由提醒；不注册工具、命令、界面或持久化，不拦截工具调用，也不写用户项目。
- 将现有 hook 输出收敛到共享提醒 JSON；shell hook 原样输出该资源，Pi extension 解析同一资源中的提醒正文。
- 增加 Pi 的 Git、本地、项目级、临时试运行、验证、重新加载和卸载说明，所有安装操作均为新增来源而非覆盖配置。

## 最终设计说明

- 仓库根 package 支持直接 Git 加载，`specz/` 的约定目录结构同时支持从本地子目录加载，两种方式引用同一 extension 与技能树。
- extension 只订阅任务前事件；当前系统提示已包含完整提醒时不返回修改，避免同一次上下文重复累加。
- package 明确采用 ESM，并把 Pi Coding Agent 核心包声明为开放范围的对等依赖；没有新增第三方运行时依赖。

## 历史设计理由

- 共享 JSON 保留了现有 SessionStart hook 的完整输出契约，又让 Pi extension 无需维护第二份提醒常量，减少三端语义漂移。
- Pi 的任务前系统提示扩展点比会话可见通知更贴近现有 hook 的目标：为 agent 提供路由上下文，而不改变用户交互或工具行为。

## 可追溯性

- `SPEC-SCENARIO-01`、`SPEC-SCENARIO-02` -> `TASK-01`、`TASK-04` -> `VERIFY-01`、`VERIFY-06`
- `SPEC-SCENARIO-03` 至 `SPEC-SCENARIO-06` -> `TASK-01` -> `VERIFY-02`、`VERIFY-03`
- `SPEC-SCENARIO-07`、`SPEC-SCENARIO-08` -> `TASK-02`、`TASK-03` -> `VERIFY-04`、`VERIFY-05`

## 验证摘要

- Pi Coding Agent `0.80.6` 从仓库根 package 与本地 `specz/` package 均成功加载；重复运行无注册错误。
- extension 通过严格 TypeScript 无输出编译和行为 mock：只注册一个任务前事件，首次追加一次提醒，已有提醒时不重复，且无需界面上下文。
- 六个技能名称唯一且完整；npm dry-run 包含 package、extension、共享提醒和入口技能。
- Codex 与 Claude Code manifest 名称和版本一致；两个 marketplace、三份 hook 与共享提醒输出回归通过。
- `git diff --check` 通过，临时 mock、依赖目录和锁文件均已清理。

## 学习候选

- 项目记忆候选：Pi 可通过一个 package 同时暴露 Specz extension 与原有技能目录，无需复制技能树；来源为 `VERIFY-01`、`VERIFY-06`。
- 验证陷阱：Pi 的 jiti 运行时能加载未明确声明 ESM 的 TypeScript extension，但严格 TypeScript 编译会拒绝其中的 `import.meta`；来源为首次类型检查失败与 `TASK-04` 修复。
- 代码质量经验：跨平台提醒应保留单一运行时数据源，并分别用平台适配层消费，避免文案副本漂移；来源为共享提醒回归验证。

## 剩余说明

- 无未完成任务或修复项。
- 公共 npm 发布不在本次范围内；当前交付支持代码仓库、本地目录和临时加载。

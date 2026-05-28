# Specz 变更日志

本文件根据仓库 `git log`、双端插件 manifest 和 `specz` 目录历史整理，记录从初始版本到当前版本的整体演进路径。

当前最新版本：`1.1.0`

## 版本路径

`0.1.0` -> `0.2.0` -> `0.5.0` -> `0.5.1` -> `0.6.0` -> `0.6.1` -> `0.6.2` -> `0.6.3` -> `0.8.0` -> `0.9.0` -> `1.0.0` -> `1.1.0`

> 说明：仓库历史中没有独立的 `0.3.x`、`0.4.x`、`0.7.x` 版本节点；上述跳号按 manifest 中实际出现的版本号保留。

## 1.1.0 - 2026-05-28

来源提交：`e05cb7f` `feat(specz): refine workflow and add brief stage`

- 新增 `specz-brief` 阶段，用于在 plan 后、run 前按需生成面向产品、研发、测试共读的 `brief.md`。
- 新增 `AI-AGENT-INTEGRATION.md`，为不支持插件机制的 agent 提供接入说明。
- 将图示模板从 plan 阶段迁移到 brief 阶段，明确 brief 是人读对齐材料，不替代执行依据。
- 优化 `specz-flow` 入口边界，强调只面向非平凡 coding development work，文档、prompt、skill 文本、纯设计和咨询类任务默认不进入 Specz。
- 强化 `specz-plan` 的影响面分析与 review 输出，要求规划完成后列出关键设计、任务和验证点。
- 更新 hook reminder 文案，使新会话提示更贴近当前入口边界。

## 1.0.0 - 2026-05-26

来源提交：`85fcc39` `feat(specz): release 1.0.0 workflow updates`

- 发布 1.0.0 工作流版本，描述更新为 disciplined clarification、impact-aware planning、traceable tasks、verification evidence、bounded run loops 与 archive history。
- 新增插件 hook 文件，包括 Codex 与 Claude Code 的 SessionStart reminder。
- 更新安装说明，补充 hook reminder 的接入方式。
- 增强 `specz-clarify`、`specz-plan`、`specz-run` 的阶段纪律，强化澄清、规划和验证闭环。
- 双端 marketplace 和插件 manifest 同步升级到 `1.0.0`。

## 0.9.0 - 2026-05-25

来源提交：`d51ead5` `feat(specz): streamline 0.9 workflow`

- 新增主入口 `specz-flow`，由它选择 active bundle 并路由到 clarify、plan、run 或 archive。
- 合并并替换旧执行链路：删除 `specz-auto-run`、`specz-exec`、`specz-verify`，新增统一的 `specz-run`。
- 删除独立 `specz-status`，改为从 bundle 内文件即时判断状态，不维护全局状态镜像。
- 删除旧 plan 参考 workflow 文件，收敛规划阶段的上下文负担。
- 将技能集合收敛为 `specz-archive`、`specz-clarify`、`specz-flow`、`specz-plan`、`specz-run`。
- README 更新为轻量 flow-router 模型，突出任务规模路由、可选设计、验证证据和有界运行闭环。

## 0.8.0 - 2026-05-13

来源提交：`1d88a26` `feat(specz): 升级到0.8.0版本，重构spec工作流`

- 引入 `specz-clarify`，把需求澄清和 `spec.md` 行为规格基线独立出来。
- 引入 `specz-status`，用于当时的生命周期状态检查。
- 将工作流扩展为按任务规模路由：小任务可直接执行，标准或大型任务进入规划。
- 强化 optional design、traceable tasks、verification evidence、bounded repair loops 和 archive history 的整体模型。
- 大幅重写 README 与各阶段 SKILL，推动 Specz 从早期文档驱动流程转向更完整的规格驱动生命周期。

## 0.6.3 - 2026-04-30

来源提交：`e4e77fa` `feat(specz): 增加验证计划文件并完善任务来源标识`

- 增强规划阶段，加入 `verification.md` 证据计划的概念。
- 完善任务来源标识，让任务与规格、设计和验证来源的关系更可追踪。
- 调整 auto-run、exec、verify 阶段，使执行和验证更贴近计划中的证据矩阵。
- 双端 manifest 从 `0.6.2` 升级到 `0.6.3`。

## 0.6.2 - 2026-04-13

来源提交：`6bfcc70` `chore: 更新插件版本至0.6.2并调整设计流程`

- 调整 `specz-plan` 的设计流程，减少对外部设计 workflow 参考的依赖。
- 更新 README 中的版本说明。
- 双端 manifest 从 `0.6.1` 升级到 `0.6.2`。

## 0.6.1 - 2026-04-08

来源提交：`1729660` `chore: 更新插件版本至0.6.1并移除specs的git排除规则`

- 移除对 `specs` 的 git 排除规则，使规格 bundle 可以进入版本控制。
- 微调 `specz-plan` 说明。
- README 补充版本说明。
- 双端 manifest 从 `0.6.0` 升级到 `0.6.1`。

## 0.6.0 - 2026-04-08

来源提交：`bba2b06` `feat: 更新 specz 插件至 0.6.0 版本`

- 扩展 `specz-plan` 设计阶段，新增多类设计模板：frontend、backend、fullstack、api-integration。
- 调整归档、自动运行、执行、规划、验证阶段的职责描述。
- 重写 design workflow 参考，使设计阶段更贴近不同工程形态。
- README 更新为 0.6 工作流说明。
- 双端 manifest 从 `0.5.1` 升级到 `0.6.0`。

## 0.5.1 - 2026-04-08

来源提交：`2c0c69c` `fix: 更新插件版本至0.5.1并优化SKILL.md格式`

- 修复 `specz-plan` 的 SKILL.md 格式问题。
- 双端 manifest 从 `0.5.0` 升级到 `0.5.1`。

## 0.5.0 - 2026-04-08

来源提交：`e5f3fe9` `feat(specz): 更新插件至0.5.0版本并新增归档功能`

- 新增 `specz-archive`，为通过验证的 bundle 提供归档阶段。
- 新增 archive workflow 参考文档。
- 插件描述从 versioned spec bundles 调整为 summary-named spec bundles，强调 bundle 使用摘要命名。
- 更新 auto-run、exec、plan、verify 阶段以接入归档后的闭环。
- marketplace 与双端 manifest 同步升级到 `0.5.0`。

## 0.2.0 - 2026-04-07

来源提交：`d220f1d` `feat(specz): evolve planning and execution workflow`

- 将插件版本从 `0.1.0` 升级到 `0.2.0`。
- 演进规划和执行工作流，强化计划、执行、验证之间的职责划分。
- 扩展 `specz-plan`，加入多类图示模板：架构、组件、数据流、ER、时序、状态机、UI 交互流、UI 布局和 API 合约。
- 调整 README 和各阶段 SKILL，继续完善设计驱动执行的路径。

## 0.1.0 - 2026-03-31

来源提交：`7002fcf` `feat: plugin init`

- 初始化插件仓库与 Specz 插件。
- 创建 Codex 与 Claude Code 双端 manifest，初始版本均为 `0.1.0`。
- 创建初始 marketplace、安装说明和验证脚本。
- 初始技能集合为 `add`、`auto-run`、`exec`、`verify`。
- 初始定位是文档驱动的 spec workflow，包含独立执行与验证 agent、有界修复循环和版本化 spec bundle。

### 0.1.0 阶段的非版本号变更

这些提交没有提升 manifest 版本号，但构成从初始版本走向 `0.2.0` 的早期演进：

- `df7e4f5` `refactor(插件系统): 重构插件仓库结构和技能命名`：将插件目录移动到仓库根目录，技能目录统一增加 `specz-` 前缀。
- `23d3492` `docs: 更新插件配置和文档`：新增 Specz README，并更新插件配置、owner 和安装说明。
- `63c0797` `feat(specz): 重构规划阶段为specz-plan并增强设计工作流`：将 `specz-add` 重构为 `specz-plan`，新增 `design.md` 支持，并要求执行、验证、自动运行阶段遵守设计产物。

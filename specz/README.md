# Specz 插件

当前版本：`0.6.0`

文档驱动的规范工作流插件，具有独立的开发与测试代理、基于 `tasks.md` 的有限修复循环，以及基于任务 summary 的规范包。

## 概述

Specz 帮助代理执行文档驱动的任务，通过开发与测试角色隔离、`exec -> verify -> exec` 的有限修复循环，以及基于 `tasks.md` 的共享执行面，支持明确的工作流程。它通过专门的技能提供结构化的规划、设计、实现和验证方法，并在执行阶段支持基于任务依赖的多 agent 并行实现。主 skill 保持可直接阅读执行，详细参考文档只承接必要的补充说明。`design.md` 现在按端生成执行指导，不再把前端、后端、API 集成的约束混在同一套结构里。

## 0.6.1 更新
- 不再把 specs 从 git 排除

## 0.6.0 更新

- 明确 `specz-exec` 与 `specz-verify` 的角色隔离：前者负责开发与修复，后者负责测试、issue 和回归判断
- `tasks.md` 成为 exec / verify loop 的唯一共享执行面；verify 通过回写任务状态和补充任务驱动下一轮修复
- 移除 `checklist.md`
- 不再使用 `test-cases.md`
- 不再使用 `issues.md`
- design 阶段补充 DDD 要求：后端或领域复杂变更需要显式进行领域数据模型设计
- design workflow 改为按端路由，分别使用 frontend / backend / api-integration / fullstack 模板生成执行指导

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

- **specz-plan**：规划阶段技能，用于创建或更新活动规范包，先定义权威的 `spec.md`，再按需进入按端生成执行指导的 `design.md` 阶段，并据此生成执行任务
- **specz-exec**：执行阶段技能，读取并遵守 `spec.md`、`design.md`、`tasks.md`，并根据 verify 回写的任务状态进行修复；无依赖任务可交给不同 subagent 并行执行
- **specz-verify**：验证阶段技能，直接基于 `spec.md` 与 `design.md` 执行验证，并回写 `tasks.md`
- **specz-archive**：归档阶段技能，将 bundle 压缩为单文件工作记录，并删除原始 bundle 文档
- **specz-auto-run**：编排技能，通过独立的代理上下文链接开发与测试，围绕 `tasks.md` 驱动有限的修复循环

## 目录结构

```
specz/
├── .claude-plugin/      # Claude Code 插件清单
├── .codex-plugin/       # Codex 插件清单
├── skills/              # 技能定义
│   ├── specz-plan/      # 规划技能
│   │   └── references/  # design 路由、端模板与图示模板
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

1. **规划**：使用 `specz-plan` 为任务创建或复用以任务 summary 命名的规范包；当需要 design 时，先判断主端，再使用对应模板生成执行指导；后端复杂场景需要明确 DDD 领域模型
2. **执行**：使用 `specz-exec` 读取 `spec.md`、`design.md`、`tasks.md` 后执行任务；优先处理未完成和 verify 回写的任务；无依赖任务可以交给不同 subagent 并行完成
3. **验证**：使用 `specz-verify` 直接基于 `spec.md` 与 `design.md` 独立验证实现，并把问题通过 `tasks.md` 回写给下一轮执行
4. **归档**：使用 `specz-archive` 将本次 workflow 归档为单文件总结，并删除原始 bundle
5. **自动运行**：使用 `specz-auto-run` 进行有限的 `exec -> verify -> exec` 循环；完成后可再交给 `specz-archive` 收尾

## 规范包结构

每个规范包包含：
- `spec.md`：权威的范围、要求和验收标准
- `design.md`：按需提供、用于直接指导后续 agent 执行的轻量设计文档；根据任务主端选择 frontend / backend / api-integration / fullstack 模板，仅保留当前端真正需要的执行约束；后端复杂场景才引入 DDD 领域数据模型设计
- `tasks.md`：从 `spec.md` 与 `design.md` 联合派生的实现任务，也是 exec / verify loop 的共享执行面

归档完成后，原始 bundle 会被删除，只保留一个单文件 archive 记录。archive 是 workflow 历史记录，不作为未来代码变更后的持续参考文档。bundle 与 archive 默认都使用本次任务 summary 的 slug 命名，不再使用 `_vN` 版本后缀。

当 `design.md` 存在时，`specz-exec`、`specz-verify`、`specz-auto-run` 都必须读取、理解并遵守它。

`design.md` 的常见表达建议：
- frontend：组件/页面结构、状态归属、交互规则、执行顺序
- backend：执行路径、模块落点、契约/存储变化，以及按需的 DDD 领域决策
- api-integration：系统边界、契约变化、失败/重试/幂等规则
- fullstack：前后端切片、两端之间的契约、跨端执行顺序

在 `design.md` 之前，`specz-plan` 会先做一次简短的设计收敛：
- 先结合项目上下文判断是否需要向用户补问关键澄清问题
- 先判断任务的主端，再选择对应模板
- 非 trivial 变更先比较多个可行实现方向
- 结合当前代码库的复用点、模块边界和复杂度进行判断
- 选出最适合当前仓库的一种设计方向，再进入 `design.md`

## 约束

- **双平台支持**：同时适用于 Codex 和 Claude Code
- **仅规划**：`specz-plan` 仅用于规划与实现准备阶段，不进行产品代码更改
- **按需设计**：只有在任务需要仓库级实现决策时才补充 `design.md`，避免重复项目既有规范；先按端选模板，再按需保留章节
- **先提问和比较再设计**：当 design 阶段存在时，应先结合上下文补齐关键澄清问题；非 trivial 变更再比较多个可行实现方向，然后收敛成最终设计
- **DDD 后端设计**：后端或领域复杂变更必须明确领域术语、聚合边界、实体和值对象等 DDD 设计
- **按端生成指导**：`design.md` 先区分 frontend / backend / api-integration / fullstack，再生成对应执行指导
- **表达方式按问题选择**：`design.md` 需要的是足够清晰的指导表达，而不是固定格式图集
- **设计约束贯穿全流程**：当 `design.md` 存在时，后续所有阶段都必须将其视为正式输入并遵守
- **多 agent 执行**：`specz-exec` 可并行执行无依赖任务，但必须遵守依赖关系、文件所有权和 `tasks.md` 同步规则
- **单文件归档**：`specz-archive` 会把 bundle 压缩成单文件工作记录，并删除原始 workflow 文档
- **独立代理上下文**：执行和验证技能在不同的代理上下文中运行
- **角色隔离**：`specz-exec` 负责开发与修复，`specz-verify` 负责测试和回归结论
- **单一回写面**：verify 只通过 `tasks.md` 回写缺陷、修复任务和回归结果，不创建额外跟踪文件
- **有限循环**：自动运行在 3 轮执行-验证后停止
- **规范权威**：spec.md 是范围和验收的唯一真实来源

## 许可证

MIT

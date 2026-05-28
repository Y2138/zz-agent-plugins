---
name: project-ui-skill-builder
description: 分析已有产品/应用的 UI 界面，提取设计系统并生成可复用的项目专属原型 skill。从代码仓、截图、运行中的应用、Storybook、设计文档、Figma 引用或 PRD 中提取 UI 技术栈、组件库、Design Token、组件模式、布局规则和交互约定，生成让任何 agent 都能产出符合项目视觉系统的独立 HTML 原型的 skill。触发词：提取设计系统、生成项目原型skill、UI组件提取、设计Token提取、项目UI分析、extract UI、project prototype skill、生成原型skill。
---

# project-ui-skill-builder · 项目 UI 提取与 Skill 生成

从已有项目中提取设计语言，打包成可复用的项目专属原型 skill。本 skill 负责**提取**，不负责直接设计新产品方向。

## 工作流程

### Phase 1 · 收集 UI 证据

1. 检查可用来源：代码、样式配置、CSS 变量、组件源码、截图、运行中的页面、Storybook、设计文档、Figma 链接
2. Tailwind 项目优先尝试解析 resolved Tailwind config，见 `references/extraction-protocol.md`
3. 真实渲染 UI 证据 > 推断的样式值
4. 证据不足时，向用户索取最小补充：截图、关键路由、组件库、样式配置或设计文档

**检查点 1**：确认证据覆盖核心 UI 区域后再进入提取。

### Phase 2 · 提取设计与可复用 UI 资产

1. 走 `references/extraction-protocol.md` 完整协议
2. 捕获：UI 技术栈、组件库、Design Token、组件模式、布局模式、交互模式、文案惯例、显式视觉禁区
3. 识别应生成为 `assets/` 的固定可复用 UI 结构：admin shell、侧边栏、顶栏、导航框架、页面外框、表格工具栏外壳、模态框/抽屉框架、仪表盘网格
4. 每条重要规则标注证据和置信度

### Phase 3 · 生成前确认

写最终 project skill 之前，先展示 UI 证据摘要和提议的 token/组件基线。只问会影响生成结果的决策：冲突 token、不明确的主风格、缺失核心组件、输出位置。

### Phase 4 · 生成 Project Skill

1. 使用 `references/generated-skill-template.md` 模板
2. 生成的 `SKILL.md` 保持简短（agent 友好）
3. 详细项目 UI 规则放 `references/`
4. 稳定的可复用布局/组件脚手架放 `assets/`
5. 包含 consistency checklist，让未来 agent 自我检查原型

### Phase 5 · 小样本验证

1. 走 `references/validation-protocol.md`
2. 用新生成的 skill 做一个小的样本页面
3. 验证产出是否符合提取的项目 UI 基线

**检查点 2**：样本页面通过一致性检查后再交付。

## 默认输出

在用户项目内创建 `<project-name>-prototype/` 文件夹（除非用户指定其他名称或路径）。**禁止**把生成的项目专属 skill 写回 `prd-designz` 插件目录，除非用户明确要求。

推荐生成结构：

```text
<project-name>-prototype/
├── SKILL.md
├── references/
│   ├── design-tokens.md
│   ├── tech-stack.md
│   ├── component-patterns.md
│   ├── layout-patterns.md
│   ├── interaction-patterns.md
│   ├── prototype-rules.md
│   └── consistency-checklist.md
├── examples/
│   ├── DESIGN.md
│   └── prototype.html
└── assets/
    ├── admin_shell.jsx
    ├── sidebar_nav.jsx
    ├── topbar.jsx
    ├── table_page_shell.jsx
    └── reference-screenshots/
```

## 边界约束

- 不为产品发明新的视觉方向
- 矛盾证据不静默合并：记录主规则 + 例外 + 待决问题
- 不承诺从任意项目全自动提取，诚实标注证据质量
- 除非用户要求打包成插件，否则不把生成的 project skill 变成完整 plugin

## References 路由表

| 任务 | 读 |
|---|---|
| 从已有 UI 和技术栈提取什么 | `references/extraction-protocol.md` |
| 如何组织生成的 project skill | `references/generated-skill-template.md` |
| 如何验证生成的 skill | `references/validation-protocol.md` |

## 核心提醒

- **证据优先**：真实渲染 UI > 推断值，证据不足就停下问
- **标注置信度**：每条规则标 high / medium / low
- **先确认再生成**：展示摘要 → 等用户确认 → 再写文件
- **生成到用户项目**：不污染插件目录
- **小样本验证**：生成后跑一个样本页面验证可用性

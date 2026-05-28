# 生成的 Project Skill 模板

生成一个可移植的 skill 文件夹，任何 agent 都能用它产出匹配特定项目 UI 的原型。

## 生成的 `SKILL.md`

保持生成的 `SKILL.md` 简洁：

```markdown
---
name: <project-name>-prototype
description: 生成匹配 <项目名> 已有 UI 系统的 DESIGN.md 和高保真 HTML 原型。当用户要求做新页面、新流程、功能原型、PRD 转 UI mockup、草图转原型或 UI 变体探索时使用，产出须遵循此项目的 Token、组件、布局密度和交互规则。
---

# <项目名> 原型 Skill

使用本 skill 创建匹配 <项目名> 已有产品 UI 的原型。

## 必需上下文

生成原型前先读取：
- `references/design-tokens.md`
- `references/tech-stack.md`
- `references/component-patterns.md`
- `references/layout-patterns.md`
- `references/interaction-patterns.md`
- `references/prototype-rules.md`

若本 skill 在 `assets/` 下有可复用 UI 资产，生成 HTML 前先读取对应资产文件。内联或适配该脚手架，不从文字描述重建固定项目外框。

## 工作流

1. 理解用户的页面或流程需求
2. 若含草图或截图，提取布局意图但不复制不一致的视觉样式
3. 将需求页面映射到最接近的已有项目页面模式
4. 复用匹配的 `assets/` 脚手架作为固定项目外框和页面外壳
5. 使用项目 Token 和组件规则生成 DESIGN.md 或 HTML 原型
6. HTML 产出为单文件独立 `.html`
7. 交付前跑 `references/consistency-checklist.md` 并在浏览器中预览 HTML

## 规则

- 默认复用项目 Token 和组件模式
- 复用生成的 `assets/` 布局或组件脚手架，不手建固定导航、顶栏、页面外壳、模态框、抽屉、表格外壳或仪表盘框架
- 原型优先使用项目原始 UI 技术栈和组件库；仅在原始技术栈无法安全用于独立 HTML 文件时才降级为原生 HTML/CSS/JS
- 仅在已有模式无法表达需求时才扩展
- 产品行为或数据缺失时标注假设
- 不引入项目中不存在的渐变、图标、圆角卡片系统、阴影或营销布局
```

## 需生成的 Reference 文件

### `references/design-tokens.md`

包含：
- 证据摘要
- Token 表（Token、值、角色、证据、置信度）
- 冲突说明和未解决问题

### `references/tech-stack.md`

包含：
- 框架、元框架、语言、样式方案、组件库、图标、图表、表格
- 原始资产来源：字体、图标库、Logo、产品图、插画、静态资源
- 每项检测到的技术的证据和置信度
- 原型指南：如何在单文件 HTML 中近似项目技术栈
- 资产处理指南：关键本地资产内嵌、使用稳定 URL、或提供占位符
- 降级规则：原始技术栈优先，原生 HTML/CSS/JS 次之

### `references/component-patterns.md`

包含：
- 导航、操作、数据展示、输入、遮罩层、反馈状态
- 组件使用规则和反模式
- 有 `assets/` 脚手架支持的组件，链接资产路径并描述槽位/props

### `references/layout-patterns.md`

包含：
- 页面外壳、密度、间距节奏、响应式行为、常见页面原型
- 将可复用外壳映射到生成的资产，如 `assets/admin_shell.jsx`、`assets/table_page_shell.jsx`、`assets/detail_page_shell.jsx`

### `references/interaction-patterns.md`

包含：
- hover/focus/selected/disabled、loading、empty、error、确认、批量操作

### `references/prototype-rules.md`

包含：
- HTML 原型约束：可交付物必须是独立 `.html` 文件，inline CSS/JS，无构建步骤
- 如何将 PRD 或草图映射到项目 UI
- 如何选择和内联生成的 `assets/` 脚手架作为固定项目外框
- 如何在独立文件中使用原始 UI 框架/组件库
- 如何在独立文件中引用原始资产而不出现本地路径断裂
- 何时允许扩展

### `references/consistency-checklist.md`

包含检查项：
- 独立 HTML 预览无 JS 错误加载
- 原始资产已渲染或有显式降级
- Token 使用
- 组件一致性
- 布局密度
- 状态覆盖
- 未引入不支持的新视觉元素
- 假设和置信度标注

## 需生成的 Assets

当稳定的项目 UI 结构应被未来原型直接复用时，生成 `assets/` 文件。这些文件不是文档，是可移植的原型脚手架，类似设备框组件。

Admin 或 SaaS 项目推荐资产：

```text
assets/
├── admin_shell.jsx          # 应用框架：侧栏、顶栏、面包屑、内容槽位
├── sidebar_nav.jsx          # 导航树、active/收起态、图标节奏
├── topbar.jsx               # 搜索、账户菜单、通知、全局操作
├── table_page_shell.jsx     # 筛选、工具栏、表格区、分页、空态/加载槽位
├── detail_page_shell.jsx    # header 摘要、Tab、元数据、侧面板槽位
├── overlay_frames.jsx       # 模态/抽屉框架和操作 footer 模式
└── reference-screenshots/   # 仅用作视觉证据的截图
```

仅生成有证据支持的资产。文件按可复用结构命名，不按一次性页面命名。保持小巧、基于槽位、可直接内联到独立 HTML 原型。包含足够的 CSS/类/Token 以保持布局保真度，但避免硬编码业务内容（中立占位符除外）。

非 React 项目：优先原始框架（可行的独立浏览器构建）；否则用相同文件目的的纯 JS/CSS 脚手架，并在 `references/prototype-rules.md` 中记录降级方案。

## 示例

证据充足时包含：
- `examples/DESIGN.md`：一个有代表性的生成设计规格
- `examples/prototype.html`：一个匹配项目的小页面原型或外壳，有 `assets/` 脚手架时至少复用一个

证据不足时，仅在标注低置信度后才包含示例。

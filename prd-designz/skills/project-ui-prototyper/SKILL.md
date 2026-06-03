---
name: project-ui-prototyper
description: 基于已有项目 UI 规则，从 PRD、页面需求、流程图、截图、线框图或手绘草稿生成与项目一致的 DESIGN.md 和独立 HTML 原型。使用项目专属原型 skill、原始 UI 技术栈、Design Token、组件模式、布局规则和交互约定，产出可在浏览器预览的单文件 HTML。触发词：项目原型、PRD转原型、草图转原型、线框图转原型、页面还原、UI还原、设计还原、project prototype、sketch to prototype、wireframe to HTML、mockup from PRD。
---

# project-ui-prototyper · 项目一致原型生成

基于已有项目的设计系统创建 UI 原型。本 skill **消费**项目 UI 规则，不从零提取。

## 所需输入

至少一个项目 UI 来源：

- 生成的 project-specific 原型 skill
- `design-tokens.md`、`component-patterns.md`、`layout-patterns.md`、`interaction-patterns.md` 或等效的项目 UI reference
- 截图或运行中的页面（仅在没有正式 project skill 时作为降级来源）

至少一个产品输入：

- PRD、页面需求、用户流程、验收说明、截图、线框图或草图

若项目 UI 规则缺失，向用户索取 `DESIGN.md`、项目 UI references、截图或运行页面；仍缺时不生成“项目一致”原型。

## 工作流程

### Phase 0 · 输入门禁

确认项目 UI 来源可读取，产品输入能映射到页面/流程/状态；只有草图或截图时，读 `references/sketch-input.md` 区分结构意图和粗糙视觉。

**🔴 CHECKPOINT 0 · 🛑 STOP**：UI 来源和产品输入缺任一类时补齐，不进入生成。

### Phase 1 · 加载项目 UI 规则

1. 读取相关 project skill 或 references
2. 识别：技术栈、组件库、Token、组件模式、页面原型、布局密度、交互状态

### Phase 2 · 理解产品需求

1. 读取 PRD / 页面需求 / 草图
2. 提取：页面目标、目标用户、主任务、所需内容、状态、约束
3. 只问会影响布局、流程或必需状态的缺失信息

### Phase 3 · 映射到已有模式

1. 选择最接近的已有项目页面原型
2. 默认复用项目 Token、组件和密度
3. 仅在已有模式无法表达需求时才扩展

允许扩展信息架构、模块优先级、字段分组、局部交互和状态覆盖；禁止改品牌色、圆角、阴影、图标风格、密度和营销式 hero。Variation 只能改结构、优先级、流程或状态，不得引入新视觉方向。

**🔴 CHECKPOINT 1 · 🛑 STOP**：确认所有页面的信息架构、所选项目模式和组件方案后再进入生成。低置信度映射必须列出来让用户确认。

### Phase 4 · 生成原型

1. 走 `references/prototype-workflow.md`
2. 按用户要求产出 DESIGN.md、HTML 原型或两者
3. HTML 产出必须是**一个独立 `.html` 文件**
4. 涉及草图时：保留布局意图，应用项目视觉系统，不复制草稿风格

### Phase 5 · 预览与一致性检查

1. 交付前跑 `references/consistency-checklist.md`
2. 在浏览器中打开生成的 HTML，检查 JS 错误和渲染问题
3. 报告 UI 来源、复用模式、必要扩展、Token/组件、假设和验证结果

**🔴 CHECKPOINT 2 · 🛑 STOP**：浏览器预览无报错、无白屏、无布局破碎后才交付。验证失败时先修 HTML，再重新预览。

## 输出模式

| 模式 | 何时用 |
|---|---|
| DESIGN.md | 需要可复用的页面设计规格，UI 生成前对齐 |
| HTML 原型 | 需要高保真原型做评审 |
| DESIGN.md + HTML | 非平凡页面或流程的默认选项 |
| Variation 对比 | 在同一项目 UI 系统内探索多个方案 |

## 规则

- 不创造新的视觉方向
- 优先项目原始 UI 框架和组件库；仅在原始技术栈无法安全用于独立 HTML 时才降级为原生 HTML/CSS/JS
- HTML 原型可交付物必须是**一个独立 `.html` 文件**
- 不引入项目设计系统中不存在的渐变、图标风格、圆角卡片系统、阴影或营销布局
- 不复制草稿的粗糙视觉样式；草稿只用于提取结构和意图
- 保持项目的信息密度、间距节奏和状态模式
- 低置信度假设必须标注，不静默发明缺失行为

## 失败模式与兜底

- 如果项目 UI 规则缺失或不可读，则索取 project skill、references 或截图；仍缺时转 builder，不生成“项目一致”原型。
- 如果产品输入缺关键状态或流程，则只问影响布局/流程/状态的问题；仍缺时用已有状态并标注假设。
- 如果草图视觉与项目 UI 冲突，则保留结构意图，丢弃粗糙视觉；无法裁决时停下确认。
- 如果找不到可映射模式，则选最接近模式并说明差距；扩展最小且写入摘要。
- 如果独立 HTML 不能用原始组件库或本地资产，则用 inline CSS/JS、内嵌资产、稳定 URL 或 placeholder。
- 如果预览报错、白屏或布局破碎，则修复后重测；仍失败时降级静态原型并记录原因。

## 反例黑名单

- 不在缺少项目 UI 规则时从零设计；先补规则或用 builder 提取。
- 不引入项目不存在的渐变、插画、圆角卡片、阴影或 hero。
- 不照抄草图手绘视觉；草图只提供结构和意图。
- 不生成需要 npm install、构建步骤或 dev server 的原型。
- 不静默发明业务数据、权限或交互；用占位并标注假设。
- 不保留断裂的本地图片、字体或组件导入。

## References 路由表

| 任务 | 读 |
|---|---|
| 页面生成工作流 | `references/prototype-workflow.md` |
| 草图或线框图解读 | `references/sketch-input.md` |
| 交付一致性检查 | `references/consistency-checklist.md` |

## 核心提醒

- **项目 UI 规则优先**：先加载 project skill / references，再动手
- **模式映射**：选最接近的已有页面原型，扩展而非重造
- **单文件交付**：HTML 原型必须是独立 `.html`，双击可开
- **浏览器验证**：交付前必须在浏览器中打开检查
- **标注假设**：数据缺失或行为不确定时诚实标注，不硬凑

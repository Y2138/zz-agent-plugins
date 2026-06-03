---
name: project-ui-skill-builder
description: 分析已有产品/应用的 UI 界面，提取轻量 DESIGN.md 和可复用 React/Tailwind 原型 assets，并生成项目专属原型 skill。用于把旧项目的视觉语言、组件气质、布局密度、交互习惯和稳定页面外壳打包成可被 agent 复用的原型生成能力；不分析项目技术栈，不生成多份 reference 文档。触发词：提取设计系统、生成项目原型skill、UI资产提取、项目UI分析、项目风格skill、extract UI、project prototype skill、生成原型skill。
---

# project-ui-skill-builder · 项目 UI 提取与 Skill 生成

从已有项目中提取设计语言，打包成可复用的项目专属原型 skill。本 skill 负责**提取与打包**，不负责直接设计新产品方向。

生成后的 project skill 只有一个设计权威：`DESIGN.md`。可复用结构放在 `assets/`。后续 HTML 原型统一使用 React 18 + Tailwind CSS CDN + Babel，不沿用或分析原项目技术栈。

## 工作流程

### Phase 1 · 收集 UI 证据

1. 检查可用来源：截图、运行中的页面、Storybook、设计文档、Figma 链接、样式配置、CSS 变量、主题文件、关键组件源码
2. 真实渲染 UI 证据 > 设计意图文档 > 样式配置 > 组件源码推断
3. 组件源码只用于理解视觉形状、状态、布局槽位和可复用结构；不提取技术栈、框架版本、路由、状态管理或请求库
4. 证据不足时，向用户索取最小补充：截图、关键页面、页面外壳截图、核心列表/表单/详情页截图或样式配置

**CHECKPOINT 1：** 证据覆盖页面外壳、一个核心内容页和关键组件状态后再提取；不足时不生成 project skill。

### Phase 2 · 提取 DESIGN.md 与可复用 assets

1. 走 `references/extraction-protocol.md`
2. 生成项目级 `DESIGN.md`：视觉气质、颜色角色、字体规则、组件样式、布局原则、交互模式、Prompt Hints、证据与置信度
3. 识别应生成为 `assets/` 的稳定 UI 结构：admin shell、侧边栏、顶栏、页面外框、表格页外壳、详情页外壳、模态框/抽屉框架、仪表盘网格
4. `assets/` 默认生成 React 组件片段，使用 Tailwind utility class 和必要 inline style token，可直接内联到单文件 HTML 原型
5. 每条重要规则标注证据和置信度

最小提取清单：`DESIGN.md` 覆盖项目级 UI 语言；`assets/` 只收稳定、高频、可槽位化的结构。缺项标“证据不足”。规则格式：`规则 -> 证据 -> 置信度 -> 例外/待确认`。

### Phase 3 · 生成前确认

写最终 project skill 之前，先展示：

- UI 证据摘要
- `DESIGN.md` 提议基线
- 拟生成的 assets 清单
- 冲突、低置信度规则和待确认项
- 输出位置

只问会影响生成结果的决策：主风格冲突、关键外壳缺失、是否生成某个可复用 asset、输出路径。

**CHECKPOINT 2：** 用户确认证据摘要、`DESIGN.md` 基线、assets 清单和输出位置后，才写文件。

### Phase 4 · 生成 Project Skill

1. 使用 `references/generated-skill-template.md`
2. 生成的 `SKILL.md` 保持简短，指向 `DESIGN.md` 和 `assets/`
3. 写项目级 `DESIGN.md`
4. 写必要的 `assets/*.jsx`
5. 不生成 `references/`、`tech-stack.md`、`design-tokens.md`、`prototype-rules.md`、`component-patterns.md`、`layout-patterns.md`、`interaction-patterns.md`
6. 不默认生成 `examples/`；如需验证，临时生成样本 HTML，验证后删除，除非用户明确要求保留

最小输出契约：`SKILL.md` + `DESIGN.md` + `assets/`。生成的 `SKILL.md` 必须写明原型统一使用 React 18 + Tailwind CSS CDN + Babel，禁止要求 npm install、构建步骤、dev server、本地项目路径或原项目技术栈。

### Phase 5 · 小样本验证

1. 走 `references/validation-protocol.md`
2. 用新生成的 skill 临时做一个小样本页面
3. 验证产出是否遵守 `DESIGN.md` 并复用 assets
4. 验证后删除临时样本文件，除非用户明确要求保留

**CHECKPOINT 3：** 样本页面通过一致性检查后再交付。若样本无法渲染或明显偏离项目 UI，先修 `DESIGN.md` 或 assets，再重新验证。

## 默认输出

在用户项目内创建 `<project-name>-prototype/` 文件夹（除非用户指定其他名称或路径）。禁止把生成的项目专属 skill 写回 `prd-designz` 插件目录，除非用户明确要求。

推荐生成结构：

```text
<project-name>-prototype/
├── SKILL.md
├── DESIGN.md
└── assets/
    ├── admin_shell.jsx        # 可选：高频应用外壳
    ├── table_page_shell.jsx   # 可选：列表/表格页外壳
    └── overlay_frames.jsx     # 可选：模态框/抽屉框架
```

## 边界约束

- 不为产品发明新的视觉方向
- 不分析项目技术栈；原型运行时固定为 React 18 + Tailwind CSS CDN + Babel
- 不生成多份 reference 文档；项目设计权威统一写在 `DESIGN.md`
- 不把一次性页面组件放进 `assets/`；assets 只收稳定可复用脚手架
- 矛盾证据不静默合并：记录主规则、例外和待决问题
- 不承诺从任意项目全自动提取，诚实标注证据质量
- 除非用户要求打包成插件，否则不把生成的 project skill 变成完整 plugin

## 失败模式与兜底

- 如果找不到代码、截图、Storybook、Figma 或运行页面，则索取最小证据包；仍缺时只输出缺口清单，不生成 project skill。
- 如果项目无法本地运行，则用截图、设计文档、样式配置和组件源码交叉提取；渲染规则标 `medium/low`。
- 如果 UI 证据矛盾，则写“主规则 / 例外 / 待决策”，未确认前不写最终 skill。
- 如果某个结构没有稳定复用证据，则不生成对应 asset，只在 `DESIGN.md` 写原则。
- 如果样本无法渲染或偏离项目 UI，则回到 Phase 2 修正规则和 assets；仍失败则交付草稿并标待补项。

## 反例黑名单

- 不凭少量截图发明完整设计系统；缺什么就标什么。
- 不把生成的 project skill 写回 `prd-designz` 插件目录；写到用户项目或指定位置。
- 不生成 `references/tech-stack.md` 或任何 Runtime Contract。
- 不识别 Vue、Ant Design、路由、状态管理、请求库等技术栈作为原型生成约束。
- 不默认生成 `examples/prototype.html` 或 `examples/DESIGN.md`。
- 不静默合并新旧 UI 风格；写主规则、例外和待决策。
- 不承诺“自动提取全部 UI”；交付证据覆盖范围和置信度。

## References 路由表

| 任务 | 读 |
|---|---|
| 如何提取 DESIGN.md 和 assets | `references/extraction-protocol.md` |
| 如何组织生成的 project skill | `references/generated-skill-template.md` |
| 如何验证生成的 skill | `references/validation-protocol.md` |

## 核心提醒

- **证据优先**：真实渲染 UI > 推断值，证据不足就停下问
- **只产出两类设计资产**：`DESIGN.md` 和 `assets/`
- **固定 React/Tailwind**：原型生成统一使用 React 18 + Tailwind CSS CDN + Babel
- **先确认再生成**：展示摘要 → 等用户确认 → 再写文件
- **生成到用户项目**：不污染插件目录
- **验证后清理**：临时样本文件如非用户要求保留，验证后删除

# 已有 UI 提取协议

将真实项目 UI 转化为轻量 `DESIGN.md` 和可复用 React/Tailwind 原型 assets。

本协议不分析项目技术栈。源码只作为视觉证据，用来理解颜色、密度、组件形状、状态和可复用结构。

## 证据优先级

| 优先级 | 证据 | 用途 |
|---|---|---|
| P0 | 渲染页面、截图、Storybook、组件预览 | 确认实际视觉语言、密度、状态 |
| P0 | 设计系统文档、UI Kit、Figma 组件 | 确认设计意图和命名规则 |
| P1 | CSS 变量、主题配置、Tailwind 配置、Token 文件 | 提取颜色、字体、圆角、间距、阴影等精确值 |
| P1 | 关键组件源码 | 确认变体、尺寸、状态、组合方式和槽位结构 |
| P2 | PRD、产品文档、流程图 | 理解页面角色和任务密度 |

跳过：框架版本、组件库版本、路由、状态管理、请求库、构建配置和工程架构。

## 证据表

提取规则前先记录观察来源：

```markdown
| 证据 | 来源 | 确认内容 | 置信度 |
|---|---|---|---|
| Dashboard 截图 | 用户提供 | 侧栏、表格密度、主操作按钮样式 | high |
| 全局 CSS 变量 | 代码仓 | 主色、边框、内容面、基础圆角 | high |
| Button 组件 | 代码仓 | 变体、尺寸和 hover 状态 | medium |
```

置信度：

- `high`：渲染 UI、官方设计系统或显式 token 来源
- `medium`：跨页面/组件重复出现但未正式命名
- `low`：从有限证据推断

## DESIGN.md 提取

生成项目级 `DESIGN.md`，不是 token 清单或组件 API 文档。

固定结构：

```markdown
# Design System: [项目名]

## 1. Visual Theme & Atmosphere
## 2. Color Palette & Roles
## 3. Typography Rules
## 4. Component Stylings
## 5. Layout Principles
## 6. Interaction Patterns
## 7. Prompt Hints
## 8. Evidence & Confidence
```

写法要求：

- 使用语义化命名，例如 `Action Blue (#3B5BFF)`，不要只写 `blue`
- 写清“什么时候用”和“不要怎么用”
- 每段保留证据和置信度来源
- 只写能影响后续页面生成或评审的规则
- 不把所有 CSS 变量、类名或组件源码搬进文档

## 核心 UI 语言

提取这些轻量规则：

- 视觉气质：3-5 个形容词 + 关键特征
- 颜色角色：Primary、Accent、Background、Surface、Text、Border、State
- 字体规则：字体族、字号层级、字重、行高、数字/表格文本习惯
- 组件气质：按钮、输入、选择器、表格、导航、卡片、弹层、反馈
- 布局原则：页面外壳、栅格/宽度、间距节奏、信息密度、响应式倾向
- 交互模式：hover、focus、selected、disabled、loading、empty、error、confirm
- 视觉禁区：项目中不应引入的视觉风格

每条重要规则尽量写成：

```text
规则 -> 证据 -> 置信度 -> 例外/待确认
```

## 可复用 UI assets

只为稳定、重复、槽位清晰的结构生成 `assets/` 文件。assets 是未来原型直接复用的 React 组件片段，不是文档。

优先生成资产的条件：

- 跨多个页面出现，或是某产品区域的必需外壳
- 仅靠文字描述重建容易偏离原始 UI
- 有稳定槽位供页面特定内容插入
- 可在 React 18 + Tailwind CSS CDN + Babel 的单文件 HTML 中运行

常见候选：

| 资产类型 | 典型文件 | 捕获内容 |
|---|---|---|
| Admin 外壳 | `assets/admin_shell.jsx` | 侧栏、顶栏、面包屑、内容内边距、响应式外壳行为 |
| 侧栏导航 | `assets/sidebar_nav.jsx` | 导航层级、active 态、收起态、图标/文字节奏 |
| 顶栏/Header | `assets/topbar.jsx` | 产品切换器、搜索、通知、用户菜单、操作区 |
| 表格/列表页外壳 | `assets/table_page_shell.jsx` | 筛选栏、批量操作、表格容器、分页、空态/加载槽位 |
| 详情页外壳 | `assets/detail_page_shell.jsx` | 摘要 header、Tab、元数据、动态/侧面板槽位 |
| 抽屉/模态框框架 | `assets/overlay_frames.jsx` | 模态/抽屉尺寸、header/footer 操作、关闭行为、校验区 |
| 仪表盘网格 | `assets/dashboard_grid.jsx` | 指标卡片网格、图表区、下钻表格/列表区 |

默认只生成当前样本和高频外壳需要的 1-2 个资产。证据不足时不生成 asset，只把原则写入 `DESIGN.md`。

## Asset 编写规则

资产应是可内联到单文件 HTML 的 React 组件：

```jsx
function AdminShell({ activeNav, title, breadcrumbs = [], actions = null, children }) {
  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#1F2937]">
      {/* project shell */}
    </div>
  );
}

Object.assign(window, { AdminShell });
```

规则：

- 使用 React 函数组件
- 使用 Tailwind utility class 表达布局、密度和常见状态
- 项目专属色值、圆角、阴影可用 arbitrary value，例如 `bg-[#F6F8FC]`
- 复杂重复值可在组件内用局部常量命名，例如 `const shellStyles = {...}`
- 暴露简单 props 或具名槽位：`activeNav`、`title`、`breadcrumbs`、`actions`、`children`、`filters`、`table`、`pagination`、`emptyState`
- 不硬编码业务数据；只保留展示结构所需的中立占位
- 文件按可复用结构命名，不按一次性页面命名
- 每个资产在顶部注释证据来源和适用场景

## 资产处理

记录影响原型保真度的原始视觉资产：

```markdown
| 资产 | 来源 | 用途 | 原型处理方式 | 置信度 |
|---|---|---|---|---|
| 品牌 Logo | public/logo.svg | header/sidebar | inline SVG、data URI、稳定 URL 或占位 | high |
| 图标风格 | 截图 + 组件源码 | 操作/状态 | Tailwind + 文字符号/内联 SVG 匹配笔触风格 | medium |
```

独立 HTML 原型中，本地项目路径无效。标注每项资产的可用方式：内嵌、稳定 URL 引用、安全占位符替换，或必须向用户索取。

## 冲突处理

矛盾证据不取平均值。

使用此结构写入 `DESIGN.md` 的 Evidence & Confidence：

```markdown
| 主题 | 主规则 | 例外 | 待决策 |
|---|---|---|---|
| 主圆角 | 6px 控件 | 旧设置页用 10px | 以新版页面为基线？ |
```

优先级：

1. 当前主路径和新版页面
2. 真实渲染证据
3. 官方设计资料或显式 token
4. 组件源码推断
5. 旧页面或孤立截图

## 视觉禁区

记录会破坏项目一致性的视觉操作：

- 项目中不存在的渐变
- 不支持的圆角卡片系统
- 异质插画风格
- 不同图标族或笔触宽度
- 运营页面间距出现在工具型页面
- 信息密度突然变松或变拥挤
- 未在项目中出现的大面积阴影、玻璃拟态、霓虹色或营销 hero

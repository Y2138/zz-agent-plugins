# 已有 UI 提取协议

将真实项目 UI 转化为可复用的原型基线。

## 证据优先级

| 优先级 | 证据 | 用途 |
|---|---|---|
| P0 | 渲染页面、截图、Storybook、组件预览 | 确认实际视觉语言、密度、状态 |
| P0 | 设计系统文档、UI Kit、Figma 组件 | 确认设计意图和命名规则 |
| P1 | `package.json`、lockfile、入口文件、打包配置 | 识别 UI 框架和组件库 |
| P1 | CSS 变量、Tailwind/主题配置、Token 文件 | 提取精确值 |
| P1 | 组件源码 | 确认变体、尺寸、状态、组合方式 |
| P2 | PRD、产品文档、流程图 | 理解页面角色和任务密度 |

## UI 技术栈

生成 project skill 前先提取项目的 UI 实现栈。

检查项：
- 框架：React、Vue、Svelte、Angular、Solid、纯 HTML、服务端模板
- 元框架：Next.js、Nuxt、Remix、SvelteKit、Vite、Astro
- 语言：TypeScript、JavaScript
- 样式方案：Tailwind、CSS Modules、Sass/Less、CSS-in-JS、原生 CSS、UnoCSS
- 组件库：Ant Design、MUI、Chakra、Radix/shadcn、Element Plus、Naive UI、Vuetify、Arco、Headless UI、自定义组件
- 图标/图表/表格库：lucide、heroicons、echarts、recharts、tanstack-table、ag-grid 等
- 资产来源：本地字体、图标集、Logo、产品图、插画、CSS 背景图、公共 CDN 资源

可用证据来源：
- `package.json` dependencies 和 scripts
- Lockfile 名称和版本
- `src/main.*`、`src/App.*`、`pages/`、`app/`、`components/`、`stories/`
- `vite.config.*`、`next.config.*`、`nuxt.config.*`、`tailwind.config.*`
- 已有页面中的组件导入

记录格式：

```markdown
| 领域 | 检测结果 | 证据 | 置信度 |
|---|---|---|---|
| 框架 | React 18 | package.json + src/main.tsx | high |
| 组件库 | Ant Design | package.json + 表格页导入 | high |
| 样式 | Tailwind + CSS 变量 | tailwind config + global.css | high |
```

## 资产清单

记录影响原型保真度的原始资产，包括视觉媒体资产和可复用的结构性 UI 资产。

```markdown
| 资产 | 来源 | 用途 | 原型处理方式 | 置信度 |
|---|---|---|---|---|
| 品牌 Logo | public/logo.svg | header/sidebar | inline SVG 或 data URI | high |
| 图标集 | lucide-react | 操作/状态 | 可用同图标库，否则匹配笔触风格 | high |
| Inter 字体 | CSS import | 全局排版 | 稳定 CDN 源直接用，否则系统降级 | medium |
| admin shell | 渲染的 dashboard + 布局源码 | 侧栏/顶栏/内容框架 | 生成 `assets/admin_shell.jsx` 脚手架 | high |
```

独立 HTML 原型中，本地项目路径无效。标注每项资产的可用方式：内嵌、稳定 URL 引用、安全占位符替换、或必须向用户索取。

## 可复用 UI 资产提取

为固定结构生成可复用的 `assets/` 文件，让未来原型不必从零重建。这类似乎 design-md 的设备框组件：稳定脚手架，编码了项目专属的外框、布局槽位、密度和状态面。

以下情况优先生成资产：
- 结构跨多个页面出现，或是某产品区域的必需外壳
- 仅靠文字描述重建容易偏离原始 UI
- 有稳定槽位供页面特定内容插入
- 能在独立 HTML 原型中以 inline React/Babel、Vue 浏览器组件或纯 HTML/CSS/JS 运行

常见可复用 UI 资产：

| 资产类型 | 典型文件 | 捕获内容 |
|---|---|---|
| Admin 外壳 | `assets/admin_shell.jsx` | 侧栏、顶栏、面包屑、内容内边距、响应式外壳行为 |
| 侧栏导航 | `assets/sidebar_nav.jsx` | 导航层级、active 态、收起态、图标/文字节奏 |
| 顶栏/Header | `assets/topbar.jsx` | 产品切换器、搜索、通知、用户菜单、操作区 |
| 表格/列表页外壳 | `assets/table_page_shell.jsx` | 筛选栏、批量操作、表格容器、分页、空态/加载槽位 |
| 详情页外壳 | `assets/detail_page_shell.jsx` | 摘要 header、Tab、元数据、动态/侧面板槽位 |
| 抽屉/模态框框架 | `assets/overlay_frames.jsx` | 模态/抽屉尺寸、header/footer 操作、关闭行为、校验区 |
| 仪表盘网格 | `assets/dashboard_grid.jsx` | 指标卡片网格、图表区、下钻表格/列表区 |

生成的 UI 资产应暴露简单的 props 或具名槽位供页面特定内容使用：如 `activeNav`、`title`、`breadcrumbs`、`actions`、`children`、`filters`、`table`、`pagination`、`emptyState`。业务数据不要写入资产文件，仅保留展示结构所需的代表性占位内容。

证据不足以生成可复用资产时，不静默发明。在 `references/layout-patterns.md` 中记录缺失证据，向用户索取截图、关键路由、Storybook 页面或布局源码。

## Tailwind 项目

Tailwind 项目优先读取 resolved config，而非只看原始配置文件。尝试：

```bash
npx tailwindcss config
```

从输出中提取主题色、字体族、间距量级、圆角、阴影、断点、插件、预设和内容路径。若命令不可用或执行失败，降级为读取 `tailwind.config.*`、PostCSS 配置、CSS 入口文件和本地主题/token 模块。

## 证据表

提取规则前先记录观察来源：

```markdown
| 证据 | 来源 | 确认内容 | 置信度 |
|---|---|---|---|
| Dashboard 截图 | 用户提供 | 侧栏、表格密度、主操作按钮样式 | high |
| 主题配置 | 代码仓 | 色彩、断点、圆角 | high |
| Button 组件 | 代码仓 | 变体和状态 | medium |
```

置信度：
- `high`：渲染 UI、官方设计系统或显式 token 来源
- `medium`：跨页面/组件重复出现但未正式命名
- `low`：从有限证据推断

## 提取的 Design Token

使用语义化 token 名称，不直接倾倒原始值。

推荐分类：
- 色彩：画布底色、表面色、边框色、文字色、主操作色、次操作色、选中色、禁用色、成功、警告、错误、信息
- 排版：字族、display、标题、正文、表格、辅助文字、字重、行高
- 间距：页面内边距、区块间距、组件内边距、控件间距、表格密度
- 形状：圆角、边框宽度、阴影、分割线、遮罩
- 状态：hover、focus、active、selected、disabled、loading、empty、error
- 断点：mobile、tablet、desktop、wide

模板：

```markdown
| Token | 值 | 角色 | 证据 | 置信度 |
|---|---|---|---|---|
| color.action.primary | #246BFE | 主 CTA 和选中态 | button + nav | high |
| radius.control | 6px | 按钮、输入框、选择控件 | 组件样式 | high |
```

## 组件模式

把组件规则捕获为可复用行为，不是截图。

至少检查的组件类型：
- 导航：侧栏、顶栏、Tab、面包屑、移动端导航
- 操作：主/次/幽灵/危险按钮、图标按钮
- 数据展示：表格、卡片、列表、详情面板、空态
- 输入：文本域、选择器、复选框、单选框、日期选择、搜索/筛选
- 遮罩层：模态框、抽屉、气泡、工具提示、确认框
- 反馈：加载中、成功、警告、错误、校验

每类组件记录：

```markdown
## Button
- 变体：
- 尺寸 / 内边距：
- 圆角 / 边框：
- 排版：
- 状态：
- 使用规则：
- 证据：
- 置信度：
```

## 布局与交互模式

提取：
- 页面外壳：侧栏/顶栏/内容区层级
- 信息密度：紧凑、标准、宽松、高密度
- 网格或表格节奏
- 工具栏和筛选器位置
- 表单布局和校验位置
- 模态/抽屉使用边界
- 加载、空态、错误反馈位置
- 动效和过渡风格

## 冲突处理

矛盾证据不取平均值。

使用此结构：

```markdown
| 主题 | 主规则 | 例外 | 待决策 |
|---|---|---|---|
| 主圆角 | 6px 控件 | 旧设置页用 10px | 以新版页面为基线？ |
```

## 视觉禁区

记录会破坏项目一致性的视觉操作：
- 项目中不存在的渐变
- 不支持的圆角卡片系统
- 异质插画风格
- 不同图标族或笔触宽度
- 运营页面间距出现在工具型页面
- 设计系统中不存在的新状态色

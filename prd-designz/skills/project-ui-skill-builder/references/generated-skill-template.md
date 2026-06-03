# 生成的 Project Skill 模板

生成一个可移植的 skill 文件夹，任何 agent 都能用它产出匹配特定项目 UI 的单文件 HTML 原型。

生成物保持轻量：`SKILL.md` + `DESIGN.md` + `assets/`。不要生成 `references/`。

## 生成结构

```text
<project-name>-prototype/
├── SKILL.md
├── DESIGN.md
└── assets/
    ├── admin_shell.jsx        # 可选
    ├── table_page_shell.jsx   # 可选
    └── overlay_frames.jsx     # 可选
```

## 生成的 SKILL.md

保持生成的 `SKILL.md` 简洁：

```markdown
---
name: <project-name>-prototype
description: 生成匹配 <项目名> 已有 UI 风格的单文件 HTML 原型。当用户要求做新页面、新流程、功能原型、PRD 转 UI mockup、草图转原型或 UI 变体探索时使用，产出须遵循 DESIGN.md 和 assets 中记录的视觉语言、组件气质、布局密度和交互规则。
---

# <项目名> 原型 Skill

使用本 skill 创建匹配 <项目名> 已有产品 UI 的原型。

## 必需上下文

生成原型前必须读取：

- `DESIGN.md`
- 当前页面需要复用的 `assets/*.jsx`

`DESIGN.md` 是唯一设计权威；`assets/` 是可复用 UI 脚手架。不要临时发明新的视觉系统。

## 原型运行时

最终产出必须是一个独立 `.html` 文件，统一使用：

- React 18 CDN
- ReactDOM 18 CDN
- Babel Standalone CDN
- Tailwind CSS CDN

禁止使用 npm install、构建步骤、dev server、本地项目路径或原项目技术栈。

## 工作流

1. 理解用户的页面或流程需求
2. 读取 `DESIGN.md`
3. 选择最接近的 `assets/*.jsx` 作为页面外壳或固定结构
4. 将资产代码内联到 HTML 的 `<script type="text/babel">`
5. 使用 React + Tailwind 生成单文件 HTML 原型
6. 所有页面视觉遵守 `DESIGN.md`
7. 只在已有模式无法表达需求时做最小扩展，并在交付摘要中说明
8. 交付前在浏览器中预览，确认无白屏、无 JS 错误、无明显布局破碎

## 规则

- 默认复用 `DESIGN.md` 的颜色、字体、圆角、间距、密度、组件形状和状态语言
- 优先复用 `assets/`，不要从文字描述重建固定导航、顶栏、页面外壳、模态框、抽屉、表格外壳或仪表盘框架
- 产品行为或数据缺失时标注假设
- 不引入 `DESIGN.md` 中不存在的渐变、图标、圆角卡片系统、阴影或营销布局
- 不输出需要本地依赖、构建、启动服务或项目源码导入的原型
```

## HTML Runtime 模板

生成的原型 HTML 使用此形态，可按需补充 title、内联 CSS、assets 和页面组件：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Prototype Name]</title>
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // Inline assets/*.jsx here.

    function App() {
      return <div>Prototype</div>;
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

## DESIGN.md 验收

生成的 `DESIGN.md` 必须包含：

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

验收标准：

- 语义化描述项目风格，不只是 token 表
- 记录主规则、例外、待确认和证据置信度
- `Prompt Hints` 可直接用于后续页面生成
- 不包含框架版本、组件库版本、Runtime Contract 或工程实现分析

## Assets 验收

生成的 `assets/*.jsx` 必须：

- 是 React 函数组件，可内联到 `<script type="text/babel">`
- 使用 Tailwind utility class 和必要 arbitrary value 表达项目视觉
- 暴露简单 props 或 `children` 插槽
- 只包含稳定可复用结构，不硬编码一次性业务内容
- 顶部注释证据来源和适用场景
- 通过 `Object.assign(window, {...})` 暴露组件，便于多个脚本块复用

示例：

```jsx
// Evidence: dashboard screenshot + sidebar layout source. Use for admin pages.
function AdminShell({ activeNav, title, actions = null, children }) {
  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#1F2937]">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-[#E5EAF3] bg-white">
        {/* navigation */}
      </aside>
      <main className="ml-64 min-h-screen p-6">
        <header className="mb-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{title}</h1>
          {actions}
        </header>
        {children}
      </main>
    </div>
  );
}

Object.assign(window, { AdminShell });
```

## 生成产物验收门

生成后逐项检查，不通过就回到生成阶段修正。

- `SKILL.md` 指向 `DESIGN.md` 和 `assets/`
- `SKILL.md` 明确 React 18 + Tailwind CSS CDN + Babel 单文件 HTML
- `DESIGN.md` 结构完整，且包含 Evidence & Confidence
- `assets/` 只包含稳定可复用 React/Tailwind 组件
- 没有生成 `references/`
- 没有生成 `tech-stack.md`、`design-tokens.md`、`prototype-rules.md` 或 Runtime Contract
- 没有默认保留 `examples/prototype.html`
- 没有要求 npm install、构建步骤、dev server、本地项目路径或原项目技术栈

## 临时验证样本

如需验证，可临时生成一个 `prototype.html`，使用 `SKILL.md`、`DESIGN.md` 和 `assets/` 生成小页面并在浏览器预览。验证通过后删除临时样本，除非用户明确要求保留。

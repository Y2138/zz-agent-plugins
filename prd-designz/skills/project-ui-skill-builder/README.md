# project-ui-skill-builder · 项目 UI 提取与 Skill 生成

分析已有产品 UI，提取轻量 `DESIGN.md` 和可复用 React/Tailwind 原型 assets，并生成项目专属原型 skill。

## 能力

- **DESIGN.md 提取**：视觉气质、颜色角色、字体规则、组件样式、布局原则、交互模式、Prompt Hints
- **证据置信度追踪**：主规则、例外、待确认项和 high / medium / low 证据来源
- **可复用 assets 生成**：admin shell、侧栏、顶栏、表格页外壳、详情页外壳、模态框/抽屉框架等稳定结构
- **固定原型运行时**：生成的 skill 统一使用 React 18 + Tailwind CSS CDN + Babel 产出单文件 HTML
- **小样本验证**：临时生成样本页面验证可用性，验证后删除临时文件

## 不做

- 不分析项目技术栈、框架版本、组件库版本、路由、状态管理或请求库
- 不生成 `references/`、`tech-stack.md`、`design-tokens.md`、`prototype-rules.md`
- 不默认生成 `examples/prototype.html`

## 触发词

提取设计系统、生成项目原型skill、UI资产提取、项目UI分析、项目风格skill、extract UI、project prototype skill

## 目录结构

```
project-ui-skill-builder/
├── SKILL.md
├── references/
│   ├── extraction-protocol.md        # DESIGN.md 和 assets 提取协议
│   ├── generated-skill-template.md   # 生成的 project skill 模板
│   └── validation-protocol.md        # 生成后验证协议
└── README.md
```

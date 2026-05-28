# project-ui-skill-builder · 项目 UI 提取与 Skill 生成

分析已有产品 UI，提取设计系统并生成可复用的项目专属原型 skill。

## 能力

- **UI 技术栈检测**：框架、组件库、样式方案、图标/图表库
- **Design Token 提取**：色彩、排版、间距、圆角、阴影、状态
- **组件模式捕获**：导航、操作、数据展示、输入、遮罩、反馈
- **可复用资产生成**：admin shell、侧栏、表格外壳等固定结构脚手架
- **证据置信度追踪**：每条规则标注 high / medium / low 和证据来源
- **小样本验证**：生成后用样本页面验证 skill 可用性

## 触发词

提取设计系统、生成项目原型skill、UI组件提取、设计Token提取、项目UI分析、extract UI、project prototype skill

## 目录结构

```
project-ui-skill-builder/
├── SKILL.md                          # 主文件
├── references/
│   ├── extraction-protocol.md        # UI 提取完整协议
│   ├── generated-skill-template.md   # 生成的 project skill 模板
│   └── validation-protocol.md        # 生成后验证协议
└── README.md
```

# design-md · 设计规格与原型图 Skill

从需求到 DESIGN.md（设计规格）+ HTML 高保真原型图的一体化设计 skill。

## 能力

- **DESIGN.md 生成**：语义化设计系统文档（7 段结构）
- **Hi-fi HTML 原型**：React + Babel inline JSX，双击可开
- **事实与资产门禁**：Fact Ledger + Image Ledger，先验证事实和真图再做高保真
- **品牌资产采集**：5 步协议（Logo > 产品图 > UI > 色值 > 字体）
- **设计方向顾问**：12 种设计哲学 × 4 流派 + 方向采样三锚点，Fallback 推荐差异化方向
- **反 AI slop**：质控清单 + 自检方法
- **5 维度评审**：哲学一致性 / 视觉层级 / 细节执行 / 功能性 / 创新性
- **设备框组件**：iOS / Android / macOS / Browser（来自 huashu-design）

## 触发词

做原型、设计Demo、原型图、交互原型、UI mockup、prototype、DESIGN.md、设计规格、设计系统文档、App原型、移动应用mockup、产品设计、界面设计

## 目录结构

```
design-md/
├── SKILL.md                          # 主文件（~300 行）
├── references/
│   ├── design-philosophies.md        # 12 种设计哲学（4 流派）
│   ├── brand-asset-protocol.md       # 品牌资产采集 5 步协议
│   ├── anti-slop-checklist.md        # 反 AI slop 清单
│   └── review-guide.md               # 5 维度设计评审
├── assets/
│   ├── ios_frame.jsx                 # iPhone 15 Pro 设备框
│   ├── android_frame.jsx             # Android 设备框
│   ├── macos_window.jsx              # macOS 窗口框
│   ├── browser_window.jsx            # 浏览器窗口框
│   └── design_canvas.jsx             # Variations 并排画布
├── examples/
│   └── DESIGN.md                     # 完整 DESIGN.md 示例
└── README.md
```

## 灵感来源

- [Anthropic Claude Design System Prompt](https://github.com/elder-plinius/CL4R1T4S/blob/main/ANTHROPIC/Claude-Design-Sys-Prompt.txt) — Junior Designer 工作流、HTML 设计媒介、反 AI slop
- [huashu-design](https://github.com/alchaincyf/huashu-design) — 品牌资产协议、设备框组件、设计方向顾问、5 维度评审；本 skill 吸收其事实验证、真图优先和差异化方向机制，并保留生产级 Web App 的可落地边界
- design-md skill — Google DESIGN.md 语义化命名范式（Google Stitch）

## 设备框组件来源

`assets/` 下的设备框组件（ios_frame.jsx / android_frame.jsx / macos_window.jsx / browser_window.jsx / design_canvas.jsx）来自 [huashu-design](https://github.com/alchaincyf/huashu-design)，遵循其开源协议。这些组件经过实战验证，精确对齐了设备规格（如 iPhone 15 Pro Dynamic Island 124×36px）。

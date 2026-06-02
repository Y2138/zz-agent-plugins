# 创意增强流程

用于品牌官网、营销页、产品展示页、活动页，或用户明确要求「高级感」「创意」「强视觉」「动效」的设计任务。

本流程只补设计阶段的艺术指导，不替代 DESIGN.md 结构，不引入工程实现审查。

## 触发条件

命中任一条件就使用：

- 品牌官网 / 营销站 / 落地页 / 活动页
- 产品展示页 / 发布页 / Demo 页
- 用户要求高级感、创意、视觉冲击、沉浸感、动效
- 设计目标明显偏品牌表达，而不是后台操作效率

不用于：

- 通用 CRUD / 管理后台
- 纯无障碍审计
- 组件库维护
- 生产级前端实现优化

## 输出四个创意决策

在 DESIGN.md 之前补齐：

1. **Visual Thesis**：一句话定义氛围、材质和能量；写入 DESIGN.md 的 Visual Theme & Atmosphere。
2. **First Viewport Contract**：首屏必须一眼看出品牌、产品或主任务；只保留一个强视觉锚点；写入 Layout Principles。
3. **Section Contract**：每个 section 只有一个职责、一个主视觉、一条主信息或动作；写入 Layout Principles。
4. **Motion Budget**：默认只允许一个入场序列、一个滚动/深度关系、一个 hover/reveal/layout transition；写入 Interaction Patterns。

## 设计规则

- 先确定页面类型：branding landing、editorial 或 product demo。
- 只有当产品界面本身承担强品牌展示或发布演示任务时，才使用 app workspace；不要把通用后台或 CRUD 操作台纳入本流程。
- 一个页面只允许一个主叙事轴，不让多个焦点竞争。
- 先锁定首屏层级，再选择组件。
- 先用比例、留白、对比、裁切和对齐解决层级，再考虑卡片、边框和阴影。
- 默认使用无卡片布局；卡片只作为交互边界，不作为装饰。
- 对 app UI 保持 workspace-first，不默认加营销型 hero。

## 动效规则

- 动效必须服务层级、存在感、反馈或叙事。
- 先确定动效角色，再选实现：entrance、scroll-linked、hover/affordance、layout transition、modal/menu presence。
- 默认强度：
  - low：产品 UI
  - medium：展示型页面
  - high：仅在 brief 明确要求实验性或电影感时使用
- 不默认混用多套重型动效系统。
- 尊重 `prefers-reduced-motion`；移动端减少大面积 blur、filter 和 parallax。

## 拒绝结果

不要交付这些结果：

- 通用 SaaS 卡片网格作为第一印象
- hero card 或卡片马赛克撑满首屏
- 漂亮图像但品牌或产品存在感弱
- 一个屏幕里多个视觉焦点互相竞争
- 忙乱图像压在正文背后
- 多个 section 重复同一种情绪表达
- 动效看起来昂贵但没有信息价值

## 降级处理

| 触发条件 | 处理 |
|---|---|
| 品牌资产不足 | 回到品牌资产协议；没有真素材就用诚实 placeholder |
| 视觉方向不清 | 回到设计方向顾问，让用户先选方向 |
| 首屏同时承担太多目标 | 收敛到一个主叙事轴，其余内容下移 |
| 动效预算超标 | 保留最能服务层级或反馈的一处，其余删除 |

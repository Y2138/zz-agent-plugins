# 品牌资产协议

涉及具体品牌时的 5 步资产采集流程。品牌识别度的根基是「被认出来」，不是「色值对不对」。

本协议同时承担事实验证：先确认品牌/产品当前存在、状态和官方来源，再采集视觉资产。禁止把训练语料记忆当作当前事实。

## Fact Ledger

采集资产前先写：

```markdown
## Fact Ledger

### confirmed
- <事实> — <来源名 / URL / 日期>

### uncertain
- <待确认信息> — <为什么不确定>

### rejected
- <被排除信息> — <冲突来源或原因>
```

写入规则：
- 只有 `confirmed` 能进入 DESIGN.md 和 HTML 文案
- `uncertain` 只能出现在假设、待确认项或 placeholder 标签里
- `rejected` 必须从视觉方案、卖点和页面文案里删除
- 品牌状态、产品能力、客户案例、融资/价格/获奖信息必须重新验证，不凭记忆写
- `confirmed` 至少需要 2 个可追溯来源；其中 1 个必须是官方/一级权威来源。只有二手百科、新闻聚合或粉丝站时，降级为 `uncertain`

## 资产优先级

| 资产类型 | 识别度贡献 | 必需性 |
|---|---|---|
| Logo | 最高 | 任何品牌都必须有 |
| 产品图 / 渲染图 | 极高 | 实体产品必须有 |
| UI 截图 / 界面素材 | 极高 | 数字产品必须有 |
| 色值 | 中 | 辅助 |
| 字体 | 低 | 辅助 |
| 气质关键词 | 低 | 自检用 |

## 内容图片门禁

当任务是品牌官网、产品展示、设计海报、静态科普网站、文化/人物/地点介绍页时，图片不是装饰，而是内容主体。没有真图就不要进入高保真。

图片清单模板：

```markdown
## Image Ledger

| 用途 | 图片类型 | 来源 | 许可/版权状态 | 本地路径 | 缺失时降级 |
|---|---|---|---|---|---|
| 首屏主体 | 官方产品图 / 人物图 / 场景图 | <URL> | <状态> | assets/... | placeholder + 停止 hi-fi |
```

搜索优先级：
1. 官方媒体包、新闻稿、产品页、App Store / Google Play 截图
2. 博物馆、大学、政府、研究机构等权威开放图片库
3. Wikimedia Commons 等带许可说明的公共图库
4. Unsplash 等可商用图库（适合氛围和场景，不适合冒充真实产品）
5. 用户授权素材
6. AI 生成图片：只能用于风格化海报或概念图，必须明确标注为生成素材，不得冒充真实产品/人物/事件

检查项：
- 主视觉是否真实对应当前主题？
- 图片是否有来源和许可/版权状态？
- 是否避免用 stock 图冒充具体产品、地点、人物或科学证据？
- 如果是科普内容，图片是否支持事实解释，而不是纯装饰？

## 5 步流程

### Step 1 · 问

不要只问「有 brand guidelines 吗？」按清单逐项问：

```
关于 <brand/product>，你手上有以下哪些资料？我按优先级列：
1. Logo（SVG / 高清 PNG）—— 任何品牌必备
2. 产品图 / 官方渲染图 —— 实体产品必备
3. UI 截图 / 界面素材 —— 数字产品必备
4. 色值清单（HEX / RGB）
5. 字体清单（Display / Body）
6. Brand guidelines PDF / Figma / 官网链接

有的直接发我，没有的我去搜。
```

### Step 2 · 搜

| 资产 | 搜索路径 |
|---|---|
| Logo | `<brand>.com/brand` · `<brand>.com/press` · `<brand>.com/press-kit` · 官网 header inline SVG |
| 产品图 | `<brand>.com/<product>` 产品详情页 hero + gallery · 官方 YouTube 截帧 |
| UI 截图 | App Store / Google Play 产品页截图 · 官网 screenshots section |
| 色值 | 官网 inline CSS / Tailwind config / brand guidelines PDF |
| 字体 | 官网 `<link>` 引用 · Google Fonts 追踪 |

网页搜索工具兜底关键词：
- Logo → `<brand> logo download SVG`、`<brand> press kit`
- 产品图 → `<brand> <product> official renders`
- UI → `<brand> app screenshots`、`<brand> dashboard UI`

### Step 3 · 取

下载真实资产文件。**禁止用 CSS 剪影 / SVG 手画代替产品图**。

Logo 获取路径（按成功率递减）：
1. 独立 SVG/PNG 文件（`curl -o assets/logo.svg <url>`）
2. 官网 HTML 全文提取 inline SVG（`curl -L <brand>.com` → grep `<svg>`）
3. 官方社交媒体 avatar（GitHub/Twitter/LinkedIn 的公司头像）

### Step 4 · 验

| 资产 | 验证动作 |
|---|---|
| Logo | 文件存在 + 可打开 + 至少深底/浅底两个版本 |
| 产品图 | 至少一张 2000px+ + 干净背景 |
| UI 截图 | 是最新版本 + 无用户数据污染 |
| 色值 | `grep -hoE '#[0-9A-Fa-f]{6}' assets/*.{svg,html,css} \| sort \| uniq -c \| sort -rn` |
| 内容图片 | 来源可追溯 + 许可/版权状态明确 + 能支撑页面叙事 |

**警惕**：产品截图里常有 demo 品牌色（如某工具截图演示其他品牌），那不是该工具的色。

### Step 5 · 固

写入 `brand-spec.md`，所有 HTML 引用真实文件路径。

模板：

```markdown
# <Brand> · Brand Spec
> 采集日期：YYYY-MM-DD

## Fact Ledger
- confirmed: ...
- uncertain: ...
- rejected: ...

## 核心资产

### Logo
- 主版本：`assets/<brand>/logo.svg`
- 反色版：`assets/<brand>/logo-white.svg`

### 产品图（实体产品）
- 主视角：`assets/<brand>/product-hero.png`

### UI 截图（数字产品）
- 主页：`assets/<brand>/ui-home.png`

### 内容图片（内容网站/海报/科普）
- 首屏主体：`assets/<brand>/hero.jpg` — 来源/许可：
- 证据/细节图：`assets/<brand>/detail.jpg` — 来源/许可：

## 色板
- Primary: #XXXXXX
- Background: #XXXXXX
- Ink: #XXXXXX
- Accent: #XXXXXX

## 字型
- Display: <font stack>
- Body: <font stack>

## 气质关键词
- <3-5 个形容词>

## 禁区
- <明确不能做的>
```

## 执行纪律

- HTML 必须引用 `brand-spec.md` 里的真实文件路径
- Logo 作为 `<img>` 引用，不重画
- 产品图作为 `<img>` 引用，不用 CSS 剪影
- 想临时加色要先改 spec

## 失败兜底

| 缺失 | 处理 |
|---|---|
| Logo 完全找不到 | **停下问用户** |
| 产品图找不到 | 向用户索取 → 最后诚实 placeholder（灰块+"产品图待补"） |
| 内容主视觉找不到 | 停在低保真；列 Image Ledger 和需要用户补充的素材 |
| 色值找不到 | 走「设计方向顾问」Fallback，标注 assumption |

**禁止**：找不到就静默用通用渐变硬做。宁可停下问，不要凑。

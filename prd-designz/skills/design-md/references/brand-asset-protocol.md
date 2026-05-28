# 品牌资产协议

涉及具体品牌时的 5 步资产采集流程。品牌识别度的根基是「被认出来」，不是「色值对不对」。

## 资产优先级

| 资产类型 | 识别度贡献 | 必需性 |
|---|---|---|
| Logo | 最高 | 任何品牌都必须有 |
| 产品图 / 渲染图 | 极高 | 实体产品必须有 |
| UI 截图 / 界面素材 | 极高 | 数字产品必须有 |
| 色值 | 中 | 辅助 |
| 字体 | 低 | 辅助 |
| 气质关键词 | 低 | 自检用 |

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

**警惕**：产品截图里常有 demo 品牌色（如某工具截图演示其他品牌），那不是该工具的色。

### Step 5 · 固

写入 `brand-spec.md`，所有 HTML 引用真实文件路径。

模板：

```markdown
# <Brand> · Brand Spec
> 采集日期：YYYY-MM-DD

## 核心资产

### Logo
- 主版本：`assets/<brand>/logo.svg`
- 反色版：`assets/<brand>/logo-white.svg`

### 产品图（实体产品）
- 主视角：`assets/<brand>/product-hero.png`

### UI 截图（数字产品）
- 主页：`assets/<brand>/ui-home.png`

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
| 色值找不到 | 走「设计方向顾问」Fallback，标注 assumption |

**禁止**：找不到就静默用通用渐变硬做。宁可停下问，不要凑。

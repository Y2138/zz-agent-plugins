# 生成 Skill 验证协议

交付生成的 project prototype skill 之前，做一个小型正向测试。验证文件默认是临时产物，验证后删除，除非用户明确要求保留。

## 验证任务

选一个小而有代表性的页面需求，例如：

```text
创建一个列表页原型，含筛选、表格、空态和主操作按钮。
```

以生成的 `SKILL.md`、`DESIGN.md` 和 `assets/` 作为唯一设计权威。结果应证明该 skill 可被未来 agent 使用，无需重读原始项目。

## 检查项

- 生成的 skill 是否能在项目专属原型请求时正确触发？
- `SKILL.md` 是否要求先读取 `DESIGN.md` 和相关 `assets/*.jsx`？
- `SKILL.md` 是否固定 React 18 + Tailwind CSS CDN + Babel 单文件 HTML？
- 是否没有要求原项目技术栈、npm install、构建步骤、dev server 或本地项目路径？
- 是否没有生成 `references/`、`tech-stack.md`、`design-tokens.md`、`prototype-rules.md` 或 Runtime Contract？
- `DESIGN.md` 是否覆盖视觉气质、颜色、字体、组件、布局、交互、Prompt Hints、证据置信度？
- `DESIGN.md` 是否语义化描述设计规则，而不是倾倒 CSS 变量？
- `assets/*.jsx` 是否是 React 函数组件，并可内联到 `<script type="text/babel">`？
- `assets/*.jsx` 是否使用 Tailwind utility class 和项目专属色值/圆角/密度？
- `assets/*.jsx` 是否暴露 props / `children`，而不是硬编码一次性业务数据？
- 临时样本是否复用了至少一个 asset？
- 临时样本是否匹配项目密度、布局、状态和视觉风格？
- 临时样本在浏览器中打开是否无控制台错误、无白屏、无明显渲染破碎？
- 假设和未解决冲突是否可见？
- 验证后是否删除临时样本文件，除非用户要求保留？

## 浏览器预览

当验证生成临时 `prototype.html` 时，在浏览器中打开。

验证：

- 页面不白屏
- 控制台无 JS 错误
- 关键布局区域可见
- 文字无明显截断或重叠
- CDN 依赖加载成功或有安全降级
- HTML 中没有本地 `node_modules`、`/src/`、`localhost`、Vite/Webpack dev server 或项目本地路径依赖
- HTML 使用 React、ReactDOM、Babel、Tailwind CSS CDN
- HTML 实际复用了 `assets/` 中的组件

## 静态验收命令

在生成的 project skill 根目录运行这些检查；任一失败都要回到生成阶段修正：

```bash
test -f SKILL.md
test -f DESIGN.md
test -d assets
test ! -d references || { echo "不应生成 references"; exit 1; }
test ! -f tech-stack.md
test ! -f design-tokens.md
test ! -f prototype-rules.md
rg -n "DESIGN\\.md|assets|React 18|Tailwind CSS CDN|Babel|single.*HTML|单文件" SKILL.md
rg -n "Visual Theme|Color Palette|Typography|Component|Layout|Interaction|Prompt Hints|Evidence" DESIGN.md
rg -n "function .*\\(|Object\\.assign\\(window|className=|children|props" assets/*.jsx
! rg -n "Runtime Contract|Prototype Runtime|Vue|ant-design-vue|Element Plus|npm install|dev server|node_modules|localhost|/src/|vite|webpack" SKILL.md DESIGN.md assets/*.jsx
```

最后一条如命中项目名称或普通说明文字，需要人工判断；若是原型运行时约束、依赖路径或技术栈要求，验收失败。

## 交付摘要

报告：

```markdown
## 生成 Skill 摘要
- Skill：
- 输出路径：
- 使用的证据：
- DESIGN.md 置信度：
- 生成的 assets：
- 中/低置信度区域：
- 待解决问题：
- 验证结果：
- 临时文件清理：
```

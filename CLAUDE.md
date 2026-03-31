# CLAUDE.md - 插件仓指南

## Constraints

**本文件中 #Constraints 模块内的各约束均为强制性约束，必须严格遵守。**

<constraint>
    <name>Dual Platform Support</name>
    <content>本仓库内的每个插件都必须同时支持 Codex 和 Claude Code。新增插件时，必须同时提供 `.codex-plugin/plugin.json` 与 `.claude-plugin/plugin.json`，且关键元数据保持一致。</content>
</constraint>
<constraint>
    <name>Plugin Layout</name>
    <content>插件源码统一放在仓库根目录下的一级目录中，例如 `specz/`。不得引入额外的 `plugins/plugins/...` 嵌套层级，不得把插件主数据散落到仓库外部目录。</content>
</constraint>
<constraint>
    <name>Marketplace Integrity</name>
    <content>`.agents/plugins/marketplace.json` 与 `.claude-plugin/marketplace.json` 是本仓库内的插件市场入口。修改插件清单时，必须确保 marketplace 与实际插件目录一致，不得保留失效路径或缺失条目。</content>
</constraint>
<constraint>
    <name>Install By Merge</name>
    <content>涉及安装说明或安装辅助时，必须采用“合并已有 marketplace”或“添加 marketplace 来源”的方式；不得建议覆盖用户已有插件配置。Claude Code 优先使用 `/plugin marketplace add ...`，Codex 优先通过安装说明文档指导 agent 合并 marketplace。</content>
</constraint>
<constraint>
    <name>Code Change</name>
    <content>修改前须读取相关文件、确认范围与影响；不引入安全漏洞（OWASP Top 10）；不过度工程化；不添加未请求功能。</content>
</constraint>
<constraint>
    <name>Git</name>
    <content>仅在用户明确要求时创建 commit；使用 conventional commit 格式；不更新 git config；不执行破坏性操作（push --force、reset --hard 等）。</content>
</constraint>

---

## 仓库概览

这是一个面向 **Codex 与 Claude Code 双端兼容** 的插件仓库。

- 仓库根目录承载插件市场入口、安装说明与维护文档
- 每个一级目录插件是一个可分发的本地插件单元
- 插件必须能够在当前仓库被单独 clone 后直接使用

## 仓库职责

当当前工作目录为 `/Users/staff/Documents/agent-workspace/plugins` 时，本目录作为独立插件仓使用：

- 维护 Codex / Claude Code 双端插件 manifest
- 维护本仓库内的 marketplace 入口文件
- 维护插件安装说明与维护流程文档
- 不承担业务应用代码实现

## 目录约定

- `.agents/plugins/marketplace.json`：Codex marketplace 入口
- `.claude-plugin/marketplace.json`：Claude Code marketplace 入口
- `<plugin-name>/`：单个插件目录，内部包含双端 manifest 与 `skills/`
- `codex-plugin-add.md`：Codex 安装指令文档，供 agent 合并 marketplace 时读取
- `scripts/`：维护者使用的辅助脚本，不应作为最终用户安装前置步骤

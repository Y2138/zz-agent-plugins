# Codex 项目级插件安装说明

本说明用于把 `specz`、`specx` 或 `html-agent` 合并安装到 Codex 项目，不覆盖目标项目已有插件和 hooks。

## 选择插件

- `specz`：高能力模型的轻量状态协议，默认直接执行普通任务。
- `specx`：轻量模型的完整规范工作流，包含可选 SessionStart reminder。

- `html-agent`：本地多页 HTML 只读问答助手；复制整个插件以保留本地运行时，不安装 hooks。

## 来源与目标

来源：

- `<仓库根目录>/.agents/plugins/marketplace.json`
- `<仓库根目录>/<插件名>/`

目标：

- `<项目根目录>/.agents/plugins/marketplace.json`
- `<项目根目录>/<插件名>/`
- `<项目根目录>/.codex/hooks.json`，仅安装 `specx` reminder 时使用

## 必须行为

1. 读取来源 marketplace，确认存在所选插件且路径有效。
2. 将整个插件目录复制到目标项目同名一级目录，保留 `.codex-plugin`、`.claude-plugin`、`skills` 和其他已有内容。
3. 按插件 `name` 合并 marketplace 条目：存在则只替换该条目，不存在则追加；保留无关插件、顺序和顶层元数据。
4. 使用项目相对路径，例如 `./specz`、`./specx` 或 `./html-agent`。
5. 不修改用户级 `~/.agents/plugins/marketplace.json`，不覆盖项目已有 marketplace。

## Specx Reminder

只有 `specx` 提供 reminder。用户需要时，将 `<项目根目录>/specx/hooks/codex-hooks.json` 的 `SessionStart` 条目合并到 `<项目根目录>/.codex/hooks.json`：

- 不移除或覆盖无关 hooks；
- 保持命令为 `bash "./specx/hooks/specx-flow-reminder.sh"`；
- 不添加文件编辑、工具调用或提交守卫。

`specz` 不安装 reminder，也不应在每个任务开始前强制影响模型的路径判断。

# Media Prompt 插件

媒体提示插件，用于生成和处理媒体相关的提示和内容。

## 概述

Media Prompt 插件帮助代理创建和管理媒体相关的提示，包括图像描述、视频概念和其他多媒体内容。它为媒体内容的生成和处理提供了结构化的方法。

## 目录结构

```
media-prompt/
├── .claude-plugin/      # Claude Code 插件清单
├── .codex-plugin/       # Codex 插件清单
└── README.md            # 本文件
```

## 安装

### 对于 Codex

1. 将 `media-prompt` 目录复制到项目根目录
2. 复制 `.agents/plugins/marketplace.json` 到项目的 `.agents/plugins/` 目录
3. 参考 `codex-plugin-add.md` 获取详细安装步骤

### 对于 Claude Code

使用市场添加命令：

```
/plugin marketplace add https://github.com/Y2138/zz-agent-plugins/tree/main/media-prompt
```

## 使用方法

- **生成图像描述**：使用 media-prompt 生成详细的图像描述
- **创建视频概念**：为视频内容创建概念和提示
- **处理媒体内容**：管理和处理各种媒体相关的内容生成

## 核心特性

- **双平台支持**：同时兼容 Codex 和 Claude Code
- **媒体内容生成**：专注于媒体相关的提示和内容创建
- **项目级别安装**：支持在项目中独立使用

## 许可证

MIT

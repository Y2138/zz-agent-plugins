#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { execFile } from 'node:child_process';
import { start } from './server.mjs';

const HELP = `HTML Agent · 本地 HTML 只读问答助手

运行环境：Node.js 22.13+；首次使用先在插件目录执行 npm ci --ignore-scripts。

用法：
  html-agent open <入口.html> [--root <授权根目录>] [--port <端口>] [--no-open]
  node html-agent/src/cli.mjs open <入口.html> --root <授权根目录>

默认授权范围为入口 HTML 所在目录及其子目录；不会随跳转扩大权限。
--root 同时是页面资源的站点根目录，必须覆盖 HTML、CSS、JS、图片和跳转目标。
例如 lessons/课件.html 引用 ../assets/course.css 时，应显式授权 lessons 与 assets 的共同父目录。
只提供读取、解释和修改建议，不修改原文件，不执行命令。

模型配置（兼容流式 Chat Completions 与工具调用）：
  HTML_AGENT_BASE_URL  默认 https://api.openai.com/v1
  HTML_AGENT_MODEL     必填，填写服务提供方支持的模型名称
  HTML_AGENT_API_KEY   远端模型必填；本机模型可省略

仅打开可信的本地 HTML；页面中的原有脚本仍会运行。
相关页面与资料片段会发送给你配置的模型，首次提问前需确认。`;

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { root: { type: 'string' }, port: { type: 'string' }, 'no-open': { type: 'boolean' }, help: { type: 'boolean', short: 'h' } } });
  if (values.help || !positionals.length) { console.log(HELP); }
  else {
    if (positionals[0] !== 'open' || positionals.length !== 2) throw new Error('请使用 open <入口.html>，运行 --help 查看帮助。');
    const port = values.port === undefined ? 0 : Number(values.port);
    if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('端口必须是 0–65535 的整数。');
    const service = await start({ entry: positionals[1], root: values.root, port });
    console.log(`HTML Agent · 只读\n授权根目录：${service.root}\n打开链接：${service.url}\n模型：${service.config.ready ? service.config.model : '未配置（页面可阅读，问答暂不可用）'}\n仅打开可信 HTML；页面和相关文件片段将发送给所配置的模型。\n原文件不会被修改。按 Ctrl+C 退出并清除内存对话。`);
    if (!values['no-open']) {
      const [command, args] = process.platform === 'darwin' ? ['open', [service.url]] : process.platform === 'win32' ? ['rundll32.exe', ['url.dll,FileProtocolHandler', service.url]] : ['xdg-open', [service.url]];
      execFile(command, args, error => { if (error) console.error('无法自动打开浏览器，请复制上面的链接。'); });
    }
    for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await service.close(); process.exit(0); });
  }
} catch (error) {
  console.error(`启动失败：${error.message}`);
  process.exitCode = 1;
}

import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createWorkspace, PublicError } from './workspace.mjs';
import { answer, modelConfig } from './agent.mjs';

const PREFIX = '/__html_agent__';
const MIME = { '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const webFile = name => readFile(new URL(`../web/${name}`, import.meta.url), 'utf8');
const token = () => randomBytes(32).toString('hex');
const encodePath = relative => relative.split('/').map(encodeURIComponent).join('/');
const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c');

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type }); res.end(body);
}
function failure(res, error) {
  const message = error instanceof PublicError ? error.message : error.code === 'ENOENT' ? '文件不存在。' : '请求失败，请检查路径或稍后重试。';
  if (!res.headersSent) send(res, error.status || (error.code === 'ENOENT' ? 404 : 500), message);
  else if (!res.destroyed) res.end(`${JSON.stringify({ type: 'error', message })}\n`);
}
function guard(req, res, origin) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (req.headers.host !== new URL(origin).host) throw new PublicError('Host 不受信任。', 403);
  if (!['GET', 'HEAD', 'POST', 'DELETE'].includes(req.method)) throw new PublicError('不支持的请求方法。', 405);
}
async function bodyJson(req) {
  let size = 0; const buffers = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 96 * 1024) throw new PublicError('问题或页面上下文过大。', 413);
    buffers.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(buffers).toString('utf8')); }
  catch { throw new PublicError('请求体不是有效 JSON。'); }
}
async function listen(server, port = 0) {
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return `http://127.0.0.1:${server.address().port}`;
}
function makeServer(handler) {
  const server = http.createServer((req, res) => Promise.resolve(handler(req, res)).catch(error => failure(res, error)));
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}

export async function start({ entry, root = path.dirname(path.resolve(entry)), port = 0, env = process.env }) {
  const workspace = await createWorkspace(root);
  const relative = path.relative(path.resolve(root), path.resolve(entry)).split(path.sep).join('/');
  await workspace.resolveFile(relative);
  if (!/\.html?$/i.test(relative) || relative.startsWith('__html_agent__/')) throw new PublicError('入口必须是授权目录内的 HTML 文件，且不能使用保留目录 __html_agent__。');
  await workspace.readText(relative);
  const config = modelConfig(env), launch = token(), apiKey = token();
  const sessions = new Map(), requests = new Set();
  let docOrigin, appOrigin, cookieName;
  const [widget, panelTemplate, panelScript, panelStyle, markdown] = await Promise.all(['widget.js', 'panel.html', 'panel.js', 'panel.css', 'markdown.js'].map(webFile));
  const [marked, purify] = await Promise.all(['marked/lib/marked.esm.js', 'dompurify/dist/purify.es.mjs'].map(file => readFile(new URL(`../node_modules/${file}`, import.meta.url), 'utf8'))).catch(() => { throw new PublicError('缺少页面渲染依赖，请先在 html-agent 插件目录运行 npm ci --ignore-scripts，再启动服务。'); });

  function session(id) {
    const found = sessions.get(id);
    if (!found) throw new PublicError('对话已过期，请重新打开助手。', 404);
    found.lastUsed = Date.now(); return found;
  }

  const docs = makeServer(async (req, res) => {
    guard(req, res, docOrigin);
    if (!['GET', 'HEAD'].includes(req.method)) throw new PublicError('页面服务只接受读取请求。', 405);
    const url = new URL(req.url, docOrigin);
    if (url.pathname === `${PREFIX}/start/${launch}`) {
      res.setHeader('Set-Cookie', `${cookieName}=${launch}; HttpOnly; SameSite=Strict; Path=/`);
      res.writeHead(303, { Location: `/${encodePath(relative)}` }); res.end(); return;
    }
    if (!req.headers.cookie?.split(';').some(part => part.trim() === `${cookieName}=${launch}`)) throw new PublicError('请使用启动器输出的完整入口链接打开。', 403);
    if (req.headers['service-worker'] === 'script') throw new PublicError('不允许注册持久化 Service Worker。', 403);
    if (url.pathname === `${PREFIX}/widget.js`) return send(res, 200, req.method === 'HEAD' ? '' : widget, 'text/javascript; charset=utf-8');
    if (url.pathname.startsWith(`${PREFIX}/`)) throw new PublicError('保留路径不可用。', 404);
    let requested;
    try { requested = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, ''); }
    catch { throw new PublicError('URL 编码无效。'); }
    if (!requested || requested.endsWith('/')) requested += 'index.html';
    // Directory links receive a trailing slash before resolving index.html.
    try {
      const folder = await workspace.resolveFile(requested, true);
      res.writeHead(302, { Location: `/${encodePath(folder.relative)}/${url.search}` }); res.end(); return;
    } catch (error) { if (error.status === 403) throw error; }
    const extension = path.extname(requested).toLowerCase();
    let content;
    if (['.html', '.htm'].includes(extension)) {
      const html = await workspace.readText(requested);
      const injection = `<script defer src="${docOrigin}${PREFIX}/widget.js" data-panel-origin="${appOrigin}" data-launch="${launch}"></script>`;
      const doctype = html.match(/^(?:\s|<!--[\s\S]*?-->)*<!doctype[^>]*>/i);
      content = doctype ? html.slice(0, doctype[0].length) + injection + html.slice(doctype[0].length) : injection + html;
    } else {
      content = await workspace.readBytes(requested, 32 * 1024 * 1024);
    }
    send(res, 200, req.method === 'HEAD' ? '' : content, MIME[extension] || 'text/plain; charset=utf-8');
  });

  const app = makeServer(async (req, res) => {
    guard(req, res, appOrigin);
    res.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors ${docOrigin}; base-uri 'none'; form-action 'none'`);
    const url = new URL(req.url, appOrigin);
    if (req.method === 'GET' && url.pathname === `/panel/${launch}`) {
      const bootstrap = safeJson({ apiKey, docOrigin });
      return send(res, 200, panelTemplate.replace('BOOTSTRAP_JSON', bootstrap), 'text/html; charset=utf-8');
    }
    const scripts = { '/markdown.js': markdown, '/vendor/marked.js': marked, '/vendor/purify.js': purify };
    if (req.method === 'GET' && Object.hasOwn(scripts, url.pathname)) return send(res, 200, scripts[url.pathname], 'text/javascript; charset=utf-8');
    if (req.method === 'GET' && url.pathname === '/panel.js') return send(res, 200, panelScript, 'text/javascript; charset=utf-8');
    if (req.method === 'GET' && url.pathname === '/panel.css') return send(res, 200, panelStyle, 'text/css; charset=utf-8');
    if (!url.pathname.startsWith('/api/')) throw new PublicError('页面不存在。', 404);
    if (req.headers['x-html-agent-key'] !== apiKey || (req.headers.origin && req.headers.origin !== appOrigin) || req.headers['sec-fetch-site'] === 'cross-site' || req.headers['sec-fetch-site'] === 'same-site') {
      throw new PublicError('未授权的 API 请求。', 403);
    }
    if (['POST', 'DELETE'].includes(req.method) && req.headers.origin !== appOrigin) throw new PublicError('请求来源不受信任。', 403);
    if (req.method === 'GET' && url.pathname === '/api/config') {
      return send(res, 200, JSON.stringify({ root: workspace.root, ready: config.ready, model: config.model, provider: config.provider }), 'application/json');
    }
    if (req.method === 'POST' && url.pathname === '/api/session') {
      if (sessions.size >= 64) throw new PublicError('会话数量已达上限，请关闭旧对话或重启服务。', 429);
      const id = token(); sessions.set(id, { history: [], turns: [], busy: false, lastUsed: Date.now() });
      return send(res, 201, JSON.stringify({ id }), 'application/json');
    }
    if (url.pathname === '/api/session' && req.method === 'GET') {
      return send(res, 200, JSON.stringify({ turns: session(url.searchParams.get('id')).turns }), 'application/json');
    }
    if (url.pathname === '/api/session' && req.method === 'DELETE') {
      const current = session(url.searchParams.get('id'));
      if (current.busy) throw new PublicError('请先停止正在进行的问答。', 409);
      current.history = []; current.turns = [];
      return send(res, 200, '{}', 'application/json');
    }
    if (req.method !== 'POST' || url.pathname !== '/api/chat') throw new PublicError('接口不存在。', 404);
    if (!req.headers['content-type']?.startsWith('application/json')) throw new PublicError('只接受 JSON 请求。', 415);
    const input = await bodyJson(req);
    if (!input || typeof input !== 'object') throw new PublicError('请求格式无效。');
    const current = session(input.session);
    if (input.consent !== true) throw new PublicError('请先确认将相关内容发送给所配置的模型。', 403);
    if (typeof input.question !== 'string' || !input.question.trim() || input.question.length > 4000) throw new PublicError('问题长度须为 1–4000 个字符。');
    const source = input.context;
    if (!source || typeof source.path !== 'string' || !/\.html?$/i.test(source.path)) throw new PublicError('缺少有效的当前 HTML 页面。');
    await workspace.resolveFile(source.path);
    const context = { path: workspace.normalize(source.path) };
    for (const [name, limit] of [['title', 300], ['text', 16000], ['selection', 4000]]) {
      if (typeof source[name] !== 'string' || source[name].length > limit) throw new PublicError('页面上下文格式无效或超过上限。');
      context[name] = source[name];
    }
    if (!config.ready) throw new PublicError('模型尚未配置，请设置环境变量后重启服务。', 503);
    if (current.busy) throw new PublicError('当前对话仍在回答，请稍后重试。', 409);
    current.busy = true;
    const controller = new AbortController(); requests.add(controller);
    const timeout = setTimeout(() => controller.abort(), 120000);
    res.on('close', () => controller.abort());
    res.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8' });
    res.flushHeaders();
    const emit = event => { if (!res.destroyed) res.write(`${JSON.stringify(event)}\n`); };
    const events = [];
    try {
      const pair = await answer({ config, workspace, history: current.history, question: input.question, context, signal: controller.signal, emit: event => { if (event.type === 'tool') events.push(event); emit(event); } });
      controller.signal.throwIfAborted();
      // ponytail: memory-only, last five turns; persistent history is intentionally out of scope.
      current.history = [...current.history, ...pair].slice(-10);
      current.turns = [...current.turns, { question: input.question, page: context.path, answer: pair[1].content, tools: events }].slice(-5);
      emit({ type: 'done' });
    } catch (error) {
      emit({ type: 'error', message: controller.signal.aborted ? '问答已停止或超过两分钟时限。' : error instanceof PublicError ? error.message : '模型连接失败，请检查服务地址和网络。' });
    } finally {
      clearTimeout(timeout); requests.delete(controller); current.busy = false; current.lastUsed = Date.now(); res.end();
    }
  });

  try {
    docOrigin = await listen(docs, port);
    cookieName = `html_agent_${docs.address().port}`;
    appOrigin = await listen(app);
  } catch (error) { docs.close(); app.close(); throw error; }
  const cleanup = setInterval(() => {
    for (const [id, value] of sessions) if (!value.busy && Date.now() - value.lastUsed > 2 * 60 * 60 * 1000) sessions.delete(id);
  }, 60000);
  cleanup.unref();
  return {
    url: `${docOrigin}${PREFIX}/start/${launch}`, docOrigin, appOrigin, root: workspace.root, config: { ready: config.ready, model: config.model, provider: config.provider },
    async close() {
      clearInterval(cleanup); for (const controller of requests) controller.abort();
      await Promise.all([docs, app].map(server => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); })));
    },
  };
}

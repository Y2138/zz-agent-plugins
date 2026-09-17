import { renderMarkdown } from '/markdown.js';
const { apiKey, docOrigin } = JSON.parse(document.getElementById('bootstrap').textContent);
const $ = id => document.getElementById(id);
const storage = {
  get(key) { try { return sessionStorage.getItem(`html-agent:${key}`); } catch { return null; } },
  set(key, value) { try { sessionStorage.setItem(`html-agent:${key}`, value); } catch { /* Storage-disabled browsers still support the current page. */ } },
};
let sessionId, config, busy = false, active, contextWaiter, consentScope = '', followBottom = true;
$('messages').addEventListener('scroll', () => {
  const node = $('messages'); followBottom = node.scrollHeight - node.scrollTop - node.clientHeight < 70;
});
const post = data => parent.postMessage({ channel: 'html-agent', ...data }, docOrigin);
async function api(route, options = {}) {
  const response = await fetch(route, { ...options, headers: { 'x-html-agent-key': apiKey, ...(options.body ? { 'Content-Type': 'application/json' } : {}) } });
  if (!response.ok) throw new Error((await response.text()).slice(0, 500));
  return response;
}
function appendMessage(role, text, label) {
  $('welcome').hidden = true;
  const article = document.createElement('article'); article.className = `message ${role}`;
  const title = document.createElement('div'); title.className = 'label'; title.textContent = label || (role === 'user' ? '你' : 'HTML Agent');
  const content = document.createElement('div'); content.className = 'content'; content.textContent = text;
  if (role === 'assistant') renderMarkdown(content, text, `${docOrigin}/`);
  article.append(title, content); $('messages').append(article); scroll(); return { article, content, text };
}
function appendTool(article, event) {
  const node = document.createElement('details'); node.className = `tool${event.ok ? '' : ' failed'}`;
  const names = { list_files: '列出目录', search_files: '搜索资料', read_file: '读取文件' };
  const summary = document.createElement('summary');
  summary.textContent = `${event.ok ? '✓' : '!'} ${names[event.name] || '拒绝工具'} · ${event.path || '授权根目录'}`;
  const detail = document.createElement('div');
  detail.textContent = event.ok ? [event.query && `搜索：${event.query}`, event.note, event.truncated && '结果有截断或未覆盖的文件。', event.warnings && '部分内容解析存在警告，请核对原文。', event.unsupported && `跳过 ${event.unsupported} 个不支持正文提取的二进制文件。`, event.oversized && `跳过 ${event.oversized} 个超过单文件读取上限的文件。`, event.budgetSkipped && `还有 ${event.budgetSkipped} 个文件未进入本次搜索预算，请缩小搜索目录后重试。`, event.unreadable && `跳过 ${event.unreadable} 个读取失败的文件。`].filter(Boolean).join('\n') || '已完成，只读访问。' : event.error;
  node.open = !event.ok; node.append(summary, detail);
  article.append(node); scroll();
}
function scroll() { if (followBottom) $('messages').scrollTop = $('messages').scrollHeight; }
function controls() {
  $('send').disabled = busy || !config?.ready || !$('consent').checked || !sessionId;
  $('stop').hidden = !busy; $('send').hidden = busy; $('clear').disabled = busy || !sessionId;
  $('question').disabled = busy;
}
function setPage(context) {
  if (!context || typeof context.path !== 'string' || typeof context.selection !== 'string') return;
  $('page').textContent = context.path; $('page').title = context.title || context.path;
  $('selection').textContent = `选区：${context.selection.slice(0, 180)}`; $('selection').hidden = !context.selection;
}
window.addEventListener('message', event => {
  if (event.origin !== docOrigin || event.source !== parent || event.data?.channel !== 'html-agent') return;
  const data = event.data;
  if (data.type === 'visibility') {
    storage.set('open', String(data.open === true));
    if (data.open) $('question').focus();
  }
  if (data.type === 'page') setPage(data.context);
  if (data.type === 'context' && contextWaiter && data.id === contextWaiter.id) { setPage(data.context); contextWaiter.resolve(data.context); contextWaiter = null; }
});
function getContext() {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const timeout = setTimeout(() => { contextWaiter = null; reject(new Error('无法获取当前页面，请刷新后重试。')); }, 3000);
    contextWaiter = { id, resolve(context) { clearTimeout(timeout); resolve(context); } };
    post({ type: 'context-request', id });
  });
}
async function init() {
  config = await (await api('/api/config')).json();
  $('root').textContent = config.root;
  $('model').textContent = `${config.provider} · ${config.model || '未配置 HTML_AGENT_MODEL'}`;
  consentScope = JSON.stringify([config.provider, config.model, config.root]);
  $('consent').checked = storage.get('consent') === consentScope;
  sessionId = storage.get('session');
  let turns = [];
  if (sessionId) {
    try { turns = (await (await api(`/api/session?id=${encodeURIComponent(sessionId)}`)).json()).turns; }
    catch { sessionId = null; }
  }
  if (!sessionId) { sessionId = (await (await api('/api/session', { method: 'POST' })).json()).id; storage.set('session', sessionId); }
  for (const turn of turns) {
    appendMessage('user', turn.question, `你 · ${turn.page}`);
    const message = appendMessage('assistant', turn.answer);
    for (const event of turn.tools) appendTool(message.article, event);
  }
  $('status').textContent = config.ready ? '仅提供建议，不改文件' : '模型未配置';
  if (!config.ready) { $('scope').open = true; appendMessage('error', '请设置 HTML_AGENT_MODEL、HTML_AGENT_API_KEY 后重启服务；本机模型可省略密钥。页面仍可正常阅读。', '问答尚未启用'); }
  controls();
}
$('close').addEventListener('click', () => post({ type: 'close' }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') post({ type: 'close' }); });
$('consent').addEventListener('change', () => { storage.set('consent', $('consent').checked ? consentScope : ''); controls(); });
$('stop').addEventListener('click', () => active?.abort());
$('question').addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); $('form').requestSubmit(); }
});
for (const button of document.querySelectorAll('[data-question]')) button.addEventListener('click', () => { $('question').value = button.dataset.question; $('question').focus(); });
$('clear').addEventListener('click', async () => {
  if (busy) return;
  try {
    await api(`/api/session?id=${encodeURIComponent(sessionId)}`, { method: 'DELETE' });
    for (const article of $('messages').querySelectorAll('.message')) article.remove();
    $('welcome').hidden = false;
  } catch (error) { appendMessage('error', error.message); }
});
$('form').addEventListener('submit', async event => {
  event.preventDefault();
  const question = $('question').value.trim();
  if (busy || !question || !config?.ready || !$('consent').checked || !sessionId) return;
  followBottom = true; busy = true; controls(); $('status').textContent = '正在理解…'; active = new AbortController();
  let message, done = false, renderTimer;
  const render = () => {
    clearTimeout(renderTimer); renderTimer = null;
    if (message) { renderMarkdown(message.content, message.text, `${docOrigin}/`); scroll(); }
  };
  try {
    const context = await getContext();
    active.signal.throwIfAborted();
    appendMessage('user', question, `你 · ${context.path}`); message = appendMessage('assistant', '');
    const response = await api('/api/chat', { method: 'POST', signal: active.signal, body: JSON.stringify({ session: sessionId, question, context, consent: true }) });
    const decoder = new TextDecoder(); let pending = '';
    for await (const chunk of response.body) {
      pending += decoder.decode(chunk, { stream: true });
      let at;
      while ((at = pending.indexOf('\n')) >= 0) {
        const line = pending.slice(0, at); pending = pending.slice(at + 1);
        if (!line.trim()) continue;
        const item = JSON.parse(line);
        if (item.type === 'delta') { message.text += item.text; if (!renderTimer) renderTimer = setTimeout(render, 80); $('status').textContent = '正在回答…'; }
        if (item.type === 'tool') { appendTool(message.article, item); $('status').textContent = '正在查阅资料…'; }
        if (item.type === 'error') throw new Error(item.message);
        if (item.type === 'done') done = true;
      }
    }
    if (!done) throw new Error('连接已中断，本轮未保存，可重试。');
    $('question').value = '';
  } catch (error) {
    if (message && !message.text) message.article.remove();
    appendMessage('error', active.signal.aborted ? '已停止。本轮未保存，你可以修改问题后重试。' : error.message, '未完成');
  } finally {
    render();
    busy = false; active = null; $('status').textContent = '仅提供建议，不改文件'; controls(); $('question').focus();
  }
});
post({ type: 'ready', open: storage.get('open') === 'true' });
init().catch(error => { $('status').textContent = '连接失败'; appendMessage('error', error.message); });

(() => {
  if (window.HTMLAgent?.__htmlAgent) return;
  const script = document.currentScript;
  const defaults = { panelOrigin: script?.dataset.panelOrigin, launch: script?.dataset.launch };
  let mounted;

  function mount(options = {}) {
    if (mounted) return;
    const config = { ...defaults, ...options };
    const origin = new URL(config.panelOrigin).origin;
    if (new URL(origin).hostname !== '127.0.0.1' || !/^[a-f0-9]{64}$/.test(config.launch)) throw new Error('请通过 HTML Agent 本地启动器挂载。');
    const host = document.createElement('div');
    host.dataset.htmlAgent = '';
    host.style.cssText = 'all:initial!important;position:fixed!important;right:20px!important;bottom:20px!important;z-index:2147483647!important;';
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>
      :host{font-family:system-ui,sans-serif}button{display:flex;gap:8px;align-items:center;border:1px solid #d8e5df;border-radius:24px;background:#173e36;color:#fff;padding:12px 18px;box-shadow:0 5px 24px #0002;font:600 14px system-ui;cursor:pointer}button:focus-visible{outline:3px solid #66b39c;outline-offset:3px}button span{font-size:17px}iframe{display:block;width:min(480px,calc(100vw - 32px));height:min(680px,calc(100dvh - 88px));border:1px solid #d7e1da;border-radius:18px;box-shadow:0 15px 70px #102b3430;background:#fafbf8;margin-bottom:10px}iframe[hidden]{display:none}@media print{button,iframe{display:none}}
      </style><iframe title="HTML Agent 只读问答" hidden></iframe><button type="button" aria-expanded="false"><span aria-hidden="true">✳</span> 问问 Agent</button>`;
    const frame = shadow.querySelector('iframe'), button = shadow.querySelector('button');
    frame.src = `${origin}/panel/${config.launch}`;
    frame.referrerPolicy = 'no-referrer';
    frame.allow = 'clipboard-write';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox');
    const controller = new AbortController(), listener = { signal: controller.signal };
    let selection = '', opened = false;
    const post = data => frame.contentWindow?.postMessage({ channel: 'html-agent', ...data }, origin);
    function setOpen(value, notify = true) {
      opened = Boolean(value); frame.hidden = !opened; button.setAttribute('aria-expanded', String(opened));
      if (notify) post({ type: 'visibility', open: opened });
    }
    function context(full = false) {
      const current = window.getSelection()?.toString().trim();
      if (current) selection = current.slice(0, 4000);
      let pagePath = decodeURIComponent(location.pathname).replace(/^\//, '');
      if (!pagePath || pagePath.endsWith('/')) pagePath += 'index.html';
      let text = full ? document.body.innerText : '';
      if (text.length > 16000) {
        const at = selection ? text.indexOf(selection) : -1;
        text = text.slice(Math.max(0, at - 6000), Math.max(0, at - 6000) + 16000);
      }
      return { path: pagePath, title: document.title.slice(0, 300), text, selection };
    }
    button.addEventListener('mousedown', event => event.preventDefault(), listener);
    button.addEventListener('click', () => setOpen(!opened), listener);
    document.addEventListener('selectionchange', () => {
      if (document.activeElement === host) return;
      selection = window.getSelection()?.toString().trim().slice(0, 4000) || '';
      post({ type: 'page', context: context() });
    }, listener);
    window.addEventListener('hashchange', () => { selection = ''; post({ type: 'page', context: context() }); }, listener);
    window.addEventListener('message', event => {
      if (event.origin !== origin || event.source !== frame.contentWindow || event.data?.channel !== 'html-agent') return;
      const data = event.data;
      if (data.type === 'ready') { setOpen(data.open === true, false); post({ type: 'page', context: context() }); }
      if (data.type === 'context-request' && typeof data.id === 'string') post({ type: 'context', id: data.id, context: context(true) });
      if (data.type === 'close') { setOpen(false); button.focus(); }
    }, listener);
    document.body.append(host);
    mounted = { host, controller };
  }

  function unmount() {
    if (!mounted) return;
    mounted.controller.abort(); mounted.host.remove(); mounted = undefined;
  }
  window.HTMLAgent = { __htmlAgent: true, mount, unmount };
  mount();
})();

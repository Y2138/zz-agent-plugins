import { Marked } from '/vendor/marked.js';
import DOMPurify from '/vendor/purify.js';

const escape = text => text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const parser = new Marked({ gfm: true, breaks: true, renderer: {
  html: ({ text }) => escape(text),
  // Model-provided images must not trigger network requests or leak conversation data.
  image: ({ text }) => escape(`[图片：${text || '未加载'}]`),
} });

export function renderMarkdown(element, text, base) {
  const fragment = DOMPurify.sanitize(parser.parse(text), {
    RETURN_DOM_FRAGMENT: true,
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'del', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'input'],
    ALLOWED_ATTR: ['href', 'title', 'start', 'align', 'type', 'checked', 'disabled'],
    ALLOW_DATA_ATTR: false, ALLOW_ARIA_ATTR: false,
  });
  for (const input of fragment.querySelectorAll('input')) {
    if (input.type !== 'checkbox') { input.remove(); continue; }
    input.disabled = true;
  }
  for (const anchor of fragment.querySelectorAll('a')) {
    try {
      const href = anchor.getAttribute('href');
      if (!href) throw new Error();
      const url = new URL(href, base);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error();
      anchor.href = url.href; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
    } catch { anchor.replaceWith(...anchor.childNodes); }
  }
  for (const table of fragment.querySelectorAll('table')) {
    const wrapper = document.createElement('div'); wrapper.className = 'table-scroll'; wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region'); wrapper.setAttribute('aria-label', '表格（可横向滚动）');
    table.replaceWith(wrapper); wrapper.append(table);
  }
  for (const pre of fragment.querySelectorAll('pre')) {
    const wrapper = document.createElement('div'); wrapper.className = 'code-block';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'copy-code'; button.textContent = '复制代码';
    button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(pre.textContent); button.textContent = '已复制'; }
      catch { button.textContent = '请选中代码复制'; }
    });
    pre.tabIndex = 0; pre.replaceWith(wrapper); wrapper.append(button, pre);
  }
  element.replaceChildren(fragment);
}

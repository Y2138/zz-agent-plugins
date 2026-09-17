import { constants } from 'node:fs';
import { lstat, open, opendir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { DOCUMENTS, DOCUMENT_LIMIT, extractDocument } from './documents.mjs';

const SKIP = new Set(['node_modules', 'vendor', '__pycache__']);
const SENSITIVE = /(?:^|[._-])(?:env|secret|secrets|credential|credentials|password|passwords|token|tokens|private|id_rsa|id_ed25519|id_ecdsa|id_dsa)(?:[._-]|$)|\.(?:pem|key|p12|pfx|keystore|jks|kdbx)$/i;
export const TEXT_LIMIT = 1024 * 1024;

export class PublicError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}

function allowedPart(part) {
  return part && !part.startsWith('.') && !SKIP.has(part) && !SENSITIVE.test(part);
}

export async function createWorkspace(rootPath) {
  const root = await realpath(rootPath);
  if (!(await lstat(root)).isDirectory()) throw new PublicError('授权根目录不是目录。');

  function normalize(input = '') {
    if (typeof input !== 'string' || input.length > 2048 || /[\\\x00-\x1f]/.test(input) || path.isAbsolute(input)) {
      throw new PublicError('路径必须是授权根目录内的相对路径。', 403);
    }
    const parts = input.split('/').filter(Boolean);
    if (parts.some(part => !allowedPart(part))) throw new PublicError('路径越界，或属于默认排除的目录／敏感文件。', 403);
    return parts.join('/');
  }

  async function resolveFile(input, directory = false) {
    const relative = normalize(input);
    let current = root;
    for (const part of relative.split('/').filter(Boolean)) {
      current = path.join(current, part);
      if ((await lstat(current)).isSymbolicLink()) throw new PublicError('不允许访问符号链接。', 403);
    }
    const canonical = await realpath(current);
    if (canonical !== root && !canonical.startsWith(root + path.sep)) throw new PublicError('不能访问授权目录之外的文件。', 403);
    const stat = await lstat(current);
    if (directory ? !stat.isDirectory() : !stat.isFile()) throw new PublicError(directory ? '路径不是目录。' : '路径不是普通文件。');
    if (!directory && stat.nlink > 1) throw new PublicError('不允许读取硬链接文件。', 403);
    return { absolute: current, relative, stat };
  }

  async function readBytes(input, limit = TEXT_LIMIT, prefixOnly = false) {
    const file = await resolveFile(input);
    if (!prefixOnly && file.stat.size > limit) throw new PublicError(`文件超过读取上限（${Math.round(limit / 1024)} KB）。`, 413);
    const handle = await open(file.absolute, constants.O_RDONLY | (constants.O_NOFOLLOW || 0));
    try {
      const stat = await handle.stat();
      const again = await resolveFile(input);
      if (stat.dev !== again.stat.dev || stat.ino !== again.stat.ino || stat.nlink > 1 || !stat.isFile()) {
        throw new PublicError('读取期间文件发生变化，请重试。', 409);
      }
      // Fixed-size reads bound memory even if another process is growing the file.
      const buffer = Buffer.alloc(Math.min(stat.size, prefixOnly ? limit : limit + 1));
      let offset = 0;
      while (offset < buffer.length) {
        const { bytesRead } = await handle.read(buffer, offset, buffer.length - offset, offset);
        if (!bytesRead) break;
        offset += bytesRead;
      }
      const finalStat = await handle.stat();
      if (!prefixOnly && (offset > limit || finalStat.size > limit)) throw new PublicError('文件超过读取上限。', 413);
      if (stat.size !== finalStat.size || stat.mtimeMs !== finalStat.mtimeMs) throw new PublicError('读取期间文件发生变化，请重试。', 409);
      return buffer.subarray(0, offset);
    } finally { await handle.close(); }
  }

  async function readText(input) {
    const bytes = await readBytes(input);
    if (bytes.includes(0)) throw new PublicError('不支持二进制文件。', 415);
    try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { throw new PublicError('首版仅支持 UTF-8 文本。', 415); }
  }

  function decodeText(bytes, partial = false) {
    if (bytes.includes(0)) throw new PublicError('检测到二进制内容；图片、音视频、压缩包及其他二进制文件暂不能提取正文。', 415);
    let encoding = 'utf-8';
    if (bytes[0] === 0xff && bytes[1] === 0xfe) encoding = 'utf-16le';
    if (bytes[0] === 0xfe && bytes[1] === 0xff) encoding = 'utf-16be';
    let text;
    try { text = new TextDecoder(encoding, { fatal: true }).decode(bytes); }
    catch { throw new PublicError('不是可解码的文本。非 UTF-8／带 BOM 的 UTF-16 文本请先转码；图片、音视频、压缩包及其他二进制文件暂不能提取正文。', 415); }
    if (/[\x00-\x08\x0b\x0e-\x1f\x7f]/.test(text)) throw new PublicError('检测到二进制内容；图片、音视频、压缩包及其他二进制文件暂不能提取正文。', 415);
    return { text, encoding };
  }

  async function readDocument(input, signal) {
    const extension = path.extname(input).toLowerCase();
    const bytes = await readBytes(input, DOCUMENTS.has(extension) ? DOCUMENT_LIMIT : TEXT_LIMIT);
    signal?.throwIfAborted();
    if (DOCUMENTS.has(extension)) {
      try { return await extractDocument(bytes, extension, signal); }
      catch (error) { throw new PublicError(error.message, 415); }
    }
    if (bytes.subarray(0, 8).equals(Buffer.from('d0cf11e0a1b11ae1', 'hex'))) {
      throw new PublicError('旧版 Office 或加密 Office 文件无法直接提取；请解密并另存为 DOCX、XLSX、PPTX 或文本。', 415);
    }
    return { ...decodeText(bytes), format: 'text', truncated: false };
  }

  async function listFiles(directory = '') {
    const start = await resolveFile(directory, true);
    const files = [];
    let visited = 0, truncated = false;
    async function walk(relative, depth) {
      if (depth > 20) { truncated = true; return; }
      const folder = await resolveFile(relative, true);
      const entries = await opendir(folder.absolute);
      for await (const entry of entries) {
        if (++visited > 3000 || files.length >= 1000) { truncated = true; return; }
        if (!allowedPart(entry.name) || entry.isSymbolicLink()) continue;
        const child = relative ? `${relative}/${entry.name}` : entry.name;
        if (entry.isDirectory()) await walk(child, depth + 1);
        else if (entry.isFile()) {
          try {
            await resolveFile(child);
            files.push(child);
          } catch { /* A removed or excluded file is not part of the readable listing. */ }
        }
        if (truncated && (visited > 3000 || files.length >= 1000)) return;
      }
    }
    await walk(start.relative, 0);
    return { files: files.sort(), truncated };
  }

  async function tool(name, args = {}, signal) {
    signal?.throwIfAborted();
    if (!args || typeof args !== 'object' || Array.isArray(args)) throw new PublicError('工具参数必须是对象。');
    if (name === 'list_files') {
      const result = await listFiles(args.directory ?? '');
      return { files: result.files.slice(0, 200), truncated: result.truncated || result.files.length > 200, note: '目录包含所有未被安全规则排除的普通文件；可列出不代表可解析。支持任意扩展名的文本及 PDF、DOCX、XLSX、PPTX、ODT、ODS、ODP、RTF、EPUB。' };
    }
    if (name === 'read_file') {
      if (typeof args.path !== 'string' || !args.path) throw new PublicError('请指定文件路径。');
      const start = args.start_line ?? 1, count = args.line_count ?? 100;
      if (!Number.isInteger(start) || start < 1 || !Number.isInteger(count) || count < 1 || count > 200) throw new PublicError('行号须为正整数，每次最多读取 200 行。');
      const { text, ...metadata } = await readDocument(args.path, signal);
      const lines = text.split(/\r\n?|\n/);
      const content = lines.slice(start - 1, start - 1 + count).map((line, i) => `${start + i}: ${line}`).join('\n');
      return { ...metadata, path: normalize(args.path), total_lines: lines.length, content: content.slice(0, 16000), truncated: metadata.truncated || content.length > 16000 || start - 1 + count < lines.length };
    }
    if (name === 'search_files') {
      if (typeof args.query !== 'string' || !args.query.trim() || args.query.length > 200) throw new PublicError('搜索词长度须为 1–200 个字符。');
      const { files, truncated } = await listFiles(args.directory ?? '');
      const matches = [];
      let bytes = 0, scanned = 0, skipped = 0, unsupported = 0, oversized = 0, budgetSkipped = 0, unreadable = 0, incomplete = truncated;
      const deadline = Date.now() + 15000;
      for (const file of files) {
        signal?.throwIfAborted();
        if (Date.now() >= deadline) { incomplete = true; break; }
        let document;
        try {
          const { stat } = await resolveFile(file);
          const extension = path.extname(file).toLowerCase();
          const limit = DOCUMENTS.has(extension) ? DOCUMENT_LIMIT : TEXT_LIMIT;
          if (bytes + Math.min(stat.size, 4096) > 8 * TEXT_LIMIT) { skipped++; budgetSkipped++; incomplete = true; continue; }
          if (stat.size > limit) { skipped++; oversized++; incomplete = true; continue; }
          const remaining = AbortSignal.timeout(Math.max(1, deadline - Date.now()));
          const readSignal = signal ? AbortSignal.any([signal, remaining]) : remaining;
          if (DOCUMENTS.has(extension)) {
            if (bytes + stat.size > 8 * TEXT_LIMIT) { skipped++; budgetSkipped++; incomplete = true; continue; }
            bytes += stat.size;
            document = await readDocument(file, readSignal);
          } else {
            const prefix = await readBytes(file, Math.min(4096, TEXT_LIMIT), true);
            try { decodeText(prefix, true); }
            catch (error) { if (error instanceof PublicError && error.status === 415) { skipped++; unsupported++; continue; } throw error; }
            if (bytes + stat.size > 8 * TEXT_LIMIT) { skipped++; budgetSkipped++; incomplete = true; continue; }
            bytes += stat.size;
            document = await readDocument(file, readSignal);
          }
        } catch { signal?.throwIfAborted(); skipped++; unreadable++; incomplete = true; continue; }
        scanned++;
        incomplete ||= document.truncated || Boolean(document.warnings);
        const lines = document.text.split(/\r\n?|\n/), query = args.query.toLocaleLowerCase();
        for (let i = 0; i < lines.length; i++) {
          const at = lines[i].toLocaleLowerCase().indexOf(query);
          if (at >= 0) matches.push({ path: file, line: i + 1, text: lines[i].slice(Math.max(0, at - 120), at + 280), ...(document.note ? { note: document.note } : {}) });
          if (matches.length >= 30) return { matches, scanned_files: scanned, skipped_files: skipped, unsupported_files: unsupported, oversized_files: oversized, budget_skipped_files: budgetSkipped, unreadable_files: unreadable, truncated: true };
        }
      }
      return { matches, scanned_files: scanned, skipped_files: skipped, unsupported_files: unsupported, oversized_files: oversized, budget_skipped_files: budgetSkipped, unreadable_files: unreadable, truncated: incomplete };
    }
    throw new PublicError('只允许 list_files、search_files、read_file。', 403);
  }

  return { root, normalize, resolveFile, readBytes, readText, tool };
}

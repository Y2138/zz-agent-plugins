import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

export const DOCUMENTS = new Set(['.pdf', '.docx', '.pptx', '.xlsx', '.odt', '.odp', '.ods', '.rtf', '.epub']);
export const DOCUMENT_LIMIT = 20 * 1024 * 1024;
export const EXTRACT_LIMIT = 1024 * 1024;
let activeWorkers = 0;

// Parse only validated bytes, never a path/URL. Workers bound CPU time and isolate parser failures.
export function extractDocument(bytes, extension, signal) {
  signal?.throwIfAborted();
  if (activeWorkers >= 2) return Promise.reject(new Error('文档解析繁忙，请稍后重试。'));
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), {
      workerData: { bytes, extension }, execArgv: [], stdout: true, stderr: true,
      resourceLimits: { maxOldGenerationSizeMb: 128 },
    });
    activeWorkers++;
    worker.stdout.resume(); worker.stderr.resume();
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort);
      void worker.terminate().then(() => error ? reject(error) : resolve(result), reject);
    };
    const abort = () => finish(new Error('文档读取已取消。'));
    const timer = setTimeout(() => finish(new Error('文档解析超过 10 秒，请缩小文件或导出为文本后重试。')), 10000);
    signal?.addEventListener('abort', abort, { once: true });
    worker.once('message', result => result.error ? finish(new Error(result.error)) : finish(null, result));
    worker.once('error', () => finish(new Error('文档解析失败或超过内存限制，请导出为文本后重试。')));
    worker.once('exit', () => { activeWorkers--; finish(new Error('文档解析意外中断。')); });
    if (signal?.aborted) abort();
  });
}

if (!isMainThread) {
  try {
    const { parseOffice } = await import('officeparser');
    const ast = await parseOffice(Buffer.from(workerData.bytes), {
      fileType: workerData.extension.slice(1), ocr: false, extractAttachments: false,
      decompressionLimits: { maxUncompressedBytes: 32 * 1024 * 1024, maxZipEntries: 3000, maxTableCells: 100000 },
    });
    const { value, messages = [] } = await ast.to('text', { includeImages: false });
    if (!value.trim()) throw new Error('empty');
    const encoded = Buffer.from(value);
    const truncated = encoded.length > EXTRACT_LIMIT;
    const text = truncated ? encoded.subarray(0, EXTRACT_LIMIT).toString('utf8').replace(/\uFFFD$/, '') : value;
    parentPort.postMessage({ text, truncated, format: workerData.extension.slice(1), note: '以下行号来自提取文本，不是原文档行号；不包含图片识别、公式重算或完整视觉布局。', warnings: (ast.warnings?.length || 0) + messages.length });
  } catch (error) {
    parentPort.postMessage({ error: error.message === 'empty'
      ? '未提取到可读文字；扫描 PDF／图片需要先 OCR，当前不执行图像识别。'
      : '无法解析该文档：可能已加密、损坏、格式不匹配或超过解压限制。请解密或导出为文本后重试。' });
  }
}

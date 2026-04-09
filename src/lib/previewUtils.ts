/**
 * previewUtils.ts
 *
 * 预览工具函数：生成 Blob URL 并注入 iframe
 */

/**
 * 生成完整的 HTML 文档
 */
function buildHtmlDocument(html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      min-height: 100vh; 
      background: #0a0a0a;
      overflow: hidden;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    // 捕获控制台日志
    const _log = console.log;
    console.log = (...args) => {
      _log(...args);
      window.parent.postMessage({ type: 'console', data: args.map(a => String(a)).join(' ') }, '*');
    };
    try {
      ${js}
    } catch(e) {
      console.log('Error: ' + e.message);
    }
  </script>
</body>
</html>`
}

/**
 * 注入预览到 iframe
 * @param iframe - 目标 iframe 元素
 * @param oldUrl - 旧的 Blob URL（如果有）
 * @param html - HTML 代码
 * @param css - CSS 代码
 * @param js - JS 代码
 * @returns 新的 Blob URL
 */
export function injectPreview(
  iframe: HTMLIFrameElement,
  oldUrl: string,
  html: string,
  css: string,
  js: string
): string {
  // 释放旧的 Blob URL
  if (oldUrl && oldUrl.startsWith('blob:')) {
    URL.revokeObjectURL(oldUrl)
  }

  // 构建完整的 HTML 文档
  const fullHtml = buildHtmlDocument(html, css, js)

  // 创建 Blob
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
  const newUrl = URL.createObjectURL(blob)

  // 设置 iframe src
  iframe.src = newUrl

  return newUrl
}

/**
 * 清空预览
 * @param iframe - 目标 iframe 元素
 * @param blobUrl - 当前的 Blob URL
 */
export function clearPreview(iframe: HTMLIFrameElement, blobUrl: string): void {
  // 释放 Blob URL
  if (blobUrl && blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl)
  }

  // 清空 iframe
  iframe.src = 'about:blank'
}

/**
 * 编码分享代码
 * @param html - HTML 代码
 * @param css - CSS 代码
 * @param js - JS 代码
 * @param title - 标题（可选）
 * @returns Base64 编码的分享代码
 */
export function encodeShareCode(html: string, css: string, js: string, title?: string): string {
  const data = JSON.stringify({ html, css, js, title })
  return btoa(unescape(encodeURIComponent(data)))
}

/**
 * 从 URL 解码分享代码
 * @returns 解码后的代码对象，如果没有则返回 null
 */
export function decodeShareCodeFromUrl(): { html: string; css: string; js: string; title?: string } | null {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (!code) return null

  try {
    const decoded = decodeURIComponent(escape(atob(code)))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

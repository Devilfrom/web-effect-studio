/**
 * previewUtils.js — 不含 TS 类型，纯 JS
 *
 * 注意：TS 项目中此文件不参与类型检查，
 * 因此可以在模板字符串里安全地写 </script> 等内容，
 * 不会被 TS 编译器误解析为 JSX 标签闭合符。
 */

// ---------------------------------------------------------------------------
// Console 拦截脚本
// ---------------------------------------------------------------------------

// 将 console.log/warn/error 和 window.onerror 转发到父窗口（postMessage）
const CONSOLE_OVERRIDE = `(function(){
  var _log=console.log,_warn=console.warn,_error=console.error;
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='__console'){
      var prefix=e.data.method==='error'?'\\u274c':e.data.method==='warn'?'\\u26a0\\ufe0f ':'';
      window.parent.postMessage({type:'__console',method:e.data.method,msg:prefix+e.data.msg},'*');
    }
  });
  console.log=function(){
    var a=Array.from(arguments).map(function(v){return typeof v==='object'?JSON.stringify(v):String(v)}).join(' ');
    _log.apply(console,arguments);
    window.parent.postMessage({type:'__console',method:'log',msg:a},'*')
  };
  console.warn=function(){
    var a=Array.from(arguments).map(function(v){return typeof v==='object'?JSON.stringify(v):String(v)}).join(' ');
    _warn.apply(console,arguments);
    window.parent.postMessage({type:'__console',method:'warn',msg:a},'*')
  };
  console.error=function(){
    var a=Array.from(arguments).map(function(v){return typeof v==='object'?JSON.stringify(v):String(v)}).join(' ');
    _error.apply(console,arguments);
    window.parent.postMessage({type:'__console',method:'error',msg:a},'*')
  };
  window.onerror=function(msg){window.parent.postMessage({type:'__console',method:'error',msg:String(msg)},'*')};
})();`

// ---------------------------------------------------------------------------
// HTML 安全转义
// ---------------------------------------------------------------------------

/**
 * 将 '<' + '/script' 或 '<' + '/style' 替换为 HTML 实体，
 * 防止在 style/script 标签内被浏览器误解析为标签闭合。
 *
 * 注意：TS 项目中本文件由 Babel/vite 处理，不经过 TS 编译器，
 * 因此模板字符串中的 </script> 不会触发 JSX 解析器错误。
 */
function escapeForTemplate(str) {
  return str
    .replace(/<\/script/gi, '&lt;</script')
    .replace(/<\/style/gi,  '&lt;</style')
    .replace(/\*\//g, '*\\/')
}

// ---------------------------------------------------------------------------
// Blob URL
// ---------------------------------------------------------------------------

/**
 * 构建预览 Blob URL。
 * @param {string} html
 * @param {string} css
 * @param {string} js
 * @returns {string} Blob URL
 */
export function buildPreviewBlobUrl(html, css, js) {
  const safeHtml = escapeForTemplate(html)
  const safeCss  = escapeForTemplate(css)
  const safeJs   = escapeForTemplate(js)

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    ${safeCss}
  </style>
</head>
<body>
${safeHtml}
<script>${safeJs}<\/script>
<script>${CONSOLE_OVERRIDE}<\/script>
</body>
</html>`

  return URL.createObjectURL(new Blob([fullHtml], { type: 'text/html' }))
}

/**
 * 注入预览到 iframe，自动清理旧 Blob URL。
 * @returns 本次新 Blob URL
 */
export function injectPreview(iframe, oldUrl, html, css, js) {
  if (oldUrl) URL.revokeObjectURL(oldUrl)
  const newUrl = buildPreviewBlobUrl(html, css, js)
  iframe.src = newUrl
  return newUrl
}

/**
 * 清空 iframe 预览，释放 Blob URL。
 */
export function clearPreview(iframe, blobUrl) {
  if (blobUrl) URL.revokeObjectURL(blobUrl)
  iframe.src = 'about:blank'
}

// ---------------------------------------------------------------------------
// 分享链接
// ---------------------------------------------------------------------------

/**
 * 打包代码为 base64 分享码。
 * @returns {string}
 */
export function encodeShareCode(html, css, js, title) {
  const payload = JSON.stringify({ h: html, c: css, j: js, t: title })
  return btoa(unescape(encodeURIComponent(payload)))
}

/**
 * 从 URL 参数 ?code=xxx 解析代码片段。
 * @returns {{ html:string, css:string, js:string, title:string } | null}
 */
export function decodeShareCodeFromUrl() {
  try {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) return null
    const raw = decodeURIComponent(escape(atob(code)))
    const data = JSON.parse(raw)
    return {
      html:  data.h ?? '',
      css:   data.c ?? '',
      js:    data.j ?? '',
      title: data.t ?? '',
    }
  } catch {
    return null
  }
}

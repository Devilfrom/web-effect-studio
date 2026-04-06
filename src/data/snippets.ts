/**
 * snippets.ts
 *
 * 编辑器代码片段（Snippet）定义。
 * 包含 HTML / CSS / JavaScript 常用模板，供用户一键插入。
 */

// ---------------------------------------------------------------------------
// 类型
// ---------------------------------------------------------------------------

export type SnippetLanguage = 'html' | 'css' | 'javascript'

export interface Snippet {
  /** UI 显示文字 */
  label: string
  /** UI 图标 */
  icon: string
  /** 插入的代码内容 */
  code: string
}

// ---------------------------------------------------------------------------
// HTML 片段
// ---------------------------------------------------------------------------

export const HTML_SNIPPETS: Snippet[] = [
  {
    label: 'Canvas',
    icon: '◻',
    code: '<canvas id="c"></canvas>',
  },
  {
    label: '按钮',
    icon: '▶',
    code: '<button id="btn">点击我</button>',
  },
  {
    label: '输入框',
    icon: '▭',
    code: '<input type="text" placeholder="请输入...">',
  },
  {
    label: '计时器',
    icon: '⏱',
    code: `<div id="timer">0</div>
<button id="start">开始</button>
<button id="stop">停止</button>`,
  },
]

// ---------------------------------------------------------------------------
// CSS 片段
// ---------------------------------------------------------------------------

export const CSS_SNIPPETS: Snippet[] = [
  {
    label: '重置',
    icon: '↺',
    code: '*{margin:0;padding:0;box-sizing:border-box}',
  },
  {
    label: '居中',
    icon: '⊕',
    code: 'display:flex;align-items:center;justify-content:center',
  },
  {
    label: '渐变',
    icon: '◐',
    code: 'background:linear-gradient(135deg,#667eea,#764ba2)',
  },
  {
    label: '动画',
    icon: '⟳',
    code: '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
  },
]

// ---------------------------------------------------------------------------
// JavaScript 片段
// ---------------------------------------------------------------------------

export const JS_SNIPPETS: Snippet[] = [
  {
    label: 'Canvas 初始化',
    icon: '◻',
    code: `const canvas = document.getElementById("c")
const ctx = canvas.getContext("2d")
canvas.width = innerWidth
canvas.height = innerHeight
window.addEventListener("resize", () => {
  canvas.width = innerWidth
  canvas.height = innerHeight
})`,
  },
  {
    label: '随机整数',
    icon: '⚄',
    code: 'const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min',
  },
  {
    label: '碰撞检测',
    icon: '◈',
    code: 'function collides(a, b) {\n  return a.x < b.x + b.w && a.x + a.w > b.x &&\n         a.y < b.y + b.h && a.y + a.h > b.y\n}',
  },
  {
    label: '动画循环',
    icon: '⟳',
    code: '(function loop() {\n  requestAnimationFrame(loop)\n})()',
  },
]

// ---------------------------------------------------------------------------
// 统一导出
// ---------------------------------------------------------------------------

export const SNIPPETS: Record<SnippetLanguage, Snippet[]> = {
  html:       HTML_SNIPPETS,
  css:        CSS_SNIPPETS,
  javascript: JS_SNIPPETS,
}

export const TAB_LABELS: Record<SnippetLanguage, string> = {
  html:       'HTML',
  css:        'CSS',
  javascript: 'JS',
}

export const MONACO_LANGUAGE: Record<SnippetLanguage, string> = {
  html:       'html',
  css:        'css',
  javascript: 'javascript',
}

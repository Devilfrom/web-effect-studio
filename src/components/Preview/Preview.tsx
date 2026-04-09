/**
 * Preview.tsx
 *
 * 编辑器右侧实时预览组件。
 *
 * 渲染机制：
 * - 将 html/css/js 组装成完整 HTML 文档（Blob URL）
 * - Blob URL 注入到 sandboxed iframe，避免 </script> 截断问题
 * - console.log/warn/error 通过 postMessage 转发到父窗口
 */

import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { injectPreview } from '@/lib/previewUtils'

// ---------------------------------------------------------------------------
// 类型
// ---------------------------------------------------------------------------

export interface PreviewProps {
  /** HTML 片段 */
  html?: string
  /** CSS 样式 */
  css?: string
  /** JavaScript 代码 */
  js?: string
  /** console 输出回调 */
  onConsoleLog?: (log: string) => void
}

/**
 * 暴露给父组件的方法（通过 forwardRef）
 */
export interface PreviewHandle {
  /** 手动刷新预览 */
  refresh: () => void
}

// ---------------------------------------------------------------------------
// 组件
// ---------------------------------------------------------------------------

export const Preview = forwardRef<PreviewHandle, PreviewProps>(
  ({ html = '', css = '', js = '', onConsoleLog }, ref) => {
    const iframeRef   = useRef<HTMLIFrameElement>(null)
    const blobUrlRef  = useRef<string>('')

    // 暴露 refresh 方法
    useImperativeHandle(ref, () => ({
      refresh: () => {
        if (iframeRef.current) {
          blobUrlRef.current = injectPreview(
            iframeRef.current,
            blobUrlRef.current,
            html, css, js
          )
        }
      },
    }))

    // 内容变化 → 更新 iframe
    useEffect(() => {
      if (!iframeRef.current) return
      blobUrlRef.current = injectPreview(
        iframeRef.current,
        blobUrlRef.current,
        html, css, js
      )
    }, [html, css, js])

    // 组件卸载 / effect 清理：释放 Blob URL
    useEffect(() => {
      return () => {
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current)
          blobUrlRef.current = ''
        }
      }
    }, [])

    // 监听来自 iframe 的 console 消息
    useEffect(() => {
      const handler = (e: MessageEvent) => {
        if (e.data?.type === '__console' && onConsoleLog) {
          onConsoleLog(e.data.msg)
        }
      }
      window.addEventListener('message', handler)
      return () => window.removeEventListener('message', handler)
    }, [onConsoleLog])

    // 直接返回 iframe，不再包裹 div（由父组件控制样式）
    return (
      <iframe
        ref={iframeRef}
        id="preview-frame"
        title="预览"
        className="w-full h-full border-none bg-white"
        // allow-scripts: 运行用户 JS
        // allow-same-origin: 允许 Blob URL 加载
        // allow-modals: 允许 alert/confirm
        sandbox="allow-scripts allow-same-origin allow-modals"
      />
    )
  }
)

Preview.displayName = 'Preview'

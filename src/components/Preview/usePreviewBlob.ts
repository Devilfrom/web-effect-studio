/**
 * usePreviewBlob.ts
 *
 * 管理 iframe 预览 Blob URL 的 React Hook。
 *
 * 功能：
 * - 生成 / 更新 Blob URL
 * - 处理 hover 时加载预览、离开时清空
 * - 自动释放旧 Blob URL，防止内存泄漏
 *
 * 适用场景：画廊卡片、精选卡片、我的项目卡片
 */

import { useRef, useCallback } from 'react'
import type { RefObject } from 'react'
import { injectPreview, clearPreview } from '@/lib/previewUtils'

export interface PreviewTarget {
  html: string
  css: string
  js: string
}

/**
 * Hook：管理单个 iframe 的预览状态
 *
 * @param iframeRef - iframe DOM 引用
 * @returns
 *   loadPreview()   - 加载当前代码到 iframe
 *   clearPreviewFn() - 清空 iframe
 *
 * 示例：
 *   const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, { html, css, js })
 *   onMouseEnter={loadPreview}
 *   onMouseLeave={clearPreviewFn}
 */
export function usePreviewBlob(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  target: PreviewTarget
) {
  const blobUrlRef = useRef<string>('')

  /** 加载预览：生成 Blob URL 并注入 iframe */
  const loadPreview = useCallback(() => {
    if (!iframeRef.current) return
    blobUrlRef.current = injectPreview(
      iframeRef.current,
      blobUrlRef.current,
      target.html,
      target.css,
      target.js,
    )
  }, [iframeRef, target.html, target.css, target.js])

  /** 清空预览：显示 about:blank 并释放 Blob */
  const clearPreviewFn = useCallback(() => {
    if (!iframeRef.current) return
    clearPreview(iframeRef.current, blobUrlRef.current)
    blobUrlRef.current = ''
  }, [iframeRef])

  return { loadPreview, clearPreviewFn }
}

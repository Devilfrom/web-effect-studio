/**
 * previewUtils.d.ts
 *
 * previewUtils.js 的 TypeScript 类型声明。
 * 导出函数与 .js 文件中实际导出保持一致。
 */

export function buildPreviewBlobUrl(html: string, css: string, js: string): string

export function injectPreview(
  iframe: HTMLIFrameElement,
  oldUrl: string | null,
  html: string,
  css: string,
  js: string,
): string

export function clearPreview(iframe: HTMLIFrameElement, blobUrl: string | null): void

export function encodeShareCode(
  html: string,
  css: string,
  js: string,
  title: string,
): string

export function decodeShareCodeFromUrl(): {
  html: string
  css: string
  js: string
  title: string
} | null

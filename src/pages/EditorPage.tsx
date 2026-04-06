/**
 * EditorPage.tsx — 编辑器页面（二次元风格版）
 *
 * 功能：
 * - 三标签编辑器（HTML / CSS / JavaScript） + Monaco Editor
 * - 实时预览（Blob URL）
 * - 全屏预览模式
 * - 保存 / 自动保存 / Fork / 删除
 * - 分享链接
 * - 控制台输出面板
 * - 键盘快捷键
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { effects } from '@/data/effects'
import { useProjectStore, type Project } from '@/stores/projectStore'
import { CodeEditor } from '@/components/Editor/CodeEditor'
import { Preview } from '@/components/Preview/Preview'
import { decodeShareCodeFromUrl, encodeShareCode } from '@/lib/previewUtils'
import type { SnippetLanguage } from '@/data/snippets'

// ---------------------------------------------------------------------------
// 类型
// ---------------------------------------------------------------------------

type Tab = SnippetLanguage

// ---------------------------------------------------------------------------
// 辅助函数
// ---------------------------------------------------------------------------

function isBuiltin(id: string) {
  return effects.some((e) => e.id === id)
}

function findBuiltin(id: string) {
  return effects.find((e) => e.id === id) ?? null
}

function findUserProject(id: string, projects: Project[]) {
  return projects.find((p) => p.id === id) ?? null
}

function totalChars(html: string, css: string, js: string) {
  return html.length + css.length + js.length
}

// ---------------------------------------------------------------------------
// 子组件：标签页按钮
// ---------------------------------------------------------------------------

const TABS: { key: Tab; label: string; icon: string; shortcut: string }[] = [
  { key: 'html', label: 'HTML', icon: '🌐', shortcut: '1' },
  { key: 'css', label: 'CSS', icon: '🎨', shortcut: '2' },
  { key: 'javascript', label: 'JS', icon: '⚡', shortcut: '3' },
]

// ---------------------------------------------------------------------------
// 主组件
// ---------------------------------------------------------------------------

export function EditorPage() {
  const { id = 'new' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects, addProject, updateProject } = useProjectStore()

  // ── 路由解析 ──
  const builtinEffect = isBuiltin(id) ? findBuiltin(id) : null
  const isBuiltinPage = !!builtinEffect
  const isNewPage = id === 'new'
  const userProject = !isBuiltinPage && !isNewPage ? findUserProject(id, projects) : null

  // ── 分享数据（URL 参数） ──
  const shareData = !isBuiltinPage ? decodeShareCodeFromUrl() : null

  // ── 代码状态 ──
  const [html, setHtml] = useState(shareData?.html ?? userProject?.html ?? builtinEffect?.html ?? '')
  const [css, setCss] = useState(shareData?.css ?? userProject?.css ?? builtinEffect?.css ?? '')
  const [js, setJs] = useState(shareData?.js ?? userProject?.js ?? builtinEffect?.js ?? '')
  const [title, setTitle] = useState(
    shareData?.title ?? userProject?.title ?? builtinEffect?.title ?? '未命名效果'
  )

  // ── UI 状态 ──
  const [activeTab, setActiveTab] = useState<Tab>('html')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(builtinEffect?.likeCount ?? 0)
  const [forked, setForked] = useState(false)
  const [forkedId, setForkedId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // ── 预览刷新引用的最新代码（useRef 避免闭包问题） ──
  const codeRef = useRef({ html, css, js, title })

  // ── 当前标签对应的代码 ──
  const getActiveCode = useCallback((tab: Tab) => {
    if (tab === 'html') return html
    if (tab === 'css') return css
    return js
  }, [html, css, js])

  const setActiveCode = useCallback((tab: Tab, value: string) => {
    if (tab === 'html') { setHtml(value); codeRef.current.html = value }
    if (tab === 'css') { setCss(value); codeRef.current.css = value }
    if (tab === 'javascript') { setJs(value); codeRef.current.js = value }
  }, [])

  // ── 保存 ──
  const handleSave = useCallback((showMsg = true) => {
    const current = codeRef.current
    const newTitle = title.trim() || current.title
    const proj: Project = {
      id: userProject?.id ?? `proj_${Date.now()}`,
      title: newTitle,
      html: current.html,
      css: current.css,
      js: current.js,
      createdAt: userProject?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    }

    if (userProject) {
      updateProject(userProject.id, proj)
    } else {
      addProject(proj)
      setForkedId(proj.id)
    }
    setTitle(newTitle)

    if (showMsg) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }, [title, userProject, addProject, updateProject])

  // ── Fork 内置效果 ──
  const handleFork = useCallback(() => {
    const effect = builtinEffect
    const proj: Project = {
      id: `proj_${Date.now()}`,
      title: `fork: ${effect?.title ?? title}`,
      html: effect?.html ?? html,
      css: effect?.css ?? css,
      js: effect?.js ?? js,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    addProject(proj)
    setForked(true)
    setForkedId(proj.id)
    setTimeout(() => navigate(`/editor/${proj.id}`), 1000)
  }, [builtinEffect, html, css, js, title, addProject, navigate])

  // ── 分享 ──
  const handleShare = useCallback(async () => {
    const current = codeRef.current
    const code = encodeShareCode(current.html, current.css, current.js, current.title)
    const url = `${window.location.origin}/editor/${isBuiltinPage ? 'new' : id}?code=${code}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [id, isBuiltinPage])

  // ── 自动保存（每 30 秒）──
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if ((isNewPage || userProject) && (html || css || js)) {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = setTimeout(() => handleSave(false), 30_000)
    }
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [html, css, js, title, handleSave, isNewPage, userProject])

  // ── 键盘快捷键 ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.key === 's') {
        e.preventDefault()
        handleSave(true)
        setShowSaveModal(false)
      }
      if (ctrl && e.key === 'Enter') {
        e.preventDefault()
        setRefreshKey((k) => k + 1)
      }
      if (ctrl && e.key === '1') { e.preventDefault(); setActiveTab('html') }
      if (ctrl && e.key === '2') { e.preventDefault(); setActiveTab('css') }
      if (ctrl && e.key === '3') { e.preventDefault(); setActiveTab('javascript') }
      if (e.key === 'Escape') {
        setShowMenu(false)
        setShowSaveModal(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave])

  // ── 预览刷新时使用最新代码 ──
  useEffect(() => {
    codeRef.current = { html, css, js, title }
  }, [html, css, js, title])

  const previewKey = `preview-${refreshKey}`
  const charCount = totalChars(html, css, js)

  // ---------------------------------------------------------------------------
  // 渲染
  // ---------------------------------------------------------------------------

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0f0a1e] via-[#1a1035] to-[#0f172a] text-white overflow-hidden">
      {/* ── 顶部工具栏 ── */}
      <div className="glass border-b border-white/5 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-4 flex-wrap shrink-0">
        {/* 返回 */}
        <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-pink-400 transition-colors text-xs sm:text-sm shrink-0">
          <span>←</span>
          <span className="hidden sm:inline">画廊</span>
        </Link>
        <div className="w-px h-4 bg-white/10 shrink-0" />

        {/* 标题输入 */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent text-xs sm:text-sm font-bold text-white/80 focus:outline-none flex-1 min-w-0 max-w-[140px] sm:max-w-xs"
          placeholder="效果标题"
        />

        {/* 内置效果操作 */}
        {isBuiltinPage && (
          <div className="hidden xs:flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1) }}
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border transition-all ${
                liked ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' : 'bg-white/5 border-white/10 text-white/50 hover:border-pink-500/30'
              }`}
            >
              {liked ? '❤️' : '🤍'} {likeCount}
            </button>
            <button
              onClick={handleFork}
              className={`px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold border transition-all ${
                forked
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-300 hover:from-pink-500/30 hover:to-purple-500/30'
              }`}
            >
              {forked ? '✓ 已Fork' : '✿ Fork'}
            </button>
          </div>
        )}

        {/* 保存成功提示 */}
        {saved && <span className="text-[10px] sm:text-xs text-green-400 shrink-0 animate-pulse">✓ 已保存</span>}

        {/* Fork 后跳转 */}
        {forked && !isBuiltinPage && forkedId && (
          <Link to={`/editor/${forkedId}`} className="text-[10px] sm:text-xs text-purple-400 hover:text-pink-400 transition-colors hidden sm:inline">
            → 继续编辑
          </Link>
        )}

        {/* 快捷键提示 */}
        <div className="shortcut-hints hidden lg:flex items-center gap-1 text-[10px] text-white/20 shrink-0">
          <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-white/30">Ctrl+S</kbd><span>保存</span>
          <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-white/30 ml-1">Ctrl+↵</kbd><span>刷新</span>
        </div>

        {/* 移动端预览切换 */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="md:hidden px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 text-[10px] sm:text-xs hover:bg-white/10 transition-colors shrink-0"
        >
          {showPreview ? '✏️ 代码' : '👁️ 预览'}
        </button>

        {/* 控制台 */}
        <button
          onClick={() => setShowConsole(!showConsole)}
          className={`hidden sm:block px-2.5 py-1 rounded-lg text-[10px] sm:text-xs transition-all shrink-0 ${
            showConsole ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
          }`}
        >
          📋 {showConsole ? '隐藏' : '控制台'}
        </button>

        {/* 分享 */}
        <button
          onClick={handleShare}
          className="hidden sm:block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[10px] sm:text-xs hover:bg-white/10 hover:border-pink-500/30 transition-all shrink-0"
        >
          {copied ? '✓ 已复制!' : '🔗 分享'}
        </button>

        {/* 全屏预览 */}
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className={`hidden sm:block px-2.5 py-1 rounded-lg text-[10px] sm:text-xs transition-all shrink-0 ${
            fullscreen ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
          }`}
          title={fullscreen ? '返回编辑器' : '全屏预览'}
        >
          {fullscreen ? '← 编辑器' : '⛶ 全屏'}
        </button>

        {/* 更多菜单 */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            ⋯
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 sm:w-44 glass rounded-xl overflow-hidden shadow-xl z-50">
              <button
                onClick={() => { handleSave(true); setShowMenu(false); setShowSaveModal(true) }}
                className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-white/70 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <span>💾</span> 保存项目
              </button>
              <button
                onClick={() => { handleSave(false); setShowMenu(false) }}
                className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-white/70 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <span>📋</span> 另存为新项目
              </button>
              {isBuiltinPage && (
                <button
                  onClick={() => { handleFork(); setShowMenu(false) }}
                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-pink-300 hover:bg-pink-500/10 transition-colors flex items-center gap-2"
                >
                  <span>✿</span> Fork 到我的项目
                </button>
              )}
              <div className="border-t border-white/5" />
              <Link
                to="/my"
                onClick={() => setShowMenu(false)}
                className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-white/40 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <span>📁</span> 我的项目
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── 编辑区 + 预览 ── */}
      <div
        className="editor-layout flex-1 flex overflow-hidden"
        style={{ height: showConsole ? 'calc(100vh - 110px)' : 'calc(100vh - 56px)' }}
      >
        {/* 全屏预览 */}
        {fullscreen && (
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 glass border-b border-white/5 shrink-0">
              <span className="text-sm text-white/60 truncate max-w-[200px]">{title}</span>
              <button
                onClick={() => setFullscreen(false)}
                className="px-3 py-1 rounded-lg bg-white/10 text-white/70 text-xs hover:bg-white/20 transition-colors"
              >
                ← 返回编辑器
              </button>
            </div>
            <div className="flex-1 bg-white">
              <Preview html={html} css={css} js={js} onConsoleLog={(log) => setConsoleLogs((prev) => [...prev.slice(-49), log])} />
            </div>
          </div>
        )}

        {/* 正常编辑模式 */}
        {!fullscreen && (
          <>
            {/* 代码编辑器 */}
            <div className={`editor-panel flex-1 flex flex-col border-r border-white/5 ${showPreview ? 'hidden md:flex' : 'flex'}`}>
              {/* 标签栏 */}
              <div className="flex bg-[#0a0a14]/80 border-b border-white/5 shrink-0">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-mono transition-all relative ${
                      activeTab === t.key
                        ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-300 border-b-2 border-pink-500'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                    <span className="text-[8px] sm:text-[9px] text-white/20 ml-1">⌘{t.shortcut}</span>
                  </button>
                ))}
                <span className="ml-auto px-3 text-[10px] sm:text-xs text-white/30 self-center hidden sm:inline">
                  {charCount.toLocaleString()} 字符
                </span>
              </div>

              {/* 编辑器 */}
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  key={`editor-${refreshKey}`}
                  language={activeTab}
                  value={getActiveCode(activeTab)}
                  onChange={(v) => setActiveCode(activeTab, v ?? '')}
                />
              </div>
            </div>

            {/* 预览面板 */}
            <div className={`preview-panel flex flex-col ${showPreview ? 'flex' : 'hidden md:flex'} w-full md:w-1/2 lg:w-[45%]`}>
              <div className="flex items-center justify-between px-3 py-2 bg-[#0a0a14]/80 border-b border-white/5 shrink-0">
                <span className="text-[10px] sm:text-xs text-white/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  实时预览
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRefreshKey((k) => k + 1)}
                    className="text-[10px] sm:text-xs text-white/30 hover:text-pink-400 transition-colors"
                    title="刷新预览"
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => setFullscreen(true)}
                    className="text-[10px] sm:text-xs text-white/30 hover:text-pink-400 transition-colors hidden sm:block"
                    title="全屏预览"
                  >
                    ⛶
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white overflow-hidden">
                <Preview
                  key={previewKey}
                  html={html}
                  css={css}
                  js={js}
                  onConsoleLog={(log) => setConsoleLogs((prev) => [...prev.slice(-49), log])}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 控制台面板 ── */}
      {showConsole && (
        <div className="h-20 sm:h-24 glass border-t border-white/5 px-3 sm:px-4 py-2 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-xs text-white/40 flex items-center gap-1.5">
              <span>📋</span> 控制台
            </span>
            <button
              onClick={() => setConsoleLogs([])}
              className="text-[10px] sm:text-xs text-white/20 hover:text-pink-400 transition-colors"
            >
              ✕ 清空
            </button>
          </div>
          {consoleLogs.length === 0 ? (
            <div className="text-[10px] sm:text-xs text-white/20">暂无日志输出...</div>
          ) : (
            consoleLogs.map((log, i) => (
              <div key={i} className="text-[10px] sm:text-xs text-green-400 font-mono py-0.5">
                → {log}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── 保存弹窗 ── */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSaveModal(false)}>
          <div className="glass w-full max-w-sm p-5 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
              <span>💾</span> 保存项目
            </h3>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleSave(true); setShowSaveModal(false) } }}
              placeholder="输入项目名称..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm mb-4 focus:border-pink-500/50 focus:bg-white/10 transition-all"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { handleSave(true); setShowSaveModal(false) }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-xs sm:text-sm font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                ✓ 保存
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/50 hover:bg-white/10 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

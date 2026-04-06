/**
 * EditorPage.tsx — 编辑器页面
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

/** 判断是否为内置效果 */
function isBuiltin(id: string) {
  return effects.some((e) => e.id === id)
}

/** 根据 id 查找内置效果 */
function findBuiltin(id: string) {
  return effects.find((e) => e.id === id) ?? null
}

/** 根据 id 查找用户项目 */
function findUserProject(id: string, projects: Project[]) {
  return projects.find((p) => p.id === id) ?? null
}

/** 计算总代码行数 */
function totalChars(html: string, css: string, js: string) {
  return html.length + css.length + js.length
}

// ---------------------------------------------------------------------------
// 子组件：标签页按钮
// ---------------------------------------------------------------------------

const TABS: { key: Tab; label: string; shortcut: string }[] = [
  { key: 'html',       label: 'HTML', shortcut: '1' },
  { key: 'css',        label: 'CSS',  shortcut: '2' },
  { key: 'javascript',  label: 'JS',   shortcut: '3' },
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
  const isNewPage      = id === 'new'
  const userProject    = !isBuiltinPage && !isNewPage ? findUserProject(id, projects) : null

  // ── 分享数据（URL 参数） ──
  const shareData = !isBuiltinPage ? decodeShareCodeFromUrl() : null

  // ── 代码状态 ──
  const [html, setHtml]   = useState(shareData?.html ?? userProject?.html ?? builtinEffect?.html ?? '')
  const [css, setCss]     = useState(shareData?.css ?? userProject?.css ?? builtinEffect?.css ?? '')
  const [js, setJs]       = useState(shareData?.js  ?? userProject?.js  ?? builtinEffect?.js  ?? '')
  const [title, setTitle] = useState(
    shareData?.title ?? userProject?.title ?? builtinEffect?.title ?? '我的效果'
  )

  // ── UI 状态 ──
  const [activeTab, setActiveTab] = useState<Tab>('html')
  const [copied, setCopied]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showMenu, setShowMenu]   = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [liked, setLiked]         = useState(false)
  const [likeCount, setLikeCount] = useState(builtinEffect?.likeCount ?? 0)
  const [viewCount, setViewCount] = useState(builtinEffect?.viewCount ?? 0)
  const [forked, setForked]       = useState(false)
  const [forkedId, setForkedId]   = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)   // 用于强制刷新 Preview
  const [fullscreen, setFullscreen] = useState(false)
  const [showPreview, setShowPreview] = useState(false) // 移动端预览切换

  // ── 预览刷新引用的最新代码（useRef 避免闭包问题） ──
  const codeRef = useRef({ html, css, js, title })

  // ── 当前标签对应的代码 ──
  const getActiveCode = useCallback((tab: Tab) => {
    if (tab === 'html') return html
    if (tab === 'css')  return css
    return js
  }, [html, css, js])

  const setActiveCode = useCallback((tab: Tab, value: string) => {
    if (tab === 'html') { setHtml(value);   codeRef.current.html = value }
    if (tab === 'css')  { setCss(value);   codeRef.current.css  = value }
    if (tab === 'javascript') { setJs(value); codeRef.current.js = value }
  }, [])

  // ── 保存 ──
  const handleSave = useCallback((showMsg = true) => {
    const current = codeRef.current
    const newTitle = title.trim() || current.title
    const proj: Project = {
      id:       userProject?.id ?? `proj_${Date.now()}`,
      title:    newTitle,
      html:     current.html,
      css:      current.css,
      js:       current.js,
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
      id:        `proj_${Date.now()}`,
      title:     `fork: ${effect?.title ?? title}`,
      html:      effect?.html ?? html,
      css:       effect?.css  ?? css,
      js:        effect?.js   ?? js,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, css, js, title])

  // ── 浏览数（仅内置效果）──
  useEffect(() => {
    if (builtinEffect) setViewCount((v) => v + 1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      if (ctrl && e.key === '1') { e.preventDefault(); setActiveTab('html')      }
      if (ctrl && e.key === '2') { e.preventDefault(); setActiveTab('css')       }
      if (ctrl && e.key === '3') { e.preventDefault(); setActiveTab('javascript') }
      if (e.key === 'Escape') {
        setShowMenu(false)
        setShowSaveModal(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSave])

  // ── 预览刷新时使用最新代码（注入到 ref）──
  useEffect(() => {
    codeRef.current = { html, css, js, title }
  }, [html, css, js, title])

  // 预览 key：变化时强制重新挂载 Preview，重建 Blob URL
  const previewKey = `preview-${refreshKey}`

  // ── 总字符数（用于状态栏显示）──
  const charCount = totalChars(html, css, js)

  // ---------------------------------------------------------------------------
  // 渲染
  // ---------------------------------------------------------------------------

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-white overflow-hidden">

      {/* ── 顶部工具栏 ── */}
      <TopBar
        title={title}
        onTitleChange={setTitle}
        isBuiltin={isBuiltinPage}
        liked={liked}
        likeCount={likeCount}
        viewCount={viewCount}
        onLike={() => {
          setLiked(!liked)
          setLikeCount((prev) => liked ? prev - 1 : prev + 1)
        }}
        saved={saved}
        copied={copied}
        showConsole={showConsole}
        fullscreen={fullscreen}
        forked={forked}
        forkedId={forkedId}
        showPreview={showPreview}
        onSave={() => { handleSave(true); setShowSaveModal(true) }}
        onSaveAs={() => { handleSave(false) }}
        onShare={handleShare}
        onFork={handleFork}
        onToggleConsole={() => setShowConsole(!showConsole)}
        onToggleFullscreen={() => setFullscreen(!fullscreen)}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onToggleMenu={() => setShowMenu(!showMenu)}
        showMenu={showMenu}
        onMyProjects={() => { setShowMenu(false); navigate('/my') }}
        charCount={charCount}
      />

      {/* ── 编辑区 + 预览 ── */}
      <div
        className="editor-layout flex-1 flex overflow-hidden"
        style={{ height: showConsole ? 'calc(100vh - 96px)' : 'calc(100vh - 40px)' }}
      >
        {/* 全屏预览模式 */}
        {fullscreen && (
          <FullscreenPreview
            title={title}
            html={html}
            css={css}
            js={js}
            onBack={() => setFullscreen(false)}
            onConsoleLog={(log) => setConsoleLogs((prev) => [...prev.slice(-49), log])}
          />
        )}

        {/* 正常编辑模式 */}
        {!fullscreen && (
          <>
            {/* 左：代码编辑器（移动端可切换隐藏） */}
            <div className={`editor-panel flex-1 flex flex-col border-r border-white/10 ${showPreview ? 'hidden md:flex' : 'flex'}`}>
              {/* 标签栏 */}
              <div className="flex bg-[#0a0a14] border-b border-white/10 shrink-0">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-mono transition relative ${
                      activeTab === t.key
                        ? 'bg-[#13131f] text-white border-b-2 border-purple-500'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {t.label}
                    <span className="absolute top-0.5 sm:top-1 right-1 sm:right-1.5 text-[8px] sm:text-[9px] text-white/20">
                      {t.shortcut}
                    </span>
                  </button>
                ))}
                <span className="ml-auto pr-2 sm:pr-3 text-[10px] sm:text-xs text-white/20 self-center hidden sm:inline">
                  {charCount.toLocaleString()} chars
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

            {/* 右：实时预览（移动端可切换显示） */}
            <div className={`preview-panel flex flex-col ${showPreview ? 'flex' : 'hidden md:flex'} w-full md:w-[45%]`}>
              <PreviewPanel
                html={html}
                css={css}
                js={js}
                previewKey={previewKey}
                onRefresh={() => setRefreshKey((k) => k + 1)}
                onFullscreen={() => setFullscreen(true)}
                onConsoleLog={(log) => setConsoleLogs((prev) => [...prev.slice(-49), log])}
              />
            </div>
          </>
        )}
      </div>

      {/* ── 控制台面板 ── */}
      {showConsole && (
        <ConsolePanel
          logs={consoleLogs}
          onClear={() => setConsoleLogs([])}
        />
      )}

      {/* ── 保存弹窗 ── */}
      {showSaveModal && (
        <SaveModal
          initialTitle={title}
          onSave={(newTitle) => {
            setTitle(newTitle)
            handleSave(true)
            setShowSaveModal(false)
          }}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// 子组件
// ---------------------------------------------------------------------------

interface TopBarProps {
  title: string
  onTitleChange: (t: string) => void
  isBuiltin: boolean
  liked: boolean
  likeCount: number
  viewCount: number
  onLike: () => void
  saved: boolean
  copied: boolean
  showConsole: boolean
  fullscreen: boolean
  forked: boolean
  forkedId: string | null
  showPreview: boolean
  onSave: () => void
  onSaveAs: () => void
  onShare: () => void
  onFork: () => void
  onToggleConsole: () => void
  onToggleFullscreen: () => void
  onTogglePreview: () => void
  onToggleMenu: () => void
  showMenu: boolean
  onMyProjects: () => void
  charCount: number
}

function TopBar({
  title, onTitleChange, isBuiltin, liked, likeCount, viewCount, onLike,
  saved, copied, showConsole, fullscreen, forked, forkedId, showPreview,
  onSave, onSaveAs, onShare, onFork,
  onToggleConsole, onToggleFullscreen, onTogglePreview, onToggleMenu, showMenu, onMyProjects,
}: TopBarProps) {
  return (
    <div className="top-bar flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-[#0a0a14] border-b border-white/10 shrink-0 flex-wrap">
      {/* 返回 */}
      <Link to="/" className="text-white/40 hover:text-white text-xs sm:text-sm transition shrink-0">
        &#8592; <span className="hidden sm:inline">画廊</span>
      </Link>
      <div className="w-px h-3 sm:h-4 bg-white/10 shrink-0" />

      {/* 标题输入 */}
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="title-input bg-transparent text-xs sm:text-sm font-bold text-white/80 focus:outline-none flex-1 min-w-0 max-w-[120px] sm:max-w-xs"
        placeholder="效果标题"
      />

      {/* 内置效果操作 */}
      {isBuiltin && (
        <div className="hidden xs:flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onLike}
            className={`action-btn text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border transition ${
              liked ? 'border-pink-500 text-pink-400' : 'border-white/20 text-white/40 hover:text-pink-400'
            }`}
          >
            &#10084;&#65039; {likeCount}
          </button>
          <span className="text-[10px] sm:text-xs text-white/30 hidden sm:inline">&#128065; {viewCount}</span>
          <button
            onClick={onFork}
            className={`action-btn text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 rounded-full border transition ${
              forked
                ? 'border-green-500 text-green-400'
                : 'border-purple-500/50 text-purple-300 hover:bg-purple-500/20'
            }`}
          >
            {forked ? '&#10004; 已Fork' : '&#10031; Fork'}
          </button>
        </div>
      )}

      {/* 保存成功提示 */}
      {saved && <span className="action-btn text-[10px] sm:text-xs text-green-400 shrink-0">&#10004; 已保存</span>}

      {/* Fork 后跳转 */}
      {forked && !isBuiltin && forkedId && (
        <Link
          to={`/editor/${forkedId}`}
          className="action-btn text-[10px] sm:text-xs text-purple-400 hover:underline shrink-0 hidden sm:inline"
        >
          &#8594; 继续编辑
        </Link>
      )}

      {/* 快捷键提示 */}
      <div className="shortcut-hints hidden items-center gap-1 text-[10px] sm:text-xs text-white/20 shrink-0 ml-1 sm:ml-2 lg:flex">
        <kbd className="px-1 py-0.5 bg-white/5 rounded text-white/30 text-[9px]">Ctrl+S</kbd><span>保存</span>
        <kbd className="px-1 py-0.5 bg-white/5 rounded text-white/30 text-[9px] ml-1">Ctrl+↵</kbd><span>刷新</span>
      </div>

      {/* 移动端预览切换 */}
      <button
        onClick={onTogglePreview}
        className="action-btn md:hidden text-[10px] px-2 py-1 rounded border border-white/20 text-white/40 hover:text-white transition shrink-0"
      >
        {showPreview ? '&#9998; 代码' : '&#128065; 预览'}
      </button>

      {/* 控制台 */}
      <button
        onClick={onToggleConsole}
        className={`action-btn text-[10px] sm:text-xs px-2 py-1 rounded border transition shrink-0 hidden sm:block ${
          showConsole ? 'border-cyan-500/50 text-cyan-400' : 'border-white/20 text-white/40'
        }`}
      >
        &#128203; {showConsole ? '隐藏' : '控制台'}
      </button>

      {/* 分享 */}
      <button
        onClick={onShare}
        className="action-btn text-[10px] sm:text-xs px-2 py-1 rounded border border-white/20 text-white/40 hover:text-white hover:border-white/40 transition shrink-0 hidden sm:block"
      >
        {copied ? '&#10004; 已复制!' : '&#128279; 分享'}
      </button>

      {/* 全屏预览 */}
      <button
        onClick={onToggleFullscreen}
        className={`action-btn text-[10px] sm:text-xs px-2 py-1 rounded border transition shrink-0 hidden sm:block ${
          fullscreen ? 'border-cyan-500/50 text-cyan-400' : 'border-white/20 text-white/40 hover:text-white'
        }`}
        title={fullscreen ? '返回编辑器' : '全屏预览'}
      >
        {fullscreen ? '&#8592; 编辑器' : '&#8599; 全屏'}
      </button>

      {/* 更多菜单 */}
      <div className="relative shrink-0">
        <button
          onClick={onToggleMenu}
          className="action-btn text-xs px-2 py-1 rounded border border-white/20 text-white/40 hover:text-white transition"
        >
          &#8942;
        </button>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-36 sm:w-44 bg-[#1a1a2e] border border-white/10 rounded-lg overflow-hidden shadow-xl z-50">
            <button
              onClick={onSave}
              className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 hover:bg-white/10 transition"
            >
              &#128190; 保存项目
            </button>
            <button
              onClick={onSaveAs}
              className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 hover:bg-white/10 transition"
            >
              &#128190; 另存为新项目
            </button>
            {isBuiltin && (
              <button
                onClick={onFork}
                className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-purple-300 hover:bg-white/10 transition"
              >
                &#10031; Fork 到我的项目
              </button>
            )}
            <div className="border-t border-white/5" />
            <button
              onClick={onMyProjects}
              className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/40 hover:bg-white/10 transition"
            >
              &#128193; 我的项目
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function PreviewPanel({
  html, css, js, previewKey, onRefresh, onFullscreen, onConsoleLog,
}: {
  html: string; css: string; js: string
  previewKey: string
  onRefresh: () => void
  onFullscreen: () => void
  onConsoleLog: (log: string) => void
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 sm:px-3 py-1 bg-[#0a0a14] border-b border-white/10 shrink-0">
        <span className="text-[10px] sm:text-xs text-white/40">&#128065; 实时预览</span>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onRefresh}
            className="text-[10px] sm:text-xs text-white/30 hover:text-white/60 transition"
            title="刷新预览 (Ctrl+Enter)"
          >
            &#8635;
          </button>
          <button
            onClick={onFullscreen}
            className="text-[10px] sm:text-xs text-white/30 hover:text-white/60 transition hidden sm:block"
            title="全屏预览"
          >
            &#8599; 全屏
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white">
        <Preview
          key={previewKey}
          html={html}
          css={css}
          js={js}
          onConsoleLog={onConsoleLog}
        />
      </div>
    </div>
  )
}

function FullscreenPreview({
  title, html, css, js, onBack, onConsoleLog,
}: {
  title: string; html: string; css: string; js: string
  onBack: () => void
  onConsoleLog: (log: string) => void
}) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0a0a14] border-b border-white/10 shrink-0">
        <span className="text-xs sm:text-sm text-white/60 truncate max-w-[150px] sm:max-w-none">{title}</span>
        <button
          onClick={onBack}
          className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded bg-white/10 text-white/60 hover:text-white transition"
        >
          &#8592; 返回编辑器
        </button>
      </div>
      <div className="flex-1 bg-white" style={{ height: 'calc(100% - 40px)' }}>
        <Preview html={html} css={css} js={js} onConsoleLog={onConsoleLog} />
      </div>
    </div>
  )
}

function ConsolePanel({ logs, onClear }: { logs: string[]; onClear: () => void }) {
  return (
    <div className="console-panel h-20 sm:h-24 bg-[#0a0a14] border-t border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 overflow-y-auto shrink-0">
      <div className="flex items-center text-[10px] sm:text-xs text-white/40 mb-1">
        &#128203; 控制台输出
        <button
          onClick={onClear}
          className="ml-2 text-white/20 hover:text-white/40 text-[10px] sm:text-xs"
        >
          &#10005; 清空
        </button>
      </div>
      {logs.length === 0 ? (
        <div className="text-[10px] sm:text-xs text-white/20">（暂无日志，console.log 将在此显示）</div>
      ) : (
        logs.map((log, i) => (
          <div key={i} className="text-[10px] sm:text-xs text-green-400 font-mono">&#8594; {log}</div>
        ))
      )}
    </div>
  )
}

function SaveModal({
  initialTitle, onSave, onClose,
}: {
  initialTitle: string
  onSave: (title: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState(initialTitle)

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#13131f] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:w-96 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">&#128190; 保存项目</h3>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(value) }}
          placeholder="输入项目名称..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm mb-3 sm:mb-4 focus:outline-none focus:border-purple-500/50"
          autoFocus
        />
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => onSave(value)}
            className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-xs sm:text-sm font-bold hover:opacity-90 transition"
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-white/10 rounded-lg text-xs sm:text-sm text-white/40 hover:text-white transition"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

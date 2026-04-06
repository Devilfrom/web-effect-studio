/**
 * MyProjects.tsx — 我的项目页
 *
 * 功能：
 * - 展示所有已保存项目（按更新时间倒序）
 * - 悬停实时预览
 * - 分享（复制链接）
 * - 删除
 * - 跳转编辑
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'
import type { Project } from '@/stores/projectStore'
import { usePreviewBlob } from '@/components/Preview/usePreviewBlob'
import { encodeShareCode } from '@/lib/previewUtils'

// ---------------------------------------------------------------------------
// 子组件
// ---------------------------------------------------------------------------

/** 项目卡片 */
function ProjectCard({ project }: { project: Project }) {
  const { deleteProject } = useProjectStore()
  const [hovering, setHovering] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, project)

  const handleDelete = () => {
    if (window.confirm(`删除项目「${project.title}」？`)) {
      deleteProject(project.id)
    }
    setShowMenu(false)
  }

  /** 格式化时间 */
  const formatDate = (ts?: number) => {
    if (!ts) return '未保存'
    const d = new Date(ts)
    const isUpdated = project.updatedAt && project.updatedAt !== project.createdAt
    return d.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      ...(isUpdated && { hour: '2-digit', minute: '2-digit' } as const),
    })
  }

  /** 总字符数 */
  const charCount = project.html.length + project.css.length + project.js.length

  /** HTML 标签数量 */
  const tagCount = project.html.split('<').length - 1

  return (
    <div
      className="relative bg-[#13131f] rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/40 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10"
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
    >
      {/* 预览区（链接到编辑页） */}
      <Link to={`/editor/${project.id}`} className="block">
        <div className="h-28 sm:h-36 bg-[#0a0a14] relative overflow-hidden">
          {/* 静态背景 */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovering ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-3xl sm:text-5xl opacity-10">&#9889;</div>
          </div>

          {/* 悬停遮罩 */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 ${hovering ? 'opacity-100' : 'opacity-0'}`}>
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/20 backdrop-blur-sm text-[10px] sm:text-sm font-bold shadow-lg">
              &#9998; 编辑
            </div>
          </div>

          {/* 实时预览 iframe */}
          {hovering && (
            <iframe
              ref={iframeRef as any}
              className="absolute inset-0 w-full h-full"
              sandbox="allow-scripts"
              style={{ border: 'none', background: '#0a0a14' }}
            />
          )}
        </div>
      </Link>

      {/* 信息区 */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-sm sm:text-base">
              {project.title || '未命名'}
            </h3>
            <p className="text-[10px] sm:text-xs text-white/30 mt-0.5">
              {project.updatedAt ? `更新于 ${formatDate(project.updatedAt)}` : `创建于 ${formatDate(project.createdAt)}`}
            </p>
          </div>

          {/* 更多菜单 */}
          <div className="relative shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition text-xs sm:text-sm"
            >
              &#8942;
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 sm:w-36 bg-[#1a1a2e] border border-white/10 rounded-lg overflow-hidden shadow-xl z-20">
                <Link
                  to={`/editor/${project.id}`}
                  onClick={() => setShowMenu(false)}
                  className="block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/70 hover:bg-white/10"
                >
                  &#9998; 继续编辑
                </Link>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-red-400 hover:bg-red-500/10"
                >
                  &#128465; 删除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[10px] sm:text-xs text-white/25 flex-wrap">
          <span>{charCount.toLocaleString()} chars</span>
          <span className="hidden xs:inline">&#128065; {tagCount} HTML 标签</span>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-2 sm:mt-3">
          <Link
            to={`/editor/${project.id}`}
            className="flex-1 text-center py-1 sm:py-1.5 rounded-lg bg-white/10 text-[10px] sm:text-xs text-white/60 hover:bg-purple-500/30 hover:text-white transition"
          >
            &#9998; 编辑
          </Link>
          <ShareButton project={project} />
        </div>
      </div>
    </div>
  )
}

/** 分享按钮 */
function ShareButton({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      const code = encodeShareCode(project.html, project.css, project.js, project.title)
      const url = `${window.location.origin}/editor/${project.id}?code=${code}`
      await navigator.clipboard.writeText(url)
    } catch {
      // fallback：复制当前页 URL
      await navigator.clipboard.writeText(window.location.href)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <button
      onClick={handleShare}
      className="flex-1 text-center py-1 sm:py-1.5 rounded-lg border border-purple-500/30 text-[10px] sm:text-xs text-purple-300 hover:bg-purple-500/20 transition"
    >
      {copied ? '&#10004; 已复制!' : '&#128279; 分享'}
    </button>
  )
}

// ---------------------------------------------------------------------------
// 页面
// ---------------------------------------------------------------------------

export function MyProjects() {
  const { projects } = useProjectStore()

  // 按更新时间倒序
  const sorted = [...projects].sort(
    (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
  )

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-4">
        <Link to="/" className="text-white/40 hover:text-white text-xs sm:text-sm transition shrink-0">
          &#8592; <span className="hidden sm:inline">画廊</span>
        </Link>
        <div className="w-px h-3 sm:h-4 bg-white/10 shrink-0" />
        <h1 className="font-bold text-sm sm:text-base">&#128193; 我的项目</h1>
        <span className="text-[10px] sm:text-xs text-white/30 hidden xs:inline">({projects.length} 个)</span>

        <Link
          to="/editor/new"
          className="ml-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-[10px] sm:text-sm font-bold hover:opacity-90 transition shrink-0"
        >
          + 新建项目
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {sorted.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-16 sm:py-24">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 opacity-30">&#128193;</div>
            <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-white/70">还没有保存任何项目</h2>
            <p className="text-xs sm:text-sm text-white/30 mb-4 sm:mb-6">去画廊逛逛，找个喜欢的效果开始改吧！</p>
            <Link
              to="/"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white/10 rounded-lg text-xs sm:text-sm hover:bg-white/20 transition"
            >
              &#128269; 浏览效果库 &#8594;
            </Link>
          </div>
        ) : (
          /* 项目网格 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {sorted.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

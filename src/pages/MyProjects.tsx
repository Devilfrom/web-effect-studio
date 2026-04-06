/**
 * MyProjects.tsx — 我的项目页（二次元风格版）
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
// 项目卡片组件
// ---------------------------------------------------------------------------

function ProjectCard({ project }: { project: Project }) {
  const { deleteProject } = useProjectStore()
  const [hovering, setHovering] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, project)

  const handleDelete = () => {
    if (window.confirm(`确定删除「${project.title}」？此操作不可恢复~`)) {
      deleteProject(project.id)
    }
    setShowMenu(false)
  }

  const handleShare = async () => {
    try {
      const code = encodeShareCode(project.html, project.css, project.js, project.title)
      const url = `${window.location.origin}/editor/${project.id}?code=${code}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      await navigator.clipboard.writeText(window.location.href)
    }
    setShowMenu(false)
  }

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

  const charCount = project.html.length + project.css.length + project.js.length
  const tagCount = project.html.split('<').length - 1

  return (
    <div
      className="group glass-card overflow-hidden"
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
    >
      {/* 预览区 */}
      <Link to={`/editor/${project.id}`} className="block relative h-32 sm:h-40 bg-gradient-to-br from-[#0a0a14] to-[#1a1025] overflow-hidden">
        {/* 静态背景 */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${hovering ? 'opacity-0 scale-110' : 'opacity-100'}`}>
          <div className="text-5xl opacity-10 float-animation">⚡</div>
        </div>

        {/* 悬停遮罩 */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-lg shadow-lg shadow-pink-500/30">
            ✏️
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

        {/* 操作按钮 */}
        <div className={`absolute top-2 right-2 flex gap-1 transition-opacity ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-xs hover:bg-pink-500/30 transition-colors"
          >
            {copied ? '✓' : '🔗'}
          </button>
        </div>
      </Link>

      {/* 信息区 */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate text-sm sm:text-base group-hover:text-pink-300 transition-colors">
              {project.title || '未命名'}
            </h3>
            <p className="text-[10px] sm:text-xs text-white/40 mt-1">
              {project.updatedAt ? `更新于 ${formatDate(project.updatedAt)}` : `创建于 ${formatDate(project.createdAt)}`}
            </p>
          </div>

          {/* 更多菜单 */}
          <div className="relative shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors text-sm"
            >
              ⋯
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 glass rounded-xl overflow-hidden shadow-xl z-20">
                <Link
                  to={`/editor/${project.id}`}
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2 text-xs sm:text-sm text-white/70 hover:bg-white/10 transition-colors"
                >
                  ✏️ 继续编辑
                </Link>
                <button
                  onClick={handleShare}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm text-white/70 hover:bg-white/10 transition-colors"
                >
                  🔗 复制分享链接
                </button>
                <div className="border-t border-white/5" />
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  🗑️ 删除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center gap-3 mt-3 text-[10px] sm:text-xs text-white/30 flex-wrap">
          <span className="flex items-center gap-1">
            <span>📝</span> {charCount.toLocaleString()} 字符
          </span>
          <span className="hidden xs:flex items-center gap-1">
            <span>🏷️</span> {tagCount} 标签
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-3">
          <Link
            to={`/editor/${project.id}`}
            className="flex-1 text-center py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/20 text-[10px] sm:text-xs text-pink-300 hover:from-pink-500/30 hover:to-purple-500/30 transition-all"
          >
            ✏️ 编辑
          </Link>
          <button
            onClick={handleShare}
            className="flex-1 text-center py-1.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/50 hover:bg-white/10 transition-colors"
          >
            {copied ? '✓ 已复制' : '🔗 分享'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 页面主组件
// ---------------------------------------------------------------------------

export function MyProjects() {
  const { projects } = useProjectStore()

  const sorted = [...projects].sort(
    (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1e] via-[#1a1035] to-[#0f172a] text-white pb-16">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-1.5 text-white/40 hover:text-pink-400 transition-colors text-xs sm:text-sm shrink-0">
            <span>←</span>
            <span className="hidden sm:inline">画廊</span>
          </Link>
          <div className="w-px h-3 sm:h-4 bg-white/10 shrink-0" />

          <div className="flex items-center gap-2">
            <span className="text-xl">📁</span>
            <h1 className="font-bold text-sm sm:text-lg gradient-text">我的项目</h1>
            <span className="text-[10px] sm:text-xs text-white/30 hidden xs:inline">({projects.length})</span>
          </div>

          <Link
            to="/editor/new"
            className="ml-auto btn-gradient text-[10px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4"
          >
            ✨ 新建
          </Link>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {sorted.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-16 sm:py-24">
            <div className="text-5xl sm:text-7xl mb-4 float-animation">🌸</div>
            <h2 className="text-base sm:text-xl font-bold text-white/60 mb-2">还没有保存任何项目</h2>
            <p className="text-xs sm:text-sm text-white/30 mb-6">去画廊逛逛，找个喜欢的效果开始改吧~</p>
            <Link
              to="/"
              className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 glass rounded-xl text-xs sm:text-sm text-pink-300 hover:border-pink-500/30 transition-all"
            >
              🔍 浏览效果库 →
            </Link>
          </div>
        ) : (
          /* 项目网格 */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sorted.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>

      {/* 页脚提示 */}
      <footer className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 py-2.5 px-4 text-center text-[10px] sm:text-xs text-white/30">
        💡 项目数据保存在浏览器本地，清除缓存会丢失哦~
      </footer>
    </div>
  )
}

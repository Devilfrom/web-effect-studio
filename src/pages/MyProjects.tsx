/**
 * MyProjects.tsx — 抖音风格作品页
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'
import type { Project } from '@/stores/projectStore'
import { usePreviewBlob } from '@/components/Preview/usePreviewBlob'
import { encodeShareCode } from '@/lib/previewUtils'

// ─────────────────────────────────────────
// 项目卡片
// ─────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const { deleteProject } = useProjectStore()
  const [hovering, setHovering] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, project)

  const handleDelete = () => {
    if (window.confirm(`确定删除「${project.title}」？`)) {
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
      setTimeout(() => setCopied(false), 2000)
    } catch {
      await navigator.clipboard.writeText(window.location.href)
    }
    setShowMenu(false)
  }

  const formatDate = (ts?: number) => {
    if (!ts) return ''
    const d = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
    
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      className="trend-card overflow-hidden"
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
    >
      {/* 预览区 */}
      <Link to={`/editor/${project.id}`} className="block relative aspect-[16/10] bg-[#1a1a1a] overflow-hidden">
        {/* 静态图标 */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${hovering ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-5xl opacity-20">⚡</div>
        </div>

        {/* 悬停遮罩 */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#fe2c55] to-[#a855f7] flex items-center justify-center text-lg">
            ✏️
          </div>
        </div>

        {/* 实时预览 */}
        {hovering && (
          <iframe
            ref={iframeRef as any}
            className="absolute inset-0 w-full h-full"
            sandbox="allow-scripts"
            style={{ border: 'none' }}
          />
        )}

        {/* 操作按钮 */}
        <div className={`absolute top-2 right-2 flex gap-1 transition-opacity ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => { e.preventDefault(); handleShare() }}
            className="w-7 h-7 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-xs hover:bg-white/20 transition-colors"
          >
            {copied ? '✓' : '🔗'}
          </button>
        </div>
      </Link>

      {/* 信息区 */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate">{project.title || '未命名'}</h3>
            <p className="text-[10px] text-white/40 mt-1">
              {project.updatedAt ? `更新于 ${formatDate(project.updatedAt)}` : `创建于 ${formatDate(project.createdAt)}`}
            </p>
          </div>

          {/* 更多菜单 */}
          <div className="relative shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
              ⋯
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-[#2a2a2a] rounded-xl overflow-hidden border border-white/10 shadow-xl z-20">
                <Link
                  to={`/editor/${project.id}`}
                  onClick={() => setShowMenu(false)}
                  className="block px-4 py-2.5 text-xs text-white/70 hover:bg-white/5 transition-colors"
                >
                  ✏️ 继续编辑
                </Link>
                <button
                  onClick={handleShare}
                  className="w-full text-left px-4 py-2.5 text-xs text-white/70 hover:bg-white/5 transition-colors"
                >
                  🔗 复制链接
                </button>
                <div className="border-t border-white/5" />
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2.5 text-xs text-[#fe2c55] hover:bg-[#fe2c55]/10 transition-colors"
                >
                  🗑️ 删除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 统计 */}
        <div className="flex items-center gap-3 mt-3 text-[10px] text-white/30">
          <span>📝 {(project.html.length + project.css.length + project.js.length).toLocaleString()} 字符</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// 页面主组件
// ─────────────────────────────────────────

export function MyProjects() {
  const { projects } = useProjectStore()

  const sorted = [...projects].sort(
    (a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
  )

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-lg border-b border-white/5">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link to="/" className="text-white/50 hover:text-white transition-colors">
            ← 首页
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <h1 className="font-bold flex-1">
            <span className="neon-text">我的作品</span>
            <span className="text-white/40 text-xs ml-2">{projects.length}</span>
          </h1>
          <Link
            to="/editor/new"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#fe2c55] to-[#a855f7] text-xs font-bold"
          >
            + 新建
          </Link>
        </div>
      </header>

      {/* 主内容 */}
      <main className="px-4 py-4">
        {sorted.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🎨</div>
            <h2 className="text-lg font-bold text-white/60 mb-2">还没有作品</h2>
            <p className="text-sm text-white/30 mb-6">去首页找个喜欢的特效开始吧~</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
            >
              🔍 浏览特效库 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {sorted.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </main>

      {/* 底部导航 */}
      <nav className="bottom-nav">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          <Link to="/" className="bottom-nav-item">
            <span className="text-xl">🏠</span>
            <span className="text-[10px]">首页</span>
          </Link>
          <Link to="/editor/new" className="relative -mt-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#25f4ee] via-[#fe2c55] to-[#a855f7] flex items-center justify-center text-2xl shadow-lg pulse-glow">
              +
            </div>
          </Link>
          <Link to="/my" className="bottom-nav-item active">
            <span className="text-xl">📁</span>
            <span className="text-[10px]">作品</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

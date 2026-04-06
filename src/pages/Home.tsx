/**
 * Home.tsx — 画廊首页（二次元风格版）
 * 
 * 功能：
 * - 效果卡片网格展示（仿 jq22 风格）
 * - 分类侧边栏（桌面端）/ 水平滚动分类（移动端）
 * - 搜索、排序、随机效果
 * - 悬停实时预览
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { effects, type Effect, CATEGORY_LABELS, ALL_ICONS } from '@/data/effects'
import { useProjectStore } from '@/stores/projectStore'
import { usePreviewBlob } from '@/components/Preview/usePreviewBlob'

// ─────────────────────────────────────────
// 常量定义
// ─────────────────────────────────────────

type Category = 'css-animation' | 'canvas' | 'particle' | 'webgl' | 'interactive' | 'game' | 'ui'

const categories = ['all', ...Object.keys(CATEGORY_LABELS)] as (Category | 'all')[]

// ─────────────────────────────────────────
// 精选效果（取前4个最热门）
// ─────────────────────────────────────────

const featured = effects
  .slice()
  .sort((a, b) => b.likeCount - a.likeCount)
  .slice(0, 4)

// ─────────────────────────────────────────
// 效果卡片组件
// ─────────────────────────────────────────

function EffectCard({ effect }: { effect: Effect }) {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState(false)
  const [liked, setLiked] = useState(false)
  const [forked, setForked] = useState(false)
  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, effect)

  const handleFork = (e: React.MouseEvent) => {
    e.stopPropagation()
    const store = useProjectStore.getState()
    const proj = {
      id: `proj_${Date.now()}`,
      title: `fork: ${effect.title}`,
      html: effect.html,
      css: effect.css,
      js: effect.js,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    store.addProject(proj)
    setForked(true)
    setTimeout(() => navigate(`/editor/${proj.id}`), 800)
  }

  return (
    <div
      className="group glass-card overflow-hidden cursor-pointer"
      onClick={() => navigate(`/editor/${effect.id}`)}
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
    >
      {/* 预览区 */}
      <div className="h-44 bg-gradient-to-br from-[#0a0a14] to-[#1a1025] relative overflow-hidden">
        {/* 未悬停：静态图标 */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${hovering ? 'opacity-0 scale-110' : 'opacity-100'}`}>
          <div className="text-6xl opacity-20 float-animation">
            {ALL_ICONS[effect.category as Category] || '✨'}
          </div>
        </div>

        {/* 悬停遮罩 */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30 pulse-animation">
            ▶
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

        {/* 分类标签 */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm border border-pink-500/30 text-pink-300">
            {ALL_ICONS[effect.category as Category]} {CATEGORY_LABELS[effect.category as Category]}
          </span>
        </div>
      </div>

      {/* 信息区 */}
      <div className="p-5">
        <h3 className="font-bold text-lg gradient-text group-hover:from-pink-400 group-hover:to-cyan-400 transition-all duration-300">
          {effect.title}
        </h3>
        <p className="text-sm text-white/50 mt-2 line-clamp-2 leading-relaxed">
          {effect.description}
        </p>

        {/* 标签 */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {effect.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-white/40"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 操作栏 */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              👁️ {effect.viewCount.toLocaleString()}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-pink-400' : 'hover:text-pink-400'}`}
            >
              {liked ? '❤️' : '🤍'} {effect.likeCount + (liked ? 1 : 0)}
            </button>
          </div>
          <button
            onClick={handleFork}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              forked
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 hover:from-pink-500/30 hover:to-purple-500/30'
            }`}
          >
            {forked ? '✓ 已Fork' : '✿ Fork'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// 精选大卡片组件
// ─────────────────────────────────────────

function FeaturedCard({ effect }: { effect: Effect }) {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState(false)
  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, effect)

  return (
    <div
      className="featured-card relative rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/editor/${effect.id}`)}
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
    >
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/50 to-cyan-900/40" />
      
      {/* 装饰性光效 */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
      
      {/* 分类图标背景 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="text-9xl select-none pointer-events-none">
          {ALL_ICONS[effect.category as Category]}
        </div>
      </div>

      {/* 实时预览 */}
      {hovering && (
        <iframe
          ref={iframeRef as any}
          className="absolute inset-0 w-full h-full"
          sandbox="allow-scripts"
          style={{ border: 'none', background: '#0a0a14' }}
        />
      )}

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* 内容 */}
      <div className="relative z-10 p-6 flex flex-col justify-end h-64">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm border border-amber-500/30 text-amber-300 shimmer">
            ⭐ 精选
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-white/10 backdrop-blur-sm border border-white/10 text-white/60">
            {CATEGORY_LABELS[effect.category as Category]}
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">{effect.title}</h2>
        <p className="text-sm text-white/60 mb-4 line-clamp-2">{effect.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>👁️ {effect.viewCount.toLocaleString()}</span>
            <span>❤️ {effect.likeCount.toLocaleString()}</span>
          </div>
          <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-shadow">
            开始编辑 →
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// 首页主组件
// ─────────────────────────────────────────

export function Home() {
  const navigate = useNavigate()
  const { projects } = useProjectStore()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sort, setSort] = useState<'hot' | 'new'>('hot')

  // ── 过滤和排序 ──
  const gridEffects = useMemo(() => {
    let filtered = effects.filter((e) => {
      const matchCategory = activeCategory === 'all' || e.category === activeCategory
      const matchSearch = search === '' ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      return matchCategory && matchSearch
    })
    return filtered.sort((a, b) =>
      sort === 'hot'
        ? b.likeCount - a.likeCount
        : b.id.localeCompare(a.id)
    )
  }, [activeCategory, search, sort])

  // ── 随机效果 ──
  const handleRandom = () => {
    const randomEffect = effects[Math.floor(Math.random() * effects.length)]
    navigate(`/editor/${randomEffect.id}`)
  }

  return (
    <div className="min-h-screen text-white pb-20">
      {/* ── 导航栏 ── */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-shadow float-animation">
              ✨
            </div>
            <span className="logo-text text-lg sm:text-xl font-black gradient-text hidden sm:inline">
              Web Effect Studio
            </span>
          </Link>

          {/* 搜索 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索效果..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder:text-white/30 focus:border-pink-500/50 focus:bg-white/10 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                🔍
              </span>
            </div>
          </div>

          {/* 桌面端按钮 */}
          <div className="nav-extra hidden sm:flex items-center gap-3">
            <button
              onClick={handleRandom}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-pink-500/30 hover:bg-pink-500/10 transition-all"
            >
              🎲 随机
            </button>

            <Link
              to="/my"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/10 transition-all"
            >
              📁 项目
            </Link>

            <Link
              to="/editor/new"
              className="btn-gradient"
            >
              ✨ 新建效果
            </Link>
          </div>

          {/* 移动端按钮 */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/editor/new"
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-xs font-bold"
            >
              + 新建
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 精选推荐（无搜索时显示） ── */}
      {search === '' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔥</span>
            <h2 className="text-lg font-bold gradient-text">精选推荐</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {featured.map((e) => (
              <FeaturedCard key={e.id} effect={e} />
            ))}
          </div>
        </div>
      )}

      {/* ── 移动端分类选择器 ── */}
      <div className="category-mobile sm:hidden flex px-4 py-3 gap-2 overflow-x-auto">
        {categories.map((cat) => {
          const count = cat === 'all'
            ? effects.length
            : effects.filter((e) => e.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-btn-mobile whitespace-nowrap ${
                activeCategory === cat ? 'active' : ''
              }`}
            >
              {ALL_ICONS[cat]}{' '}
              {cat === 'all' ? '全部' : CATEGORY_LABELS[cat as Category]}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── 主体布局 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex gap-6 sm:gap-8">
        {/* 分类侧边栏（桌面端） */}
        <aside className="category-sidebar w-52 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-2">
            <div className="flex items-center gap-2 mb-4 px-3">
              <span className="text-lg">📑</span>
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider">分类</span>
            </div>
            {categories.map((cat) => {
              const count = cat === 'all'
                ? effects.length
                : effects.filter((e) => e.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{ALL_ICONS[cat]}</span>
                  <span>{cat === 'all' ? '全部' : CATEGORY_LABELS[cat as Category]}</span>
                  <span className="ml-auto text-xs text-white/30">{count}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 min-w-0">
          {/* 排序控制 */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
              <button
                onClick={() => setSort('hot')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  sort === 'hot' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' : 'text-white/50 hover:text-white'
                }`}
              >
                🔥 热门
              </button>
              <button
                onClick={() => setSort('new')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  sort === 'new' ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg' : 'text-white/50 hover:text-white'
                }`}
              >
                ✨ 最新
              </button>
            </div>
            <span className="ml-auto text-sm text-white/30">
              {gridEffects.length} 个效果
            </span>
          </div>

          {/* 效果网格 */}
          {gridEffects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 float-animation">🔍</div>
              <p className="text-white/30 text-lg">没有找到相关效果</p>
              <p className="text-white/20 text-sm mt-2">试试其他关键词？</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {gridEffects.map((effect) => (
                <EffectCard key={effect.id} effect={effect} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── 页脚 ── */}
      <footer className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 py-3 px-4 text-center text-xs text-white/30">
        <span>🌸 Web Effect Studio — 用心创造每一个特效</span>
        <span className="mx-3">|</span>
        <span>已保存 <strong className="text-pink-400">{projects.length}</strong> 个项目</span>
      </footer>
    </div>
  )
}

/**
 * Home.tsx — 画廊首页
 *
 * 功能：
 * - 精选推荐大卡片（likeCount > 400）
 * - 分类侧边栏（含各分类效果数量）
 * - 搜索栏（按标题 / 描述 / 标签过滤）
 * - 排序（热门 / 最新）
 * - 效果网格（支持悬停实时 Blob URL 预览）
 * - 随机效果按钮
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { effects, CATEGORY_LABELS, CATEGORY_ICONS, type Category } from '@/data/effects'
import { useProjectStore } from '@/stores/projectStore'
import { usePreviewBlob } from '@/components/Preview/usePreviewBlob'

// ---------------------------------------------------------------------------
// 子组件
// ---------------------------------------------------------------------------

/** 效果卡片 */
function EffectCard({ effect }: { effect: typeof effects[0] }) {
  const navigate = useNavigate()
  const { addProject } = useProjectStore()
  const [liked, setLiked] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [forked, setForked] = useState(false)

  // 复用 iframe ref（避免每次渲染创建）
  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, effect)

  const handleFork = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (forked) return
    addProject({
      id: `proj_${Date.now()}`,
      title: `fork: ${effect.title}`,
      html: effect.html,
      css: effect.css,
      js: effect.js,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    setForked(true)
  }

  return (
    <div
      className="group bg-[#13131f] rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer select-none"
      onClick={() => navigate(`/editor/${effect.id}`)}
    >
      {/* 预览区 */}
      <div
        className="effect-card-preview h-32 sm:h-44 bg-[#0a0a14] relative overflow-hidden"
        onMouseEnter={() => { setHovering(true); loadPreview() }}
        onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
      >
        {/* 未悬停：静态图标 */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovering ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-3xl sm:text-5xl opacity-15">{CATEGORY_ICONS[effect.category]}</div>
        </div>

        {/* 悬停播放遮罩 */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-base sm:text-lg shadow-lg">
            &#9654;
          </div>
        </div>

        {/* 实时预览 iframe */}
        {hovering && (
          <iframe
            ref={iframeRef as any}
            className="absolute inset-0 w-full h-full"
            sandbox="allow-scripts"
            style={{ border: 'none', background: '#0a0a14', display: 'block' }}
          />
        )}

        {/* 分类标签 */}
        <div className="absolute top-2 left-2">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] sm:text-xs text-white/60">
            {CATEGORY_ICONS[effect.category]} {CATEGORY_LABELS[effect.category]}
          </span>
        </div>
      </div>

      {/* 信息区 */}
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-white group-hover:text-purple-300 transition text-sm sm:text-base">
          {effect.title}
        </h3>
        <p className="text-[10px] sm:text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
          {effect.description}
        </p>

        {/* 标签 */}
        <div className="flex gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
          {effect.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1 sm:px-1.5 py-0.5 rounded bg-white/5 text-[10px] sm:text-xs text-white/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 操作栏 */}
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[10px] sm:text-xs text-white/30 flex-wrap">
          <span>&#128065; {effect.viewCount.toLocaleString()}</span>
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
            className={`flex items-center gap-0.5 transition ${liked ? 'text-pink-400' : 'hover:text-pink-400'}`}
          >
            {liked ? '&#10084;&#65039;' : '&#10083;'} {effect.likeCount.toLocaleString()}
          </button>
          <span className="hidden xs:inline text-white/20">by {effect.authorName}</span>
          <button
            onClick={handleFork}
            className={`flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs border transition shrink-0 ml-auto ${
              forked
                ? 'border-green-500/50 text-green-400'
                : 'border-purple-500/30 text-purple-300/70 hover:border-purple-500/60 hover:text-purple-300'
            }`}
          >
            {forked ? '&#10004; 已Fork' : '&#10031; Fork'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** 精选推荐大卡片 */
function FeaturedCard({ effect }: { effect: typeof effects[0] }) {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState(false)
  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, effect)

  return (
    <div
      className="featured-card relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/editor/${effect.id}`)}
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
    >
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 to-cyan-900/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl sm:text-9xl opacity-15 select-none pointer-events-none">
          {CATEGORY_ICONS[effect.category]}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* 内容 */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col justify-end h-48 sm:h-64">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-[10px] sm:text-xs text-amber-300 backdrop-blur-sm">
            &#11088; 精选
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] sm:text-xs text-white/60 backdrop-blur-sm">
            {CATEGORY_LABELS[effect.category]}
          </span>
        </div>
        <h2 className="text-lg sm:text-2xl font-black text-white mb-1">{effect.title}</h2>
        <p className="text-xs sm:text-sm text-white/60 mb-2 sm:mb-3 line-clamp-2">{effect.description}</p>
        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-white/40 flex-wrap">
          <span>&#128065; {effect.viewCount.toLocaleString()}</span>
          <span>&#10084;&#65039; {effect.likeCount.toLocaleString()}</span>
          <span className="hidden sm:inline ml-auto px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-500/30">
            开始编辑 &#8594;
          </span>
          <span className="sm:hidden ml-auto px-2 py-1 rounded bg-white/10 text-white font-bold text-[10px]">
            编辑 &#8594;
          </span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 首页
// ---------------------------------------------------------------------------

export function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<'hot' | 'new'>('hot')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  // 所有分类（含全部）
  const categories = ['all', ...Object.keys(CATEGORY_LABELS)] as (Category | 'all')[]

  // 精选：点赞数最高的 2 个
  const featured = effects
    .filter((e) => e.likeCount > 400)
    .slice(0, 2)

  // 过滤 + 排序
  const filtered = effects
    .filter((e) => activeCategory === 'all' || e.category === activeCategory)
    .filter(
      (e) =>
        search === '' ||
        e.title.includes(search) ||
        e.description.includes(search) ||
        e.tags.some((t) => t.includes(search))
    )
    .sort((a, b) =>
      sort === 'hot' ? b.likeCount - a.likeCount : b.viewCount - a.viewCount
    )

  // 网格：排除已在精选区的效果
  const gridEffects = filtered.filter(
    (e) => !featured.some((f) => f.id === e.id)
  )

  /** 跳转到随机效果 */
  const handleRandom = () => {
    const pool = effects.filter(
      (e) => activeCategory === 'all' || e.category === activeCategory
    )
    const target = pool[Math.floor(Math.random() * pool.length)]
    if (target) navigate(`/editor/${target.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* ── 导航栏 ── */}
      <nav className="nav-bar sticky top-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-xl sm:text-2xl">&#9889;</span>
            <span className="logo-text text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Web Effect Studio
            </span>
          </Link>

          {/* 搜索 */}
          <div className="search-box flex-1 max-w-xs sm:max-w-lg">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索效果..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>

          {/* 桌面端按钮组 */}
          <div className="nav-extra hidden sm:flex items-center gap-3">
            {/* 随机效果 */}
            <button
              onClick={handleRandom}
              className="shrink-0 text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-purple-500/40 transition"
              title="随机效果"
            >
              &#127922; 随机
            </button>

            <Link
              to="/my"
              className="text-sm text-white/60 hover:text-white transition shrink-0"
            >
              我的项目
            </Link>

            <Link
              to="/editor/new"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-sm font-bold hover:opacity-90 transition shrink-0"
            >
              + 新建
            </Link>
          </div>

          {/* 移动端按钮组 */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/editor/new"
              className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-xs font-bold"
            >
              + 新建
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 移动端分类选择器 ── */}
      <div className="category-mobile sm:hidden flex px-3 pb-3 gap-2 overflow-x-auto">
        {categories.map((cat) => {
          const count =
            cat === 'all'
              ? effects.length
              : effects.filter((e) => e.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-btn-mobile ${
                activeCategory === cat ? 'active' : ''
              }`}
            >
              {cat === 'all' ? '🏠' : CATEGORY_ICONS[cat as Category]}{' '}
              {cat === 'all' ? '全部' : CATEGORY_LABELS[cat as Category]}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── 精选推荐（无搜索时显示） ── */}
      {search === '' && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8">
          <div className="mb-1 sm:mb-2 text-[10px] sm:text-xs text-white/30 uppercase tracking-widest">
            &#128293; 精选推荐
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {featured.map((e) => (
              <FeaturedCard key={e.id} effect={e} />
            ))}
          </div>
        </div>
      )}

      {/* ── 主体布局：侧边栏 + 网格 ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex gap-4 sm:gap-8">
        {/* 分类侧边栏（桌面端） */}
        <aside className="category-sidebar w-48 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-1">
            <div className="text-xs text-white/40 uppercase tracking-widest mb-3 px-3">
              &#9776; 分类
            </div>
            {categories.map((cat) => {
              const count =
                cat === 'all'
                  ? effects.length
                  : effects.filter((e) => e.category === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
                    activeCategory === cat
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat === 'all' ? '&#127968;' : CATEGORY_ICONS[cat as Category]}
                  <span>{cat === 'all' ? '全部' : CATEGORY_LABELS[cat as Category]}</span>
                  <span className="ml-auto text-xs text-white/30">{count}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* 主内容 */}
        <main className="flex-1 min-w-0">
          {/* 排序控制 */}
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
            <span className="text-xs sm:text-sm text-white/40">排序：</span>
            <button
              onClick={() => setSort('hot')}
              className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full transition ${
                sort === 'hot' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              &#128293; 热门
            </button>
            <button
              onClick={() => setSort('new')}
              className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full transition ${
                sort === 'new' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              &#10024; 最新
            </button>
            <span className="ml-auto text-xs sm:text-sm text-white/30">
              {gridEffects.length} 个效果
            </span>
          </div>

          {/* 效果网格 */}
          {gridEffects.length === 0 ? (
            <div className="text-center py-16 sm:py-20 text-white/30">
              <div className="text-4xl mb-4">&#128269;</div>
              <p className="text-sm sm:text-base">没有找到相关效果</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {gridEffects.map((effect) => (
                <EffectCard key={effect.id} effect={effect} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

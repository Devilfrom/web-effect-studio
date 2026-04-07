/**
 * Home.tsx — 二次元风格首页
 * 布局：顶部搜索栏 + 左侧分类侧边栏 + 右侧卡片网格 + 精选 Hero
 */

import { useState, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { effects, CATEGORY_LABELS, ALL_ICONS } from '@/data/effects'
import { usePreviewBlob } from '@/components/Preview/usePreviewBlob'

type Category = 'css-animation' | 'canvas' | 'particle' | 'webgl' | 'interactive' | 'game' | 'ui'

const CATS = [
  { key: 'all',           label: '全部',   icon: '🌸', color: 'rgba(255,107,157,0.15)' },
  { key: 'css-animation', label: 'CSS动画', icon: '✨', color: 'rgba(168,85,247,0.15)' },
  { key: 'canvas',        label: 'Canvas', icon: '🎨', color: 'rgba(34,211,238,0.15)'  },
  { key: 'particle',      label: '粒子',   icon: '🌟', color: 'rgba(251,191,36,0.15)'  },
  { key: 'webgl',         label: '3D',     icon: '🎲', color: 'rgba(59,130,246,0.15)'  },
  { key: 'interactive',   label: '交互',   icon: '🖱️', color: 'rgba(16,185,129,0.15)'  },
  { key: 'game',          label: '游戏',   icon: '🎮', color: 'rgba(239,68,68,0.15)'   },
  { key: 'ui',            label: 'UI',     icon: '🧩', color: 'rgba(245,158,11,0.15)'  },
]

const SORTS = [
  { key: 'hot',   label: '🔥 最热' },
  { key: 'new',   label: '✨ 最新' },
  { key: 'liked', label: '❤️ 点赞' },
]

// ─────────────────────────────────────────
// 效果卡片
// ─────────────────────────────────────────

function EffectCard({ effect, onFork }: {
  effect: typeof effects[0]
  onFork: (id: string) => void
}) {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState(false)
  const [liked, setLiked] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, effect)

  return (
    <div
      className="effect-card group"
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
      onClick={() => navigate(`/editor/${effect.id}`)}
    >
      {/* 预览区 */}
      <div className="relative h-40 bg-[#0d0a1a] overflow-hidden">
        {/* 静态背景 */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${hovering ? 'opacity-0 scale-110' : 'opacity-100'}`}>
          <div className="text-6xl opacity-10 animate-float">
            {ALL_ICONS[effect.category as Category] || '✨'}
          </div>
        </div>

        {/* 实时预览 */}
        {hovering && (
          <iframe
            ref={iframeRef}
            className="absolute inset-0 w-full h-full"
            sandbox="allow-scripts"
            style={{ border: 'none' }}
          />
        )}

        {/* 悬停遮罩 */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/editor/${effect.id}`) }}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-xs font-bold shadow-lg"
          >
            ▶ 预览
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFork(effect.id) }}
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur text-xs font-bold border border-white/20"
          >
            ✿ Fork
          </button>
        </div>

        {/* 分类标签 */}
        <div className="absolute top-2 left-2">
          <span className="tag text-[10px]">
            {ALL_ICONS[effect.category as Category]} {CATEGORY_LABELS[effect.category as Category]}
          </span>
        </div>

        {/* 点赞 */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-sm transition-transform hover:scale-110"
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </div>

      {/* 信息区 */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-white group-hover:grad-warm-text transition-all line-clamp-1">
          {effect.title}
        </h3>
        <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">
          {effect.description}
        </p>

        {/* 标签 */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {effect.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/8 text-white/40">
              #{tag}
            </span>
          ))}
        </div>

        {/* 数据 */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 text-[11px] text-white/35">
            <span>👁 {effect.viewCount.toLocaleString()}</span>
            <span>❤️ {(effect.likeCount + (liked ? 1 : 0)).toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-white/25">{effect.authorName}</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// 精选 Hero 卡片
// ─────────────────────────────────────────

function HeroCard({ effect }: { effect: typeof effects[0] }) {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, effect)

  return (
    <div
      className="hero-card cursor-pointer"
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
      onClick={() => navigate(`/editor/${effect.id}`)}
    >
      {/* 预览区 */}
      <div className="relative h-52 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-cyan-900/30" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl" />

        {/* 图标 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-8">
          <div className="text-9xl">{ALL_ICONS[effect.category as Category] || '✨'}</div>
        </div>

        {/* 实时预览 */}
        {hovering && (
          <iframe
            ref={iframeRef}
            className="absolute inset-0 w-full h-full"
            sandbox="allow-scripts"
            style={{ border: 'none' }}
          />
        )}

        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1530] via-transparent to-transparent" />

        {/* 标签 */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-[11px] font-bold backdrop-blur">
            🔥 精选推荐
          </span>
          <span className="tag-cyan tag text-[10px]">
            {CATEGORY_LABELS[effect.category as Category]}
          </span>
        </div>
      </div>

      {/* 信息 */}
      <div className="p-5">
        <h2 className="font-bold text-xl grad-text mb-2">{effect.title}</h2>
        <p className="text-sm text-white/55 leading-relaxed mb-4">{effect.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>👁 {effect.viewCount.toLocaleString()}</span>
            <span>❤️ {effect.likeCount.toLocaleString()}</span>
          </div>
          <button className="btn-primary text-xs py-2 px-5">
            立即体验 →
          </button>
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
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('hot')
  const [search, setSearch] = useState('')

  // 精选（点赞最多的3个）
  const featured = useMemo(() =>
    [...effects].sort((a, b) => b.likeCount - a.likeCount).slice(0, 3), [])

  // 过滤 + 排序
  const filtered = useMemo(() => {
    let list = effects.filter(e => {
      const matchCat = activeCategory === 'all' || e.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch = !q ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
    if (sort === 'hot')   list = [...list].sort((a, b) => b.viewCount - a.viewCount)
    if (sort === 'liked') list = [...list].sort((a, b) => b.likeCount - a.likeCount)
    return list
  }, [activeCategory, sort, search])

  const handleFork = (id: string) => navigate(`/editor/${id}`)
  const handleRandom = () => {
    const r = effects[Math.floor(Math.random() * effects.length)]
    navigate(`/editor/${r.id}`)
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* ── 顶部导航 ── */}
      <header className="topbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center text-base shadow-lg animate-pulse-pink">
              ✨
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-black grad-text leading-none">Web Effect</div>
              <div className="text-[10px] text-white/30 leading-none mt-0.5">特效实验室</div>
            </div>
          </Link>

          {/* 搜索 */}
          <div className="search-wrap">
            <span className="icon">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索特效名称、标签..."
              className="search-input"
            />
          </div>

          {/* 操作 */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleRandom} className="btn-ghost text-xs py-2 px-4 hidden sm:block">
              🎲 随机
            </button>
            <Link to="/editor/new" className="btn-primary text-xs py-2 px-5">
              + 新建
            </Link>
            <Link to="/my" className="w-9 h-9 rounded-xl glass flex items-center justify-center text-base hover:border-pink-500/30 transition-colors">
              📁
            </Link>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="cat-tabs pb-2 px-4 sm:px-6 max-w-7xl mx-auto">
          {CATS.map(cat => {
            const count = cat.key === 'all'
              ? effects.length
              : effects.filter(e => e.category === cat.key).length
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`cat-tab ${activeCategory === cat.key ? 'active' : ''}`}
              >
                <span>{cat.icon}</span>
                <span className="ml-1">{cat.label}</span>
                <span className="ml-1.5 text-[10px] opacity-50">{count}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* ── 主体 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6 relative z-10">
        {/* 左侧边栏（桌面端） */}
        <aside className="sidebar hidden lg:block shrink-0">
          <div className="sticky top-32 space-y-1">
            <div className="text-[11px] font-bold text-white/25 uppercase tracking-widest px-4 mb-3">
              分类
            </div>
            {CATS.map(cat => {
              const count = cat.key === 'all'
                ? effects.length
                : effects.filter(e => e.category === cat.key).length
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`sidebar-item w-full ${activeCategory === cat.key ? 'active' : ''}`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="count">{count}</span>
                </button>
              )
            })}

            <div className="border-t border-white/5 my-4" />

            <div className="text-[11px] font-bold text-white/25 uppercase tracking-widest px-4 mb-3">
              快捷
            </div>
            <button onClick={handleRandom} className="sidebar-item w-full">
              <span className="text-lg">🎲</span>
              <span>随机特效</span>
            </button>
            <Link to="/editor/new" className="sidebar-item block">
              <span className="text-lg">✏️</span>
              <span>新建特效</span>
            </Link>
            <Link to="/my" className="sidebar-item block">
              <span className="text-lg">📁</span>
              <span>我的作品</span>
            </Link>
          </div>
        </aside>

        {/* 右侧主内容 */}
        <main className="flex-1 min-w-0">
          {/* 精选 Hero（仅全部分类 + 无搜索时显示） */}
          {activeCategory === 'all' && !search && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🌸</span>
                <h2 className="font-bold text-base grad-text">精选推荐</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map(e => <HeroCard key={e.id} effect={e} />)}
              </div>
            </section>
          )}

          {/* 排序 + 数量 */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white/80">
                {activeCategory === 'all' ? '全部特效' : CATS.find(c => c.key === activeCategory)?.label}
              </h2>
              <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
              {SORTS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    sort === s.key
                      ? 'bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 卡片网格 */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4 animate-float">🔍</div>
              <p className="text-white/40">没有找到相关特效~</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(e => (
                <EffectCard key={e.id} effect={e} onFork={handleFork} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

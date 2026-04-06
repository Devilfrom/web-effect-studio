/**
 * Home.tsx — 抖音风格首页
 * 
 * 功能：
 * - 全屏卡片展示
 * - 底部导航栏
 * - 分类标签页
 * - 热门标签
 */

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { effects, CATEGORY_LABELS, ALL_ICONS } from '@/data/effects'
import { usePreviewBlob } from '@/components/Preview/usePreviewBlob'

type Category = 'css-animation' | 'canvas' | 'particle' | 'webgl' | 'interactive' | 'game' | 'ui'

const CATEGORIES = [
  { key: 'all', label: '推荐', icon: '🔥' },
  { key: 'css-animation', label: 'CSS', icon: '✨' },
  { key: 'canvas', label: 'Canvas', icon: '🎨' },
  { key: 'particle', label: '粒子', icon: '🌟' },
  { key: 'interactive', label: '交互', icon: '👆' },
  { key: 'game', label: '游戏', icon: '🎮' },
]

// ─────────────────────────────────────────
// 效果卡片（竖屏风格）
// ─────────────────────────────────────────

function EffectCard({ effect }: { effect: typeof effects[0] }) {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState(false)
  const [liked, setLiked] = useState(false)
  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, effect)

  return (
    <div
      className="trend-card relative aspect-[9/14] sm:aspect-[9/16] cursor-pointer overflow-hidden"
      onClick={() => navigate(`/editor/${effect.id}`)}
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
    >
      {/* 背景 */}
      <div className="absolute inset-0 bg-[#1a1a1a]" />
      
      {/* 静态图标背景 */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${hovering ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-8xl opacity-10">{ALL_ICONS[effect.category as Category] || '✨'}</div>
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

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* 分类标签 */}
      <div className="absolute top-3 left-3">
        <span className="hot-tag text-[10px]">
          {CATEGORY_LABELS[effect.category as Category]}
        </span>
      </div>

      {/* 右侧互动按钮 */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${liked ? 'bg-[#fe2c55]' : 'bg-white/10'}`}>
            {liked ? '❤️' : '🤍'}
          </div>
          <span className="text-[10px] text-white/80">{(effect.likeCount + (liked ? 1 : 0)).toLocaleString()}</span>
        </button>
        
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
            💬
          </div>
          <span className="text-[10px] text-white/80">{Math.floor(effect.likeCount / 10)}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
            ↗️
          </div>
          <span className="text-[10px] text-white/80">分享</span>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-bold text-base mb-1 line-clamp-2">{effect.title}</h3>
        <p className="text-xs text-white/60 line-clamp-1 mb-2">{effect.description}</p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#fe2c55] to-[#25f4ee]" />
          <span className="text-xs text-white/80">{effect.authorName}</span>
        </div>
      </div>

      {/* 播放按钮 */}
      {hovering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <span className="text-3xl ml-1">▶</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// 精选大卡片
// ─────────────────────────────────────────

function FeaturedCard({ effect }: { effect: typeof effects[0] }) {
  const navigate = useNavigate()
  const [hovering, setHovering] = useState(false)
  const iframeRef = { current: null as HTMLIFrameElement | null }
  const { loadPreview, clearPreviewFn } = usePreviewBlob(iframeRef, effect)

  return (
    <div
      className="trend-card aspect-[16/9] sm:aspect-[2/1] cursor-pointer overflow-hidden relative"
      onClick={() => navigate(`/editor/${effect.id}`)}
      onMouseEnter={() => { setHovering(true); loadPreview() }}
      onMouseLeave={() => { setHovering(false); clearPreviewFn() }}
    >
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a1a2a] to-[#1a1a2a]" />
      
      {/* 装饰 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#fe2c55]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#25f4ee]/20 rounded-full blur-3xl" />

      {/* 图标背景 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="text-9xl">{ALL_ICONS[effect.category as Category] || '✨'}</div>
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

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* 标签 */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#fe2c55] to-[#a855f7] text-[10px] font-bold">
          🔥 热门
        </span>
        <span className="px-3 py-1 rounded-full bg-white/10 text-[10px]">
          {CATEGORY_LABELS[effect.category as Category]}
        </span>
      </div>

      {/* 内容 */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h2 className="font-bold text-xl sm:text-2xl mb-2">{effect.title}</h2>
        <p className="text-sm text-white/70 mb-3 line-clamp-2">{effect.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span>👁️ {effect.viewCount.toLocaleString()}</span>
            <span>❤️ {effect.likeCount.toLocaleString()}</span>
          </div>
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#fe2c55] to-[#a855f7] text-xs font-bold">
            立即体验 →
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
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  // ── 精选效果 ──
  const featured = useMemo(() => 
    [...effects].sort((a, b) => b.likeCount - a.likeCount).slice(0, 3),
  [])

  // ── 过滤效果 ──
  const filteredEffects = useMemo(() => {
    return effects.filter(e => {
      const matchCat = activeCategory === 'all' || e.category === activeCategory
      const matchSearch = !search || 
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  // ── 随机效果 ──
  const handleRandom = () => {
    const randomEffect = effects[Math.floor(Math.random() * effects.length)]
    navigate(`/editor/${randomEffect.id}`)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-20">
      {/* ── 顶部搜索栏 ── */}
      <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-lg border-b border-white/5">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#fe2c55] via-[#a855f7] to-[#25f4ee] flex items-center justify-center text-sm">
              ✨
            </div>
            <span className="font-bold text-sm hidden sm:inline neon-text">
              Web Effect
            </span>
          </Link>

          {/* 搜索框 */}
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索特效..."
              className="search-input"
            />
          </div>

          {/* 新建按钮 */}
          <Link
            to="/editor/new"
            className="shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-[#fe2c55] to-[#a855f7] text-xs font-bold"
          >
            + 新建
          </Link>
        </div>

        {/* ── 分类标签 ── */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
            >
              <span>{cat.icon}</span>
              <span className="ml-1">{cat.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── 主内容 ── */}
      <main className="px-4 py-4">
        {/* 精选大卡片 */}
        {search === '' && activeCategory === 'all' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold flex items-center gap-2">
                <span>🔥</span>
                <span className="neon-text">热门推荐</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(e => (
                <FeaturedCard key={e.id} effect={e} />
              ))}
            </div>
          </div>
        )}

        {/* 效果网格 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">
            {activeCategory === 'all' ? '全部特效' : CATEGORIES.find(c => c.key === activeCategory)?.label}
            <span className="text-white/40 text-sm ml-2">{filteredEffects.length}</span>
          </h2>
          <button
            onClick={handleRandom}
            className="btn-outline text-xs py-1.5 px-3"
          >
            🎲 随机
          </button>
        </div>

        {filteredEffects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white/40">没有找到相关特效</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredEffects.map(effect => (
              <EffectCard key={effect.id} effect={effect} />
            ))}
          </div>
        )}
      </main>

      {/* ── 底部导航 ── */}
      <nav className="bottom-nav">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          <Link to="/" className="bottom-nav-item active">
            <span className="text-xl">🏠</span>
            <span className="text-[10px]">首页</span>
          </Link>
          <button onClick={handleRandom} className="bottom-nav-item">
            <span className="text-xl">🎲</span>
            <span className="text-[10px]">发现</span>
          </button>
          <Link to="/editor/new" className="relative -mt-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#25f4ee] via-[#fe2c55] to-[#a855f7] flex items-center justify-center text-2xl shadow-lg pulse-glow">
              +
            </div>
          </Link>
          <Link to="/my" className="bottom-nav-item">
            <span className="text-xl">📁</span>
            <span className="text-[10px]">作品</span>
          </Link>
          <button className="bottom-nav-item">
            <span className="text-xl">👤</span>
            <span className="text-[10px]">我的</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

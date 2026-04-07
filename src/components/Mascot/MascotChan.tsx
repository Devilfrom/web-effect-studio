/**
 * MascotChan.tsx — 二次元看板娘
 * 风格：精致 chibi，粉紫配色，有表情变化
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const GREETINGS = [
  '欢迎来到特效实验室！(◕‿◕)',
  '今天想做什么特效呢？✨',
  '发现好看的效果了吗？',
  '主人加油哦！(ﾉ◕ヮ◕)ﾉ',
  '随机一个试试？🎲',
]

const CLICK_MSGS = [
  '哎呀~ (≧▽≦)',
  '嘻嘻，你好呀！',
  '要去编辑器吗？',
  '主人最棒了！❤',
  '点我干嘛啦~',
]

type Mood = 'normal' | 'happy' | 'surprised' | 'shy'

export function MascotChan() {
  const navigate = useNavigate()
  const [mood, setMood] = useState<Mood>('normal')
  const [dialog, setDialog] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [pos, setPos] = useState({ x: window.innerWidth - 110, y: window.innerHeight - 220 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef({ ox: 0, oy: 0 })
  const posRef = useRef(pos)
  const dialogTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => { posRef.current = pos }, [pos])

  // 初始问候
  useEffect(() => {
    const t = setTimeout(() => speak(GREETINGS[0], 'happy'), 1500)
    return () => clearTimeout(t)
  }, [])

  const speak = useCallback((text: string, m: Mood = 'normal') => {
    if (dialogTimer.current) clearTimeout(dialogTimer.current)
    setDialog(text)
    setMood(m)
    setShowDialog(true)
    dialogTimer.current = setTimeout(() => {
      setShowDialog(false)
      setMood('normal')
    }, 3500)
  }, [])

  // 拖拽
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (showMenu) return
    setDragging(true)
    dragRef.current = { ox: e.clientX - posRef.current.x, oy: e.clientY - posRef.current.y }
  }, [showMenu])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 90, e.clientX - dragRef.current.ox)),
        y: Math.max(0, Math.min(window.innerHeight - 180, e.clientY - dragRef.current.oy)),
      })
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dragging])

  const onClick = () => {
    if (dragging) return
    speak(CLICK_MSGS[Math.floor(Math.random() * CLICK_MSGS.length)], 'happy')
  }

  const onMenu = (action: string) => {
    setShowMenu(false)
    if (action === 'editor') { speak('传送中~', 'happy'); setTimeout(() => navigate('/editor/new'), 500) }
    if (action === 'home')   { speak('回首页啦！', 'normal'); setTimeout(() => navigate('/'), 500) }
    if (action === 'random') {
      const { effects } = require('@/data/effects')
      const r = effects[Math.floor(Math.random() * effects.length)]
      speak('随机到了！', 'surprised')
      setTimeout(() => navigate(`/editor/${r.id}`), 500)
    }
  }

  // ── 表情 SVG ──
  const Eyes = () => {
    if (mood === 'happy') return (
      <>
        <path d="M28 38 Q31 34 34 38" stroke="#2d1b4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M46 38 Q49 34 52 38" stroke="#2d1b4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </>
    )
    if (mood === 'surprised') return (
      <>
        <ellipse cx="31" cy="38" rx="5" ry="6" fill="#2d1b4e"/>
        <ellipse cx="49" cy="38" rx="5" ry="6" fill="#2d1b4e"/>
        <circle cx="33" cy="36" r="2" fill="white"/>
        <circle cx="51" cy="36" r="2" fill="white"/>
      </>
    )
    if (mood === 'shy') return (
      <>
        <path d="M27 38 Q31 35 35 38" stroke="#2d1b4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M45 38 Q49 35 53 38" stroke="#2d1b4e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="24" cy="43" rx="5" ry="3" fill="#ff9eb5" opacity="0.6"/>
        <ellipse cx="56" cy="43" rx="5" ry="3" fill="#ff9eb5" opacity="0.6"/>
      </>
    )
    // normal
    return (
      <>
        <ellipse cx="31" cy="38" rx="5" ry="5.5" fill="#2d1b4e"/>
        <ellipse cx="49" cy="38" rx="5" ry="5.5" fill="#2d1b4e"/>
        <circle cx="33" cy="36" r="2" fill="white"/>
        <circle cx="51" cy="36" r="2" fill="white"/>
        <circle cx="29" cy="40" r="1" fill="#a78bfa" opacity="0.6"/>
        <circle cx="47" cy="40" r="1" fill="#a78bfa" opacity="0.6"/>
      </>
    )
  }

  const Mouth = () => {
    if (mood === 'happy') return <path d="M34 50 Q40 56 46 50" stroke="#e879a0" strokeWidth="2" fill="none" strokeLinecap="round"/>
    if (mood === 'surprised') return <ellipse cx="40" cy="52" rx="4" ry="5" fill="#e879a0"/>
    return <path d="M36 51 Q40 54 44 51" stroke="#e879a0" strokeWidth="2" fill="none" strokeLinecap="round"/>
  }

  return (
    <div className="mascot-widget" style={{ left: pos.x, top: pos.y, position: 'fixed' }}>
      {/* 对话气泡 */}
      {showDialog && (
        <div
          className="absolute bottom-full right-0 mb-3 px-4 py-2.5 rounded-2xl text-xs text-white/90 whitespace-nowrap animate-fade-in-up"
          style={{
            background: 'rgba(26,21,48,0.95)',
            border: '1px solid rgba(255,107,157,0.3)',
            boxShadow: '0 8px 30px rgba(168,85,247,0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {dialog}
          <div
            className="absolute -bottom-2 right-6 w-3 h-3 rotate-45"
            style={{ background: 'rgba(26,21,48,0.95)', borderRight: '1px solid rgba(255,107,157,0.3)', borderBottom: '1px solid rgba(255,107,157,0.3)' }}
          />
        </div>
      )}

      {/* 菜单 */}
      {showMenu && (
        <div
          className="absolute bottom-full right-0 mb-3 w-44 rounded-2xl overflow-hidden animate-fade-in-up"
          style={{ background: 'rgba(26,21,48,0.97)', border: '1px solid rgba(255,107,157,0.2)', boxShadow: '0 16px 40px rgba(168,85,247,0.25)' }}
        >
          {[
            { key: 'editor', icon: '✨', label: '新建特效' },
            { key: 'home',   icon: '🏠', label: '返回首页' },
            { key: 'random', icon: '🎲', label: '随机特效' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => onMenu(item.key)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 角色 SVG */}
      <div
        className={`relative select-none ${dragging ? 'scale-110' : 'hover:scale-105'} transition-transform`}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onContextMenu={e => { e.preventDefault(); setShowMenu(v => !v) }}
      >
        <svg width="88" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc"/>
              <stop offset="100%" stopColor="#818cf8"/>
            </linearGradient>
            <linearGradient id="dressGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6"/>
              <stop offset="100%" stopColor="#a855f7"/>
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde8d8"/>
              <stop offset="100%" stopColor="#fcd5b5"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* 发光光晕 */}
          <ellipse cx="40" cy="60" rx="32" ry="50" fill="url(#dressGrad)" opacity="0.08" filter="url(#glow)"/>

          {/* 裙子 */}
          <path d="M20 80 Q15 110 10 118 L70 118 Q65 110 60 80 Z" fill="url(#dressGrad)" opacity="0.9"/>
          <path d="M22 80 Q18 100 14 115 L66 115 Q62 100 58 80 Z" fill="white" opacity="0.12"/>

          {/* 身体 */}
          <rect x="24" y="68" width="32" height="18" rx="8" fill="url(#dressGrad)"/>

          {/* 蝴蝶结 */}
          <path d="M34 70 Q40 66 46 70 Q40 74 34 70Z" fill="#fce7f3"/>
          <circle cx="40" cy="70" r="2.5" fill="#f9a8d4"/>

          {/* 手臂 */}
          <path d="M24 72 Q14 78 12 88" stroke="url(#skinGrad)" strokeWidth="7" strokeLinecap="round"/>
          <path d="M56 72 Q66 78 68 88" stroke="url(#skinGrad)" strokeWidth="7" strokeLinecap="round"/>

          {/* 手 */}
          <circle cx="11" cy="90" r="5" fill="#fde8d8"/>
          <circle cx="69" cy="90" r="5" fill="#fde8d8"/>

          {/* 头发后层 */}
          <ellipse cx="40" cy="26" rx="22" ry="24" fill="url(#hairGrad)"/>
          <path d="M18 26 Q14 50 16 65" stroke="url(#hairGrad)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M62 26 Q66 50 64 65" stroke="url(#hairGrad)" strokeWidth="10" strokeLinecap="round"/>

          {/* 脸 */}
          <ellipse cx="40" cy="32" rx="18" ry="19" fill="url(#skinGrad)"/>

          {/* 耳朵 */}
          <ellipse cx="22" cy="34" rx="4" ry="5" fill="#fde8d8"/>
          <ellipse cx="58" cy="34" rx="4" ry="5" fill="#fde8d8"/>

          {/* 表情 */}
          <Eyes/>
          <Mouth/>

          {/* 腮红（常驻） */}
          {mood !== 'shy' && (
            <>
              <ellipse cx="25" cy="44" rx="5" ry="3" fill="#ffb3c6" opacity="0.45"/>
              <ellipse cx="55" cy="44" rx="5" ry="3" fill="#ffb3c6" opacity="0.45"/>
            </>
          )}

          {/* 头发前层 - 刘海 */}
          <path d="M22 18 Q24 8 40 6 Q56 8 58 18 Q50 14 40 14 Q30 14 22 18Z" fill="url(#hairGrad)"/>
          <path d="M22 18 Q20 28 22 34" fill="url(#hairGrad)"/>
          <path d="M58 18 Q60 28 58 34" fill="url(#hairGrad)"/>

          {/* 呆毛 */}
          <path d="M40 6 Q44 -4 48 2" stroke="url(#hairGrad)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <circle cx="49" cy="2" r="3" fill="#f472b6"/>

          {/* 发饰 - 星星 */}
          <path d="M55 10 L56.5 13 L60 13 L57.5 15 L58.5 18.5 L55 16.5 L51.5 18.5 L52.5 15 L50 13 L53.5 13Z" fill="#fbbf24" opacity="0.9"/>
        </svg>

        {/* 名字 */}
        <div className="text-center mt-1">
          <span
            className="text-[11px] font-bold"
            style={{ background: 'linear-gradient(135deg,#ff6b9d,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            特效酱
          </span>
        </div>
      </div>
    </div>
  )
}

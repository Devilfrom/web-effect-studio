/**
 * MascotChan.tsx — 潮流看板娘组件
 * 
 * 风格：简约可爱 chibi 风格
 * 功能：可拖拽、点击互动、功能菜单
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────
// 对话内容
// ─────────────────────────────────────────

const GREETINGS = [
  '嗨~ 欢迎来到特效工作室！',
  '今天也要加油哦！✨',
  '发现宝藏特效！快来看看~',
  '想做什么效果？告诉我~',
  '滑动查看更多特效哦！',
]

const CLICK_RESPONSES = [
  '哎呀~ 别戳啦！',
  '嘻嘻，你好呀~',
  '要试试编辑器吗？',
  '主人最棒了！❤️',
  '传送门已开启！',
]

const MENU_RESPONSES: Record<string, string> = {
  editor: '即将传送到编辑器~',
  gallery: '返回首页看看~',
  random: '随机一个试试！',
  chat: '想聊什么呢？',
}

// ─────────────────────────────────────────
// 主组件
// ─────────────────────────────────────────

export function MascotChan() {
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [dialogText, setDialogText] = useState(GREETINGS[0])
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 200 })
  const [isBlinking, setIsBlinking] = useState(false)
  const [isHappy, setIsHappy] = useState(false)
  
  const dragStartRef = useRef({ x: 0, y: 0 })
  const positionRef = useRef(position)

  // ── 眨眼动画 ──
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  // ── 初始问候 ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setDialogText(GREETINGS[Math.floor(Math.random() * GREETINGS.length)])
      setShowDialog(true)
      setTimeout(() => setShowDialog(false), 4000)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // ── 位置同步 ──
  useEffect(() => {
    positionRef.current = position
  }, [position])

  // ── 拖拽 ──
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (showMenu) return
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    }
  }, [showMenu])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - dragStartRef.current.x
    const newY = e.clientY - dragStartRef.current.y
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 80, newX)),
      y: Math.max(0, Math.min(window.innerHeight - 160, newY)),
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // ── 点击互动 ──
  const handleClick = () => {
    if (isDragging) return
    setIsHappy(true)
    setTimeout(() => setIsHappy(false), 500)
    const text = CLICK_RESPONSES[Math.floor(Math.random() * CLICK_RESPONSES.length)]
    setDialogText(text)
    setShowDialog(true)
    setTimeout(() => setShowDialog(false), 3000)
  }

  // ── 菜单操作 ──
  const handleMenuClick = (action: string) => {
    setShowMenu(false)
    setShowDialog(false)
    
    if (MENU_RESPONSES[action]) {
      setDialogText(MENU_RESPONSES[action])
      setShowDialog(true)
      setTimeout(() => setShowDialog(false), 2000)
    }

    switch (action) {
      case 'editor':
        navigate('/editor/new')
        break
      case 'gallery':
        navigate('/')
        break
      case 'random':
        const effects = [
          'gradient-text', 'neon-text', 'fireworks', 
          'heart-particle', 'snowfall', 'vortex'
        ]
        const randomId = effects[Math.floor(Math.random() * effects.length)]
        navigate(`/editor/${randomId}`)
        break
    }
  }

  return (
    <div
      className="mascot-widget"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* 对话气泡 */}
      {showDialog && (
        <div className="absolute bottom-full right-0 mb-3 min-w-[180px] max-w-[280px] px-4 py-3 rounded-2xl bg-[#2a2a2a] border border-white/10 text-sm text-white/90 animate-fade-in">
          <span>{dialogText}</span>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#2a2a2a] border-r border-b border-white/10 transform rotate-45" />
        </div>
      )}

      {/* 菜单 */}
      <div className={`absolute bottom-full right-0 mb-3 w-48 bg-[#2a2a2a] rounded-2xl overflow-hidden border border-white/10 transition-all ${showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        {[
          { key: 'editor', icon: '✨', label: '新建特效' },
          { key: 'gallery', icon: '🏠', label: '返回首页' },
          { key: 'random', icon: '🎲', label: '随机特效' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => handleMenuClick(item.key)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 看板娘角色 - 简约 chibi 风格 */}
      <div
        className={`relative w-20 h-24 cursor-pointer transition-transform ${isDragging ? 'scale-110' : 'hover:scale-105'}`}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onContextMenu={(e) => { e.preventDefault(); setShowMenu(!showMenu) }}
      >
        {/* 发光效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fe2c55]/30 to-[#25f4ee]/30 blur-xl opacity-60" />
        
        {/* 身体 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16">
          {/* 衣服 - 抖音配色 */}
          <div className="absolute inset-0 rounded-t-full bg-gradient-to-br from-[#fe2c55] via-[#a855f7] to-[#25f4ee]" />
          {/* 衣服高光 */}
          <div className="absolute top-1 left-2 w-4 h-4 rounded-full bg-white/20" />
        </div>

        {/* 头部 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-14">
          {/* 头发后层 */}
          <div className="absolute -top-1 -left-2 -right-2 h-10 rounded-t-full bg-[#1a1a1a]" />
          
          {/* 脸 */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#ffd5c8]">
            {/* 眼睛 */}
            <div className={`absolute top-4 left-2 w-3 h-${isBlinking ? '0.5' : '3'} rounded-full bg-[#1a1a1a] transition-all ${isHappy ? 'translate-y-0.5' : ''}`}>
              {!isBlinking && (
                <>
                  <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="absolute bottom-0.5 left-1 w-1 h-1 rounded-full bg-[#25f4ee] opacity-60" />
                </>
              )}
            </div>
            <div className={`absolute top-4 right-2 w-3 h-${isBlinking ? '0.5' : '3'} rounded-full bg-[#1a1a1a] transition-all ${isHappy ? 'translate-y-0.5' : ''}`}>
              {!isBlinking && (
                <>
                  <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="absolute bottom-0.5 left-1 w-1 h-1 rounded-full bg-[#fe2c55] opacity-60" />
                </>
              )}
            </div>
            
            {/* 腮红 */}
            <div className="absolute top-6 left-0.5 w-2 h-1 rounded-full bg-[#fe2c55] opacity-40" />
            <div className="absolute top-6 right-0.5 w-2 h-1 rounded-full bg-[#fe2c55] opacity-40" />
            
            {/* 嘴巴 */}
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 ${isHappy ? 'w-3 h-2 rounded-full bg-[#fe2c55]' : 'w-2 h-0.5 rounded-full bg-[#1a1a1a]'}`} />
          </div>

          {/* 头发前层 - 刘海 */}
          <div className="absolute -top-1 left-0 w-5 h-6 bg-[#1a1a1a] rounded-b-full" />
          <div className="absolute -top-1 right-0 w-5 h-6 bg-[#1a1a1a] rounded-b-full" />
          
          {/* 呆毛 */}
          <div className="absolute -top-4 left-1/2 -translate-x-1 w-1.5 h-5 bg-[#1a1a1a] rounded-full transform -rotate-12 origin-bottom" />
        </div>

        {/* 头饰 - 抖音音符 */}
        <div className="absolute top-1 -right-1 text-lg animate-pulse">
          🎵
        </div>

        {/* 手 - 挥手 */}
        <div className={`absolute top-14 -right-2 text-2xl ${isHappy ? 'animate-wave' : ''}`}>
          👋
        </div>
      </div>

      {/* 名字 */}
      <div className="text-center mt-1">
        <span className="text-[10px] font-bold bg-gradient-to-r from-[#fe2c55] to-[#25f4ee] bg-clip-text text-transparent">
          特效酱
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// CSS 动画（注入到全局）
// ─────────────────────────────────────────

const style = document.createElement('style')
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
  }
  .animate-wave {
    animation: wave 0.5s ease-in-out 2;
  }
`
if (typeof document !== 'undefined' && !document.querySelector('#mascot-styles')) {
  style.id = 'mascot-styles'
  document.head.appendChild(style)
}

/**
 * MascotChan.tsx — 二次元看板娘组件
 * 
 * 功能：
 * - 显示可爱的看板娘角色（CSS 动画版）
 * - 点击交互显示对话
 * - 功能菜单（跳转编辑器、聊天助手等）
 * - 可拖拽移动
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────
// 对话内容
// ─────────────────────────────────────────

const GREETINGS = [
  '你好呀~ 欢迎来到 Web Effect Studio！',
  '主人~ 今天想做什么特效呢？',
  '✨ 发现宝藏前端效果库！',
  '需要帮忙吗？点击我看看能做什么~',
  '樱花飘落的效果好美呀~',
  '主人加油！代码一定会跑起来的！',
]

const CLICK_RESPONSES = [
  '哎呀~ 主人你好调皮！',
  '嘻嘻，戳我干嘛？',
  '要不要试试编辑器？',
  '想聊天的话点菜单里的"聊天助手"哦~',
  '主人最棒了！(◕ᴗ◕✿)',
]

// ─────────────────────────────────────────
// 主组件
// ─────────────────────────────────────────

export function MascotChan() {
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [dialogText, setDialogText] = useState(GREETINGS[0])
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 280 })
  const dragStartRef = useRef({ x: 0, y: 0 })
  const positionRef = useRef(position)

  // ── 初始化位置 ──
  useEffect(() => {
    positionRef.current = position
  }, [position])

  // ── 随机问候 ──
  useEffect(() => {
    const timer = setInterval(() => {
      if (!showDialog && !showMenu && !isDragging) {
        const text = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
        setDialogText(text)
        setShowDialog(true)
        setTimeout(() => setShowDialog(false), 4000)
      }
    }, 15000)
    return () => clearInterval(timer)
  }, [showDialog, showMenu, isDragging])

  // ── 拖拽功能 ──
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
      x: Math.max(0, Math.min(window.innerWidth - 100, newX)),
      y: Math.max(0, Math.min(window.innerHeight - 150, newY)),
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

  // ── 点击响应 ──
  const handleClick = () => {
    if (isDragging) return
    const text = CLICK_RESPONSES[Math.floor(Math.random() * CLICK_RESPONSES.length)]
    setDialogText(text)
    setShowDialog(true)
    setTimeout(() => setShowDialog(false), 3000)
  }

  // ── 菜单操作 ──
  const handleMenuClick = (action: string) => {
    setShowMenu(false)
    setShowDialog(false)
    switch (action) {
      case 'editor':
        navigate('/editor/new')
        break
      case 'gallery':
        navigate('/')
        break
      case 'projects':
        navigate('/my')
        break
      case 'chat':
        setDialogText('主人想聊什么呢？女仆在这里等你~')
        setShowDialog(true)
        setTimeout(() => setShowDialog(false), 5000)
        break
      case 'hide':
        // 隐藏看板娘（可以存入 localStorage）
        setDialogText('主人再见~ 需要我的时候刷新页面就好！')
        setShowDialog(true)
        setTimeout(() => {
          setShowDialog(false)
        }, 3000)
        break
    }
  }

  return (
    <div
      className="live2d-widget"
      style={{
        left: position.x,
        top: position.y,
        right: 'auto',
        bottom: 'auto',
      }}
    >
      {/* 对话气泡 */}
      {showDialog && (
        <div className="live2d-widget-dialog">
          <span className="text-pink-300">{dialogText}</span>
        </div>
      )}

      {/* 菜单 */}
      <div className={`live2d-widget-menu ${showMenu ? 'show' : ''}`}>
        <div className="live2d-widget-menu-item" onClick={() => handleMenuClick('editor')}>
          <span>✨</span>
          <span>新建效果</span>
        </div>
        <div className="live2d-widget-menu-item" onClick={() => handleMenuClick('gallery')}>
          <span>🎨</span>
          <span>效果画廊</span>
        </div>
        <div className="live2d-widget-menu-item" onClick={() => handleMenuClick('projects')}>
          <span>📁</span>
          <span>我的项目</span>
        </div>
        <div className="live2d-widget-menu-item" onClick={() => handleMenuClick('chat')}>
          <span>💬</span>
          <span>聊天助手</span>
        </div>
        <div className="live2d-widget-menu-item" onClick={() => handleMenuClick('hide')}>
          <span>👋</span>
          <span>隐藏</span>
        </div>
      </div>

      {/* 看板娘角色 - CSS 版本 */}
      <div
        className={`relative w-24 h-32 cursor-pointer transition-transform ${isDragging ? 'scale-110' : 'hover:scale-105'}`}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onContextMenu={(e) => { e.preventDefault(); setShowMenu(!showMenu) }}
      >
        {/* 身体 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24">
          {/* 连衣裙 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-pink-400 to-pink-600 rounded-t-full" />
          {/* 裙摆 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-8 bg-gradient-to-b from-pink-500 to-pink-700 rounded-b-3xl" />
        </div>

        {/* 头部 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16">
          {/* 头发后层 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-18 h-14 bg-gradient-to-b from-purple-600 to-purple-800 rounded-t-full" style={{ width: '72px', left: '-4px' }} />
          
          {/* 脸 */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full">
            {/* 眼睛 */}
            <div className="absolute top-5 left-2 w-3 h-4 bg-purple-900 rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <div className="absolute top-5 right-2 w-3 h-4 bg-purple-900 rounded-full">
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            {/* 腮红 */}
            <div className="absolute top-8 left-1 w-2 h-1 bg-pink-400 rounded-full opacity-60" />
            <div className="absolute top-8 right-1 w-2 h-1 bg-pink-400 rounded-full opacity-60" />
            {/* 嘴巴 */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2 h-1 bg-pink-500 rounded-full" />
          </div>

          {/* 头发前层 */}
          <div className="absolute top-0 left-0 w-6 h-8 bg-gradient-to-b from-purple-500 to-purple-700 rounded-b-full" />
          <div className="absolute top-0 right-0 w-6 h-8 bg-gradient-to-b from-purple-500 to-purple-700 rounded-b-full" />
          
          {/* 呆毛 */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-purple-600 rounded-full transform rotate-12" />
        </div>

        {/* 头饰 - 蝴蝶结 */}
        <div className="absolute top-0 right-0 w-6 h-4">
          <div className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transform -rotate-12" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-r from-pink-600 to-pink-400 rounded-full transform rotate-12" />
        </div>

        {/* 呼吸动画 */}
        <div className="absolute inset-0 animate-pulse opacity-30 pointer-events-none" />
      </div>

      {/* 名字标签 */}
      <div className="text-center mt-1">
        <span className="text-xs font-bold gradient-text">小萌</span>
      </div>
    </div>
  )
}

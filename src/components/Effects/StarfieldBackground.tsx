/**
 * StarfieldBackground.tsx — 星空背景效果
 * 
 * 功能：
 * - 生成随机分布的星星
 * - 星星闪烁动画
 * - 可选的流星效果
 */

import { useEffect, useRef } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.8 + 0.2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }))
}

export function StarfieldBackground() {
  const starsRef = useRef<Star[]>([])
  
  useEffect(() => {
    starsRef.current = generateStars(150)
  }, [])

  return (
    <div className="starfield">
      {starsRef.current.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--opacity': star.opacity,
            '--duration': `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

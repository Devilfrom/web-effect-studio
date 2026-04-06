/**
 * SakuraEffect.tsx — 樱花飘落效果
 * 
 * 功能：
 * - 生成随机飘落的樱花花瓣
 * - 带有旋转和摆动效果
 */

import { useEffect, useState } from 'react'

interface Petal {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  opacity: number
}

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 10,
    duration: Math.random() * 10 + 8,
    size: Math.random() * 8 + 8,
    opacity: Math.random() * 0.5 + 0.3,
  }))
}

export function SakuraEffect({ count = 20 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    setPetals(generatePetals(count))
  }, [count])

  return (
    <div className="sakura">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.x}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: petal.opacity,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

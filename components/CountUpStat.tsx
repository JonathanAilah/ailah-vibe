'use client'

import { useEffect, useState } from 'react'

interface CountUpStatProps {
  end: number
  label: string
  prefix?: string
  suffix?: string
  duration?: number
}

export const CountUpStat = ({
  end,
  label,
  prefix = '',
  suffix = '',
  duration = 1600,
}: CountUpStatProps) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return

    const frames = 60
    const frameRate = duration / frames
    let currentFrame = 0

    const timer = setInterval(() => {
      currentFrame++
      // Ease-out cubic
      const progress = 1 - Math.pow(1 - currentFrame / frames, 3)
      setCount(Math.floor(end * progress))

      if (currentFrame >= frames) {
        clearInterval(timer)
        setCount(end)
        setHasAnimated(true)
      }
    }, frameRate)

    return () => clearInterval(timer)
  }, [end, duration, hasAnimated])

  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-chakra font-bold text-white mb-2">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm mono text-lavender-dim uppercase tracking-widest">
        {label}
      </div>
    </div>
  )
}

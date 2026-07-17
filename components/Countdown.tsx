'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: Date
  format?: 'DHms' | 'HMs' // D:H:M:S or H:M:S
}

export const Countdown = ({ targetDate, format = 'DHms' }: CountdownProps) => {
  const [time, setTime] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const diff = Math.max(0, target - now)

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTime({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (format === 'HMs') {
    return (
      <span className="font-mono font-bold">
        {String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
        <span className="text-orange-primary">{String(time.seconds).padStart(2, '0')}</span>
      </span>
    )
  }
  return (
    <span className="font-mono font-bold">
      {time.days}:{String(time.hours).padStart(2, '0')}:{String(time.minutes).padStart(2, '0')}:
      <span className="text-orange-primary">{String(time.seconds).padStart(2, '0')}</span>
    </span>
  )
}

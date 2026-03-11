import React, { useState, useEffect } from 'react'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date()
    target.setDate(target.getDate() + 30)
    target.setHours(9, 0, 0, 0)

    const stored = localStorage.getItem('nirmitee_event_date')
    const eventDate = stored ? new Date(stored) : target
    if (!stored) localStorage.setItem('nirmitee_event_date', target.toISOString())

    function update() {
      const now = new Date()
      const diff = Math.max(0, eventDate - now)
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="countdown">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' },
      ].map(item => (
        <div key={item.label} className="countdown-item">
          <div className="countdown-number">{String(item.value).padStart(2, '0')}</div>
          <div className="countdown-label">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

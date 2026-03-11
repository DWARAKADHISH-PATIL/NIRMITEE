import React, { useRef, useEffect } from 'react'

export default function EventCard({ event, onRegister, style }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const pct = ((event.totalSeats - event.seatsLeft) / event.totalSeats) * 100
  const isLow = event.seatsLeft <= 5

  const badgeClass =
    event.category === 'Literary' ? 'badge-literary' :
    event.category === 'Performing Arts' ? 'badge-performing' :
    event.category === 'Visual Arts' ? 'badge-visual' : 'badge-general'

  return (
    <div className="event-card" ref={cardRef} style={style}>
      <div className="event-card-icon">{event.icon}</div>
      <span className={`event-badge ${badgeClass}`}>{event.category}</span>
      <h3>{event.name}</h3>
      <div className="event-card-meta">
        <span>🕐 {event.time}</span>
        <span>📍 {event.venue}</span>
        <span>📅 {event.date}</span>
      </div>

      <div className="seats-bar">
        <div className="seats-bar-label">
          <span>Seats Filled</span>
          <span>{event.seatsLeft} left</span>
        </div>
        <div className="seats-bar-track">
          <div
            className={`seats-bar-fill ${isLow ? 'low' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <button className="btn btn-primary btn-small" onClick={() => onRegister(event)} style={{ width: '100%' }}>
        Register
      </button>
    </div>
  )
}

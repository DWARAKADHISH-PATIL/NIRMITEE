import React, { useState, useContext, useRef, useEffect } from 'react'
import { AppContext } from '../App'
import EventCard from './EventCard'

const CATEGORIES = ['All', 'Literary', 'Performing Arts', 'Visual Arts', 'General']

export default function EventListing() {
  const { events, setModalOpen, setSelectedEvent } = useContext(AppContext)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filtered = events.filter(e => {
    const matchCat = filter === 'All' || e.category === filter
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.venue.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleRegister = (event) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  return (
    <section className="events-section" id="events">
      <div className="container">
        <div className="section-header section-reveal" ref={sectionRef}>
          <h2>Explore <span>Events</span></h2>
          <p>आमच्या सांस्कृतिक कार्यक्रमांमध्ये सहभागी व्हा — साहित्य, कला आणि नाट्य यांचा अनोखा संगम.</p>
          <div className="section-divider" />
        </div>

        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search events by name or venue..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="events-grid">
          {filtered.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleRegister}
              style={{ transitionDelay: `${i * 0.08}s` }}
            />
          ))}
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', opacity: 0.5, gridColumn: '1 / -1', padding: '40px' }}>
              No events found matching your search.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

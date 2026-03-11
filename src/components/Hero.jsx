import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../App'
import CountdownTimer from './CountdownTimer'

const TAGLINES = [
  'मराठी संस्कृतीचा उत्सव',
  'Celebrating Marathi Heritage',
  'साहित्य · कला · नाट्य · नृत्य',
  'Where Tradition Meets Talent',
  'युवा मराठी साहित्य संमेलन',
]

/* Rangoli-inspired SVG patterns */
function FloatingPattern({ style }) {
  return (
    <div className="hero-floating" style={style}>
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="60" cy="60" r="25" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <path d="M60 5 L65 55 L60 60 L55 55 Z" fill="currentColor" opacity="0.15" />
        <path d="M60 115 L55 65 L60 60 L65 65 Z" fill="currentColor" opacity="0.15" />
        <path d="M5 60 L55 55 L60 60 L55 65 Z" fill="currentColor" opacity="0.15" />
        <path d="M115 60 L65 65 L60 60 L65 55 Z" fill="currentColor" opacity="0.15" />
      </svg>
    </div>
  )
}

export default function Hero() {
  const { setModalOpen } = useContext(AppContext)
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const currentText = TAGLINES[taglineIndex]
    let timeout

    if (!deleting && charIndex < currentText.length) {
      timeout = setTimeout(() => setCharIndex(c => c + 1), 60)
    } else if (!deleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(c => c - 1), 30)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setTaglineIndex(i => (i + 1) % TAGLINES.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, taglineIndex])

  const scrollToEvents = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      {/* Background pattern */}
      <div className="hero-bg-pattern">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="rangoli" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <line x1="40" y1="10" x2="40" y2="70" stroke="currentColor" strokeWidth="0.3" />
              <line x1="10" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="0.3" />
              <line x1="18" y1="18" x2="62" y2="62" stroke="currentColor" strokeWidth="0.3" />
              <line x1="62" y1="18" x2="18" y2="62" stroke="currentColor" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rangoli)" />
        </svg>
      </div>

      {/* Floating elements */}
      <FloatingPattern style={{ top: '10%', left: '8%', color: '#FF6B00' }} />
      <FloatingPattern style={{ top: '60%', right: '5%', color: '#FFD700' }} />
      <FloatingPattern style={{ bottom: '15%', left: '15%', color: '#FFD700' }} />
      <FloatingPattern style={{ top: '25%', right: '18%', color: '#FF6B00' }} />

      <div className="hero-content">
        <div className="hero-badge">युवा मराठी साहित्य संघटना presents</div>
        <h1 className="hero-title">
          <span className="saffron">NIRMI</span><span className="gold">TEE</span>
        </h1>
        <div className="hero-year">२ ० २ ५</div>

        <p className="hero-tagline">
          {TAGLINES[taglineIndex].substring(0, charIndex)}
          <span className="typewriter-cursor" />
        </p>

        <CountdownTimer />

        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            🎫 Register Now
          </button>
          <button className="btn btn-outline" onClick={scrollToEvents}>
            🔍 Explore Events
          </button>
        </div>
      </div>
    </section>
  )
}

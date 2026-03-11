import React, { useState, useEffect, useRef, useContext } from 'react'
import { AppContext } from '../App'

export default function QRCheckIn() {
  const { registrations, updateRegistration, events, showToast } = useContext(AppContext)
  const [query, setQuery] = useState('')
  const [found, setFound] = useState(null)
  const [justCheckedIn, setJustCheckedIn] = useState(false)
  const qrRef = useRef(null)
  const qrInstance = useRef(null)
  const sectionRef = useRef(null)

  // Section reveal
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleSearch = () => {
    const trimmed = query.trim().toUpperCase()
    if (!trimmed) return
    const reg = registrations.find(r => r.id.toUpperCase() === trimmed)
    if (reg) {
      setFound(reg)
      setJustCheckedIn(false)
    } else {
      setFound(null)
      showToast('Registration ID not found', 'error')
    }
  }

  // QR code generation
  useEffect(() => {
    if (!found || !qrRef.current) return

    // Clear previous
    qrRef.current.innerHTML = ''
    qrInstance.current = null

    if (typeof window.QRCode !== 'undefined') {
      qrInstance.current = new window.QRCode(qrRef.current, {
        text: `NIRMITEE-CHECKIN:${found.id}|${found.name}|${found.email}`,
        width: 180,
        height: 180,
        colorDark: '#0A0F2E',
        colorLight: '#FFFFFF',
      })
    } else {
      // Fallback text
      qrRef.current.innerHTML = `<div style="width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:#fff;color:#0A0F2E;font-size:0.8rem;text-align:center;border-radius:8px;padding:16px;">QR: ${found.id}</div>`
    }
  }, [found])

  const handleCheckIn = () => {
    if (!found) return
    updateRegistration(found.id, { checkedIn: true })
    setFound({ ...found, checkedIn: true })
    setJustCheckedIn(true)
    showToast(`${found.name} checked in successfully!`, 'success')
  }

  const checkedInList = registrations.filter(r => r.checkedIn)

  return (
    <section className="qr-section" id="checkin">
      <div className="container">
        <div className="section-header section-reveal" ref={sectionRef}>
          <h2>QR <span>Check-In</span></h2>
          <p>Enter your Registration ID to generate your QR code and check in at the event.</p>
          <div className="section-divider" />
        </div>

        <div className="qr-container">
          <div className="qr-input-group">
            <input
              type="text"
              placeholder="Enter Registration ID (e.g., NRM-1001)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary btn-small" onClick={handleSearch}>
              🔍 Look Up
            </button>
          </div>

          {found && (
            <div className="qr-result" style={{ animation: 'fadeSlideUp 0.5s var(--transition)' }}>
              <div className="qr-code-box" ref={qrRef} />

              <div className="registrant-card">
                <h3>{found.name}</h3>
                <div className="info-row">
                  <span className="label">ID</span>
                  <span>{found.id}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email</span>
                  <span>{found.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">College</span>
                  <span>{found.college}</span>
                </div>
                <div className="info-row">
                  <span className="label">Year</span>
                  <span>{found.year}</span>
                </div>
                <div className="info-row">
                  <span className="label">Events</span>
                  <span>{found.events.map(id => events.find(e => e.id === id)?.name).join(', ')}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status</span>
                  <span style={{ color: found.checkedIn ? 'var(--green)' : 'var(--gold)' }}>
                    {found.checkedIn ? '✅ Checked In' : '⏳ Not Checked In'}
                  </span>
                </div>

                {!found.checkedIn && (
                  <button className="btn btn-primary checkin-btn" onClick={handleCheckIn}>
                    ✅ Mark as Checked In
                  </button>
                )}

                {justCheckedIn && (
                  <div className="checkmark-anim">
                    <div className="checkmark-circle">✓</div>
                    <span style={{ color: 'var(--green)', fontWeight: 600 }}>Successfully Checked In!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {checkedInList.length > 0 && (
            <div className="recent-checkins">
              <h4>Recently Checked In</h4>
              <div className="checkin-list">
                {checkedInList.slice(-5).reverse().map(r => (
                  <div key={r.id} className="checkin-item">
                    <div>
                      <strong>{r.name}</strong>
                      <span style={{ opacity: 0.5, marginLeft: 8, fontSize: '0.82rem' }}>{r.id}</span>
                    </div>
                    <span className="status-badge">Checked In</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

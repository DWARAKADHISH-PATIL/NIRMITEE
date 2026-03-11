import React, { useState, useEffect, useRef, useContext } from 'react'
import { AppContext } from '../App'

const DASHBOARD_PASSWORD = 'yuvamarathi2025'

function AnimatedNumber({ target }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const duration = 1200
        const startTime = performance.now()
        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          start = Math.floor(eased * target)
          setValue(start)
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{value}</span>
}

function RingChart({ percentage }) {
  const circumference = 2 * Math.PI * 45
  const [offset, setOffset] = useState(circumference)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setOffset(circumference - (percentage / 100) * circumference), 200)
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [percentage, circumference])

  return (
    <div className="ring-chart" ref={ref}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle className="ring-bg" cx="70" cy="70" r="45" />
        <circle
          className="ring-fill"
          cx="70" cy="70" r="45"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text className="ring-text" x="70" y="70">{Math.round(percentage)}%</text>
      </svg>
      <span style={{ fontSize: '0.88rem', opacity: 0.7 }}>Check-in Rate</span>
    </div>
  )
}

export default function OrganizerDashboard() {
  const { registrations, events, showToast } = useContext(AppContext)
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEvent, setFilterEvent] = useState('All')
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

  const handleLogin = () => {
    if (password === DASHBOARD_PASSWORD) {
      setLoggedIn(true)
      showToast('Dashboard access granted', 'success')
    } else {
      showToast('Incorrect password', 'error')
    }
  }

  const totalRegs = registrations.length
  const checkedIn = registrations.filter(r => r.checkedIn).length
  const checkinRate = totalRegs > 0 ? (checkedIn / totalRegs) * 100 : 0

  // Per-event breakdown
  const eventBreakdown = events.map(e => ({
    ...e,
    count: registrations.filter(r => r.events.includes(e.id)).length,
  }))
  const maxCount = Math.max(...eventBreakdown.map(e => e.count), 1)

  // Filtered attendees
  const filtered = registrations.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.college.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEvent = filterEvent === 'All' || r.events.includes(filterEvent)
    return matchSearch && matchEvent
  })

  // Export CSV
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'College', 'Year', 'Events', 'Checked In']
    const rows = registrations.map(r => [
      r.id,
      r.name,
      r.email,
      r.phone,
      r.college,
      r.year,
      r.events.map(id => events.find(e => e.id === id)?.name).join('; '),
      r.checkedIn ? 'Yes' : 'No',
    ])
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'nirmitee_registrations.csv'
    a.click()
    URL.revokeObjectURL(url)
    showToast('CSV exported successfully', 'success')
  }

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="container">
        <div className="section-header section-reveal" ref={sectionRef}>
          <h2>Organizer <span>Dashboard</span></h2>
          <p>Real-time overview of registrations, check-ins, and event analytics.</p>
          <div className="section-divider" />
        </div>

        {!loggedIn ? (
          <div className="dashboard-login">
            <div className="lock-icon">🔐</div>
            <h3 style={{ marginBottom: 8 }}>Organizer Access</h3>
            <p style={{ opacity: 0.6, marginBottom: 20, fontSize: '0.9rem' }}>
              Enter the organizer password to access the dashboard.
            </p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button className="btn btn-primary" onClick={handleLogin} style={{ width: '100%' }}>
              🔓 Unlock Dashboard
            </button>
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-number"><AnimatedNumber target={totalRegs} /></div>
                <div className="stat-label">Total Registrations</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-number"><AnimatedNumber target={checkedIn} /></div>
                <div className="stat-label">Checked In</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎭</div>
                <div className="stat-number"><AnimatedNumber target={events.length} /></div>
                <div className="stat-label">Total Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏫</div>
                <div className="stat-number">
                  <AnimatedNumber target={new Set(registrations.map(r => r.college)).size} />
                </div>
                <div className="stat-label">Colleges</div>
              </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 40 }}>
              {/* Bar chart */}
              <div style={{ flex: 2, minWidth: 300 }}>
                <h4 style={{ marginBottom: 16, fontFamily: 'var(--font-heading)' }}>Per-Event Registrations</h4>
                <div className="bar-chart">
                  {eventBreakdown.map(e => (
                    <div key={e.id} className="bar-chart-item">
                      <div className="bar-chart-label">{e.icon} {e.name}</div>
                      <div className="bar-chart-track">
                        <div
                          className="bar-chart-fill"
                          style={{ width: `${(e.count / maxCount) * 100}%` }}
                        >
                          {e.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ring chart */}
              <div style={{ flex: 1, minWidth: 160, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RingChart percentage={checkinRate} />
              </div>
            </div>

            {/* Attendee Table */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <input
                className="search-input"
                type="text"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ maxWidth: 300 }}
              />
              <select
                value={filterEvent}
                onChange={e => setFilterEvent(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: 30,
                  border: '1px solid var(--glass-border)',
                  background: 'var(--glass-bg)',
                  color: 'var(--ivory)', fontSize: '0.88rem',
                }}
              >
                <option value="All">All Events</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>

            <div className="attendee-table-wrap">
              <table className="attendee-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>College</th>
                    <th>Events</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.name}</td>
                      <td>{r.college}</td>
                      <td>{r.events.map(id => events.find(e => e.id === id)?.name).join(', ')}</td>
                      <td>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                          background: r.checkedIn ? 'rgba(46,204,113,0.2)' : 'rgba(255,215,0,0.2)',
                          color: r.checkedIn ? 'var(--green)' : 'var(--gold)',
                        }}>
                          {r.checkedIn ? 'Checked In' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', opacity: 0.5, padding: 24 }}>No attendees found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <button className="btn btn-outline export-btn" onClick={exportCSV}>
              📥 Export to CSV
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

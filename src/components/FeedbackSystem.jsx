import React, { useState, useEffect, useRef, useContext } from 'react'
import { AppContext } from '../App'

const MARATHI_QUOTES = [
  '„जो स्वतःला ओळखतो, तो जगाला जिंकतो."',
  '„कलेशिवाय जीवन म्हणजे निर्जीव माती."',
  '„शब्दांना ताकद असते, ती वापरा संस्कृती जपण्यासाठी."',
  '„एकमेकांचा सन्मान करणे हीच खरी संस्कृती."',
]

export default function FeedbackSystem() {
  const { events, feedbacks, addFeedback, showToast } = useContext(AppContext)
  const [selectedEvent, setSelectedEvent] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedEvent || rating === 0 || !text.trim() || !name.trim()) {
      showToast('Please fill all fields and select a rating', 'error')
      return
    }
    addFeedback({
      id: 'f' + Date.now(),
      eventId: selectedEvent,
      name: name.trim(),
      rating,
      text: text.trim(),
      timestamp: Date.now(),
    })
    setSubmitted(true)
    showToast('Feedback submitted — धन्यवाद!', 'success')
  }

  const resetForm = () => {
    setSelectedEvent('')
    setRating(0)
    setHoverRating(0)
    setText('')
    setName('')
    setSubmitted(false)
  }

  const randomQuote = MARATHI_QUOTES[Math.floor(Math.random() * MARATHI_QUOTES.length)]

  return (
    <section className="feedback-section" id="feedback">
      <div className="container">
        <div className="section-header section-reveal" ref={sectionRef}>
          <h2>Share Your <span>Feedback</span></h2>
          <p>तुमचा अनुभव आमच्यासाठी मौल्यवान आहे. कार्यक्रमाबद्दल तुमचे मत सांगा.</p>
          <div className="section-divider" />
        </div>

        {!submitted ? (
          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Select Event</label>
              <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
                <option value="">Choose an event</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.icon} {ev.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Feedback</label>
              <textarea
                placeholder="Tell us about your experience..."
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              📤 Submit Feedback
            </button>
          </form>
        ) : (
          <div className="feedback-form">
            <div className="thankyou-card">
              <div style={{ fontSize: '4rem' }}>🙏</div>
              <h3>धन्यवाद!</h3>
              <p style={{ opacity: 0.7 }}>Your feedback has been submitted successfully.</p>
              <p className="marathi-quote">{randomQuote}</p>
              <button className="btn btn-outline" onClick={resetForm} style={{ marginTop: 20 }}>
                Submit Another
              </button>
            </div>
          </div>
        )}

        {/* Feedback Gallery */}
        {feedbacks.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', textAlign: 'center', marginBottom: 24 }}>
              What Attendees Say
            </h3>
            <div className="feedback-gallery">
              {feedbacks.map(fb => {
                const ev = events.find(e => e.id === fb.eventId)
                return (
                  <div key={fb.id} className="feedback-card">
                    <div className="stars">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</div>
                    <p className="fb-text">"{fb.text}"</p>
                    <p className="fb-author">— {fb.name}</p>
                    {ev && <p className="fb-event">{ev.icon} {ev.name}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

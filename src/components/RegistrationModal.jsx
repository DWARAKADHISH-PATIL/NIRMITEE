import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../App'

const PHONE_REGEX = /^[6-9]\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegistrationModal() {
  const { modalOpen, setModalOpen, events, addRegistration, showToast, selectedEvent } = useContext(AppContext)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', year: '' })
  const [selectedEvents, setSelectedEvents] = useState([])
  const [errors, setErrors] = useState({})
  const [regId, setRegId] = useState('')

  // When opened from an event card, pre-select that event
  // Hook must be called before any conditional return
  useEffect(() => {
    if (modalOpen && selectedEvent) {
      setSelectedEvents([selectedEvent.id])
    }
  }, [selectedEvent, modalOpen])

  if (!modalOpen) return null

  const resetAndClose = () => {
    setStep(1)
    setForm({ name: '', email: '', phone: '', college: '', year: '' })
    setSelectedEvents([])
    setErrors({})
    setRegId('')
    setModalOpen(false)
  }

  const updateField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const validateStep1 = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!EMAIL_REGEX.test(form.email)) errs.email = 'Valid email is required'
    if (!PHONE_REGEX.test(form.phone)) errs.phone = 'Valid 10-digit phone number required'
    if (!form.college.trim()) errs.college = 'College name is required'
    if (!form.year) errs.year = 'Please select your year'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    if (selectedEvents.length === 0) {
      setErrors({ events: 'Please select at least one event' })
      return false
    }
    setErrors({})
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const handleBack = () => {
    setErrors({})
    setStep(s => s - 1)
  }

  const toggleEvent = (id) => {
    setSelectedEvents(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
    if (errors.events) setErrors(e => ({ ...e, events: '' }))
  }

  const handleSubmit = () => {
    const id = 'NRM-' + (1000 + Math.floor(Math.random() * 9000))
    const registration = {
      id,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      college: form.college.trim(),
      year: form.year,
      events: selectedEvents,
      checkedIn: false,
      timestamp: Date.now(),
    }
    addRegistration(registration)
    setRegId(id)
    showToast(`Registration successful! Your ID: ${id}`, 'success')
  }

  // Check time conflicts among selected events
  const getConflicts = () => {
    const selected = events.filter(e => selectedEvents.includes(e.id))
    const conflicts = []
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        if (selected[i].date === selected[j].date && selected[i].time === selected[j].time) {
          conflicts.push(`${selected[i].name} & ${selected[j].name}`)
        }
      }
    }
    return conflicts
  }

  const conflicts = getConflicts()
  const totalAmount = selectedEvents.length * 50

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) resetAndClose() }}>
      <div className="modal">
        <button className="modal-close" onClick={resetAndClose}>✕</button>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '4px' }}>
          {regId ? 'Registration Complete!' : 'Register for NIRMITEE'}
        </h2>
        {!regId && <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '24px' }}>
          Step {step} of 3 — {step === 1 ? 'Personal Info' : step === 2 ? 'Select Events' : 'Confirmation'}
        </p>}

        {/* Stepper */}
        {!regId && (
          <div className="stepper">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="stepper-step">
                <div className={`stepper-circle ${step === s ? 'active' : step > s ? 'completed' : ''}`}>
                  {step > s ? '✓' : s}
                </div>
                {i < 2 && <div className={`stepper-line ${step > s ? 'active' : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && !regId && (
          <div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text" placeholder="Enter your full name"
                value={form.name} onChange={e => updateField('name', e.target.value)}
              />
              {errors.name && <div className="error-msg">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email" placeholder="your.email@college.edu"
                value={form.email} onChange={e => updateField('email', e.target.value)}
              />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel" placeholder="10-digit mobile number"
                value={form.phone} onChange={e => updateField('phone', e.target.value)}
                maxLength={10}
              />
              {errors.phone && <div className="error-msg">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label>College</label>
              <input
                type="text" placeholder="Your college name"
                value={form.college} onChange={e => updateField('college', e.target.value)}
              />
              {errors.college && <div className="error-msg">{errors.college}</div>}
            </div>
            <div className="form-group">
              <label>Year of Study</label>
              <select value={form.year} onChange={e => updateField('year', e.target.value)}>
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              {errors.year && <div className="error-msg">{errors.year}</div>}
            </div>
            <button className="btn btn-primary" onClick={handleNext} style={{ width: '100%', marginTop: '8px' }}>
              Next → Event Selection
            </button>
          </div>
        )}

        {/* Step 2: Select Events */}
        {step === 2 && !regId && (
          <div>
            <div className="event-checkbox-group">
              {events.map(event => (
                <label
                  key={event.id}
                  className={`event-checkbox ${selectedEvents.includes(event.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEvent(event.id)}
                  />
                  <div className="check-mark">
                    {selectedEvents.includes(event.id) && '✓'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{event.icon} {event.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{event.date} · {event.time}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.events && <div className="error-msg" style={{ marginTop: 12 }}>{errors.events}</div>}
            {conflicts.length > 0 && (
              <div className="conflict-warning">
                ⚠️ Time conflict detected: {conflicts.join(', ')}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn btn-outline" onClick={handleBack} style={{ flex: 1 }}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={handleNext} style={{ flex: 1 }}>
                Next → Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && !regId && (
          <div>
            <div style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
            }}>
              <h4 style={{ marginBottom: 12, color: 'var(--saffron)' }}>Registration Summary</h4>
              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div><strong>Name:</strong> {form.name}</div>
                <div><strong>Email:</strong> {form.email}</div>
                <div><strong>Phone:</strong> {form.phone}</div>
                <div><strong>College:</strong> {form.college} ({form.year})</div>
                <div><strong>Events:</strong> {selectedEvents.map(id => events.find(e => e.id === id)?.name).join(', ')}</div>
              </div>
            </div>

            <div className="payment-sim">
              <h4>💳 Payment Summary (Simulation)</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.9rem' }}>
                <span>{selectedEvents.length} event(s) × ₹50</span>
                <span className="amount">₹{totalAmount}</span>
              </div>
              <p style={{ fontSize: '0.78rem', opacity: 0.5, marginTop: 8 }}>
                This is a simulated payment — no actual transaction will occur.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn btn-outline" onClick={handleBack} style={{ flex: 1 }}>
                ← Back
              </button>
              <button className="btn btn-gold" onClick={handleSubmit} style={{ flex: 1 }}>
                ✅ Confirm & Pay ₹{totalAmount}
              </button>
            </div>
          </div>
        )}

        {/* Registration Complete */}
        {regId && (
          <div className="confirmation-card">
            <div style={{ fontSize: '4rem', marginBottom: 8 }}>🎉</div>
            <h3>Welcome to NIRMITEE 2025!</h3>
            <p style={{ opacity: 0.7, margin: '8px 0' }}>Your registration has been recorded successfully.</p>
            <div className="reg-id">{regId}</div>
            <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>
              Save this Registration ID for QR Check-in at the event.
            </p>
            <button className="btn btn-primary" onClick={resetAndClose} style={{ marginTop: 20 }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

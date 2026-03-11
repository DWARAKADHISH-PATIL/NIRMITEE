import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import EventListing from './components/EventListing'
import RegistrationModal from './components/RegistrationModal'
import QRCheckIn from './components/QRCheckIn'
import OrganizerDashboard from './components/OrganizerDashboard'
import FeedbackSystem from './components/FeedbackSystem'
import Toast from './components/Toast'

/* ── Context ── */
export const AppContext = createContext()

/* ── Sample Events ── */
const EVENTS = [
  { id: 'e1', name: 'Kavita Vachan', icon: '📜', category: 'Literary', time: '10:00 AM – 12:00 PM', venue: 'Auditorium A', totalSeats: 60, seatsLeft: 18, date: 'Day 1' },
  { id: 'e2', name: 'Natya Spardha', icon: '🎭', category: 'Performing Arts', time: '1:00 PM – 4:00 PM', venue: 'Main Stage', totalSeats: 40, seatsLeft: 8, date: 'Day 1' },
  { id: 'e3', name: 'Rangoli Competition', icon: '🎨', category: 'Visual Arts', time: '9:00 AM – 11:30 AM', venue: 'Open Ground', totalSeats: 50, seatsLeft: 22, date: 'Day 1' },
  { id: 'e4', name: 'Nibandh Lekhan', icon: '✍️', category: 'Literary', time: '11:00 AM – 1:00 PM', venue: 'Hall B', totalSeats: 80, seatsLeft: 45, date: 'Day 1' },
  { id: 'e5', name: 'Vaad-Vivad (Debate)', icon: '🗣️', category: 'General', time: '2:00 PM – 5:00 PM', venue: 'Seminar Hall', totalSeats: 30, seatsLeft: 5, date: 'Day 2' },
  { id: 'e6', name: 'Lok Nritya (Folk Dance)', icon: '💃', category: 'Performing Arts', time: '10:00 AM – 12:30 PM', venue: 'Main Stage', totalSeats: 35, seatsLeft: 12, date: 'Day 2' },
  { id: 'e7', name: 'Patha Natak (Street Play)', icon: '🎪', category: 'Performing Arts', time: '3:00 PM – 5:30 PM', venue: 'Amphitheatre', totalSeats: 25, seatsLeft: 3, date: 'Day 2' },
  { id: 'e8', name: 'Samanya Dnyan (Quiz)', icon: '🧠', category: 'General', time: '11:00 AM – 1:00 PM', venue: 'Auditorium A', totalSeats: 100, seatsLeft: 56, date: 'Day 2' },
]

/* ── Seed Data ── */
function seedData() {
  if (localStorage.getItem('nirmitee_seeded')) return

  const registrations = [
    { id: 'NRM-1001', name: 'Aarav Deshmukh', email: 'aarav@vit.edu', phone: '9876543210', college: 'VIT Pune', year: '2nd Year', events: ['e1', 'e3'], checkedIn: false, timestamp: Date.now() - 86400000 },
    { id: 'NRM-1002', name: 'Sneha Kulkarni', email: 'sneha@vit.edu', phone: '9876543211', college: 'VIT Pune', year: '3rd Year', events: ['e2', 'e6'], checkedIn: true, timestamp: Date.now() - 72000000 },
    { id: 'NRM-1003', name: 'Rohan Patil', email: 'rohan@mitpune.edu', phone: '9876543212', college: 'MIT Pune', year: '1st Year', events: ['e4', 'e5', 'e8'], checkedIn: false, timestamp: Date.now() - 50000000 },
    { id: 'NRM-1004', name: 'Priya Joshi', email: 'priya@coep.edu', phone: '9876543213', college: 'COEP Pune', year: '4th Year', events: ['e1', 'e7'], checkedIn: true, timestamp: Date.now() - 30000000 },
    { id: 'NRM-1005', name: 'Aditya Bhosale', email: 'aditya@vit.edu', phone: '9876543214', college: 'VIT Pune', year: '2nd Year', events: ['e3', 'e6', 'e8'], checkedIn: false, timestamp: Date.now() - 10000000 },
  ]

  const feedbacks = [
    { id: 'f1', eventId: 'e1', name: 'Sneha Kulkarni', rating: 5, text: 'कविता वाचनाचा कार्यक्रम अत्यंत सुंदर होता! कवींनी मनाला भिडणाऱ्या रचना सादर केल्या.', timestamp: Date.now() - 20000000 },
    { id: 'f2', eventId: 'e2', name: 'Rohan Patil', rating: 4, text: 'नाट्य स्पर्धेचे आयोजन उत्कृष्ट होते. सर्व पथके उत्तम सादरीकरण केले.', timestamp: Date.now() - 15000000 },
    { id: 'f3', eventId: 'e6', name: 'Priya Joshi', rating: 5, text: 'लोकनृत्य कार्यक्रम खूपच रंगला! लावणी आणि कोळी नृत्य विशेष आवडले.', timestamp: Date.now() - 8000000 },
  ]

  localStorage.setItem('nirmitee_registrations', JSON.stringify(registrations))
  localStorage.setItem('nirmitee_feedbacks', JSON.stringify(feedbacks))
  localStorage.setItem('nirmitee_seeded', 'true')
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('nirmitee_theme') || 'dark')
  const [registrations, setRegistrations] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [toasts, setToasts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Seed + load
  useEffect(() => {
    seedData()
    setRegistrations(JSON.parse(localStorage.getItem('nirmitee_registrations') || '[]'))
    setFeedbacks(JSON.parse(localStorage.getItem('nirmitee_feedbacks') || '[]'))
  }, [])

  // Persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('nirmitee_theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])

  // Registration
  const addRegistration = useCallback((reg) => {
    setRegistrations(prev => {
      const next = [...prev, reg]
      localStorage.setItem('nirmitee_registrations', JSON.stringify(next))
      return next
    })
  }, [])

  const updateRegistration = useCallback((id, updates) => {
    setRegistrations(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...updates } : r)
      localStorage.setItem('nirmitee_registrations', JSON.stringify(next))
      return next
    })
  }, [])

  // Feedback
  const addFeedback = useCallback((fb) => {
    setFeedbacks(prev => {
      const next = [...prev, fb]
      localStorage.setItem('nirmitee_feedbacks', JSON.stringify(next))
      return next
    })
  }, [])

  // Toast
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const contextValue = {
    theme, toggleTheme,
    events: EVENTS,
    registrations, addRegistration, updateRegistration,
    feedbacks, addFeedback,
    showToast,
    modalOpen, setModalOpen,
    selectedEvent, setSelectedEvent,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Navbar />
      <main>
        <Hero />
        <EventListing />
        <RegistrationModal />
        <QRCheckIn />
        <OrganizerDashboard />
        <FeedbackSystem />
      </main>
      <footer className="footer">
        <div className="container">
          <p>© 2025 NIRMITEE — Yuva Marathi Literary Association. सर्व हक्क राखीव.</p>
        </div>
      </footer>
      <Toast toasts={toasts} />
    </AppContext.Provider>
  )
}

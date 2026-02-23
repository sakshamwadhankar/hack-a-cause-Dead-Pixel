import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [visibleSections, setVisibleSections] = useState(new Set())
  const [iframeLoading, setIframeLoading] = useState(false)
  const [activeApp, setActiveApp] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(Math.round((scrolled / maxScroll) * 100))

      // Check which sections are visible
      const sections = document.querySelectorAll('.section')
      const newVisible = new Set()
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
          newVisible.add(section.id)
        }
      })
      setVisibleSections(newVisible)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const words = ['Prevention', 'Protection', 'Intelligence', 'Accountability', 'Innovation']
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleAppNavigation = (appName, url) => {
    setActiveApp(appName)
    setIframeLoading(true)
    const appSection = document.getElementById('app-section')
    if (appSection) {
      appSection.scrollIntoView({ behavior: 'smooth' })
    }
    // Update iframe src
    const iframe = document.getElementById('jalrakshak-frame')
    if (iframe) {
      iframe.src = url
    }
  }

  return (
    <div className="app">
      {/* Border Frame */}
      <div className="border-frame">
        <div className="border-top"></div>
        <div className="border-right"></div>
        <div className="border-bottom"></div>
        <div className="border-left"></div>
      </div>

      {/* Loading Screen */}
      <section className={`loading ${!loading ? 'hide' : ''}`}>
        <span className="loading-text">The paint is drying...</span>
      </section>

      {/* Scroll Progress */}
      <div className="scroll-indicator">
        <div className="scroll-track"></div>
        <div 
          className="scroll-thumb" 
          style={{ top: `calc(3vw + ${scrollProgress}% * (100vh - 6vw - 2.5rem) / 100)` }}
        >
          <span>{scrollProgress}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-backdrop"></div>
        <div className="nav-content">
          <a href="#home" className="nav-link">
            <span className="nav-text">jalrakshak</span>
            <span className="nav-text-hover">jalrakshak</span>
          </a>
          <a href="#about" className="nav-link">
            <span className="nav-text">about</span>
            <span className="nav-text-hover">about</span>
          </a>
          <a href="#features" className="nav-link">
            <span className="nav-text">features</span>
            <span className="nav-text-hover">features</span>
          </a>
          <a href="#impact" className="nav-link">
            <span className="nav-text">impact</span>
            <span className="nav-text-hover">impact</span>
          </a>
          <a href="#team" className="nav-link">
            <span className="nav-text">team</span>
            <span className="nav-text-hover">team</span>
          </a>
          <a href="#contact" className="nav-link">
            <span className="nav-text">contact</span>
            <span className="nav-text-hover">contact</span>
          </a>
        </div>
      </nav>

      <div className="container">
        {/* Hero Section */}
        <section id="home" className={`section hero-section ${visibleSections.has('home') ? 'visible' : ''}`}>
          <div className="hero-background" style={{ backgroundImage: 'url(/backgrounds/sky.jpg)' }}></div>
          <div className="hero-content">
            <h1 className="hero-main-title">AQUASYNERGY</h1>
            <div className="hero-text">
              <div className="hero-line">
                <span className="word" style={{ '--delay': '0s' }}>From</span>
                <span className="word" style={{ '--delay': '0.1s' }}>crisis</span>
              </div>
              <div className="hero-line">
                <span className="word" style={{ '--delay': '0.2s' }}>management</span>
              </div>
              <div className="hero-line">
                <span className="word" style={{ '--delay': '0.3s' }}>to</span>
              </div>
              <div className="hero-line">
                <span className="word word-animated" style={{ '--delay': '0.4s' }}>
                  {words[currentWordIndex]}
                </span>
              </div>
              <div className="hero-line">
                <span className="word" style={{ '--delay': '0.5s' }}>one</span>
                <span className="word" style={{ '--delay': '0.6s' }}>drop</span>
              </div>
              <div className="hero-line">
                <span className="word" style={{ '--delay': '0.7s' }}>at</span>
                <span className="word" style={{ '--delay': '0.8s' }}>a</span>
                <span className="word" style={{ '--delay': '0.9s' }}>time.</span>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className={`section about-section ${visibleSections.has('about') ? 'visible' : ''}`}>
          <div className="about-background" style={{ backgroundImage: 'url(/backgrounds/room.jpg)' }}></div>
          <div className="section-content">
            <div className="content-box">
              <h2 className="section-title">THE PROBLEM</h2>
              <p className="section-text">
                Every summer, thousands of villages across Maharashtra face severe water shortage. 
                The government's response is reactive, manual, and corrupt. Village Sarpanch calls 
                begging for water. District Collector gets 200+ calls daily. Tankers go to villages 
                with political connections, not actual need.
              </p>
              <p className="section-text">
                No data. No accountability. No early warning. Crores of government money wasted on 
                inefficient tanker routes. JalRakshak replaces this entire broken system with one 
                intelligent platform that shifts from crisis management to prevention.
              </p>
            </div>
            <div className="about-image">
              <img src="/about/kid.png" alt="Water Crisis" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={`section features-section ${visibleSections.has('features') ? 'visible' : ''}`}>
          <h2 className="section-title-center">HOW IT WORKS</h2>
          
          <div className="project-card" style={{ '--delay': '0s' }}>
            <div className="project-background" style={{ backgroundImage: 'url(/projects/find-your-tribe/background.jpg)' }}></div>
            <div className="project-overlay"></div>
            <div className="project-content">
              <h3 className="project-title">WSI ALGORITHM</h3>
              <p className="project-description">
                Water Stress Index calculates crisis severity using rainfall deficit (40%), groundwater drop (40%), 
                and days without water (20%). One number 0-100 tells you exactly how bad the water crisis is.
              </p>
            </div>
          </div>

          <div className="project-card" style={{ '--delay': '0.2s' }}>
            <div className="project-background" style={{ backgroundImage: 'url(/projects/sea-cracker/background.jpg)' }}></div>
            <div className="project-overlay"></div>
            <div className="project-content">
              <h3 className="project-title">SMART ALLOCATION</h3>
              <p className="project-description">
                One-click tanker dispatch using Haversine distance formula. Priority = WSI(60%) + Population(20%) + 
                Distance(20%). Right tanker goes to right village instantly. No human bias. No corruption possible.
              </p>
            </div>
          </div>

          <div className="project-card" style={{ '--delay': '0.4s' }}>
            <div className="project-background" style={{ backgroundImage: 'url(/projects/sprunk/background.jpg)' }}></div>
            <div className="project-overlay"></div>
            <div className="project-content">
              <h3 className="project-title">REAL-TIME DATA</h3>
              <p className="project-description">
                Live rainfall data from Open-Meteo API for exact village coordinates. Soil moisture as groundwater proxy. 
                Color-coded map updates automatically: Critical (red), High (orange), Moderate (yellow), Safe (green).
              </p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className={`section impact-section ${visibleSections.has('impact') ? 'visible' : ''}`}>
          <div className="impact-background" style={{ backgroundImage: 'url(/awards/sky.jpg)' }}></div>
          <div className="impact-content">
            <img src="/awards/trophy.png" alt="Trophy" className="trophy-image" />
            <h2 className="section-title-center">IMPACT</h2>
            <div className="awards-grid">
              <div className="award-item" style={{ '--delay': '0s' }}>
                <h3>30 Villages</h3>
                <p>Monitored with Real Data</p>
              </div>
              <div className="award-item" style={{ '--delay': '0.1s' }}>
                <h3>500K+ People</h3>
                <p>Covered in Dataset</p>
              </div>
              <div className="award-item" style={{ '--delay': '0.2s' }}>
                <h3>All Regions</h3>
                <p>Pan-India Coverage</p>
              </div>
              <div className="award-item" style={{ '--delay': '0.3s' }}>
                <h3>20+ APIs</h3>
                <p>Fully Working Endpoints</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className={`section team-section ${visibleSections.has('team') ? 'visible' : ''}`}>
          <div className="testimonials-background" style={{ backgroundImage: 'url(/backgrounds/sky.jpg)' }}></div>
          <h2 className="section-title-center">TECH STACK</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card" style={{ '--delay': '0s' }}>
              <img src="/testimonials/man-1.jpg" alt="Backend" className="testimonial-image" />
              <p className="testimonial-text">
                Python FastAPI • SQLite + SQLAlchemy • Pandas & NumPy • Open-Meteo API • Haversine Distance
              </p>
              <p className="testimonial-author">Backend & Algorithms</p>
            </div>
            <div className="testimonial-card" style={{ '--delay': '0.2s' }}>
              <img src="/testimonials/man-2.jpg" alt="Frontend" className="testimonial-image" />
              <p className="testimonial-text">
                React 18 • Vite • Tailwind CSS • Leaflet.js Maps • Recharts • Lucide Icons • Axios
              </p>
              <p className="testimonial-author">Frontend & Visualization</p>
            </div>
            <div className="testimonial-card" style={{ '--delay': '0.4s' }}>
              <img src="/testimonials/man-3.jpg" alt="Data" className="testimonial-image" />
              <p className="testimonial-text">
                Real IMD rainfall data • CGWB groundwater reports • Census 2011 population • Live API integration
              </p>
              <p className="testimonial-author">Data Sources</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={`section contact-section ${visibleSections.has('contact') ? 'visible' : ''}`}>
          <div className="contact-background" style={{ backgroundImage: 'url(/contact/sky.jpeg)' }}></div>
          <div className="contact-content">
            <h2 className="contact-title">TEAM DEAD PIXEL</h2>
            <h2 className="contact-title highlight">HACK A CAUSE</h2>
            <p className="contact-subtitle">Jalmanthan • PS2 • Ramdeobaba University</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App

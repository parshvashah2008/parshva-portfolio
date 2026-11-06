import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion, useIsLowPower } from './hooks/useReducedMotion'
import { useLenis } from './hooks/useLenis'
import { useDepth3D } from './hooks/useDepth3D'

// Supporting UI & Spatial Infrastructure
import Loader from './components/Loader'
import Backdrop from './components/Backdrop'
import Nav from './components/Nav'
import FloatRail from './components/FloatRail'
import Marquee from './components/Marquee'
import CustomCursor from './components/CustomCursor'
import FilmGrainOverlay from './components/FilmGrainOverlay'

// Complete 9-Page Portfolio Architecture
import Hero from './components/Hero'                           // Page 01: Home / Introduction
import ProjectUniverse from './components/ProjectUniverse'       // Page 02 & 03: 3D Project Universe & Case Studies
import AboutSection from './components/AboutSection'           // Page 04: About Me
import ExperienceSection from './components/ExperienceSection'   // Page 05: Experience & Achievements
import TechStackSection from './components/TechStackSection'     // Page 06: Tech Stack & Capabilities
import DigitalPlayground from './components/DigitalPlayground'   // Page 07: Experiments / Digital Lab
import WritingSection from './components/WritingSection'       // Page 08: Writing & Field Notes
import ContactSection from './components/ContactSection'       // Page 09: Contact & Collaboration

gsap.registerPlugin(ScrollTrigger)

const STACK_TICKER = [
  'FastAPI', 'Claude Agent SDK', 'Model Context Protocol (MCP)', 'Python 3.12',
  'Three.js / WebGL', 'React 19', 'PostgreSQL', 'Google Gemini 1.5 Pro',
  'MediaPipe Computer Vision', 'SQLAlchemy 2.0', 'KaTeX', 'Tailwind CSS',
]

export default function App() {
  const reduced = useReducedMotion()
  const lowPower = useIsLowPower()
  const [loading, setLoading] = useState(true)

  useLenis(reduced)
  useDepth3D(reduced, !loading)

  useEffect(() => {
    // Prevent browser auto-restoring scroll to middle of page
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    // If opening without a specific #hash anchor, always start at Home (0, 0)
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    if (loading) return undefined
    const t = setTimeout(() => ScrollTrigger.refresh(), 260)
    return () => clearTimeout(t)
  }, [loading])

  return (
    <>
      <CustomCursor reduced={reduced} />
      <FilmGrainOverlay reduced={reduced} />
      <Loader reduced={reduced} onDone={() => setLoading(false)} />
      <Backdrop reduced={reduced} />
      <Nav reduced={reduced} />
      <FloatRail />

      <main className="relative">
        {/* Page 01: Home / Introduction */}
        <Hero reduced={reduced} />

        {/* Page 02 & 03: The Centerpiece 3D Project Universe & Dedicated Case Studies */}
        <ProjectUniverse reduced={reduced} lowPower={lowPower} />

        {/* Page 04: About Me */}
        <AboutSection reduced={reduced} />

        {/* Page 05: Experience & Achievements */}
        <ExperienceSection reduced={reduced} />

        {/* Page 06: Tech Stack & Capabilities */}
        <TechStackSection reduced={reduced} lowPower={lowPower} />

        {/* Continuous Architectural Ticker */}
        <Marquee items={STACK_TICKER} duration={48} />

        {/* Page 07: Experiments & Digital Playground */}
        <DigitalPlayground reduced={reduced} />

        {/* Page 08: Writing & Thoughts */}
        <WritingSection />

        {/* Page 09: Contact & Collaboration */}
        <ContactSection />
      </main>
    </>
  )
}

import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion, useIsLowPower } from './hooks/useReducedMotion'
import { useLenis } from './hooks/useLenis'
import { useDepth3D } from './hooks/useDepth3D'
import { useContentProtection } from './hooks/useContentProtection'
import { playMusic } from './utils/soundFX'

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
  'React', 'FastAPI', 'ChatGPT', 'Claude API', 'Three.js', 'Python', 'C++', 'Postgres', 'HTML', 'Twilio', 'Supabase',
]

export default function App() {
  const reduced = useReducedMotion()
  const lowPower = useIsLowPower()
  const [loading, setLoading] = useState(true)
  const { isVeiled, toastMessage, dismissVeil } = useContentProtection()

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
      <Loader reduced={reduced} onDone={() => { setLoading(false); playMusic(); }} />
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

      {/* Privacy Protection Shield: Active on screenshot attempts / window blur */}
      {isVeiled && (
        <div
          onClick={dismissVeil}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-2xl text-center px-6 transition-all duration-200 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full border border-[#c8f53c]/40 bg-[#c8f53c]/10 flex items-center justify-center text-[#c8f53c] text-xl mb-4 shadow-[0_0_24px_rgba(200,245,60,0.3)]">
            🔒
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#c8f53c] mb-2">
            Protected Digital Canvas
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#f4f1ea] font-normal mb-2">
            Parshva Shah · Spatial Portfolio
          </h2>
          <p className="font-sans text-xs sm:text-sm text-white/60 max-w-md mb-6 leading-relaxed">
            Screen captures and automated harvesting are restricted. Click anywhere to resume viewing.
          </p>
          <button
            type="button"
            onClick={dismissVeil}
            className="px-5 py-2 rounded-full bg-[#c8f53c] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#d6ff4d] transition-all cursor-pointer"
          >
            Resume Viewing
          </button>
        </div>
      )}

      {/* Non-intrusive HUD toast for blocked shortcuts / context menu */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none transition-all duration-200">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0a120c]/90 border border-[#c8f53c]/40 shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-pulse" />
            <span className="font-mono text-[11px] text-[#f4f1ea] tracking-wide">
              {toastMessage}
            </span>
          </div>
        </div>
      )}
    </>
  )
}

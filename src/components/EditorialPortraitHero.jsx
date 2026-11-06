import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSyntheticSound } from '../utils/soundFX'

const EASE = [0.16, 1, 0.3, 1]

const PORTRAITS = [
  {
    id: 'street',
    title: 'Night Street & Horizon',
    tag: 'THE INDEPENDENT BUILDER',
    src: `${import.meta.env.BASE_URL}parshva-street.jpg`,
    location: 'Urban Shift · Mumbai',
    caption: 'Exploring modern software architectures, creative technologies, and AI agents under late-night neon.',
    badge: 'PERSPECTIVE 01 // NIGHT',
    aspect: 'object-cover object-center',
  },
  {
    id: 'jersey',
    title: 'PARSHVA 04 — Chiaroscuro',
    tag: 'THE DISCIPLINE & IDENTITY',
    src: `${import.meta.env.BASE_URL}parshva-jersey.png`,
    location: 'Studio Silhouette · Mumbai',
    caption: 'Athletic focus, relentless prototyping, and the builder mindset behind every shipped codebase.',
    badge: 'PERSPECTIVE 02 // IDENTITY',
    aspect: 'object-cover object-[center_28%]',
  },
  {
    id: 'portrait',
    title: 'Analytical Focus',
    tag: 'THE SYSTEMS ARCHITECT',
    src: `${import.meta.env.BASE_URL}parshva-portrait.png`,
    location: 'KJ Somaiya · AI & DS',
    caption: 'Pursuing BTech in Artificial Intelligence & Data Science (2026–2030), engineering from first principles.',
    badge: 'PERSPECTIVE 03 // ARCHITECT',
    aspect: 'object-cover object-center',
  },
]

export default function EditorialPortraitHero({ reduced = false }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef(null)

  // Preload all portrait images so transitions are instant with zero flash
  useEffect(() => {
    PORTRAITS.forEach((p) => {
      const img = new Image()
      img.src = p.src
    })
  }, [])

  // 1-second auto carousel: changes picture directly every 1000ms
  useEffect(() => {
    if (reduced) return undefined

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PORTRAITS.length)
    }, 1000)

    return () => clearInterval(timer)
  }, [activeIdx, reduced])

  const active = PORTRAITS[activeIdx]

  // Subtle interactive 3D tilt
  const handleMouseMove = (e) => {
    if (reduced || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: x * 10, y: -y * 10 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  // Keyboard and manual click navigation
  const nextPerspective = () => {
    playSyntheticSound('shutter')
    setActiveIdx((prev) => (prev + 1) % PORTRAITS.length)
  }

  const selectPerspective = (idx) => {
    playSyntheticSound('shutter')
    setActiveIdx(idx)
  }

  return (
    <div className="relative w-full flex flex-col gap-3">
      {/* Editorial Frame with 3D Tilt */}
      <div
        ref={containerRef}
        data-cursor="view"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: reduced
            ? 'none'
            : `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s var(--ease)',
        }}
        className="relative h-[48vh] sm:h-[56vh] lg:h-[66vh] w-full rounded-3xl overflow-hidden border border-white/[0.12] bg-[#060807] shadow-[0_24px_80px_rgba(0,0,0,0.8)] select-none group"
      >
        {/* Photo Canvas with direct snappy crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={active.src}
              alt={active.title}
              className={`w-full h-full ${active.aspect} contrast-[1.08] brightness-[0.98] group-hover:scale-[1.02] transition-transform duration-700`}
            />

            {/* Cinematic vignetting and atmospheric lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040504] via-[#040504]/20 to-[#040504]/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#040504]/30 via-transparent to-[#040504]/30 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Viewfinder crosshairs and technical metadata */}
        <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between pointer-events-none z-10">
          {/* Top Bar Metadata */}
          <div className="flex items-center justify-between text-white/70">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[10px] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8f53c] animate-pulse" />
              <span>{active.badge}</span>
            </div>

            <div className="font-mono text-[10px] tracking-widest uppercase text-white/50 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded border border-white/5">
              ISO 400 · 35MM · RAW
            </div>
          </div>

          {/* Center Subtle Grid Markers */}
          <div className="flex justify-between items-center opacity-30 text-white font-mono text-xs">
            <span>+</span>
            <span>+</span>
          </div>

          {/* Bottom Card Title & Narrative (Consistent height across slides) */}
          <div className="space-y-2 pointer-events-auto">
            <div className="rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-5 space-y-1.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c8f53c]">
                  {active.tag}
                </span>
                <span className="font-mono text-[10px] text-[#a8a49a]">{active.location}</span>
              </div>

              <div className="font-serif text-lg sm:text-2xl text-white font-normal leading-snug">
                {active.title}
              </div>

              <p className="text-xs text-white/80 font-sans line-clamp-2 leading-relaxed">
                {active.caption}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Click-to-Next Overlay */}
        <button
          onClick={nextPerspective}
          aria-label="Switch perspective"
          className="absolute inset-0 w-full h-full cursor-pointer z-20 focus:outline-none"
        />
      </div>

      {/* Perspective Switcher Controls */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {PORTRAITS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => selectPerspective(idx)}
              className={`px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-[#c8f53c] text-black font-semibold shadow-[0_0_15px_rgba(200,245,60,0.3)]'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              0{idx + 1} // {p.id === 'street' ? 'Street' : p.id === 'jersey' ? 'Jersey 04' : 'Portrait'}
            </button>
          ))}
        </div>

        <button
          onClick={nextPerspective}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[11px] text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <span>Next</span>
          <span className="text-[#c8f53c]">↻</span>
        </button>
      </div>
    </div>
  )
}

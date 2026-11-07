import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EditorialPortraitHero from './EditorialPortraitHero'
import MagneticButton from './MagneticButton'
import FluidAmberBackground from './FluidAmberBackground'
import { projects } from '../data/projects'
import { forageCertifications, anthropicCertifications } from '../data/certifications'
import { useGitHubStats } from '../utils/githubStats'

const EASE = [0.16, 1, 0.3, 1]

/**
 * InvertibleHeroTypography
 *
 * Implements a dual-layer typography architecture:
 * 1. Base Layer: Elegant editorial serif typography in warm luminous ivory & golden honey on dark background
 * 2. Inverted Black Layer: Crisp deep ink-black typography revealed in real-time beneath the cursor's
 *    fluid amber glow using hardware-accelerated multi-stamp CSS radial masks.
 *
 * When the glowing cursor/trail moves over the text, the letters under the glow turn pitch black (#050402),
 * preventing blowout and creating high contrast against the illuminated amber pool.
 */
function InvertibleHeroTypography({ reduced }) {
  const containerRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined
    const container = containerRef.current
    const overlay = overlayRef.current
    if (!container || !overlay) return undefined

    // Active trail stamps for smooth multi-point fluid mask
    const stamps = []
    let lastX = -1000
    let lastY = -1000
    let lastTime = performance.now()
    let rafId = null

    function handlePointer(clientX, clientY) {
      const rect = container.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const dx = x - lastX
      const dy = y - lastY
      const dist = Math.hypot(dx, dy)
      lastX = x
      lastY = y

      // Stamp radius dynamically expands with pointer velocity to mirror the fluid splat (185px - 280px)
      const radius = Math.min(280, 185 + dist * 1.6)

      stamps.push({
        x,
        y,
        r: radius,
        alpha: 1.0,
        decay: 0.92, // Smooth dissipation over ~1.1s matching the fluid dissipation
      })

      // Retain the most recent active stamps
      if (stamps.length > 10) {
        stamps.splice(0, stamps.length - 10)
      }
    }

    const onPointerMove = (e) => {
      handlePointer(e.clientX, e.clientY)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    function loop(now) {
      rafId = requestAnimationFrame(loop)
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      if (stamps.length === 0) {
        if (overlay.style.opacity !== '0') {
          overlay.style.opacity = '0'
        }
        return
      }

      for (let i = stamps.length - 1; i >= 0; i--) {
        stamps[i].alpha -= dt * stamps[i].decay
        stamps[i].r += dt * 32
        if (stamps[i].alpha <= 0.02) {
          stamps.splice(i, 1)
        }
      }

      if (stamps.length === 0) {
        overlay.style.opacity = '0'
        return
      }

      // Build composite CSS radial gradient mask
      const gradients = stamps.map((s) => {
        const a = Math.min(1.0, s.alpha).toFixed(3)
        const aMid = (s.alpha * 0.72).toFixed(3)
        const r = Math.round(s.r)
        const rx = Math.round(s.x)
        const ry = Math.round(s.y)
        return `radial-gradient(circle ${r}px at ${rx}px ${ry}px, rgba(0,0,0,${a}) 0%, rgba(0,0,0,${aMid}) 52%, transparent 100%)`
      })

      const maskValue = gradients.join(', ')
      overlay.style.maskImage = maskValue
      overlay.style.webkitMaskImage = maskValue
      overlay.style.opacity = '1'
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [reduced])

  return (
    <div ref={containerRef} className="relative select-none">
      {/* 1. BASE LAYER: Luminous warm cream & amber/gold on dark textured surface */}
      <div className="space-y-4">
        {/* Status Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          className="font-mono text-xs uppercase tracking-[0.28em] text-[#e5a83b] flex items-center gap-2"
        >
          <span className="text-[#e5a83b]/60">❖</span>
          <span>[ 01 // ARCHIVE · BTECH 2026–2030 ]</span>
        </motion.div>

        {/* Headline: Parshva Shah (Sublime Instrument Serif & Italic Gold Accent) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.2rem] font-normal leading-[0.9] tracking-[-0.035em] text-[#fbf8f0]"
        >
          Parshva{' '}
          <span className="italic font-serif text-[#f0c458] transition-colors duration-300">
            Shah
          </span>
        </motion.h1>

        {/* Editorial Quote: Refined pull-quote layout with delicate amber border and typographic cadence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="border-l-2 border-[#e5a83b]/45 pl-4 sm:pl-5 py-1.5 my-3.5 backdrop-blur-[2px]"
        >
          <p className="font-serif text-xl sm:text-2xl md:text-[1.85rem] text-[#f2ebe0] font-normal leading-[1.28] tracking-[-0.018em]">
            “Building things that make the digital world{' '}
            <span className="italic text-[#f5d58a]">more interesting.</span>”
          </p>
        </motion.div>

        {/* Supporting Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg text-[#b8b1a2] font-sans max-w-xl leading-relaxed"
        >
          I'm Parshva — a developer, engineering student at{' '}
          <span className="text-[#fbf8f0] font-medium">KJ Somaiya School of Engineering</span>{' '}
          (BTech AI &amp; DS 2026–2030), and independent builder exploring the intersection of software engineering, AI, and product design.
        </motion.p>
      </div>

      {/* 2. INVERTED BLACK OVERLAY LAYER: Revealed dynamically under the glowing cursor/fluid */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none space-y-4"
        style={{
          opacity: 0,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        {/* Status Eyebrow Inverted (Crisp Deep Ink Black) */}
        <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#050402] font-normal flex items-center gap-2">
          <span>❖</span>
          <span>[ 01 // ARCHIVE · BTECH 2026–2030 ]</span>
        </div>

        {/* Headline Inverted (Solid Ink Black - 100% subpixel metric alignment with base) */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.2rem] font-normal leading-[0.9] tracking-[-0.035em] text-[#050402]">
          Parshva{' '}
          <span className="italic font-serif text-[#050402]">
            Shah
          </span>
        </h1>

        {/* Editorial Quote Inverted (Solid Ink Black - 100% metric match) */}
        <div className="border-l-2 border-[#050402] pl-4 sm:pl-5 py-1.5 my-3.5">
          <p className="font-serif text-xl sm:text-2xl md:text-[1.85rem] text-[#050402] font-normal leading-[1.28] tracking-[-0.018em]">
            “Building things that make the digital world{' '}
            <span className="italic text-[#050402]">more interesting.</span>”
          </p>
        </div>

        {/* Supporting Introduction Inverted (Pure Ink Black - 100% metric match) */}
        <p className="text-sm sm:text-base md:text-lg text-[#050402] font-sans font-normal max-w-xl leading-relaxed">
          I'm Parshva — a developer, engineering student at{' '}
          <span className="text-[#050402] font-medium">KJ Somaiya School of Engineering</span>{' '}
          (BTech AI &amp; DS 2026–2030), and independent builder exploring the intersection of software engineering, AI, and product design.
        </p>
      </div>
    </div>
  )
}

export default function Hero({ reduced = false }) {
  const [activeStat, setActiveStat] = useState(0)
  const ghStats = useGitHubStats()

  const stats = [
    { n: String(projects.length), l: 'Verified Projects Shipped' },
    { n: String(anthropicCertifications.length), l: 'Anthropic Claude Certifications' },
    { n: String(ghStats.publicRepos), l: 'Public Production Repositories' },
    { n: String(forageCertifications.length), l: 'Forage Industry Simulations' },
  ]

  useEffect(() => {
    if (reduced) return undefined
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length)
    }, 3200)
    return () => clearInterval(interval)
  }, [reduced, stats.length])

  return (
    <FluidAmberBackground
      as="section"
      id="home"
      backgroundColor="#090703"
      glowColor={[224, 142, 28]}
      tintColor="#d98b1e"
      cursorColor="#d8c4a0"
      grainOpacity={0.32}
      reduced={reduced}
      className="relative min-h-[100svh] flex flex-col justify-between pt-24 pb-12 overflow-hidden"
    >
      {/* Main Hero Grid */}
      <div className="shell w-full my-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
        {/* Left Column: Expressive Typography & Storytelling */}
        <div className="space-y-7 z-10">
          {/* Status badge with warm amber pulse and glass border */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/25 backdrop-blur-md shadow-[0_2px_12px_rgba(229,168,59,0.12)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#e5a83b] animate-ping" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f4f1ea]/95">
              Independent Builder &amp; Engineering Student
            </span>
          </motion.div>

          {/* Invertible Elevated Typography (Turns black under cursor glow) */}
          <InvertibleHeroTypography reduced={reduced} />

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <MagneticButton
              href="#work"
              reduced={reduced}
              className="bg-[#e5a83b]! text-black! font-semibold hover:bg-[#f2b448]! shadow-[0_10px_30px_rgba(229,168,59,0.28)] px-7 py-3.5 text-sm"
            >
              Explore Project Universe →
            </MagneticButton>

            <MagneticButton
              href="#about"
              variant="outline"
              reduced={reduced}
              className="border-white/20 hover:border-amber-400/60 px-6 py-3.5 text-white text-sm"
            >
              About &amp; Manifesto
            </MagneticButton>
          </motion.div>

          {/* Rotating credential highlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-2 flex items-center gap-4 font-mono text-xs text-white/50"
          >
            <span className="text-[#e5a83b] font-bold">●</span>
            <div className="h-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stats[activeStat].l}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2 text-white/80"
                >
                  <span className="font-bold text-white text-sm">{stats[activeStat].n}</span>
                  <span className="text-[#a8a49a] font-medium">{stats[activeStat].l}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Editorial Photograph Frame with Parshva's Authentic Pictures */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="relative w-full z-10"
        >
          <EditorialPortraitHero reduced={reduced} />
        </motion.div>
      </div>

      {/* Information Strip (Specification Requirement & Live Activity Radar) */}
      <div className="shell relative z-20 mt-12 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
          <div className="flex flex-col gap-1.5">
            <span className="text-[#a8a49a] uppercase tracking-widest text-[10px] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e5a83b] animate-pulse" />
              Live Activity Radar {ghStats.isLive && <span className="text-[9px] text-[#e5a83b] font-mono">(API LIVE)</span>}
            </span>
            <span className="text-white/90 font-sans text-xs flex items-center gap-2">
              <span className="text-[#e5a83b] font-mono">●</span>
              <a
                href={ghStats.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e5a83b] transition-colors inline-flex items-center gap-1.5 group"
                title="View GitHub Profile (@parshvashah2008)"
              >
                <span className="underline decoration-white/20 underline-offset-2 group-hover:decoration-[#e5a83b]">
                  {ghStats.statusText}
                </span>
                <span className="font-mono text-[9px] text-[#e5a83b] bg-[#e5a83b]/10 px-1.5 py-0.5 rounded border border-[#e5a83b]/25">
                  {ghStats.publicRepos} Repos
                </span>
                <span className="text-[10px] text-white/50 group-hover:text-[#e5a83b]">↗</span>
              </a>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[#a8a49a] uppercase tracking-widest text-[10px] font-semibold">
              Location &amp; Academic Base
            </span>
            <span className="text-white/90 font-sans text-xs flex items-center gap-1.5">
              <span>🇮🇳</span> Mumbai / Surat · KJ Somaiya School of Engineering
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[#a8a49a] uppercase tracking-widest text-[10px] font-semibold">
              Engineering Focus
            </span>
            <span className="text-white/90 font-sans text-xs">
              Software Engineering · AI Agent Systems · WebGL &amp; Full-Stack
            </span>
          </div>
        </div>
      </div>
    </FluidAmberBackground>
  )
}

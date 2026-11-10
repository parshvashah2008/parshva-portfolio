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
 * HeroTypographyContent
 *
 * Shared metric-locked typography renderer used by both the base ivory/gold layer
 * and the cursor-illuminated ink-black layer. Keeping the markup, fonts, weights,
 * spacing, and line-heights 100% identical prevents any character shift or double-ghosting.
 */
function HeroTypographyContent({ inverted = false }) {
  return (
    <div className="space-y-4">
      {/* Status Eyebrow — identical font-normal weight across both layers */}
      <div
        className={`font-mono text-xs font-normal uppercase tracking-[0.28em] flex items-center gap-2 ${
          inverted ? 'text-[#050402]' : 'text-[#f2ebe0]/90'
        }`}
      >
        <span className={inverted ? 'text-[#050402]' : 'text-[#e5a83b]'}>❖</span>
        <span>[ 01 // ARCHIVE · BTECH 2026–2030 ]</span>
      </div>

      {/* Headline: Parshva Shah — Instrument Serif & Italic Display */}
      <h1
        className={`font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] xl:text-[6.2rem] font-normal leading-[0.92] tracking-[-0.035em] ${
          inverted ? 'text-[#050402]' : 'text-[#fbf8f0]'
        }`}
      >
        Parshva{' '}
        <span
          className={`italic font-serif font-normal ${
            inverted ? 'text-[#050402]' : 'text-[#f0c458]'
          }`}
        >
          Shah
        </span>
      </h1>

      {/* Editorial Pull Quote */}
      <div
        className={`border-l-2 pl-5 sm:pl-6 py-2 my-4 ${
          inverted ? 'border-[#050402]' : 'border-[#e5a83b]/55'
        }`}
      >
        <p
          className={`font-serif italic text-2xl sm:text-3xl md:text-[1.95rem] font-normal leading-[1.26] tracking-[-0.015em] ${
            inverted ? 'text-[#050402]' : 'text-[#f4efe6]'
          }`}
        >
          “Building things that make the digital world{' '}
          <span
            className={`not-italic font-serif font-normal ${
              inverted ? 'text-[#050402]' : 'text-[#f5d58a]'
            }`}
          >
            more interesting.
          </span>
          ”
        </p>
      </div>

      {/* Supporting Introduction — exact metric parity on every inline span */}
      <p
        className={`text-sm sm:text-base md:text-lg font-sans font-normal max-w-xl leading-relaxed ${
          inverted ? 'text-[#050402]' : 'text-[#c2bbb0]'
        }`}
      >
        I'm Parshva — a developer, engineering student at{' '}
        <span
          className={`font-medium ${
            inverted ? 'text-[#050402]' : 'text-[#fbf8f0]'
          }`}
        >
          KJ Somaiya School of Engineering
        </span>{' '}
        <span
          className={`font-mono text-[0.82em] tracking-tight font-normal ${
            inverted ? 'text-[#050402]' : 'text-[#f4efe6]/90'
          }`}
        >
          (BTech AI &amp; DS 2026–2030)
        </span>
        , and independent builder exploring the intersection of software engineering, AI, and product design.
      </p>
    </div>
  )
}

/**
 * InvertibleHeroTypography
 *
 * Renders a metric-locked dual-layer typography system with mutually exclusive masks:
 * - Base Layer (Ivory & Gold) is masked OUT inside the bright amber glow core
 * - Overlay Layer (Ink Black #050402) is masked IN inside the exact same bright amber glow core
 *
 * The mask mirrors the bright fluid core radius and burns away in lockstep as the glow fades,
 * guaranteeing crisp ink-black letters over luminous amber and crisp ivory over the dark canvas.
 */
function InvertibleHeroTypography({ reduced }) {
  const containerRef = useRef(null)
  const baseRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined
    const container = containerRef.current
    const base = baseRef.current
    const overlay = overlayRef.current
    if (!container || !base || !overlay) return undefined

    const stamps = []
    let lastX = -1000
    let lastY = -1000
    let lastTime = performance.now()
    let rafId = null

    function handlePointer(clientX, clientY) {
      const rect = container.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const isNearby =
        x >= -130 &&
        x <= rect.width + 130 &&
        y >= -130 &&
        y <= rect.height + 130

      if (!isNearby) {
        lastX = -1000
        lastY = -1000
        return
      }

      if (lastX < -500) {
        lastX = x
        lastY = y
      }

      const dx = x - lastX
      const dy = y - lastY
      const dist = Math.hypot(dx, dy)

      // Strictly track only the bright luminous amber core (2D blur + dissipation decays fast)
      const fluidH = container.closest('[data-fluid-bg]')?.clientHeight || window.innerHeight || 760
      const minCoreR = Math.max(30, Math.round(fluidH * 0.044))
      const baseR = Math.min(58, minCoreR + dist * 0.22)
      const steps = Math.max(1, Math.min(6, Math.ceil(dist / 16)))
      const vx = Math.max(-70, Math.min(70, dx * 1.4))
      const vy = Math.max(-70, Math.min(70, dy * 1.4))
      const initialAlpha = Math.min(1.0, 0.76 + dist * 0.018)

      for (let s = 1; s <= steps; s++) {
        const t = s / steps
        stamps.push({
          x: lastX + dx * t,
          y: lastY + dy * t,
          vx: vx * 0.3,
          vy: vy * 0.3,
          baseR,
          r: baseR,
          alpha: initialAlpha,
        })
      }

      lastX = x
      lastY = y

      if (stamps.length > 16) {
        stamps.splice(0, stamps.length - 16)
      }
    }

    const onPointerMove = (e) => {
      handlePointer(e.clientX, e.clientY)
    }

    const onPointerLeave = () => {
      lastX = -1000
      lastY = -1000
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)

    function clearMasks() {
      overlay.style.opacity = '0'
      overlay.style.maskImage = 'none'
      overlay.style.webkitMaskImage = 'none'
      base.style.maskImage = 'none'
      base.style.webkitMaskImage = 'none'
      base.style.maskComposite = ''
      base.style.webkitMaskComposite = ''
    }

    function loop(now) {
      rafId = requestAnimationFrame(loop)
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      for (let i = stamps.length - 1; i >= 0; i--) {
        const st = stamps[i]
        // Exponential + 2D diffusion attenuation matching WebGL peak bright-core lifetime
        st.alpha *= Math.exp(-5.8 * dt)
        st.x += st.vx * dt
        st.y += st.vy * dt
        st.vx *= 0.90
        st.vy *= 0.90
        st.r = st.baseR * (0.25 + 0.75 * Math.max(0, st.alpha))
        if (st.alpha <= 0.42) {
          st.alpha = 0
          stamps.splice(i, 1)
        }
      }

      if (stamps.length === 0) {
        if (overlay.style.opacity !== '0') {
          clearMasks()
        }
        return
      }

      const revealGradients = stamps.map((p) => {
        const r = Math.max(8, Math.round(p.r))
        const rx = Math.round(p.x)
        const ry = Math.round(p.y)
        const coreStrength = p.alpha > 0.62 ? '1' : Math.max(0, (p.alpha - 0.42) / 0.2).toFixed(3)
        return `radial-gradient(circle ${r}px at ${rx}px ${ry}px, rgba(0,0,0,${coreStrength}) 0%, rgba(0,0,0,${coreStrength}) 48%, transparent 72%)`
      })

      // Overlay reveals ink-black text inside active bright amber trail
      const revealMask = revealGradients.join(', ')
      overlay.style.maskImage = revealMask
      overlay.style.maskComposite = 'add'
      overlay.style.opacity = '1'

      // Base layer: solid mask on TOP (index 0) subtracts the union of all reveal gradients below it
      // Formula: solid \ (grad1 + grad2 + ... + gradN) = 1 - min(1, sum)
      const cutoutMask = ['linear-gradient(#000, #000)', ...revealGradients].join(', ')
      const compositeModes = ['subtract', ...revealGradients.map(() => 'add')].join(', ')
      base.style.maskImage = cutoutMask
      base.style.maskComposite = compositeModes
    }

    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [reduced])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
      className="relative select-none"
    >
      {/* 1. BASE LAYER: Warm luminous ivory & gold (masked out inside amber core) */}
      <div
        ref={baseRef}
        style={{
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <HeroTypographyContent inverted={false} />
      </div>

      {/* 2. INVERTED BLACK LAYER: Pure ink black (#050402) revealed only over bright amber trail */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none z-20"
        style={{
          opacity: 0,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <HeroTypographyContent inverted={true} />
      </div>
    </motion.div>
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

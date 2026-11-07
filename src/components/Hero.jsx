import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EditorialPortraitHero from './EditorialPortraitHero'
import MagneticButton from './MagneticButton'
import { projects } from '../data/projects'
import { forageCertifications, anthropicCertifications } from '../data/certifications'

const EASE = [0.16, 1, 0.3, 1]

export default function Hero({ reduced = false }) {
  const [activeStat, setActiveStat] = useState(0)

  const stats = [
    { n: String(projects.length), l: 'Verified Projects Shipped' },
    { n: String(anthropicCertifications.length), l: 'Anthropic Claude Certifications' },
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
    <section
      id="home"
      className="relative min-h-[100svh] flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-[#040504]"
    >
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-[42vw] h-[42vw] bg-[#c8f53c]/[0.025] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[38vw] h-[38vw] bg-[#1a3828]/[0.3] rounded-full blur-[150px] pointer-events-none" />

      {/* Main Hero Grid */}
      <div className="shell w-full my-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
        {/* Left Column: Expressive Typography & Storytelling */}
        <div className="space-y-7 z-10">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-ping" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f4f1ea]/90">
              Independent Builder &amp; Engineering Student
            </span>
          </motion.div>

          {/* Large Expressive Typography */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              className="font-mono text-xs uppercase tracking-[0.28em] text-[#c8f53c]"
            >
              [ 01 // ARCHIVE · BTECH 2026–2030 ]
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[0.92] tracking-[-0.03em] text-[#f4f1ea]"
            >
              Parshva <span className="italic font-serif text-[#a8a49a]">Shah</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#f4f1ea]/90 font-normal leading-[1.18] tracking-[-0.015em]"
            >
              "Building things that make the digital world more interesting."
            </motion.div>
          </div>

          {/* Supporting Introduction */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-[#a8a49a] font-sans max-w-xl leading-relaxed"
          >
            I'm Parshva — a developer, engineering student at KJ Somaiya School of Engineering (BTech AI &amp; DS 2026–2030), and independent builder exploring the intersection of software engineering, AI, and product design.
          </motion.p>

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
              className="bg-[#c8f53c]! text-black! font-semibold hover:bg-[#d8ff54]! shadow-[0_10px_30px_rgba(200,245,60,0.25)] px-7 py-3.5 text-sm"
            >
              Explore Project Universe →
            </MagneticButton>

            <MagneticButton
              href="#about"
              variant="outline"
              reduced={reduced}
              className="border-white/20 hover:border-white px-6 py-3.5 text-white text-sm"
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
            <span className="text-[#c8f53c] font-bold">●</span>
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8f53c] animate-pulse" />
              Live Activity Status
            </span>
            <span className="text-white/90 font-sans text-xs flex items-center gap-2">
              <span className="text-[#c8f53c] font-mono">●</span>
              <span>Active Builder · Pushing code to GitHub (@parshvashah2008)</span>
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
    </section>
  )
}

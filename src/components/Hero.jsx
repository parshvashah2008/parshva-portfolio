import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PortraitMatrix from './PortraitMatrix'
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
      <div className="absolute top-10 left-1/3 w-[36vw] h-[36vw] bg-[#c8f53c]/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[32vw] h-[32vw] bg-[#1a3828]/[0.25] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Hero Grid */}
      <div className="shell w-full my-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        {/* Left Column: Expressive Typography & Storytelling */}
        <div className="space-y-6 z-10">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/5 border border-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-ping" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#f4f1ea]/90">
              Independent Builder &amp; Engineering Student
            </span>
          </motion.div>

          {/* Large Expressive Typography */}
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[0.94] tracking-tight text-[#f4f1ea]"
            >
              Parshva <span className="italic font-serif text-[#a8a49a]">Shah</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#f4f1ea]/90 font-light leading-snug"
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
            I'm Parshva — a developer, engineering student at KJ Somaiya, and independent builder exploring the intersection of software engineering, AI and product design.
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
              className="bg-[#c8f53c]! text-black! font-semibold hover:bg-[#d8ff54]! shadow-lg px-6 py-3"
            >
              Explore Project Universe →
            </MagneticButton>

            <MagneticButton
              href="#about"
              variant="outline"
              reduced={reduced}
              className="border-white/20 hover:border-white px-6 py-3 text-white"
            >
              About Parshva
            </MagneticButton>
          </motion.div>

          {/* Rotating credential highlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-4 flex items-center gap-4 font-mono text-xs text-white/50"
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
                  className="flex items-center gap-2"
                >
                  <span className="font-bold text-white text-sm">{stats[activeStat].n}</span>
                  <span>{stats[activeStat].l}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right Column: High-Quality Personal Photograph Matrix */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          className="relative h-[42vh] sm:h-[50vh] lg:h-[62vh] rounded-3xl overflow-hidden border border-white/10 bg-[#060a08]/80 backdrop-blur-sm p-2 group"
        >
          {/* Luminance-mapped interactive particle matrix canvas */}
          <div className="w-full h-full relative rounded-2xl overflow-hidden">
            <PortraitMatrix src={`${import.meta.env.BASE_URL}parshva-portrait.png`} reduced={reduced} />
          </div>

          {/* Subtle spatial caption overlay */}
          <div className="pointer-events-none absolute bottom-4 inset-x-0 flex justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
              Interactive Pixel Matrix · Hover to perturb
            </span>
          </div>
        </motion.div>
      </div>

      {/* Information Strip (Specification Requirement) */}
      <div className="shell relative z-20 mt-12 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-white/40 uppercase tracking-widest text-[10px]">Currently</span>
            <span className="text-white/80 font-sans text-xs">
              Building digital products &amp; exploring AI engineering
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-white/40 uppercase tracking-widest text-[10px]">Based in</span>
            <span className="text-white/80 font-sans text-xs flex items-center gap-1.5">
              <span>🇮🇳</span> Mumbai / Surat, India
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-white/40 uppercase tracking-widest text-[10px]">Focus</span>
            <span className="text-white/80 font-sans text-xs">
              Software Engineering · AI · Web Dev · Product Building
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

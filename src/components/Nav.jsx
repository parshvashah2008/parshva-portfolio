import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton'
import { isSoundEnabled, toggleSound, playSyntheticSound } from '../utils/soundFX'

const LINKS = [
  { id: 'work', label: 'Work (Universe)' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'tech-stack', label: 'Tech Stack' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'writing', label: 'Writing' },
]

export default function Nav({ reduced = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const [soundActive, setSoundActive] = useState(isSoundEnabled())

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      setScrolled(window.scrollY > 24)
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (!targets.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px' }
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      window.__lenis?.stop()
    } else {
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [open])

  return (
    <>
      {/* Permanent top scrim */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-40 pointer-events-none"
        style={{
          height: 'calc(var(--nav-h) + 36px)',
          background: 'linear-gradient(180deg, rgba(4,6,5,.95), rgba(4,6,5,.6) 55%, transparent)',
        }}
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass' : 'bg-transparent'
        }`}
        style={{ height: 'var(--nav-h)' }}
      >
        <div className="shell h-full flex items-center justify-between">
          {/* Custom Personal Monogram / Logo */}
          <a
            href="#home"
            className="group flex items-center gap-3 font-display font-bold text-[16px] tracking-tight"
          >
            <div className="relative w-8 h-8 rounded-lg border border-white/20 bg-[#0e1612] flex items-center justify-center p-0.5 group-hover:border-[#c8f53c] transition-all shadow-sm">
              <span className="font-mono text-xs font-bold text-[#f4f1ea] tracking-tighter">PS</span>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#c8f53c] animate-ping" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[#f4f1ea] font-sans text-sm font-semibold group-hover:text-[#c8f53c] transition-colors">
                Parshva Shah
              </span>
              <span className="font-mono text-[9px] text-[#a8a49a] tracking-wider uppercase">
                Independent Builder
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={'#' + l.id}
                onMouseEnter={() => playSyntheticSound('tick')}
                onClick={() => playSyntheticSound('click')}
                className="relative px-3.5 py-1.5 font-mono text-xs transition-colors rounded-full"
                style={{ color: active === l.id ? '#c8f53c' : 'rgba(244, 241, 234, 0.65)' }}
              >
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full border border-[#c8f53c]/30 bg-white/5"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Audio Toggle, Contact Action & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const nowOn = toggleSound()
                setSoundActive(nowOn)
              }}
              onMouseEnter={() => playSyntheticSound('tick')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] border transition-all flex items-center gap-1.5 cursor-pointer ${
                soundActive
                  ? 'border-[#c8f53c] text-[#c8f53c] bg-[#c8f53c]/10 shadow-[0_0_12px_rgba(200,245,60,0.2)] font-semibold'
                  : 'border-white/15 text-white/50 bg-white/5 hover:text-white/80 hover:border-white/30'
              }`}
              title="Toggle Synthesized Audio Feedback"
            >
              <span className="text-xs">{soundActive ? '♫' : '♪'}</span>
              <span className="hidden md:inline">{soundActive ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
            </button>

            <MagneticButton
              href="#contact"
              variant="outline"
              reduced={reduced}
              className="text-xs! py-2! px-4! hidden sm:inline-flex border-white/20 hover:border-[#c8f53c] hover:text-[#c8f53c]"
            >
              Contact →
            </MagneticButton>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="lg:hidden w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1.5"
            >
              <span
                className="block w-4 h-0.5 bg-white transition-transform duration-300"
                style={{ transform: open ? 'translateY(4px) rotate(45deg)' : 'none' }}
              />
              <span
                className="block w-4 h-0.5 bg-white transition-transform duration-300"
                style={{ transform: open ? 'translateY(-4px) rotate(-45deg)' : 'none' }}
              />
            </button>
          </div>
        </div>

        {/* Reading progress hairline */}
        <div
          className="absolute left-0 bottom-0 h-[2px]"
          style={{
            width: progress + '%',
            background: 'linear-gradient(90deg, #527546, #c8f53c)',
          }}
        />
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[45] lg:hidden bg-[#040605]/98 backdrop-blur-2xl flex flex-col justify-between p-8 overflow-y-auto overscroll-contain"
            data-lenis-prevent="true"
            style={{ paddingTop: 'calc(var(--nav-h) + 20px)' }}
          >
            <div className="flex flex-col gap-3">
              {[...LINKS, { id: 'contact', label: 'Contact & Connect' }].map((l, i) => (
                <motion.a
                  key={l.id}
                  href={'#' + l.id}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.35 }}
                  className="font-serif text-3xl py-3 border-b border-white/10 text-white/90 hover:text-[#c8f53c] transition-colors"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>

            <div className="font-mono text-xs text-white/40 space-y-1">
              <div>Parshva Shah · KJ Somaiya School of Engineering</div>
              <div>Software Engineering · AI · Product Building</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

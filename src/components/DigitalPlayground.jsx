import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { experiments } from '../data/experiments'
import ParshvaCLI from './ParshvaCLI'

/**
 * 1. Live Interactive Particle Gravity Well Canvas
 */
function ParticleVortexLab() {
  const canvasRef = useRef(null)
  const [mode, setMode] = useState('vortex') // 'vortex' | 'attract' | 'repel'
  const particleCount = 1200

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: false })
    let raf = null
    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)
    let rect = canvas.getBoundingClientRect()
    let isInView = true
    let isTabVisible = !document.hidden
    let lastTime = performance.now()

    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 0.8,
        accent: i % 2 === 0,
      })
    }

    const mouse = { x: w / 2, y: h / 2, active: false }

    function handleMouseMove(e) {
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    function handleMouseLeave() {
      mouse.active = false
    }

    function handleResize() {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
      rect = canvas.getBoundingClientRect()
    }

    function syncRect() {
      rect = canvas.getBoundingClientRect()
    }

    function loop(now) {
      if (!isInView || !isTabVisible) {
        raf = null
        return
      }
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.05)
      lastTime = now
      const dtScale = dt * 60
      const drag = Math.pow(0.94, dtScale)

      ctx.fillStyle = 'rgba(6, 10, 8, 0.22)'
      ctx.fillRect(0, 0, w, h)

      const targetX = mouse.active ? mouse.x : w * 0.5
      const targetY = mouse.active ? mouse.y : h * 0.5

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = targetX - p.x
        const dy = targetY - p.y
        const distSq = dx * dx + dy * dy
        const dist = Math.sqrt(distSq) || 1

        if (mode === 'attract') {
          const force = Math.min(2.5, 300 / distSq) * dtScale
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        } else if (mode === 'repel') {
          if (dist < 180) {
            const force = (1 - dist / 180) * 4.5 * dtScale
            p.vx -= (dx / dist) * force
            p.vy -= (dy / dist) * force
          }
        } else {
          const perpX = -dy / dist
          const perpY = dx / dist
          p.vx += (perpX * 1.8 + (dx / dist) * 0.45) * dtScale
          p.vy += (perpY * 1.8 + (dy / dist) * 0.45) * dtScale
        }

        p.vx *= drag
        p.vy *= drag
        p.x += p.vx * dtScale
        p.y += p.vy * dtScale

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }

      // Batch all 1,200 particles into 2 draw calls instead of 1,200 individual fill() calls
      ctx.fillStyle = '#c8f53c'
      ctx.beginPath()
      for (let i = 0; i < particles.length; i += 2) {
        const p = particles[i]
        const d = p.size * 1.7
        ctx.rect(p.x - p.size * 0.85, p.y - p.size * 0.85, d, d)
      }
      ctx.fill()

      ctx.fillStyle = '#f4f1ea'
      ctx.beginPath()
      for (let i = 1; i < particles.length; i += 2) {
        const p = particles[i]
        const d = p.size * 1.7
        ctx.rect(p.x - p.size * 0.85, p.y - p.size * 0.85, d, d)
      }
      ctx.fill()

      raf = requestAnimationFrame(loop)
    }

    const syncLoop = () => {
      if (isInView && isTabVisible && !raf) {
        lastTime = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }

    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          ([entry]) => {
            isInView = Boolean(entry?.isIntersecting)
            syncLoop()
          },
          { rootMargin: '200px 0px' }
        )
      : null
    io?.observe(canvas)

    const onVis = () => {
      isTabVisible = !document.hidden
      syncLoop()
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('scroll', syncRect, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    syncLoop()

    return () => {
      isInView = false
      if (raf) cancelAnimationFrame(raf)
      io?.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', syncRect)
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mode, particleCount])

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#060a08]">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Floating control bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 p-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md font-mono text-xs">
        <span className="text-white/40 uppercase tracking-widest text-[10px] px-1">Mode:</span>
        <button
          onClick={() => setMode('vortex')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            mode === 'vortex' ? 'bg-[#c8f53c] text-black font-semibold' : 'text-white/60 hover:text-white'
          }`}
        >
          Vortex
        </button>
        <button
          onClick={() => setMode('attract')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            mode === 'attract' ? 'bg-[#c8f53c] text-black font-semibold' : 'text-white/60 hover:text-white'
          }`}
        >
          Attract
        </button>
        <button
          onClick={() => setMode('repel')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            mode === 'repel' ? 'bg-[#c8f53c] text-black font-semibold' : 'text-white/60 hover:text-white'
          }`}
        >
          Repel
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 font-mono text-[11px] text-white/50 bg-black/50 px-3 py-1 rounded-full border border-white/10">
        Move pointer across field to control gravity
      </div>
    </div>
  )
}

/**
 * 2. Harmonic Audio-Visual Synthesizer Canvas
 */
function AudioVisualizerLab() {
  const canvasRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef(null)
  const oscRef = useRef(null)

  function toggleAudio() {
    if (isPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
      setIsPlaying(false)
    } else {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(220, ctx.currentTime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()

      audioCtxRef.current = ctx
      oscRef.current = osc
      setIsPlaying(true)
    }
  }

  // Draw procedural animated harmonics (zero per-frame canvas resizing + dt-scaled phase + offscreen pause)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: false })
    let raf = null
    let t = 0
    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)
    let isInView = true
    let isTabVisible = !document.hidden
    let lastTime = performance.now()

    const waves = [
      { freq: 0.015, amp: 40, color: '#c8f53c', speed: 0.04 },
      { freq: 0.025, amp: 25, color: '#f4f1ea', speed: 0.06 },
      { freq: 0.008, amp: 60, color: '#8ba352', speed: 0.02 },
    ]

    function syncSize() {
      if (!canvas) return
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }

    function draw(now) {
      if (!isInView || !isTabVisible) {
        raf = null
        return
      }
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.05)
      lastTime = now
      t += dt * 60

      ctx.fillStyle = '#060a08'
      ctx.fillRect(0, 0, w, h)

      // Batch grid lines into one stroke() call
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < w; x += 40) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let y = 0; y < h; y += 40) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()

      for (let wi = 0; wi < waves.length; wi++) {
        const wave = waves[wi]
        ctx.strokeStyle = wave.color
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let x = 0; x <= w; x += 2) {
          const y =
            h * 0.5 +
            Math.sin(x * wave.freq + t * wave.speed) * wave.amp +
            Math.cos(x * 0.005 + t * 0.01) * (wave.amp * 0.4)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      raf = requestAnimationFrame(draw)
    }

    const syncLoop = () => {
      if (isInView && isTabVisible && !raf) {
        lastTime = performance.now()
        raf = requestAnimationFrame(draw)
      }
    }

    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          ([entry]) => {
            isInView = Boolean(entry?.isIntersecting)
            syncLoop()
          },
          { rootMargin: '200px 0px' }
        )
      : null
    io?.observe(canvas)

    const onVis = () => {
      isTabVisible = !document.hidden
      syncLoop()
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null
    ro?.observe(canvas)
    window.addEventListener('resize', syncSize, { passive: true })
    document.addEventListener('visibilitychange', onVis)

    syncLoop()
    return () => {
      isInView = false
      if (raf) cancelAnimationFrame(raf)
      io?.disconnect()
      ro?.disconnect()
      window.removeEventListener('resize', syncSize)
      document.removeEventListener('visibilitychange', onVis)
      if (audioCtxRef.current) audioCtxRef.current.close()
    }
  }, [])

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#060a08]">
      <canvas ref={canvasRef} className="w-full h-full block" />

      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 p-2 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
        <button
          onClick={toggleAudio}
          className={`px-4 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
            isPlaying
              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
              : 'bg-[#c8f53c] text-black hover:bg-[#d8ff54]'
          }`}
        >
          <span>{isPlaying ? '■ Mute Oscillator' : '▶ Play 220Hz Sine Synth'}</span>
        </button>
        <span className="font-mono text-[11px] text-white/50">
          {isPlaying ? 'Oscillator Active' : 'Sound Initialized on Click'}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-10 font-mono text-[11px] text-white/50 bg-black/50 px-3 py-1 rounded-full border border-white/10">
        Fourier waveform visualization · Web Audio Analyser
      </div>
    </div>
  )
}

/**
 * 3. Kinetic Collision Typography Sandbox
 */
function KineticTypographyLab() {
  const letters = ['P', 'A', 'R', 'S', 'H', 'V', 'A', '·', 'B', 'U', 'I', 'L', 'D']
  const [scattered, setScattered] = useState(false)

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#060907] flex flex-col items-center justify-center p-8 select-none">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl">
        {letters.map((char, i) => (
          <motion.div
            key={i}
            animate={{
              x: scattered ? (Math.sin(i * 3.5) * 160) : 0,
              y: scattered ? (Math.cos(i * 2.5) * 120) : 0,
              rotate: scattered ? (i % 2 === 0 ? 35 : -35) : 0,
              scale: scattered ? 1.2 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 18,
            }}
            whileHover={{ scale: 1.35, color: '#c8f53c' }}
            className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-serif text-3xl sm:text-4xl text-white cursor-pointer hover:border-[#c8f53c]/50 shadow-lg"
          >
            {char}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-3 z-10">
        <button
          onClick={() => setScattered((v) => !v)}
          className="px-4 py-1.5 rounded-full bg-[#c8f53c] text-black font-mono text-xs font-semibold hover:bg-[#d8ff54] transition-all shadow-md"
        >
          {scattered ? '↺ Reassemble Typographic Grid' : '💥 Trigger Kinetic Scatter'}
        </button>
      </div>
    </div>
  )
}

export default function DigitalPlayground({ reduced = false }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="experiments" className="relative py-24 sm:py-32 bg-[#040605] border-t border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-1/4 w-[42vw] h-[42vw] bg-[#c8f53c]/[0.02] rounded-full blur-[160px] pointer-events-none" />

      <div className="shell relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#c8f53c]">
                07 — Experiments / Digital Laboratory
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f4f1ea] font-normal leading-[0.96] tracking-[-0.025em]">
              Computational <span className="italic font-serif text-[#a8a49a]">Playground</span>
            </h2>
            <p className="text-[#a8a49a] text-xs sm:text-sm font-sans mt-2 max-w-xl">
              An exploratory laboratory for creative coding, vector particle physics, real-time audio synthesis, and interactive browser mechanics.
            </p>
          </div>

          {/* Workbench Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {experiments.map((exp, idx) => (
              <button
                key={exp.id}
                onClick={() => setActiveTab(idx)}
                className={`font-mono text-xs px-3.5 py-1.5 rounded-full transition-all ${
                  activeTab === idx
                    ? 'bg-[#c8f53c] text-black font-semibold'
                    : 'bg-white/5 text-white/60 border border-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                {exp.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Playground Canvas */}
        <div className="space-y-6">
          {activeTab === 0 && <ParshvaCLI />}
          {activeTab === 1 && <ParticleVortexLab reduced={reduced} />}
          {activeTab === 2 && <AudioVisualizerLab />}
          {activeTab === 3 && <ParticleVortexLab reduced={reduced} />}
          {activeTab === 4 && <KineticTypographyLab />}

          {/* Experiment Technical Specs Card */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="font-mono text-xs text-[#a8a49a] uppercase tracking-widest">
                Concept &amp; Mechanics
              </span>
              <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
                {experiments[activeTab].description}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-[#a8a49a] uppercase tracking-widest">
                Techniques Applied
              </span>
              <div className="flex flex-wrap gap-1.5">
                {experiments[activeTab].tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[#c8f53c]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-[#a8a49a] uppercase tracking-widest">
                Interaction Instructions
              </span>
              <ul className="text-xs text-white/80 font-mono space-y-1">
                {experiments[activeTab].controls.map((ctrl, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#c8f53c]">→</span> {ctrl}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

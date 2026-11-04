import { useEffect, useRef } from 'react'

const STAR_COUNT = 170
const TINTS = ['244,241,234', '244,241,234', '200,245,60', '139,163,82', '216,179,117']

/**
 * Fixed depth environment behind every section: drifting colour fields, an
 * infinite starfield you physically fly through as you scroll, a perspective
 * grid horizon, and a grain/vignette finish.
 *
 * The starfield is the page's core 3D scroll cue — scroll position advances the
 * camera along Z, so stars stream outward past the viewer instead of merely
 * parallaxing. 170 points on a 2D canvas, so it costs a fraction of a WebGL
 * scene and never blocks the main thread.
 */
export default function Backdrop({ reduced }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0
    let dpr = 1
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
      tint: TINTS[Math.floor(Math.random() * TINTS.length)],
    }))

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    let camTarget = 0
    let cam = 0
    let idle = 0

    function readScroll() {
      camTarget = window.scrollY * 0.00055
    }

    let raf
    function frame() {
      cam += (camTarget - cam) * 0.07
      if (!reduced) idle += 0.00022

      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const spread = Math.max(w, h) * 0.62
      const travel = cam + idle

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        let z = s.z - travel
        z -= Math.floor(z)

        const pz = 0.07 + z * 1.7
        const sx = cx + (s.x * spread) / pz
        const sy = cy + (s.y * spread) / pz
        if (sx < -40 || sx > w + 40 || sy < -40 || sy > h + 40) continue

        // fade at both ends of the Z tunnel so recycled stars never pop in
        const edge = Math.min(1, z * 9) * Math.min(1, (1 - z) * 5)
        const alpha = Math.min(0.55, 0.42 / pz) * edge
        if (alpha < 0.012) continue

        const r = Math.min(2.1, 0.34 + 0.85 / pz)
        ctx.fillStyle = 'rgba(' + s.tint + ',' + alpha.toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, 6.2832)
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    resize()
    readScroll()
    cam = camTarget
    frame()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', readScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', readScroll)
    }
  }, [reduced])

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[var(--bg)]" />
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="grid-floor" />
      <div className="absolute inset-0 grain" />
      <div className="absolute inset-0 vignette" />
    </div>
  )
}

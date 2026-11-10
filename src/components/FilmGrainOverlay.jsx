import { useEffect, useRef } from 'react'

/**
 * 35mm Film Grain & Subtle Scanline Cinema Overlay
 * Adds physical texture, depth, and Awwwards-level atmosphere.
 */
export default function FilmGrainOverlay({ reduced = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')

    const width = 180
    const height = 180
    canvas.width = width
    canvas.height = height

    // Pre-bake 4 grain frames once at mount so runtime loop uses zero CPU pixel synthesis
    const frames = Array.from({ length: 4 }, () => {
      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const offCtx = off.getContext('2d')
      const imgData = offCtx.createImageData(width, height)
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        const val = (Math.random() * 255) | 0
        data[i] = val
        data[i + 1] = val
        data[i + 2] = val
        data[i + 3] = 22
      }
      offCtx.putImageData(imgData, 0, 0)
      return off
    })

    let rafId = null
    let frameIdx = 0
    let lastSwap = 0
    let running = !document.hidden

    function renderGrain(now) {
      if (!running) {
        rafId = null
        return
      }
      if (now - lastSwap >= 66) {
        lastSwap = now
        frameIdx = (frameIdx + 1) % frames.length
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(frames[frameIdx], 0, 0)
      }
      rafId = requestAnimationFrame(renderGrain)
    }

    function onVisibility() {
      if (document.hidden) {
        running = false
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      } else {
        running = true
        lastSwap = 0
        if (!rafId) rafId = requestAnimationFrame(renderGrain)
      }
    }

    ctx.drawImage(frames[0], 0, 0)
    if (running) rafId = requestAnimationFrame(renderGrain)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      if (rafId) cancelAnimationFrame(rafId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[45] overflow-hidden select-none"
      style={{ opacity: 0.35, mixBlendMode: 'overlay' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-repeat"
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
        }}
      />
      {/* Subtle vignette border */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_55%,rgba(0,0,0,0.65)_100%]" />
    </div>
  )
}

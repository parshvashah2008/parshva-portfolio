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
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    const width = 180
    const height = 180
    canvas.width = width
    canvas.height = height

    let rafId = null
    let frameCount = 0

    function generateNoise() {
      // Generate noise every 3 frames (~20fps) to keep CPU at near-zero
      frameCount++
      if (frameCount % 3 === 0) {
        const imgData = ctx.createImageData(width, height)
        const data = imgData.data
        const len = data.length

        for (let i = 0; i < len; i += 4) {
          const val = (Math.random() * 255) | 0
          data[i] = val
          data[i + 1] = val
          data[i + 2] = val
          data[i + 3] = 22 // ~8.6% opacity in canvas
        }
        ctx.putImageData(imgData, 0, 0)
      }
      rafId = requestAnimationFrame(generateNoise)
    }

    generateNoise()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
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

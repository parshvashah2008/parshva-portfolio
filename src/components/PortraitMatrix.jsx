import { useEffect, useRef, useState } from 'react'

const CELL_DESKTOP = 6
const CELL_MOBILE = 5
const INK_FLOOR = 0.085     // below this the source pixel is background -> no dot
const SPRING = 0.055
const DAMPING = 0.87
const PUSH_RADIUS = 132
const PUSH_FORCE = 1.5
const BUCKETS = 8

/** deep charcoal moss -> luminous raw ivory, pre-baked so the draw loop builds zero strings */
const COLORS = Array.from({ length: BUCKETS }, (_, i) => {
  const t = i / (BUCKETS - 1)
  const r = Math.round(42 + (244 - 42) * t)
  const g = Math.round(52 + (241 - 52) * t)
  const b = Math.round(44 + (234 - 44) * t)
  return 'rgb(' + r + ',' + g + ',' + b + ')'
})

/**
 * The portrait, resolved as a field of luminance-mapped pixels.
 *
 * The source photo is downsampled to one sample per grid cell; brightness maps
 * to dot size and colour, and anything at background level emits no dot at all.
 * That is deliberate: it means the image has no rectangular boundary to give
 * away — the subject simply materialises out of the page. The previous build
 * showed a hard grey plate because a screenshot's studio backdrop was being
 * painted as-is.
 *
 * Interaction: pointer coordinates are resolved against a live canvas rect on
 * every frame, so the force field stays locked to the real cursor through
 * smooth-scroll and pinned sections. Nothing is drawn to represent the cursor,
 * so there is no second cursor to drift out of sync.
 */
export default function PortraitMatrix({ src = `${import.meta.env.BASE_URL}parshva-portrait.png`, reduced = false }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined
    const ctx = canvas.getContext('2d')

    let cells = []
    let w = 0
    let h = 0
    let cell = CELL_DESKTOP
    let img = null
    let raf = null
    let scan = 0
    let t = 0

    const pointer = { cx: -9999, cy: -9999, present: false }
    const rect = { left: 0, top: 0, width: 0, height: 0 }
    const bucketXs = Array.from({ length: BUCKETS }, () => [])

    function build() {
      if (!img || !img.naturalWidth || !img.naturalHeight) return
      const box = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(1, Math.floor(box.width))
      h = Math.max(1, Math.floor(box.height))

      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cell = w < 640 ? CELL_MOBILE : CELL_DESKTOP

      // contain-fit the source inside the stage
      const scale = Math.min(w / img.width, h / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      const dx = (w - dw) / 2
      const dy = (h - dh) / 2

      const cols = Math.max(1, Math.floor(dw / cell))
      const rows = Math.max(1, Math.floor(dh / cell))

      // one offscreen pass at grid resolution == one sample per cell
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      octx.drawImage(img, 0, 0, cols, rows)
      const data = octx.getImageData(0, 0, cols, rows).data

      const next = []
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const p = (j * cols + i) * 4
          const luma = (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255
          const ink = 1 - luma
          if (ink < INK_FLOOR) continue
          const ox = dx + i * cell + cell / 2
          const oy = dy + j * cell + cell / 2
          next.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
            ink,
            size: Math.max(1.15, cell * (0.32 + 0.5 * ink)),
            phase: (ox + oy) * 0.021,
          })
        }
      }
      cells = next
      setReady(true)
    }

    function frame() {
      const box = canvas.getBoundingClientRect()
      rect.left = box.left
      rect.top = box.top
      rect.width = box.width
      rect.height = box.height

      // dissolve as the hero leaves: dots drift outward and dim, reading as
      // depth rather than a flat opacity fade
      const exit = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height * 0.85)))
      const alive = 1 - exit

      const cursorX = pointer.present ? pointer.cx - rect.left : -9999
      const cursorY = pointer.present ? pointer.cy - rect.top : -9999
      const cx = w / 2
      const cy = h / 2

      if (!reduced) {
        t += 0.016
        scan += 1.05
        if (scan > h + 150) scan = -150
      }

      ctx.clearRect(0, 0, w, h)
      if (alive <= 0.02) {
        raf = requestAnimationFrame(frame)
        return
      }
      ctx.globalAlpha = alive

      for (let b = 0; b < BUCKETS; b++) bucketXs[b].length = 0

      for (let i = 0; i < cells.length; i++) {
        const c = cells[i]
        let heat = 0

        if (pointer.present) {
          const dx = c.x - cursorX
          const dy = c.y - cursorY
          const d2 = dx * dx + dy * dy
          if (d2 < PUSH_RADIUS * PUSH_RADIUS) {
            const d = Math.sqrt(d2) || 0.001
            const f = 1 - d / PUSH_RADIUS
            heat = f
            c.vx += (dx / d) * f * f * PUSH_FORCE
            c.vy += (dy / d) * f * f * PUSH_FORCE
          }
        }

        if (!reduced) {
          const sd = Math.abs(c.oy - scan)
          if (sd < 48) heat = Math.max(heat, (1 - sd / 48) * 0.5)
        }

        c.vx += (c.ox - c.x) * SPRING
        c.vy += (c.oy - c.y) * SPRING
        c.vx *= DAMPING
        c.vy *= DAMPING
        c.x += c.vx
        c.y += c.vy

        const wob = reduced ? 0 : Math.sin(c.phase + t) * 0.55
        const px = c.x + (c.ox - cx) * exit * 0.55
        const py = c.y + (c.oy - cy) * exit * 0.55 + wob

        const s = c.size * (1 + heat * 0.85)
        const b = Math.min(BUCKETS - 1, (((c.ink * 0.55 + heat * 0.8) * BUCKETS) | 0))
        const arr = bucketXs[b]
        arr.push(px - s / 2, py - s / 2, s)
      }

      for (let b = 0; b < BUCKETS; b++) {
        const arr = bucketXs[b]
        if (!arr.length) continue
        ctx.fillStyle = COLORS[b]
        for (let k = 0; k < arr.length; k += 3) ctx.fillRect(arr[k], arr[k + 1], arr[k + 2], arr[k + 2])
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    function onPointerMove(e) {
      pointer.cx = e.clientX
      pointer.cy = e.clientY
      pointer.present = true
    }
    function onPointerOut(e) {
      if (!e.relatedTarget && !e.toElement) pointer.present = false
    }

    img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      build()
      if (!raf) frame()
    }
    img.src = src

    const ro = new ResizeObserver(build)
    ro.observe(wrap)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerout', onPointerOut)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerout', onPointerOut)
    }
  }, [src, reduced])

  return (
    <div ref={wrapRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  )
}

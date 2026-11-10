import { useEffect, useRef, useState } from 'react'

/**
 * Bespoke Magnetic & Fluid Cursor
 * Active only on fine pointer devices (desktops/laptops).
 */
export default function CustomCursor({ reduced = false }) {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [cursorState, setCursorState] = useState({
    active: false,
    text: '',
    variant: 'default', // 'default' | 'hover' | 'orbit' | 'view' | 'terminal'
  })

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let lastTime = performance.now()
    let rafId = null
    let isRunning = !document.hidden
    let lastMetaKey = 'false||default'

    function commitMeta(active, text, variant) {
      const nextKey = `${active}|${text}|${variant}`
      if (nextKey !== lastMetaKey) {
        lastMetaKey = nextKey
        setCursorState({ active, text, variant })
      }
    }

    function onMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY

      const target = e.target

      // If hovering over FluidAmberBackground, let its bespoke square sand cursor take precedence
      if (target && target.closest && target.closest('[data-fluid-bg]')) {
        commitMeta(false, lastMetaKey.split('|')[1] || '', lastMetaKey.split('|')[2] || 'default')
        return
      }

      // Check hovered element
      const interactiveEl = target.closest?.(
        'button, a, [data-cursor], input, textarea, select'
      )

      if (interactiveEl) {
        const cursorAttr = interactiveEl.getAttribute('data-cursor')
        if (cursorAttr === 'orbit') {
          commitMeta(true, 'ORBIT', 'orbit')
        } else if (cursorAttr === 'view') {
          commitMeta(true, 'VIEW', 'view')
        } else if (cursorAttr === 'terminal') {
          commitMeta(true, 'TYPE', 'terminal')
        } else {
          commitMeta(true, '', 'hover')
        }
      } else {
        commitMeta(true, '', 'default')
      }
    }

    function onMouseLeave() {
      commitMeta(false, '', 'default')
    }

    function renderLoop(now) {
      if (!isRunning) {
        rafId = null
        return
      }
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.05)
      lastTime = now

      // Display-refresh-independent exponential smoothing (identical feel at 60Hz, 144Hz, 240Hz+)
      const ease = 1 - Math.exp(-16 * dt)
      ringX += (mouseX - ringX) * ease
      ringY += (mouseY - ringY) * ease

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`

      rafId = requestAnimationFrame(renderLoop)
    }

    function onVisibility() {
      if (document.hidden) {
        isRunning = false
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      } else {
        isRunning = true
        lastTime = performance.now()
        if (!rafId) rafId = requestAnimationFrame(renderLoop)
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('visibilitychange', onVisibility)
    if (isRunning) rafId = requestAnimationFrame(renderLoop)

    return () => {
      isRunning = false
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [reduced])

  if (reduced) return null

  const isText = Boolean(cursorState.text)
  const isHover = cursorState.variant === 'hover'

  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none fixed inset-0 z-[9999999] overflow-hidden"
      style={{ opacity: cursorState.active ? 1 : 0, transition: 'opacity 0.25s' }}
    >
      {/* Precision Core Dot (zero latency, exact hardware cursor tracking) */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#c8f53c] shadow-[0_0_10px_#c8f53c]"
        style={{
          opacity: isText ? 0 : 1,
          willChange: 'transform',
        }}
      />

      {/* Trailing Fluid Ring (never transition transform since rAF drives it per-frame) */}
      <div
        ref={ringRef}
        style={{ willChange: 'transform' }}
        className={`absolute top-0 left-0 rounded-full flex items-center justify-center font-mono text-[9px] font-bold tracking-widest uppercase transition-[width,height,margin,border-color,background-color,opacity] duration-200 ${
          isText
            ? '-ml-6 -mt-6 w-12 h-12 border border-[#c8f53c] bg-[#c8f53c]/20 text-[#c8f53c] shadow-[0_0_20px_rgba(200,245,60,0.35)] backdrop-blur-xs'
            : isHover
            ? '-ml-6 -mt-6 w-12 h-12 border-2 border-[#c8f53c] bg-[#c8f53c]/10'
            : '-ml-4 -mt-4 w-8 h-8 border border-white/30 bg-white/[0.02]'
        }`}
      >
        {cursorState.text}
      </div>
    </div>
  )
}

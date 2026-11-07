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
    let rafId = null

    function onMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY

      const target = e.target

      // If hovering over FluidAmberBackground, let its bespoke square sand cursor take precedence
      if (target && target.closest && target.closest('[data-fluid-bg]')) {
        setCursorState((prev) => (prev.active ? { ...prev, active: false } : prev))
        return
      }

      // Check hovered element
      const interactiveEl = target.closest(
        'button, a, [data-cursor], input, textarea, select'
      )

      if (interactiveEl) {
        const cursorAttr = interactiveEl.getAttribute('data-cursor')
        if (cursorAttr === 'orbit') {
          setCursorState({ active: true, text: 'ORBIT', variant: 'orbit' })
        } else if (cursorAttr === 'view') {
          setCursorState({ active: true, text: 'VIEW', variant: 'view' })
        } else if (cursorAttr === 'terminal') {
          setCursorState({ active: true, text: 'TYPE', variant: 'terminal' })
        } else {
          setCursorState({ active: true, text: '', variant: 'hover' })
        }
      } else {
        setCursorState({ active: true, text: '', variant: 'default' })
      }
    }

    function onMouseLeave() {
      setCursorState((prev) => ({ ...prev, active: false }))
    }

    function renderLoop() {
      // Smooth lerp for ring
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`

      rafId = requestAnimationFrame(renderLoop)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    rafId = requestAnimationFrame(renderLoop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
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
        }}
      />

      {/* Trailing Fluid Ring */}
      <div
        ref={ringRef}
        className={`absolute top-0 left-0 rounded-full flex items-center justify-center font-mono text-[9px] font-bold tracking-widest uppercase transition-all duration-300 ${
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

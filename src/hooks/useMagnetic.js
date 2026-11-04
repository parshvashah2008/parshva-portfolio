import { useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/**
 * Magnetic-hover physics for CTA buttons: pointer proximity pulls the element
 * toward it with spring inertia, and releases smoothly on leave.
 */
export function useMagnetic(strength = 0.35, reduced = false) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 })

  function onMouseMove(e) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    x.set(relX * strength)
    y.set(relY * strength)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return { ref, x: springX, y: springY, onMouseMove, onMouseLeave }
}

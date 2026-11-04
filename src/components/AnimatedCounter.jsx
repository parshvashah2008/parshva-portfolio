import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/** Counts up from 0 to a target number once it scrolls into view. Renders
 * non-numeric values (like '∞') statically without animating. */
export default function AnimatedCounter({ value, duration = 1200 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const numeric = /^\d+$/.test(value)
  const [display, setDisplay] = useState(numeric ? '0' : value)

  useEffect(() => {
    if (!inView || !numeric) return undefined
    const target = parseInt(value, 10)
    const start = performance.now()
    let raf
    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(String(Math.floor(eased * target)))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay(String(target))
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, numeric, value, duration])

  return <span ref={ref}>{display}</span>
}

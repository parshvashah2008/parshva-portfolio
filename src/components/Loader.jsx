import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Premium preload sequence — name letterspaces in, a hairline underscore
 * draws itself out to full width, then the whole screen wipes upward
 * (clip-path reveal, not a fade) to uncover the hero underneath.
 */
export default function Loader({ onDone, reduced }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduced) {
      setDone(true)
      onDone?.()
      return undefined
    }

    let raf
    const start = performance.now()
    const duration = 1100

    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.floor(eased * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setDone(true)
          onDone?.()
        }, 240)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, onDone])

  if (reduced) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[var(--bg)] flex flex-col items-center justify-center"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{
            clipPath: 'inset(0% 0% 100% 0%)',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-sm md:text-base uppercase text-[var(--hi)] mb-8"
          >
            Parshva Shah
          </motion.span>

          <div className="w-56 h-px bg-[var(--line)] relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[var(--hi)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 font-mono text-[11px] text-[var(--dim)] tracking-[0.3em] uppercase tabular-nums">
            {String(progress).padStart(3, '0')}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useEffect, useState } from 'react'

/** Tracks prefers-reduced-motion live (updates if the OS setting changes mid-session). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

/**
 * Detects devices likely to struggle with heavy WebGL + postprocessing:
 * touchscreens, low core-count CPUs, and low device memory. A laptop with
 * a mouse but weak integrated graphics still needs the lighter path —
 * checking only `pointer: coarse` misses that case entirely.
 */
export function useIsLowPower() {
  const detect = () => {
    if (typeof window === 'undefined') return false
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const fewCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
    const lowMemory = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4
    return coarsePointer || fewCores || lowMemory
  }

  const [low, setLow] = useState(detect)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const handler = () => setLow(detect())
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return low
}

import { useEffect } from 'react'

/**
 * useContentProtection - Silent, seamless background protection
 * - Silently prevents accidental Ctrl+S (page dump) and Ctrl+P (printing)
 * - Zero UI interruptions, zero popups, zero screen shields so visitors have a 100% friction-free viewing experience
 */
export function useContentProtection() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isModifier = e.ctrlKey || e.metaKey

      if (isModifier) {
        const key = e.key.toLowerCase()

        // Silently intercept Ctrl+S (Save page) & Ctrl+P (Print)
        if (key === 's' || key === 'p') {
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

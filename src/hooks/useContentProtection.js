import { useEffect, useState } from 'react'

/**
 * useContentProtection - Comprehensive client-side protection against:
 * 1. Screen capture / snipping tools (auto-veil on window blur / visibility loss)
 * 2. Unauthorized asset downloading & context saving
 * 3. Print-to-PDF dumps and Ctrl+S / Ctrl+U source dumps
 * 4. DevTools / Inspect shortcut attempts
 */
export function useContentProtection() {
  const [isVeiled, setIsVeiled] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    let toastTimeout = null

    const showToast = (msg) => {
      setToastMessage(msg)
      if (toastTimeout) clearTimeout(toastTimeout)
      toastTimeout = setTimeout(() => {
        setToastMessage(null)
      }, 1800)
    }

    // 1. Intercept shortcut attempts (Print, Save, View Source, Inspect)
    const handleKeyDown = (e) => {
      // PrintScreen key
      if (e.key === 'PrintScreen') {
        setIsVeiled(true)
        showToast('Screen capture restricted')
        navigator.clipboard?.writeText?.('').catch(() => {})
        setTimeout(() => setIsVeiled(false), 1200)
        return
      }

      const isModifier = e.ctrlKey || e.metaKey

      if (isModifier) {
        const key = e.key.toLowerCase()

        // Ctrl+S / Cmd+S (Save Page)
        if (key === 's') {
          e.preventDefault()
          e.stopPropagation()
          showToast('Content export restricted')
          return
        }

        // Ctrl+P / Cmd+P (Print to PDF)
        if (key === 'p') {
          e.preventDefault()
          e.stopPropagation()
          showToast('Printing is disabled')
          return
        }

        // Ctrl+U / Cmd+U (View Source)
        if (key === 'u') {
          e.preventDefault()
          e.stopPropagation()
          showToast('Source inspection restricted')
          return
        }

        // Ctrl+Shift+I / J / C (DevTools)
        if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
          e.preventDefault()
          e.stopPropagation()
          showToast('Inspection restricted')
          return
        }
      }

      // F12 key (DevTools)
      if (e.key === 'F12') {
        e.preventDefault()
        e.stopPropagation()
        showToast('Developer console restricted')
      }
    }

    // 2. Prevent right-click context menu on images, canvas, and layout
    const handleContextMenu = (e) => {
      const target = e.target
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if (!isInput) {
        e.preventDefault()
        showToast('Protected Asset · Parshva Shah')
      }
    }

    // 3. Privacy Veil on window blur / screenshot tool triggers (e.g. Win+Shift+S)
    const handleBlur = () => {
      // Blur indicates system screenshot tool or app switch has taken active window focus
      setIsVeiled(true)
    }

    const handleFocus = () => {
      setIsVeiled(false)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVeiled(true)
      } else {
        setIsVeiled(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown, { capture: true })
    window.addEventListener('contextmenu', handleContextMenu, { capture: true })
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true })
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true })
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (toastTimeout) clearTimeout(toastTimeout)
    }
  }, [])

  return { isVeiled, toastMessage, dismissVeil: () => setIsVeiled(false) }
}

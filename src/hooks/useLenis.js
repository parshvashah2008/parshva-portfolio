import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wires Lenis smooth-scroll into GSAP's ScrollTrigger ticker so scroll-driven
 * animations stay perfectly in sync with the inertia scroll.
 * Falls back to native scroll (no Lenis) when reduced motion is requested.
 */
export function useLenis(reduced) {
  useEffect(() => {
    if (reduced) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const onRaf = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    function handleAnchorClick(e) {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        lenis.scrollTo(target, { offset: -68, duration: 1.1 })
      }
    }
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
      gsap.ticker.remove(onRaf)
      window.__lenis = null
    }
  }, [reduced])
}

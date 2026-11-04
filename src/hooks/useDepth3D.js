import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-driven 3D depth for any element carrying `data-depth`.
 *
 * Each block starts pushed back and tilted away from the viewer on the X axis,
 * then rotates flat and travels forward to Z=0 as it scrolls up — so content
 * reads as physical panels swinging into place inside a room rather than
 * fading in on a flat plane.
 *
 * `transformPerspective` puts the vanishing point on the element itself, which
 * is what keeps the effect identical everywhere. A single `perspective` on a
 * tall shared ancestor would smear anything far from the page's midpoint.
 *
 * `data-depth="1.4"` scales the intensity; `data-depth-origin="top"` flips the
 * hinge to the top edge.
 */
export function useDepth3D(reduced, ready) {
  useEffect(() => {
    if (reduced || !ready) return undefined

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-depth]').forEach((node) => {
        const k = parseFloat(node.dataset.depth) || 1
        const hinge = node.dataset.depthOrigin === 'top' ? '50% 0%' : '50% 100%'

        gsap.fromTo(
          node,
          {
            opacity: 0,
            y: 54 * k,
            rotateX: 9 * k,
            z: -150 * k,
            transformPerspective: 1300,
            transformOrigin: hinge,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: node,
              start: 'top bottom-=6%',
              end: 'top 58%',
              scrub: 0.65,
            },
          }
        )
      })
    })

    const t = setTimeout(() => ScrollTrigger.refresh(), 220)
    return () => {
      clearTimeout(t)
      ctx.revert()
    }
  }, [reduced, ready])
}

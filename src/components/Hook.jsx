import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINES = [
  'Tired of tools that don\u2019t actually think?',
  'Looking for an engineer who ships, not just prototypes?',
  'You found him.',
]

/**
 * Pinned three-beat hook. Each line arrives by rotating up out of the floor on
 * the X axis and leaves by rotating away overhead, so the sequence reads as
 * panels turning in space.
 *
 * The pin is deliberately short (+=120%) — the previous 180% left roughly two
 * blank screens of scrolling with nothing on them.
 */
export default function Hook({ reduced }) {
  const sectionRef = useRef(null)
  const lineRefs = useRef([])

  useEffect(() => {
    if (reduced || !sectionRef.current) return undefined

    const ctx = gsap.context(() => {
      gsap.set(lineRefs.current, { opacity: 0, rotateX: -78, y: 54, transformPerspective: 800 })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=120%',
          scrub: 0.55,
          pin: true,
          anticipatePin: 1,
        },
      })

      lineRefs.current.forEach((el, i) => {
        tl.to(el, { opacity: 1, rotateX: 0, y: 0, duration: 0.5 }, i * 0.9)
        if (i < LINES.length - 1) {
          tl.to(el, { opacity: 0, rotateX: 62, y: -54, duration: 0.45 }, i * 0.9 + 0.55)
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  if (reduced) {
    return (
      <section className="section shell text-center space-y-6">
        {LINES.map((l, i) => (
          <p key={l} className="font-display font-bold text-2xl md:text-4xl">
            {i === LINES.length - 1 ? <span className="gradient-text">{l}</span> : l}
          </p>
        ))}
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full max-w-3xl px-6 h-[42vh]">
        {LINES.map((line, i) => (
          <p
            key={line}
            ref={(el) => (lineRefs.current[i] = el)}
            className="absolute inset-0 flex items-center justify-center text-center font-display font-bold text-[clamp(1.6rem,4.6vw,3.1rem)] leading-[1.12] tracking-[-0.02em] will-change-transform"
          >
            {i === LINES.length - 1 ? <span className="gradient-text">{line}</span> : line}
          </p>
        ))}
      </div>
      <span className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--dim)]">
        keep scrolling
      </span>
    </section>
  )
}

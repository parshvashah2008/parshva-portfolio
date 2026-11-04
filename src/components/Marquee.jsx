/**
 * Edge-to-edge ticker. The track holds the list twice and travels exactly -50%,
 * so the loop is seamless, and a gradient mask dissolves both ends instead of
 * letting words get sliced off at the viewport edge.
 */
export default function Marquee({ items, duration = 44, accent = 'var(--accent)' }) {
  const run = [...items, ...items]
  return (
    <div className="marquee py-9 border-y border-[var(--line-soft)]" aria-hidden>
      <div className="marquee-track" style={{ '--dur': duration + 's' }}>
        {run.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-display font-semibold text-[clamp(1.4rem,3.4vw,2.3rem)] tracking-[-0.02em] text-[var(--dim)] whitespace-nowrap px-7">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent, opacity: 0.55 }} />
          </span>
        ))}
      </div>
    </div>
  )
}

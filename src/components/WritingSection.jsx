import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { articles } from '../data/writing'

export default function WritingSection() {
  const [activeArticle, setActiveArticle] = useState(null)

  // Close reader on Escape key
  useEffect(() => {
    if (!activeArticle) return undefined
    function onKeyDown(e) {
      if (e.key === 'Escape') setActiveArticle(null)
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [activeArticle])

  return (
    <section id="writing" className="relative py-24 sm:py-32 bg-[#050706] border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] bg-emerald-500/[0.025] rounded-full blur-[160px] pointer-events-none" />

      <div className="shell relative z-10 space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c]" />
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#c8f53c]">
              08 — Writing &amp; Field Notes
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f4f1ea] font-medium sm:font-semibold leading-[1.05] tracking-tight">
            Architectural <span className="italic font-serif font-normal text-[#c8f53c]">Essays</span>
          </h2>
          <p className="text-[#a8a49a] text-xs sm:text-sm font-sans mt-2">
            Technical breakdowns, systems reflections, and lessons learned from shipping production AI and web software.
          </p>
        </div>

        {/* Editorial Articles List */}
        <div className="space-y-4">
          {articles.map((art, idx) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              onClick={() => setActiveArticle(art)}
              className="group cursor-pointer p-6 sm:p-8 rounded-2xl bg-[#080d0a] border border-white/10 hover:border-[#c8f53c]/40 hover:bg-[#0c140f] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 font-mono text-xs text-white/50">
                  <span className="text-[#c8f53c] font-semibold">{art.date}</span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {art.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-[#c8f53c] transition-colors leading-snug">
                {art.title}
              </h3>

              <p className="font-serif italic text-sm text-white/60 mt-1 mb-3">
                {art.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed line-clamp-2 max-w-4xl">
                {art.excerpt}
              </p>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/50">
                <span className="text-[#a8a49a]">Read architectural deep dive</span>
                <span className="text-[#c8f53c] font-semibold group-hover:translate-x-1 transition-transform">
                  Read Article →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999999] overflow-y-auto overscroll-contain bg-[#030504]/96 backdrop-blur-2xl text-white"
            data-lenis-prevent="true"
          >
            {/* Header */}
            <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#040705]/90 backdrop-blur-md">
              <div className="shell flex items-center justify-between h-16">
                <div className="flex items-center gap-3 font-mono text-xs text-white/60">
                  <span className="text-[#c8f53c]">{activeArticle.date}</span>
                  <span>·</span>
                  <span>{activeArticle.readTime}</span>
                </div>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-1.5 rounded-full text-xs font-mono bg-white/10 hover:bg-white/20 transition-all text-white border border-white/15 flex items-center gap-1.5"
                >
                  <span>Close Reader</span>
                  <span>✕</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="shell py-12 md:py-20 max-w-3xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {activeArticle.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#c8f53c]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl text-[#f4f1ea] font-normal leading-tight">
                  {activeArticle.title}
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-[#a8a49a]">
                  {activeArticle.subtitle}
                </p>
              </div>

              {/* Body */}
              <div className="pt-8 border-t border-white/10 text-white/80 font-sans leading-relaxed text-base space-y-6">
                <div className="p-4 rounded-xl bg-white/[0.03] border-l-2 border-[#c8f53c] text-white/90 italic">
                  {activeArticle.excerpt}
                </div>

                <div className="whitespace-pre-line font-sans text-sm sm:text-base leading-relaxed space-y-4">
                  {activeArticle.content}
                </div>
              </div>

              {/* Reader Footer */}
              <div className="pt-12 border-t border-white/10 flex items-center justify-between">
                <div className="font-mono text-xs text-white/50">
                  Written by Parshva Shah · KJ Somaiya School of Engineering
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2 rounded-full font-mono text-xs bg-[#c8f53c] text-black font-semibold hover:bg-[#d8ff54] transition-all"
                >
                  Back to Articles
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

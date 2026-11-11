import { useState } from 'react'
import { skillCategories } from '../data/projects'
import SkillsOrbit from '../three/SkillsOrbit'

export default function TechStackSection({ reduced = false }) {
  const [displayMode, setDisplayMode] = useState('grid') // 'grid' | 'orbit'

  return (
    <section id="tech-stack" className="relative py-24 sm:py-32 bg-[#050706] border-t border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 w-[35vw] h-[35vw] bg-emerald-500/[0.025] rounded-full blur-[140px] pointer-events-none" />

      <div className="shell relative z-10 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c8f53c]" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#c8f53c]">
                06 — Tech Stack
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f4f1ea] font-normal leading-[0.96] tracking-[-0.025em]">
              What I <span className="italic font-serif text-[#a8a49a]">build with.</span>
            </h2>
            <p className="text-[#a8a49a] text-xs sm:text-sm font-sans mt-2 max-w-xl">
              The actual tools, languages, and APIs behind the projects in this portfolio.
            </p>
          </div>

          {/* Toggle between Structured Grid and 3D Orbit */}
          <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs self-start md:self-auto">
            <button
              onClick={() => setDisplayMode('grid')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                displayMode === 'grid'
                  ? 'bg-[#c8f53c] text-black font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              ☷ Stack View
            </button>
            <button
              onClick={() => setDisplayMode('orbit')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                displayMode === 'orbit'
                  ? 'bg-[#c8f53c] text-black font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              ✦ 3D Orbit View
            </button>
          </div>
        </div>

        {displayMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10">
            {skillCategories.map((cat) => (
              <div key={cat.label} className="space-y-3">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                  {cat.label}
                </h3>
                <div className="flex flex-col gap-2">
                  {cat.items.map((item) => (
                    <div
                      key={item}
                      className="font-sans text-sm text-white/90 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#c8f53c]/40 hover:translate-x-1 transition-all"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 3D Orbit View */
          <div className="relative w-full h-[55vh] rounded-3xl overflow-hidden border border-white/10 bg-[#070b09] flex flex-col items-center justify-center">
            <SkillsOrbit reduced={reduced} />
            <div className="pointer-events-none absolute bottom-4 inset-x-0 flex justify-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
                Interactive 3D Skill Constellation · Rotating in spatial orbit
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

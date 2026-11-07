import { useState } from 'react'
import { skillCategories } from '../data/projects'
import SkillsOrbit from '../three/SkillsOrbit'

export default function TechStackSection({ reduced = false }) {
  const [activeCategory, setActiveCategory] = useState(0)
  const [displayMode, setDisplayMode] = useState('grid') // 'grid' | 'orbit'

  const currentGroup = skillCategories[activeCategory]

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
                06 — Tech Stack &amp; Capabilities
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f4f1ea] font-normal leading-[0.96] tracking-[-0.025em]">
              Systems Architecture &amp; <span className="italic font-serif text-[#a8a49a]">Toolkit</span>
            </h2>
            <p className="text-[#a8a49a] text-xs sm:text-sm font-sans mt-2 max-w-xl">
              Organized honestly according to real production proficiency across systems engineering, applied AI, full-stack web, and product design.
            </p>
          </div>

          {/* Toggle between Structured Grid and 3D Orbit */}
          <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs">
            <button
              onClick={() => setDisplayMode('grid')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                displayMode === 'grid'
                  ? 'bg-[#c8f53c] text-black font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              ☷ Matrix View
            </button>
            <button
              onClick={() => setDisplayMode('orbit')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
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
          <div className="space-y-8">
            {/* Category Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {skillCategories.map((cat, idx) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(idx)}
                  className={`font-mono text-xs px-4 py-2 rounded-xl transition-all shrink-0 ${
                    activeCategory === idx
                      ? 'bg-white/15 text-white border border-[#c8f53c]/40 shadow-sm'
                      : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Active Category Description & Cards */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="font-serif text-2xl text-white">
                  {currentGroup.category}
                </div>
                <div className="text-xs font-mono text-white/50">
                  {currentGroup.summary}
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentGroup.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold text-sm text-white">
                        {skill.name}
                      </span>
                      <span
                        className={`font-mono text-[9.5px] px-2 py-0.5 rounded-full border ${
                          skill.level === 'Advanced'
                            ? 'bg-[#c8f53c]/10 text-[#c8f53c] border-[#c8f53c]/30'
                            : 'bg-[#d8b375]/10 text-[#d8b375] border-[#d8b375]/30'
                        }`}
                      >
                        {skill.level}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      {skill.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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

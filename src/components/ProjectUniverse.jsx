import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import ProjectUniverseScene from '../three/ProjectUniverseScene'
import ProjectThumbnail from './ProjectThumbnail'
import CaseStudyModal from './CaseStudyModal'
import { playSyntheticSound } from '../utils/soundFX'

const FILTERS = ['All', 'AI & Machine Learning', 'Web Development', 'SaaS & Products', 'Experiments']

export default function ProjectUniverse({ reduced = false, lowPower = false }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [viewMode, setViewMode] = useState(lowPower ? 'editorial' : '3d') // default to 3D on desktop
  const [hoveredProject, setHoveredProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeCaseStudy, setActiveCaseStudy] = useState(null)

  // Default selected project to first project
  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0])
    }
  }, [selectedProject])

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'AI & Machine Learning') return p.category.includes('AI')
    if (activeFilter === 'Web Development') return p.category.includes('Web')
    if (activeFilter === 'SaaS & Products') return p.category.includes('SaaS')
    if (activeFilter === 'Experiments') return p.category.includes('Experiments')
    return true
  })

  const currentDisplayProject = hoveredProject || selectedProject || filteredProjects[0] || projects[0]
  const currentIndex = projects.findIndex((p) => p.id === currentDisplayProject?.id)

  function cycleProject(direction) {
    const nextIdx = (currentIndex + direction + projects.length) % projects.length
    setSelectedProject(projects[nextIdx])
  }

  return (
    <section id="work" className="relative min-h-[100svh] bg-[#040504] py-20 overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[42vw] h-[42vw] bg-[#c8f53c]/[0.02] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[38vw] h-[38vw] bg-[#1a3828]/[0.2] rounded-full blur-[160px] pointer-events-none" />

      {/* Section Header */}
      <div className="shell relative z-20 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#c8f53c]">
                02 — The Work / Project Universe
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f4f1ea] font-normal tracking-tight">
              An Interactive <span className="italic font-serif text-[#c8f53c]">Digital Universe</span>
            </h2>
            <p className="text-[#a8a49a] text-xs sm:text-sm font-sans mt-2 max-w-xl">
              Explore my software engineering projects, production SaaS engines, AI tools, and creative experiments floating in 3D spatial orbit.
            </p>
          </div>

          {/* View Mode & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* 3D vs Editorial View Toggle */}
            <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  viewMode === '3d'
                    ? 'bg-[#c8f53c] text-black font-semibold shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                ✦ 3D Universe
              </button>
              <button
                onClick={() => setViewMode('editorial')}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  viewMode === 'editorial'
                    ? 'bg-[#c8f53c] text-black font-semibold shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                ☷ Editorial List
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`font-mono text-xs px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                activeFilter === f
                  ? 'bg-white/15 text-white border border-[#c8f53c]/40 shadow-sm'
                  : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-[#a8a49a] font-semibold hidden sm:inline">
            Showing {filteredProjects.length} of {projects.length} artifacts
          </span>
        </div>
      </div>

      {/* Main Experience View */}
      {viewMode === '3d' ? (
        <div
          data-cursor="orbit"
          className="relative w-full h-[68vh] sm:h-[72vh] md:h-[76vh]"
        >
          {/* Spatial Three.js Scene */}
          <ProjectUniverseScene
            projects={filteredProjects}
            activeProject={selectedProject}
            hoveredProject={hoveredProject}
            onHoverProject={setHoveredProject}
            onSelectProject={(p) => {
              playSyntheticSound('open')
              setSelectedProject(p)
              setActiveCaseStudy(p)
            }}
            activeFilter={activeFilter}
            reduced={reduced}
            modalOpen={Boolean(activeCaseStudy)}
          />

          {/* Top Control Hint */}
          <div className="pointer-events-none absolute top-4 inset-x-0 flex justify-center z-10">
            <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md font-mono text-[11px] text-white/60">
              Drag to orbit · Scroll to zoom · Click any node or button to explore
            </div>
          </div>

          {/* Bottom Project Preview Dock (Vadim Carazan HUD) */}
          {currentDisplayProject && !activeCaseStudy && (
            <div className="absolute bottom-4 inset-x-0 z-20 pointer-events-none">
              <div className="shell flex justify-center">
                <div className="pointer-events-auto w-full max-w-2xl p-4 sm:p-5 rounded-2xl bg-[#090e0c]/90 border border-white/15 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Mini visual indicator */}
                    <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0 hidden sm:block">
                      <ProjectThumbnail project={currentDisplayProject} compact={true} />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
                        <span className="text-[#c8f53c] font-bold">
                          [ {currentDisplayProject.num} / {String(projects.length).padStart(2, '0')} ]
                        </span>
                        <span>·</span>
                        <span className="uppercase">{currentDisplayProject.category}</span>
                        <span>·</span>
                        <span className="text-[#c8f53c]">{currentDisplayProject.status.split(' ')[0]}</span>
                      </div>
                      <h4 className="font-serif text-lg sm:text-xl font-normal text-white">
                        {currentDisplayProject.title}
                      </h4>
                      <p className="text-xs text-white/60 line-clamp-1 max-w-md font-sans">
                        {currentDisplayProject.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Carousel Navigation */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <div className="flex items-center gap-1 font-mono text-xs">
                      <button
                        onClick={() => cycleProject(-1)}
                        className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
                        title="Previous project"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => cycleProject(1)}
                        className="w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
                        title="Next project"
                      >
                        →
                      </button>
                    </div>

                    {currentDisplayProject.link && currentDisplayProject.link.startsWith('http') && (
                      <a
                        href={currentDisplayProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-full font-mono text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Live</span>
                        <span>↗</span>
                      </a>
                    )}

                    <button
                      onClick={() => setActiveCaseStudy(currentDisplayProject)}
                      className="px-4 py-2 rounded-full font-mono text-xs font-semibold bg-[#c8f53c] text-black hover:bg-[#d8ff54] transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Case Study</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Curated Editorial View (Suho Studio aesthetic) */
        <div className="shell relative z-20 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((p, idx) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => setActiveCaseStudy(p)}
                className="group cursor-pointer rounded-2xl bg-[#080d0a] border border-white/10 hover:border-[#c8f53c]/40 p-6 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-4">
                    <span className="font-bold text-[#c8f53c]">PROJECT {p.num}</span>
                    <span className="uppercase tracking-wider">{p.category}</span>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-full h-56 rounded-xl overflow-hidden border border-white/10 mb-5 relative group-hover:border-white/20 transition-all">
                    <ProjectThumbnail project={p} />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white group-hover:text-[#c8f53c] transition-colors">
                    {p.title}
                  </h3>
                  <p className="font-serif italic text-sm text-white/60 mt-1 mb-3">
                    {p.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed line-clamp-3 mb-4">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 3).map((st) => (
                      <span
                        key={st}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/60"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-xs text-[#c8f53c] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Case Study →
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* Dedicated Case Study Modal Reader (Page 03) */}
      <CaseStudyModal
        project={activeCaseStudy}
        onClose={() => setActiveCaseStudy(null)}
        onSelectNext={(next) => setActiveCaseStudy(next)}
      />
    </section>
  )
}

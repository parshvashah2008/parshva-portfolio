import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import ProjectUniverseScene from '../three/ProjectUniverseScene'
import ProjectThumbnail from './ProjectThumbnail'
import CaseStudyModal from './CaseStudyModal'
import { playSyntheticSound } from '../utils/soundFX'

const FILTERS = ['All', 'AI & Machine Learning', 'Web Development', 'SaaS & Products', 'Experiments']

const MIN_ZOOM_DIST = 4.2
const MAX_ZOOM_DIST = 12.0
const DEFAULT_ZOOM_DIST = 8.2

function distToPercent(dist) {
  const clamped = Math.max(MIN_ZOOM_DIST, Math.min(MAX_ZOOM_DIST, dist))
  return Math.round(((MAX_ZOOM_DIST - clamped) / (MAX_ZOOM_DIST - MIN_ZOOM_DIST)) * 100)
}

function percentToDist(pct) {
  const clamped = Math.max(0, Math.min(100, pct))
  return MAX_ZOOM_DIST - (clamped / 100) * (MAX_ZOOM_DIST - MIN_ZOOM_DIST)
}

export default function ProjectUniverse({ reduced = false, lowPower = false }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [viewMode, setViewMode] = useState(lowPower ? 'editorial' : '3d') // default to 3D on desktop
  const [hoveredProject, setHoveredProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [activeCaseStudy, setActiveCaseStudy] = useState(null)

  // Neon Zoom Scroll Bar State for 3D Orbit
  const [zoomPercent, setZoomPercent] = useState(() => distToPercent(DEFAULT_ZOOM_DIST))
  const [zoomDistance, setZoomDistance] = useState(DEFAULT_ZOOM_DIST)
  const isDraggingSlider = useRef(false)

  const handleSliderChange = (e) => {
    isDraggingSlider.current = true
    const pct = Number(e.target.value)
    setZoomPercent(pct)
    setZoomDistance(percentToDist(pct))
  }

  const handleDistanceChange = useCallback((dist) => {
    if (isDraggingSlider.current) return
    const pct = distToPercent(dist)
    setZoomPercent((prev) => (Math.abs(prev - pct) >= 1 ? pct : prev))
  }, [])

  const adjustZoom = (deltaPct) => {
    playSyntheticSound('tick')
    setZoomPercent((prev) => {
      const next = Math.max(0, Math.min(100, prev + deltaPct))
      setZoomDistance(percentToDist(next))
      return next
    })
  }

  const resetZoom = () => {
    playSyntheticSound('click')
    setZoomPercent(distToPercent(DEFAULT_ZOOM_DIST))
    setZoomDistance(DEFAULT_ZOOM_DIST)
  }

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
            zoomDistance={zoomDistance}
            onDistanceChange={handleDistanceChange}
          />

          {/* Top Control Hint (Hidden on very small screens to avoid clutter) */}
          <div className="pointer-events-none absolute top-4 inset-x-0 justify-center z-10 hidden md:flex">
            <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md font-mono text-[11px] text-white/60">
              Drag to orbit · Scroll or drag Neon Scroll Bar to zoom · Click node to explore
            </div>
          </div>

          {/* Spatial Neon Zoom Scroll Bar HUD */}
          <div className="absolute top-4 right-3 sm:top-4 sm:right-6 z-30 pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#070c09]/95 border border-[#c8f53c]/40 backdrop-blur-2xl shadow-[0_0_24px_rgba(200,245,60,0.22)]">
              {/* Reticle / Target indicator */}
              <div className="flex items-center gap-1.5 pr-2 border-r border-white/15">
                <span className="w-2 h-2 rounded-full bg-[#c8f53c] shadow-[0_0_8px_#c8f53c] animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#c8f53c] font-bold hidden xs:inline">
                  ZOOM
                </span>
              </div>

              {/* Zoom Out Button */}
              <button
                type="button"
                onClick={() => adjustZoom(-15)}
                className="w-5 h-5 rounded-full bg-white/5 border border-white/15 hover:border-[#c8f53c] hover:text-[#c8f53c] text-white/80 font-mono text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Zoom Out (−)"
                aria-label="Zoom Out"
              >
                −
              </button>

              {/* Neon Zoom Scroll Bar Slider */}
              <div className="relative w-20 sm:w-28 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={zoomPercent}
                  onChange={handleSliderChange}
                  onMouseDown={() => { isDraggingSlider.current = true }}
                  onMouseUp={() => { isDraggingSlider.current = false }}
                  onTouchStart={() => { isDraggingSlider.current = true }}
                  onTouchEnd={() => { isDraggingSlider.current = false }}
                  className="neon-zoom-slider"
                  aria-label="Orbit Camera Zoom Scroll Bar"
                />
              </div>

              {/* Zoom In Button */}
              <button
                type="button"
                onClick={() => adjustZoom(15)}
                className="w-5 h-5 rounded-full bg-white/5 border border-white/15 hover:border-[#c8f53c] hover:text-[#c8f53c] text-white/80 font-mono text-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                title="Zoom In (+)"
                aria-label="Zoom In"
              >
                +
              </button>

              {/* Live Zoom Percentage Badge (Click to Reset) */}
              <button
                type="button"
                onClick={resetZoom}
                className="font-mono text-[10px] text-[#c8f53c] font-bold px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#c8f53c]/50 transition-all cursor-pointer tabular-nums min-w-[34px] text-center"
                title="Click to reset zoom to default (1.0x)"
              >
                {zoomPercent}%
              </button>
            </div>
          </div>

          {/* Bottom Cinematic Gradient Scrim: ensures clean separation between 3D orbit & HUD dock */}
          <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-t from-[#040504] via-[#040504]/80 to-transparent pointer-events-none z-10" />

          {/* Bottom Project Preview Dock (Bespoke Spatial HUD Capsule) */}
          {currentDisplayProject && !activeCaseStudy && (
            <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 pointer-events-none">
              <div className="shell flex justify-center px-3 sm:px-6">
                <div
                  className="pointer-events-auto w-full max-w-3xl px-4 py-3 sm:px-5 sm:py-3 rounded-2xl sm:rounded-full bg-[#070c09]/95 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 transition-all duration-300"
                  style={{
                    boxShadow: `0 0 40px ${currentDisplayProject.color}15, 0 20px 50px rgba(0,0,0,0.9)`
                  }}
                >
                  {/* Left: Project identity & context */}
                  <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                    {/* Index badge with live pulse */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 shrink-0">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: currentDisplayProject.color }}
                      />
                      <span className="font-mono text-[10px] font-bold text-white tracking-wider">
                        {currentDisplayProject.num}
                      </span>
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-sm sm:text-base text-white truncate">
                          {currentDisplayProject.title}
                        </span>
                        <span className="font-mono text-[10px] uppercase text-[#c8f53c] hidden md:inline shrink-0 px-2 py-0.5 rounded-full bg-[#c8f53c]/10 border border-[#c8f53c]/20">
                          {currentDisplayProject.category}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 truncate font-sans hidden sm:block max-w-md">
                        {currentDisplayProject.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Stepper controls & Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                    {/* Carousel Navigation Stepper */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          playSyntheticSound('click')
                          cycleProject(-1)
                        }}
                        className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer text-xs"
                        aria-label="Previous project"
                        title="Previous project"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playSyntheticSound('click')
                          cycleProject(1)
                        }}
                        className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer text-xs"
                        aria-label="Next project"
                        title="Next project"
                      >
                        →
                      </button>
                    </div>

                    {/* Live App Link if applicable */}
                    {currentDisplayProject.link && currentDisplayProject.link.startsWith('http') && (
                      <a
                        href={currentDisplayProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full font-mono text-xs border border-white/20 bg-white/5 hover:bg-white/15 active:scale-95 text-white transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Live</span>
                        <span className="text-[11px]">↗</span>
                      </a>
                    )}

                    {/* Primary Case Study Action */}
                    <button
                      type="button"
                      onClick={() => {
                        playSyntheticSound('open')
                        setActiveCaseStudy(currentDisplayProject)
                      }}
                      className="px-4 py-1.5 rounded-full font-mono text-xs font-semibold bg-[#c8f53c] text-black hover:bg-[#d8ff54] active:scale-95 transition-all shadow-[0_0_20px_rgba(200,245,60,0.3)] flex items-center gap-1.5 cursor-pointer shrink-0"
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

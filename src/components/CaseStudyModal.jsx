import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectThumbnail from './ProjectThumbnail'
import ArchitectureVisualizer from './ArchitectureVisualizer'
import { projects } from '../data/projects'
import { playSyntheticSound } from '../utils/soundFX'

export default function CaseStudyModal({ project, allProjects, onClose, onSelectNext }) {
  const scrollRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    if (!project) return undefined
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        playSyntheticSound('close')
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll while modal is active & pause Lenis smooth-scroll
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [project, onClose])

  if (!project) return null

  const s = project.sections || {}
  const projectList = Array.isArray(allProjects) && allProjects.length > 0 ? allProjects : projects
  const currentIdx = projectList.findIndex((p) => p.id === project.id)
  const nextProject =
    projectList[(currentIdx === -1 ? 0 : currentIdx + 1) % projectList.length] || projectList[0]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[999999] overflow-y-auto overscroll-contain bg-[#030504]/98 backdrop-blur-3xl text-white selection:bg-[#c8f53c] selection:text-black"
        data-lenis-prevent="true"
        ref={scrollRef}
      >
        {/* Top sticky editorial bar */}
        <header className="sticky top-0 z-[100] w-full border-b border-white/15 bg-[#040705]/95 backdrop-blur-xl shadow-2xl">
          <div className="shell flex items-center justify-between gap-2 h-16 sm:h-18">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="font-mono text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded font-bold tracking-wider shrink-0"
                style={{ backgroundColor: `${project.color}25`, color: project.color }}
              >
                PROJ {project.num}
              </span>
              <span className="text-white/40 text-xs hidden sm:inline">/</span>
              <span className="font-mono text-xs text-white/70 uppercase tracking-wider hidden md:inline">
                {project.category}
              </span>
              <span className="text-white/30 text-xs hidden sm:inline">—</span>
              <span className="font-display font-semibold text-xs sm:text-sm md:text-base text-white truncate">
                {project.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {project.link && project.link.startsWith('http') && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono font-semibold bg-[#c8f53c] text-black hover:bg-[#d8ff54] transition-all shadow-[0_4px_16px_rgba(200,245,60,0.3)] cursor-pointer shrink-0"
                >
                  <span className="hidden xs:inline sm:inline">{project.linkLabel || 'Live Demo'}</span>
                  <span className="xs:hidden sm:hidden">Live</span>
                  <span className="text-xs">↗</span>
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white cursor-pointer shrink-0"
                >
                  <span>GitHub</span>
                  <span className="text-xs">↗</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  playSyntheticSound('close')
                  onClose()
                }}
                aria-label="Close Case Study"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-mono bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white border border-white/20 cursor-pointer shadow shrink-0"
              >
                <span>Close</span>
                <span className="text-sm sm:text-base leading-none font-bold">✕</span>
              </button>
            </div>
          </div>
        </header>

        {/* Case Study Content */}
        <main className="shell py-10 md:py-16 max-w-4xl mx-auto space-y-14 relative z-10">
          {/* 01. Project Intro & Headlines */}
          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-white/60">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {project.status}
              </span>
              <span>·</span>
              <span>Year {project.year}</span>
              <span>·</span>
              <span>Verified Production Build</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.04] tracking-tight text-[#f5f5f3]">
              {project.title}
            </h1>
            <p className="font-serif italic text-xl sm:text-2xl text-white/70 max-w-2xl leading-relaxed">
              {project.subtitle}
            </p>

            {/* Direct Quick Launch Action Dock */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.link && project.link.startsWith('http') && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full text-xs font-mono font-semibold bg-[#c8f53c] text-black hover:bg-[#d8ff54] transition-all shadow-[0_10px_25px_rgba(200,245,60,0.3)] flex items-center gap-2 cursor-pointer"
                >
                  <span>🚀 {project.linkLabel || 'Launch Live Application'}</span>
                  <span>↗</span>
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full text-xs font-mono border border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white flex items-center gap-2 cursor-pointer"
                >
                  <span>📦 View Source on GitHub</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            <p className="text-base sm:text-lg text-white/80 font-sans leading-relaxed pt-4 border-t border-white/10">
              {s.intro}
            </p>
          </section>

          {/* 02. Hero Visual Presentation */}
          <section className="space-y-4">
            <div className="w-full h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative">
              <ProjectThumbnail project={project} className="!p-8" />
            </div>
            {s.heroVisual && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-white/50 font-mono gap-1 px-1">
                <span className="text-white/80">{s.heroVisual.headline}</span>
                <span>{s.heroVisual.caption}</span>
              </div>
            )}
          </section>

          {/* 03 & 04 & 05. Overview, Problem, Why Built */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                03 — Project Overview
              </span>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                {s.overview}
              </p>
            </div>
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#d8b375]">
                04 — Problem Statement
              </span>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                {s.problem}
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
              05 — Why I Decided To Build It
            </span>
            <p className="text-base text-white/90 leading-relaxed font-sans italic">
              "{s.whyBuilt}"
            </p>
          </section>

          {/* 06 & 07. Research & Architecture */}
          <section className="space-y-8 pt-8 border-t border-white/10">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#a8a49a]">
                06 — Research &amp; Planning
              </span>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                {s.research}
              </p>
            </div>

            {s.architecture && (
              <ArchitectureVisualizer project={project} />
            )}
          </section>

          {/* 08 & 09. UI/UX & Development */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                08 — UI/UX &amp; Design Process
              </span>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                {s.uiUx}
              </p>
            </div>
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#d8b375]">
                09 — Development Process
              </span>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                {s.development}
              </p>
            </div>
          </section>

          {/* 10. Tech Stack Details */}
          {s.techStackDetails && (
            <section className="space-y-4 pt-8 border-t border-white/10">
              <span className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                10 — Tech Stack Breakdown &amp; Rationale
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {s.techStackDetails.map((tech, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1"
                  >
                    <div className="font-mono font-semibold text-sm text-[#c8f53c]">
                      {tech.name}
                    </div>
                    <div className="text-xs text-white/70 font-sans leading-relaxed">
                      {tech.role}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 11 & 12. Challenges & Solutions */}
          {s.challenges && s.solutions && (
            <section className="space-y-6 pt-8 border-t border-white/10">
              <span className="font-mono text-xs uppercase tracking-widest text-[#d8b375]">
                11 &amp; 12 — Engineering Challenges &amp; Solutions
              </span>
              <div className="space-y-4">
                {s.challenges.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 shrink-0">
                        Challenge
                      </span>
                      <p className="text-sm text-white/90 font-medium">{ch}</p>
                    </div>
                    <div className="flex items-start gap-2.5 pl-2 sm:pl-4 border-l-2 border-[#c8f53c]/40">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#c8f53c]/10 text-[#c8f53c] border border-[#c8f53c]/20 shrink-0">
                        Solution
                      </span>
                      <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
                        {s.solutions[idx] || 'Resolved cleanly through modular isolation and boundary validation.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hiring & Acquisition Technical Due-Diligence Q&A */}
          <section className="space-y-6 pt-8 border-t border-white/10">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                Engineering Due-Diligence · Technical Q&amp;A
              </span>
              <p className="text-xs text-white/50 font-sans mt-1">
                Key architecture, scalability, and team-handoff questions evaluated by engineering leaders.
              </p>
            </div>
            <div className="space-y-4">
              {(s.technicalQa && s.technicalQa.length > 0
                ? s.technicalQa
                : [
                    {
                      q: `Why choose ${s.architecture?.pattern || project.stack.slice(0, 2).join(' + ')} for ${project.title} over heavier alternatives?`,
                      a: `${s.architecture?.description?.split('\n')[0] || project.description} This keeps runtime overhead low, failure modes isolated, and team onboarding straightforward.`,
                    },
                    {
                      q: `How does this codebase demonstrate production readiness for our engineering team?`,
                      a: `${s.resultsLearnings || project.description} Every core boundary pairs explicit validation with clean separation of concerns between state, transport, and interface layers.`,
                    },
                  ]
              ).map((qa, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#070d0a] border border-white/10 hover:border-[#c8f53c]/30 transition-colors space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#d8b375]/15 text-[#d8b375] border border-[#d8b375]/30 shrink-0">
                      Q{idx + 1}
                    </span>
                    <p className="text-sm sm:text-base font-medium text-white leading-snug">
                      {qa.q}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 pl-2 sm:pl-4 border-l-2 border-[#c8f53c]/40">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#c8f53c]/15 text-[#c8f53c] border border-[#c8f53c]/30 shrink-0">
                      Answer
                    </span>
                    <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
                      {qa.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 13 & 14. Key Highlights & Learnings */}
          <section className="space-y-6 pt-8 border-t border-white/10">
            {s.demonstration && (
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                  13 — Feature Demonstrations &amp; Capabilities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {s.demonstration.map((demo, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1"
                    >
                      <div className="font-mono text-xs text-white/50">{demo.label}</div>
                      <div className="text-sm font-semibold text-white">{demo.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 rounded-xl bg-[#08140c]/40 border border-[#c8f53c]/20 space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                14 — Results &amp; What I Learned
              </span>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans">
                {s.resultsLearnings}
              </p>
            </div>
          </section>

          {/* 15. Action Links */}
          <section className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/15">
            <div>
              <div className="font-display font-semibold text-lg text-white">
                Ready to explore the live application?
              </div>
              <div className="text-xs text-white/60 font-mono mt-0.5">
                Verify the live deployment or view repository source code.
              </div>
            </div>

            <div className="flex items-center gap-3">
              {project.link && project.link.startsWith('http') && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-mono font-semibold bg-[#c8f53c] text-black hover:bg-[#d8ff54] transition-all shadow-lg"
                >
                  {project.linkLabel || 'Open Live Project'} ↗
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-mono border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-white"
                >
                  View GitHub Source ↗
                </a>
              )}
            </div>
          </section>

          {/* 16. Next Project Navigation */}
          {nextProject && (
            <footer className="pt-12 pb-16 border-t border-white/10">
              <button
                onClick={() => {
                  onSelectNext(nextProject)
                  if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="w-full group p-8 rounded-2xl bg-[#080d0b] border border-white/10 hover:border-[#c8f53c]/40 transition-all text-left flex items-center justify-between"
              >
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[#c8f53c] mb-1">
                    16 — Next Case Study → PROJ {nextProject.num}
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#c8f53c] transition-colors">
                    {nextProject.title}
                  </div>
                  <div className="text-xs text-white/50 font-sans mt-1">
                    {nextProject.subtitle}
                  </div>
                </div>
                <span className="font-mono text-2xl text-white/40 group-hover:text-[#c8f53c] group-hover:translate-x-2 transition-all">
                  →
                </span>
              </button>
            </footer>
          )}
        </main>
      </motion.div>
    </AnimatePresence>
  )
}

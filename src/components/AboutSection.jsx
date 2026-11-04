import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

export default function AboutSection() {
  const [selectedPhoto, setSelectedPhoto] = useState('jersey')

  return (
    <section id="about" className="relative py-24 sm:py-36 bg-[#040605] border-t border-white/5 overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-0 w-[50vw] h-[50vw] bg-emerald-500/[0.02] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[45vw] h-[45vw] bg-[#c8f53c]/[0.015] rounded-full blur-[170px] pointer-events-none" />

      <div className="shell relative z-10 space-y-20">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c8f53c]" />
              <span className="font-mono text-xs uppercase tracking-[0.26em] text-[#c8f53c]">
                04 — Visual Persona &amp; Manifesto
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#f4f1ea] font-normal leading-[0.98] tracking-tight">
              The Mind &amp; <span className="italic font-serif text-[#a8a49a]">The Craft</span>
            </h2>
          </div>

          <div className="font-mono text-xs text-white/50 space-y-1">
            <div>MUMBAI · KJ SOMAIYA (2026–2030)</div>
            <div>AI SYSTEMS · INDEPENDENT BUILDER</div>
          </div>
        </div>

        {/* Dual Editorial Photo Presentation: Real Photography of Parshva */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: The "PARSHVA 4" Jersey Portrait */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#070b09] shadow-2xl flex flex-col justify-between group">
            <div className="relative h-[480px] sm:h-[560px] overflow-hidden bg-black">
              <img
                src={`${import.meta.env.BASE_URL}parshva-jersey.png`}
                alt="Parshva Shah in Jersey 04"
                className="w-full h-full object-cover object-[center_28%] contrast-[1.08] brightness-[0.98] group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b09] via-transparent to-[#070b09]/20" />
              
              {/* Editorial Badges & Monogram on Image */}
              <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 font-mono text-[10px] uppercase tracking-widest text-[#c8f53c]">
                No. 04 · PARSHVA JERSEY
              </div>

              <div className="absolute top-5 right-5 font-mono text-[10px] text-white/60 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded border border-white/5">
                LOC: 19.0760° N, 72.8777° E
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-3 border-t border-white/10 bg-white/[0.01]">
              <div className="flex items-center justify-between">
                <div className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  "PARSHVA 4" — The Identity
                </div>
                <span className="font-mono text-[10px] uppercase text-[#c8f53c] tracking-wider">
                  Discipline &amp; Focus
                </span>
              </div>
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                Relentless personal standard. Whether architecting distributed backend state machines, evaluating LLM agent boundaries, or refining micro-interactions, the work is approached with athletic focus, deep curiosity, and first-principles discipline.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 font-mono text-[10px] text-white/60">First Principles</span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 font-mono text-[10px] text-white/60">Defensive Architecture</span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 font-mono text-[10px] text-white/60">End-to-End Ownership</span>
              </div>
            </div>
          </div>

          {/* Card 2: The Night Street BMW Exploration */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#070b09] shadow-2xl flex flex-col justify-between group">
            <div className="relative h-[480px] sm:h-[560px] overflow-hidden bg-black">
              <img
                src={`${import.meta.env.BASE_URL}parshva-street.jpg`}
                alt="Parshva Shah Night Urban Exploration"
                className="w-full h-full object-cover object-center contrast-[1.08] brightness-[0.98] group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b09] via-transparent to-[#070b09]/20" />

              {/* Editorial Badges & Monogram on Image */}
              <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 font-mono text-[10px] uppercase tracking-widest text-[#f4f1ea]">
                Night Explorer · Urban Edge
              </div>

              <div className="absolute top-5 right-5 font-mono text-[10px] text-white/60 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded border border-white/5">
                URBAN HORIZON
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-3 border-t border-white/10 bg-white/[0.01]">
              <div className="flex items-center justify-between">
                <div className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  The Independent Builder
                </div>
                <span className="font-mono text-[10px] uppercase text-[#a8a49a] tracking-wider">
                  Commercial Practice
                </span>
              </div>
              <p className="text-sm text-white/70 font-sans leading-relaxed">
                Operating directly in the wild. Working with business owners across Mumbai and Surat to automate operations, build custom web platforms, and explore the frontier of AI application development.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 font-mono text-[10px] text-white/60">Client Delivery</span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 font-mono text-[10px] text-white/60">Autonomous Automations</span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 font-mono text-[10px] text-white/60">Creative WebGL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Narrative & Direct User Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 sm:gap-16 items-start pt-6">
          {/* Left Column: Direct Quote & Personal Journey */}
          <div className="space-y-8">
            {/* The Direct Personal Quote specified in the brief */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 relative overflow-hidden">
              <span className="absolute top-4 right-6 font-serif text-7xl text-white/[0.04] select-none pointer-events-none">“</span>
              <blockquote className="font-serif italic text-2xl sm:text-3xl text-white font-normal leading-relaxed relative z-10">
                "I'm Parshva Shah. An engineering student, independent builder and someone who genuinely enjoys turning ideas into working products.
                <br /><br />
                I spend my time exploring software engineering, AI, product development and the creative possibilities of the web.
                <br /><br />
                I don't just want to understand how technology works. I want to build things with it."
              </blockquote>
            </div>

            {/* Narrative text */}
            <div className="space-y-5 text-sm sm:text-base text-white/75 font-sans leading-relaxed">
              <p>
                Currently pursuing my <strong className="text-white">BTech in Artificial Intelligence &amp; Data Science (2026–2030) at KJ Somaiya School of Engineering, Mumbai</strong>. My trajectory began with an insatiable curiosity for how computational systems operate: from data structures and memory allocation to discrete mathematics and neural network optimization.
              </p>
              <p>
                Alongside my academic syllabus, I run an <strong className="text-white">independent commercial practice</strong>. I partner directly with local businesses—salons, tuition academies, and textile merchants in Mumbai and Surat. I build production software: multi-tenant WhatsApp FSM bots, admissions portals, and automated scheduling systems.
              </p>
              <p>
                This practical exposure taught me what algorithms in textbooks rarely emphasize: <strong className="text-white">software in production must be defensive, reliable, and intuitive</strong>.
              </p>
            </div>
          </div>

          {/* Right Column: Creative Pursuits & Philosophy */}
          <div className="space-y-6">
            {/* Creative Pursuits: Photography */}
            <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                  Beyond Code · Visual Arts
                </div>
                <span className="text-xl">📷</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-white">Photography &amp; Composition</h3>
                <p className="text-sm text-white/70 font-sans leading-relaxed">
                  Active member of photography circles. The practice of framing subjects, controlling lighting, and balancing negative space directly shapes my approach to digital user interfaces and spatial WebGL environments.
                </p>
              </div>
            </div>

            {/* 3 Core Builder Perspectives */}
            <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
              <div className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                Core Engineering Philosophy
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-sm text-[#c8f53c] mt-0.5">01</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Real Human Utility</h4>
                    <p className="text-xs text-white/60 font-sans mt-0.5">
                      Code is a means to eliminate friction. If software doesn't simplify someone's daily life, it doesn't matter how clever it is.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-sm text-[#c8f53c] mt-0.5">02</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">AI as Reasoning Primitives</h4>
                    <p className="text-xs text-white/60 font-sans mt-0.5">
                      LLMs are probabilistic reasoning engines. Robust applications require deterministic guardrails, structured schemas, and error boundaries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-sm text-[#c8f53c] mt-0.5">03</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Full-Stack Sovereignty</h4>
                    <p className="text-xs text-white/60 font-sans mt-0.5">
                      Taking complete ownership: from database migrations and API schemas to tactile UI animations and typographic hierarchy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

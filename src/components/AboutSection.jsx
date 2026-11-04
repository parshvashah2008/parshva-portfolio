export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#050706] border-t border-white/5 overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-0 w-[45vw] h-[45vw] bg-emerald-500/[0.025] rounded-full blur-[160px] pointer-events-none" />

      <div className="shell relative z-10 space-y-20">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c]" />
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#c8f53c]">
              04 — About Me
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f4f1ea] font-normal leading-[1.05] tracking-tight">
            The Person Behind <span className="italic font-serif text-[#a8a49a]">The Code</span>
          </h2>
        </div>

        {/* Storytelling Grid: Portrait & Candid Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 sm:gap-16 items-start">
          {/* Portrait & Visual Badges */}
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#080d0a] shadow-2xl group">
              <img
                src={`${import.meta.env.BASE_URL}parshva-portrait.png`}
                alt="Parshva Shah"
                className="w-full h-auto object-cover grayscale-[20%] contrast-[1.08] group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 inset-x-6">
                <div className="font-serif text-2xl text-white">Parshva Shah</div>
                <div className="font-mono text-xs text-white/60">
                  AI Engineer &amp; Engineering Student · Mumbai, India
                </div>
              </div>
            </div>

            {/* Quick Facts Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
              <div className="font-mono text-xs uppercase tracking-widest text-[#c8f53c]">
                Core Perspectives
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-white/80 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#c8f53c] font-mono">01.</span>
                  <span><strong>Build for real utility:</strong> A system is only as good as the actual friction it eliminates for humans.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c8f53c] font-mono">02.</span>
                  <span><strong>AI as an amplifier:</strong> LLMs are reasoning primitives, not magic. Architecture and error boundaries are what matter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c8f53c] font-mono">03.</span>
                  <span><strong>End-to-end agency:</strong> From database schema and backend APIs to fine-tuned UX and typography.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Narrative & Philosophy */}
          <div className="space-y-8 text-white/80 font-sans leading-relaxed text-base sm:text-lg">
            {/* Direct personal quote specified by user */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border-l-4 border-[#c8f53c] border-white/10">
              <blockquote className="font-serif italic text-xl sm:text-2xl text-white font-normal leading-relaxed">
                "I'm Parshva Shah. An engineering student, independent builder and someone who genuinely enjoys turning ideas into working products.
                <br /><br />
                I spend my time exploring software engineering, AI, product development and the creative possibilities of the web.
                <br /><br />
                I don't just want to understand how technology works. I want to build things with it."
              </blockquote>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-white/70">
              <p>
                Pursuing my <strong className="text-white">BTech in Artificial Intelligence &amp; Data Science at KJ Somaiya School of Engineering (2026–2030)</strong>, Mumbai. My journey started with a natural obsession for understanding computational systems from the inside out—how bits travel across networks, how algorithms optimize memory, and how mathematical models simulate human cognition.
              </p>
              <p>
                Alongside my academic coursework, I operate an <strong className="text-white">independent freelance AI automation practice</strong>. I work directly with local business owners—salons, tuition academies, and textile merchants in Mumbai and Surat. I build production tools: multi-tenant WhatsApp state machines, automated scheduling pipelines, and interactive web portals.
              </p>
              <p>
                This hands-on commercial experience taught me a lesson that textbook algorithms rarely convey: <strong className="text-white">reliability in production is everything</strong>. Edge cases, unstable cellular networks, API rate limits, and non-technical end users require software engineered with deep defensive discipline.
              </p>
            </div>

            {/* Creative & Community Interests */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="font-mono text-xs uppercase tracking-widest text-white/50">
                Beyond The Screen · Creative Pursuits
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="font-display font-semibold text-sm text-white flex items-center gap-2">
                    <span>📷</span> Photography Club
                  </div>
                  <p className="text-xs text-white/60 font-sans">
                    Active participant in photography circles, developing an eye for visual composition, negative space, and lighting that informs my design work.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="font-display font-semibold text-sm text-white flex items-center gap-2">
                    <span>⚡</span> Hackathons &amp; Open Source
                  </div>
                  <p className="text-xs text-white/60 font-sans">
                    Regularly participating in rapid prototyping sprints, exploring experimental computer vision tools and agentic architectures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

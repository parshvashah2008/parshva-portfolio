import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  forageCertifications,
  anthropicCertifications,
  forageUserCode,
  googleCertification,
} from '../data/certifications'
import CertificateModal from './CertificateModal'

const TIMELINE_EVENTS = [
  {
    period: '2026 — 2030',
    role: 'BTech in Artificial Intelligence & Data Science',
    org: 'KJ Somaiya School of Engineering, Mumbai',
    type: 'Academic',
    highlight:
      'Rigorous coursework in Data Structures & Algorithms, Machine Learning, Operating Systems, Database Management, and Discrete Mathematics.',
    tags: ['Algorithms', 'Machine Learning', 'Systems Architecture', 'Linear Algebra'],
  },
  {
    period: '2024 — Present',
    role: 'Independent Builder & Freelance AI Automation',
    org: 'Local Business Practice (Mumbai & Surat)',
    type: 'Practice',
    highlight:
      'Architecting custom software tools and AI automations for salons, tuition academies, and textile merchants. Shipped multi-tenant WhatsApp FSM bots, admissions portals, and scheduling tools.',
    tags: ['FastAPI', 'WhatsApp API', 'Client Delivery', 'React', 'Production Deployments'],
  },
  {
    period: '2025 — 2026',
    role: 'Specialized AI Engineering & Agent Architecture',
    org: 'Anthropic Certification Program (18 Credentials)',
    type: 'Specialization',
    highlight:
      'Earned 18 official credentials spanning Claude Platform, Model Context Protocol (MCP), subagent orchestration, and generative AI fluency frameworks.',
    tags: ['Model Context Protocol', 'Subagents', 'Claude Agent SDK', 'Tool Routing'],
    actionTab: 'anthropic',
    actionLabel: 'View 18 Anthropic Certificates →',
  },
  {
    period: '2025 — 2026',
    role: 'Technical Job Simulations & Quantitative Tasks',
    org: 'Goldman Sachs, J.P. Morgan, Tata, Skyscanner, Deloitte, British Airways, Siemens',
    type: 'Simulations',
    highlight:
      'Completed 8 hands-on simulations across quantitative research, Kafka REST controllers, risk profiling, microservices, and industrial engineering.',
    tags: ['Quant Research', 'Kafka', 'Financial Modeling', 'Data Analytics', 'Operations'],
    actionTab: 'forage',
    actionLabel: 'View 8 Industry Simulation Certificates →',
  },
  {
    period: '2026',
    role: 'Google AI Student Certification',
    org: 'Google for Education',
    type: 'AI Credential',
    highlight:
      'Demonstrated competencies and practical applications of Google AI in educational and developmental environments.',
    tags: ['Google Gemini', 'Generative AI', 'Education Systems'],
    actionTab: 'google',
    actionLabel: 'View Google AI Certificate →',
  },
  {
    period: 'Extracurricular',
    role: 'Photography Club & Visual Arts',
    org: 'Student Community & Creative Practice',
    type: 'Creative',
    highlight:
      'Active member exploring visual composition, lighting, and framing, directly informing digital user interface design and art direction.',
    tags: ['Visual Composition', 'Lighting', 'Creative Direction'],
  },
]

export default function ExperienceSection() {
  const [activeTab, setActiveTab] = useState('forage') // default to forage to directly address user
  const [modalCert, setModalCert] = useState(null)
  const [modalList, setModalList] = useState([])

  function openCertificate(cert, list) {
    setModalCert(cert)
    setModalList(list)
  }

  function handleNext() {
    if (!modalCert || !modalList.length) return
    const idx = modalList.findIndex((c) => c.id === modalCert.id)
    if (idx !== -1) {
      const nextIdx = (idx + 1) % modalList.length
      setModalCert(modalList[nextIdx])
    }
  }

  function handlePrev() {
    if (!modalCert || !modalList.length) return
    const idx = modalList.findIndex((c) => c.id === modalCert.id)
    if (idx !== -1) {
      const prevIdx = (idx - 1 + modalList.length) % modalList.length
      setModalCert(modalList[prevIdx])
    }
  }

  return (
    <section id="experience" className="relative py-24 sm:py-32 bg-[#040605] border-t border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-0 w-[40vw] h-[40vw] bg-[#c8f53c]/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="shell relative z-10 space-y-16">
        {/* Section Header & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c8f53c]" />
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#c8f53c]">
                05 — Experience &amp; Achievements
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#f4f1ea] font-medium sm:font-semibold leading-[1.05] tracking-tight">
              Curiosity In <span className="italic font-serif font-normal text-[#c8f53c]">Execution</span>
            </h2>
            <p className="text-[#a8a49a] text-xs sm:text-sm font-sans mt-2 max-w-xl">
              An honest, verifiable record of academic studies, independent engineering practice, and professional technical certificates with original documents.
            </p>
          </div>

          {/* Interactive View Tabs */}
          <div className="inline-flex flex-wrap p-1 rounded-2xl sm:rounded-full bg-white/5 border border-white/10 font-mono text-xs gap-1">
            <button
              onClick={() => setActiveTab('forage')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'forage'
                  ? 'bg-[#d8b375] text-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Industry Simulations ({forageCertifications.length})
            </button>
            <button
              onClick={() => setActiveTab('anthropic')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'anthropic'
                  ? 'bg-[#c8f53c] text-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Anthropic Certs ({anthropicCertifications.length})
            </button>
            <button
              onClick={() => setActiveTab('google')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'google'
                  ? 'bg-blue-400 text-black font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Google AI (1)
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'timeline'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {/* TAB 1: 8 FORAGE INDUSTRY SIMULATIONS (WITH VISIBLE CERTIFICATES) */}
        {activeTab === 'forage' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0e140f] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#d8b375]">
                  Forage Job Simulations — Real Industry Tasks
                </span>
                <p className="text-sm text-white/80 font-sans mt-0.5">
                  Verified candidate code:{' '}
                  <code className="text-[#c8f53c] bg-black/40 px-2 py-0.5 rounded font-mono">
                    {forageUserCode}
                  </code>{' '}
                  · Click any certificate to inspect full document or open PDF.
                </p>
              </div>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#d8b375]/15 text-[#d8b375] border border-[#d8b375]/30 shrink-0">
                {forageCertifications.length} Programs Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {forageCertifications.map((f) => (
                <div
                  key={f.id}
                  className="p-5 rounded-2xl bg-[#090f0c] border border-white/10 space-y-4 hover:border-[#d8b375]/40 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-lg text-white">
                        {f.company}
                      </span>
                      <span className="font-mono text-xs text-white/50">{f.date}</span>
                    </div>

                    <div className="font-serif italic text-xl text-white/95">
                      {f.title}
                    </div>

                    {/* Certificate Thumbnail Preview */}
                    <div
                      onClick={() => openCertificate(f, forageCertifications)}
                      className="aspect-[16/11] bg-black/50 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#d8b375]/50 transition-all cursor-pointer relative shadow-inner"
                      title="Click to view full certificate"
                    >
                      <img
                        src={f.image}
                        alt={`${f.company} - ${f.title} Certificate`}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#d8b375] text-black font-mono text-xs font-semibold shadow-2xl flex items-center gap-1.5">
                          <span>Inspect Full Certificate</span>
                          <span>↗</span>
                        </span>
                      </div>
                    </div>

                    {/* Skills Applied */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#a8a49a] font-semibold">
                        Skills Applied:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {f.skills.map((sk) => (
                          <span
                            key={sk}
                            className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/70"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between font-mono text-[11px] text-white/50">
                      <span>Enrollment Verification:</span>
                      <code className="text-[#d8b375] font-semibold">{f.enrollCode}</code>
                    </div>

                    <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                      <button
                        onClick={() => openCertificate(f, forageCertifications)}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#d8b375]/15 hover:bg-[#d8b375] text-[#d8b375] hover:text-black border border-[#d8b375]/30 hover:border-[#d8b375] text-center font-semibold transition-all text-xs flex items-center justify-center gap-1.5"
                      >
                        <span>View Certificate</span>
                        <span>↗</span>
                      </button>
                      <a
                        href={f.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 text-center transition-all text-xs"
                      >
                        Open PDF ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 18 ANTHROPIC CLAUDE CERTIFICATIONS (WITH VISIBLE CERTIFICATES) */}
        {activeTab === 'anthropic' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0a120e] border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                  Anthropic Skilljar Credentials Verified
                </span>
                <p className="text-sm text-white/80 font-sans mt-0.5">
                  18 official credentials completed across Claude Agent SDK, Model Context Protocol, and subagent orchestration. Click any certificate to preview.
                </p>
              </div>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                18 / 18 Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {anthropicCertifications.map((cert) => (
                <div
                  key={cert.id}
                  className="group p-4 rounded-2xl bg-[#090f0c] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cert.color }}
                      />
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Official Badge
                      </span>
                    </div>

                    <div className="font-display font-medium text-base text-white group-hover:text-emerald-300 transition-colors">
                      {cert.title}
                    </div>

                    {cert.partner && (
                      <div className="font-mono text-[10px] text-[#a8a49a]">
                        Partner: {cert.partner}
                      </div>
                    )}

                    {/* Certificate Thumbnail */}
                    <div
                      onClick={() => openCertificate(cert, anthropicCertifications)}
                      className="aspect-[4/3] bg-black/50 rounded-xl overflow-hidden border border-white/10 group-hover:border-emerald-500/50 transition-all cursor-pointer relative shadow-inner"
                      title="Click to view certificate"
                    >
                      <img
                        src={cert.image}
                        alt={`${cert.title} Certificate`}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-3 py-1 rounded-full bg-[#c8f53c] text-black font-mono text-[11px] font-semibold shadow-2xl flex items-center gap-1">
                          <span>Inspect</span>
                          <span>↗</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 font-mono text-[11px]">
                    <button
                      onClick={() => openCertificate(cert, anthropicCertifications)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/30 text-center transition-all font-medium"
                    >
                      View Cert ↗
                    </button>
                    <a
                      href={cert.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 text-center transition-all"
                    >
                      PDF
                    </a>
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 text-center transition-all"
                      title="Verify at Skilljar"
                    >
                      Verify
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GOOGLE AI CERTIFICATION */}
        {activeTab === 'google' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090f0c] border border-blue-500/20 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="font-mono text-xs uppercase tracking-widest text-blue-400">
                      {googleCertification.issuer}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white mt-1">
                    {googleCertification.title}
                  </h3>
                </div>
                <span className="font-mono text-xs px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 self-start sm:self-auto">
                  {googleCertification.verifyLabel}
                </span>
              </div>

              {/* Large Image Preview */}
              <div
                onClick={() => openCertificate(googleCertification, [googleCertification])}
                className="aspect-[4/3] max-w-lg mx-auto bg-black/60 rounded-2xl overflow-hidden border border-white/15 hover:border-blue-400/50 transition-all cursor-pointer relative shadow-2xl group"
              >
                <img
                  src={googleCertification.image}
                  alt={googleCertification.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="px-4 py-2 rounded-full bg-blue-400 text-black font-mono text-xs font-semibold shadow-2xl">
                    Inspect Full Certificate ↗
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm sm:text-base text-white/80 font-sans leading-relaxed pt-2">
                <p>{googleCertification.description}</p>
                <div className="font-mono text-xs text-white/50 pt-2 flex flex-wrap gap-4">
                  <span>Issued: {googleCertification.date}</span>
                  <span>·</span>
                  <span>Valid Through: {googleCertification.validThrough}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => openCertificate(googleCertification, [googleCertification])}
                  className="py-2.5 px-5 rounded-full bg-blue-400 hover:bg-blue-300 text-black font-semibold transition-all"
                >
                  View Large Certificate ↗
                </button>
                <a
                  href={googleCertification.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white transition-all"
                >
                  Open Original PDF ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHRONOLOGICAL TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="relative pl-6 sm:pl-10 border-l border-white/10 space-y-12">
            {TIMELINE_EVENTS.map((event, idx) => (
              <motion.div
                key={event.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative group"
              >
                {/* Node pin */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#040504] border-2 border-[#c8f53c] group-hover:scale-125 transition-transform" />

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="text-[#c8f53c] font-semibold">{event.period}</span>
                    <span className="text-white/30">·</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 uppercase text-[10px]">
                      {event.type}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal group-hover:text-[#c8f53c] transition-colors">
                    {event.role}
                  </h3>

                  <div className="font-sans text-sm text-white/50 font-medium">
                    {event.org}
                  </div>

                  <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed pt-1 max-w-3xl">
                    {event.highlight}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {event.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-white/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {event.actionTab && (
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab(event.actionTab)}
                        className="font-mono text-xs text-[#c8f53c] hover:underline flex items-center gap-1"
                      >
                        {event.actionLabel}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Certificate Lightbox Modal */}
      <CertificateModal
        certificate={modalCert}
        onClose={() => setModalCert(null)}
        onNext={handleNext}
        onPrev={handlePrev}
        hasMultiple={modalList.length > 1}
      />
    </section>
  )
}

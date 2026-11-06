import { useState, useEffect } from 'react'
import { contact } from '../data/projects'

export default function ContactSection() {
  const [copied, setCopied] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', message: '', projectType: 'AI Engineering' })
  const [submitted, setSubmitted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  // Live IST time clock
  useEffect(() => {
    function updateClock() {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setCurrentTime(timeStr)
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  function copyEmail() {
    navigator.clipboard.writeText(contact.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) return
    setSubmitted(true)
  }

  return (
    <footer id="contact" className="relative pt-24 sm:pt-32 pb-12 bg-[#040605] border-t border-white/10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-[35vw] h-[35vw] bg-emerald-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[30vw] h-[30vw] bg-[#c8f53c]/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="shell relative z-10 space-y-20">
        {/* Main Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-ping" />
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#c8f53c]">
              09 — Contact &amp; Collaboration
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#f4f1ea] font-normal leading-[1.02] tracking-tight">
            Have something <span className="italic font-serif text-[#c8f53c]">interesting in mind?</span>
          </h2>

          <p className="text-[#a8a49a] text-base sm:text-lg font-sans max-w-2xl leading-relaxed pt-2">
            I'm always interested in building meaningful things, exploring ambitious ideas and connecting with people who enjoy creating.
          </p>
        </div>

        {/* Contact Channels & Message Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 sm:gap-16 items-start">
          {/* Direct Channels */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#a8a49a] font-semibold">
                Direct Communication Channels
              </span>
              <p className="text-sm text-white/80 font-sans">
                Feel free to reach out directly via email, send a message through the form, or connect on LinkedIn and GitHub.
              </p>
            </div>

            <div className="space-y-3">
              {/* Email Card with Direct Action Suite */}
              <div className="p-5 rounded-2xl bg-[#080d0a] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c8f53c]" />
                    <span className="font-mono text-[10px] text-[#a8a49a] uppercase font-semibold tracking-wider">
                      Direct Email Dispatch
                    </span>
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-mono text-xs sm:text-sm md:text-[15px] text-white group-hover:text-[#c8f53c] transition-colors truncate block font-medium"
                    title={contact.email}
                  >
                    {contact.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button
                    onClick={copyEmail}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-mono text-xs border border-white/15 bg-white/5 hover:bg-white/15 active:scale-95 text-white/90 hover:text-white transition-all cursor-pointer"
                  >
                    <span>{copied ? '✓ Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold bg-[#c8f53c] text-black hover:bg-[#d8ff54] active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Send Mail</span>
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              </div>

              {/* LinkedIn & GitHub Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#080d0a] border border-white/10 hover:border-[#c8f53c]/40 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono text-[10px] text-[#c8f53c] uppercase">Professional Network</div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#c8f53c]">
                      LinkedIn Profile
                    </div>
                    <div className="font-mono text-[10px] text-[#a8a49a]">/in/parshva-shah-592022328</div>
                  </div>
                  <span className="text-white/30 group-hover:text-[#c8f53c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-base">↗</span>
                </a>

                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#080d0a] border border-white/10 hover:border-[#c8f53c]/40 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono text-[10px] text-[#c8f53c] uppercase">Code &amp; Repositories</div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#c8f53c]">
                      GitHub
                    </div>
                    <div className="font-mono text-[10px] text-[#a8a49a]">@parshvashah2008</div>
                  </div>
                  <span className="text-white/30 group-hover:text-[#c8f53c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-base">↗</span>
                </a>
              </div>
            </div>

            {/* Opportunities Box */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#d8b375]">
                Open For
              </span>
              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                Software Engineering Roles · AI Agent &amp; LLM Engineering · Technical Freelance Systems for Local Businesses · Creative WebGL Collaborations.
              </p>
            </div>
          </div>

          {/* Contact / Inquiry Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070c09] border border-white/10 relative shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#c8f53c]/20 text-[#c8f53c] border border-[#c8f53c]/40 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="font-serif text-2xl text-white">Message Transmitted</h3>
                <p className="text-sm text-white/70 font-sans max-w-sm mx-auto">
                  Thank you for reaching out, {formState.name}. I will review your note and respond promptly.
                </p>
                <div className="pt-2">
                  <a
                    href={`mailto:${contact.email}?subject=${encodeURIComponent(
                      formState.projectType + ' Inquiry'
                    )}&body=${encodeURIComponent(formState.message)}`}
                    className="inline-block px-4 py-2 rounded-full font-mono text-xs bg-white/10 hover:bg-white/20 text-white"
                  >
                    Also Send via Default Email Client →
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl text-white">Send A Message</h3>
                  <p className="text-xs text-white/50 font-sans">
                    Have an idea, project, or role? Drop a message directly below.
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label htmlFor="contact-name" className="block text-white/60 mb-1.5 uppercase tracking-wider text-[10px]">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#c8f53c] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-white/60 mb-1.5 uppercase tracking-wider text-[10px]">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#c8f53c] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-topic" className="block text-white/60 mb-1.5 uppercase tracking-wider text-[10px]">
                      Topic / Domain
                    </label>
                    <select
                      id="contact-topic"
                      name="topic"
                      value={formState.projectType}
                      onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#090e0c] border border-white/10 text-white focus:outline-none focus:border-[#c8f53c] transition-colors"
                    >
                      <option value="AI Engineering">AI Engineering &amp; LLM Systems</option>
                      <option value="Full-Stack Web Application">Full-Stack Web Development</option>
                      <option value="Local Business Automation">Local Business Automation (WhatsApp / Booking)</option>
                      <option value="Software Engineering Role">Software Engineering Opportunity</option>
                      <option value="General Conversation">Creative Idea / Collaboration</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-white/60 mb-1.5 uppercase tracking-wider text-[10px]">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell me about what you are building or exploring..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#c8f53c] transition-colors resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-mono text-xs font-semibold bg-[#c8f53c] text-black hover:bg-[#d8ff54] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Transmit Message</span>
                  <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-white/50">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-md bg-white/10 border border-white/15 flex items-center justify-center font-bold text-white text-[10px]">
              PS
            </span>
            <span>Parshva Shah © 2026 · All Rights Reserved</span>
          </div>

          {/* Live IST clock */}
          <div className="flex items-center gap-2 text-white/70">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-pulse" />
            <span>Mumbai, IN · {currentTime || 'IST'}</span>
          </div>

          <a
            href="#home"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Back to top</span>
            <span>↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

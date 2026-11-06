import { useState, useRef, useEffect } from 'react'
import { playSyntheticSound } from '../utils/soundFX'

const BANNER = `
  ____                 _                 ____  _           _     
 |  _ \\ __ _ _ __ ___| |___   ____ _   / ___|| |__   __ _| |__  
 | |_) / _\` | '__/ __| '_  \\ / / _\` |  \\___ \\| '_ \\ / _\` | '_ \\ 
 |  __/ (_| | |  \\__ \\ | | | V / (_| |   ___) | | | | (_| | | | |
 |_|   \\__,_|_|  |___/_| |_|\\_/ \\__,_|  |____/|_| |_|\\__,_|_| |_|

 Architecture Console v2.4 · KJ Somaiya School of Engineering (BTech AI & DS 2026–2030)
 Type "help" to view available system commands.
`

const COMMANDS = {
  help: `Available commands:
  about           - Overview of Parshva Shah, background & focus
  skills          - Full breakdown of systems, AI & development toolkit
  projects        - List shipped production systems & experiments
  contact         - Direct channels (Email, LinkedIn, GitHub)
  status          - Academic & credential verification state
  cat manifesto   - Read the independent builder manifesto
  sudo hire       - Fast-track communication channel for founders & leads
  clear           - Clear terminal buffer`,

  about: `Parshva Shah
-----------------------------------------------------------
Identity:   Independent Builder & Engineering Student
Education:  BTech in Artificial Intelligence & Data Science (2026–2030)
Institute:  KJ Somaiya School of Engineering, Mumbai
Practice:   Architecting custom AI automations & full-stack web software
Mindset:    Building things that make the digital world more interesting`,

  skills: `Technical Capabilities & Toolkit
-----------------------------------------------------------
AI & ML:        LLMs, Anthropic Claude SDK, Model Context Protocol (MCP),
                Multi-provider routing, MediaPipe Computer Vision, RAG
Backend:        Python 3.12, FastAPI, PostgreSQL, SQLAlchemy 2.0, Twilio FSM
Languages:      Python, C++, TypeScript, JavaScript, SQL
Frontend:       React 19, Three.js / WebGL, GSAP, Tailwind CSS, Vite
Systems:        Linux, Docker, Git/GitHub, CI/CD, Discrete Mathematics`,

  projects: `Shipped Software & Production Artifacts
-----------------------------------------------------------
[01] Multi-Tenant WhatsApp Bot  - Config-driven FSM engine on FastAPI
[02] JEE Doubt Solver           - Multi-provider LLM router across 5 models
[03] Scholars Hub               - Modern digital presence for premier coaching
[04] Particle Storm             - MediaPipe hand-tracking kinetic particle engine
[05] Virtual Blackboard         - In-air camera drawing canvas (OpenCV + HTML5)
[06] Speak Smart Club           - Client portal for spoken-English academy
Type "projects" or scroll up to section 02 to explore the 3D Universe.`,

  contact: `Direct Communication Channels
-----------------------------------------------------------
Email:     parshvashah2203@gmail.com
LinkedIn:  https://www.linkedin.com/in/parshva-shah-592022328/
GitHub:    https://github.com/parshvashah2008
Based In:  Mumbai & Surat, India`,

  status: `Verified System & Credential Status
-----------------------------------------------------------
Academic:        BTech AI & Data Science (2026–2030) @ KJ Somaiya
Certifications:  18 Official Anthropic Claude & MCP Credentials
Simulations:     8 Forage Industry Tasks (Goldman Sachs, J.P. Morgan, Tata...)
Candidate Code:  69e98e1a52413f37a520e4c7
GitHub Pipeline: Automated GitHub Actions CI/CD to GitHub Pages`,

  'cat manifesto': `"I don't just want to understand how technology works.
 I want to build things with it.

 Real engineering is not about assembling templates; it is about
 understanding constraints from first principles, designing defensive
 state machines, and creating software that feels alive."`,

  'sudo hire': `[ACCESS GRANTED · PRIORITY CHANNEL]
-----------------------------------------------------------
Parshva is actively exploring software engineering roles,
AI engineering projects, and ambitious technical collaborations.

Direct Email: parshvashah2203@gmail.com
LinkedIn:     https://www.linkedin.com/in/parshva-shah-592022328/
Transmitting message protocol enabled.`,
}

export default function ParshvaCLI() {
  const [history, setHistory] = useState([
    { type: 'banner', text: BANNER },
    { type: 'output', text: 'Ready. Type "help" to inspect capabilities.' },
  ])
  const [inputVal, setInputVal] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase()
    playSyntheticSound('keystroke')

    if (!cmd) return

    setCmdHistory((prev) => [cmdRaw, ...prev])
    setHistoryIdx(-1)

    if (cmd === 'clear') {
      setHistory([])
      return
    }

    const output =
      COMMANDS[cmd] ||
      COMMANDS[cmd.replace(/^cat\s+manifesto(\.txt)?$/, 'cat manifesto')] ||
      `Command not found: "${cmdRaw}". Type "help" for a list of available commands.`

    setHistory((prev) => [
      ...prev,
      { type: 'input', text: `parshva@arch:~$ ${cmdRaw}` },
      { type: 'output', text: output },
    ])
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCommand(inputVal)
      setInputVal('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length > 0 && historyIdx + 1 < cmdHistory.length) {
        const nextIdx = historyIdx + 1
        setHistoryIdx(nextIdx)
        setInputVal(cmdHistory[nextIdx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1
        setHistoryIdx(nextIdx)
        setInputVal(cmdHistory[nextIdx])
      } else if (historyIdx === 0) {
        setHistoryIdx(-1)
        setInputVal('')
      }
    } else {
      playSyntheticSound('tick')
    }
  }

  return (
    <div
      data-cursor="terminal"
      onClick={() => inputRef.current?.focus()}
      className="w-full rounded-2xl bg-[#030604] border border-white/15 overflow-hidden shadow-2xl font-mono text-xs flex flex-col cursor-text select-text"
    >
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#060a07] border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-white/50 text-[11px]">
            parshva@somaiya-arch: ~/systems-lab
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#a8a49a] text-[10px] font-medium">
          <span>bash 5.2</span>
          <span>·</span>
          <span className="text-[#c8f53c] font-semibold">ACTIVE</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        className="p-4 sm:p-6 overflow-y-auto overscroll-contain max-h-[380px] space-y-3 font-mono leading-relaxed text-[#d4d1c9]"
        data-lenis-prevent="true"
      >
        {history.map((item, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            {item.type === 'banner' ? (
              <pre className="text-[10px] sm:text-xs text-[#c8f53c] font-bold overflow-x-auto">
                {item.text}
              </pre>
            ) : item.type === 'input' ? (
              <div className="text-white font-semibold flex items-center gap-1">
                <span className="text-[#c8f53c] font-bold">parshva@arch:~$</span>
                <span>{item.text.replace(/^parshva@arch:~\$\s*/, '')}</span>
              </div>
            ) : (
              <div className="text-white/80 pl-2 border-l border-white/10">{item.text}</div>
            )}
          </div>
        ))}

        {/* Live Input Line */}
        <div className="flex items-center gap-2 text-white pt-1">
          <span className="text-[#c8f53c] font-bold shrink-0">parshva@arch:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type 'help'..."
            className="flex-1 bg-transparent border-none outline-none text-[#f4f1ea] font-mono text-xs focus:ring-0 placeholder:text-white/20 caret-[#c8f53c]"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Terminal Footer Quick Suggestions */}
      <div className="px-4 py-2 bg-[#060a07] border-t border-white/5 flex flex-wrap items-center gap-2 text-[10px] text-white/70 select-none">
        <span className="text-[#a8a49a] font-semibold">Quick Run:</span>
        {['help', 'about', 'skills', 'projects', 'cat manifesto', 'sudo hire'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleCommand(cmd)
            }}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-[#c8f53c] transition-colors font-mono cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  )
}

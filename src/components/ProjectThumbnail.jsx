export default function ProjectThumbnail({ project, className = '' }) {
  const { id } = project

  // Render bespoke editorial visual mockups for each real project
  if (id === 'whatsapp-bot') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#070c09] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c8f53c_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#c8f53c]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c] animate-pulse" />
            FastAPI · FSM Engine
          </span>
          <span className="text-[10px] text-white/40">TENANT: MULTI_JSON</span>
        </div>

        {/* Central Visual: Conversational FSM Flow */}
        <div className="relative z-10 my-auto py-2 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c8f53c]" />
            <div className="px-2.5 py-1 rounded bg-[#0e1912] border border-[#c8f53c]/30 text-[10.5px] text-[#e8fce0] max-w-[85%]">
              Incoming WhatsApp Webhook: <span className="text-[#c8f53c]">"Check salon slot"</span>
            </div>
          </div>
          <div className="pl-3.5 border-l border-white/10 ml-0.5 space-y-1 py-0.5">
            <div className="text-[9.5px] text-white/50">→ TenantResolver: tenant_id="glamour_01"</div>
            <div className="text-[9.5px] text-[#c8f53c]">✓ FSM State: [SELECT_STYLIST] evaluated</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8ba352]" />
            <div className="px-2.5 py-1 rounded bg-[#101e14] border border-[#8ba352]/40 text-[10.5px] text-[#f4f1ea] max-w-[85%]">
              Outbound Twilio: "Available: 1. Priya (3PM) 2. Rahul (5PM)"
            </div>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
          <span>SQLAlchemy · PostgreSQL</span>
          <span className="text-[#c8f53c]">200 OK · 14ms</span>
        </div>
      </div>
    )
  }

  if (id === 'jee-doubt-solver') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#0c100e] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d8b375_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#d8b375]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#d8b375] animate-pulse" />
            Multi-LLM · STEM Engine
          </span>
          <span className="text-[10px] text-white/40">OCR + LATEX</span>
        </div>

        {/* Central Visual: Equation & Provider Fallback */}
        <div className="relative z-10 my-auto py-2 space-y-2">
          <div className="p-2.5 rounded bg-white/[0.03] border border-[#d8b375]/30 text-[11px]">
            <div className="text-[9px] uppercase tracking-wider text-[#d8b375]/80 mb-1">Rotational Dynamics · Calculus</div>
            <div className="font-serif italic text-[16px] text-[#f4f1ea]">
              {"\\int_0^R (2\\pi r \\sigma) \\cdot r^2 \\, dr = \\frac{1}{2} M R^2"}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px]">
            <span className="px-1.5 py-0.5 rounded bg-[#c8f53c]/15 text-[#c8f53c] border border-[#c8f53c]/30">Gemini Vision ✓</span>
            <span className="px-1.5 py-0.5 rounded bg-[#d8b375]/15 text-[#d8b375] border border-[#d8b375]/30">DeepSeek Proof</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">Groq Fallback</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
          <span>LaTeX KaTeX Rendered</span>
          <span className="text-[#d8b375]">Multi-Provider 99.8%</span>
        </div>
      </div>
    )
  }

  if (id === 'scholars-hub') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#080f0b] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f4f1ea_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#f4f1ea]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#f4f1ea] animate-pulse" />
            Scholars Hub · Surat
          </span>
          <span className="text-[10px] text-[#d8b375]">CLASS 8–12</span>
        </div>

        <div className="relative z-10 my-auto py-2 space-y-1.5">
          <div className="p-2.5 rounded bg-white/[0.04] border border-white/10">
            <div className="text-[12px] font-sans font-semibold text-[#f4f1ea]">Foundation &amp; Board Excellence</div>
            <div className="text-[10px] text-white/60 font-sans mt-0.5">Comprehensive Science &amp; Mathematics Coaching</div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
            <div className="p-1 rounded bg-[#0f1a13] border border-white/10 text-[#f4f1ea]">8th–10th Board</div>
            <div className="p-1 rounded bg-[#0f1a13] border border-white/10 text-[#f4f1ea]">11th–12th Sci</div>
            <div className="p-1 rounded bg-[#0f1a13] border border-[#d8b375]/30 text-[#d8b375]">JEE / NEET</div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
          <span>Client Architecture</span>
          <span className="text-[#f4f1ea]">98+ Lighthouse</span>
        </div>
      </div>
    )
  }

  if (id === 'particle-storm') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#060b08] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-36 h-36 rounded-full border border-dashed border-[#8be28a] animate-spin [animation-duration:20s]" />
          <div className="w-24 h-24 rounded-full border border-[#c8f53c] absolute animate-spin [animation-duration:12s] [animation-direction:reverse]" />
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#8be28a]/40 to-[#c8f53c]/40 blur-md absolute" />
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#8be28a]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#8be28a]" />
            MediaPipe · Hands
          </span>
          <span className="text-[10px] text-white/40">3,000 PARTICLES</span>
        </div>

        <div className="relative z-10 my-auto text-center py-2">
          <div className="inline-block px-2.5 py-1 rounded-full bg-[#0d1811] border border-[#8be28a]/40 text-[10px] text-[#e8fce0]">
            🖐️ Pinch = Singularity · Open = Supernova
          </div>
          <div className="text-[10px] text-white/60 mt-1 font-sans">
            In-Browser Spatial Kinetic Physics
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
          <span>Vector Euler Integration</span>
          <span className="text-[#8be28a]">60 FPS WASM</span>
        </div>
      </div>
    )
  }

  if (id === 'virtual-blackboard') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#060d09] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#c8f53c]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c]" />
            Virtual Blackboard
          </span>
          <span className="text-[10px] text-white/40">AIR DRAWING</span>
        </div>

        <div className="relative z-10 my-auto py-2">
          {/* Neon air drawing stroke */}
          <svg className="w-full h-16" viewBox="0 0 200 60">
            <path
              d="M 20 40 Q 60 10 100 35 T 180 20"
              fill="none"
              stroke="#c8f53c"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_#c8f53c]"
            />
            <circle cx="180" cy="20" r="4" fill="#8be28a" className="animate-ping" />
          </svg>
          <div className="flex items-center justify-between text-[9px] text-white/60 px-1">
            <span>Index Extended: Draw</span>
            <span>Two Fingers: Select Color</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
          <span>Python CV + HTML5 Canvas</span>
          <span className="text-[#c8f53c]">Bézier Splines</span>
        </div>
      </div>
    )
  }

  if (id === 'speak-smart-club') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#0a120d] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#d8b375]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#d8b375]" />
            Speak Smart Club
          </span>
          <span className="text-[10px] text-white/40">COMMUNICATION</span>
        </div>

        <div className="relative z-10 my-auto py-2 space-y-1.5">
          <div className="p-2.5 rounded bg-white/[0.03] border border-white/10">
            <div className="text-[12px] font-sans font-semibold text-[#f4f1ea]">English Fluency &amp; Confidence</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8f53c]" />
              <span className="text-[9.5px] text-[#c8f53c]">Interactive Batch Schedules Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-white/50 px-1">
            <span>• Weekend Executive</span>
            <span>• Daily Foundation</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
          <span>Client Deployment</span>
          <span className="text-[#d8b375]">WhatsApp Funnel</span>
        </div>
      </div>
    )
  }

  if (id === 'agentic-mcp-explorer') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#070c09] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#c8f53c]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#c8f53c]" />
            MCP Protocol Lab
          </span>
          <span className="text-[10px] text-[#c8f53c]">18 ANTHROPIC CERTS</span>
        </div>

        <div className="relative z-10 my-auto py-2 space-y-1 text-[10px]">
          <div className="text-white/40 font-mono text-[9px]">// JSON-RPC 2.0 stdio stream</div>
          <div className="p-1.5 rounded bg-black/50 border border-white/10 text-white/80 font-mono text-[9.5px]">
            &gt; tools/list: [db_query, git_diff, file_read]
          </div>
          <div className="p-1.5 rounded bg-[#0e1912] border border-[#c8f53c]/30 text-[#e8fce0] font-mono text-[9.5px]">
            ✓ Agent Subtask delegated to child context
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
          <span>Claude Agent SDK · Python</span>
          <span className="text-[#c8f53c]">Model Context Protocol</span>
        </div>
      </div>
    )
  }

  if (id === 'cybernetic-audiovisual-lab') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#07100b] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#8be28a]">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#8be28a]" />
            GLSL Shaders &amp; Audio
          </span>
          <span className="text-[10px] text-white/40">WEBGL 2.0</span>
        </div>

        <div className="relative z-10 my-auto py-2 text-center">
          <div className="flex items-end justify-center gap-1 h-12 mb-1">
            {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 80, 50].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-t bg-gradient-to-t from-[#8be28a] to-[#c8f53c]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="text-[10px] text-white/60">Simplex Noise Volumetric Mesh</div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/50">
          <span>Web Audio API · Three.js</span>
          <span className="text-[#8be28a]">Real-time FFT</span>
        </div>
      </div>
    )
  }

  // Dynamic visual preview for auto-synced GitHub repositories & hosted deployments
  const accent = project.color || '#c8f53c'
  const isLive = Boolean(project.link && project.link.startsWith('http'))
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#070c09] rounded-xl flex flex-col justify-between p-4 font-mono select-none ${className}`}>
      <div
        className="absolute inset-0 opacity-15 [background-size:16px_16px]"
        style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)` }}
      />

      <div className="relative z-10 flex items-center justify-between gap-1.5 text-[10.5px]" style={{ color: accent }}>
        <span className="flex items-center gap-1 font-semibold truncate">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: accent }} />
          <span className="truncate">{project.repoLanguage || project.stack?.[0] || 'GitHub'}</span>
        </span>
        <span className="text-[9px] text-white/50 shrink-0">
          {isLive ? 'LIVE' : 'REPO'}
        </span>
      </div>

      <div className="relative z-10 my-auto py-2 space-y-1.5">
        <div className="p-2 rounded bg-white/[0.03] border border-white/10">
          <div className="text-[11.5px] font-sans font-semibold text-[#f4f1ea] truncate">
            {project.title}
          </div>
          <div className="text-[9.5px] text-white/60 font-sans line-clamp-2 mt-0.5 leading-snug">
            {project.description}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[9.5px] text-white/50">
        <span className="truncate">{project.githubRepoName || project.id}</span>
        <span style={{ color: accent }} className="shrink-0">
          {project.updatedRelative ? `Pushed ${project.updatedRelative}` : 'GitHub Sync'}
        </span>
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { projects as staticProjects } from '../data/projects'

const GITHUB_USERNAME = 'parshvashah2008'
const CACHE_KEY = 'parshva_github_universe_cache_v3'
const CACHE_DURATION_MS = 60 * 1000 // 1 minute so new repos & GitHub Pages deployments appear rapidly

const EXCLUDED_REPOS = new Set([
  'parshva-portfolio',
  'parshvashah',
  '.github',
])

const REPO_ALIAS_TO_CASE_STUDY_ID = {
  'scholars-hub---website': 'scholars-hub',
  'scholars-hub': 'scholars-hub',
  'whatsapp-bot': 'whatsapp-bot',
  'jee-doubt-solver': 'jee-doubt-solver',
  'particle-storm': 'particle-storm',
  'virtual-blackboard': 'virtual-blackboard',
  'speak-smart-club': 'speak-smart-club',
}

const KNOWN_LIVE_URLS = {
  'safar-ai': 'https://safar-ai.netlify.app/',
}

const TECH_RATIONALE_MAP = {
  JavaScript: 'Direct event-loop & Web API control in native ES modules without heavy runtime framework overhead.',
  TypeScript: 'End-to-end compile-time type contracts catching state, prop, and API schema bugs before deploy.',
  Python: 'Rapid numerical, AI/ML pipeline iteration and async backend service composition.',
  HTML: 'Semantic, zero-overhead markup foundation optimized for immediate first-paint rendering.',
  CSS: 'Hardware-accelerated transitions and clean custom visual tokens with zero runtime style cost.',
  'Three.js': 'GPU-accelerated WebGL scene graph, spatial culling, and camera math for interactive 3D rendering.',
  'WebRTC / STUN': 'Direct peer-to-peer data channels with STUN NAT traversal eliminating recurring server relay costs.',
  'Web Audio API': 'Sample-accurate procedural and spatial audio synthesis directly inside browser tabs.',
  'HTML5 Canvas': 'High-frequency 2D HUD overlays, crosshairs, and pixel-accurate telemetry rendering at 60 FPS.',
  'Next.js': 'Hybrid React App Router architecture delivering SEO-ready SSR, fast route prefetching, and edge bundling.',
  'Tailwind CSS': 'Utility-first atomic design system keeping CSS bundle footprint minimal across responsive viewports.',
  'Gemini API': 'Structured generative reasoning for multi-constraint synthesis with low inference latency.',
  Supabase: 'Managed PostgreSQL, SSR cookie auth sessions, and row-level security ready for multi-user scale.',
  Zod: 'Runtime boundary validation enforcing strict typed contracts on external API inputs and outputs.',
  'ONNX Runtime': 'Cross-platform quantized model execution optimized for edge CPUs and Snapdragon NPU acceleration.',
  OpenCV: 'Deterministic real-time computer vision preprocessing and frame-level motion/hazard inspection.',
  Arduino: 'Direct microcontroller serial telemetry bridging physical environmental sensors with software inference.',
  FastAPI: 'Async ASGI Python service layer delivering fast validation and predictable endpoint latency.',
  'GitHub Pages': 'Zero-cost, immutable CDN static hosting tied cleanly to version-controlled repository artifacts.',
  'GitHub Repo': 'Clean modular version history organized for reproducible builds and engineering handoff.',
}

const REPO_CASE_STUDY_BLUEPRINTS = {
  'voxfire-io': {
    title: 'VOXFIRE.io',
    subtitle: 'Browser-Native 3D Voxel First-Person Shooter with P2P WebRTC Multiplayer',
    category: 'Experiments',
    stack: ['Three.js', 'WebRTC / STUN', 'JavaScript ES6+', 'Web Audio API', 'HTML5 Canvas', 'GitHub Repo'],
    intro:
      'VOXFIRE.io is a browser-playable 3D blocky first-person shooter engineered to launch instantly from a URL without downloads or heavy dedicated game servers. It pairs a Three.js voxel engine with modular multiplayer room networking, bot AI, and 4 competitive modes.',
    overview:
      'Architected cleanly across decoupled ES modules (voxel core engine, net.js P2P synchronization layer, and menu.js mode/loadout orchestrator). Supports Free For All, Team Deathmatch, 4v4 Tactical Squads, and a 16-weapon Gun Game ladder with customizable match mutators (Low Gravity, Headshots Only) and invite-by-code rooms.',
    problem:
      'Browser FPS prototypes usually suffer from either bloated asset pipelines that stall first load or expensive WebSocket game servers required just to play with friends in two tabs.',
    whyBuilt:
      'To prove a real-time 3D multiplayer action experience can run smoothly inside a standard web browser while keeping infrastructure costs near zero via serverless WebRTC room discovery.',
    research:
      'Evaluated central authoritative WebSocket relays against peer-to-peer WebRTC DataChannels backed by public STUN ICE servers (Google & Cloudflare STUN). Chose P2P room codes (voxfire-room-*) with numeric precision quantization (r2/r3/r4 coordinate rounding) to minimize packet overhead.',
    pattern: 'Modular Client Simulation + Serverless P2P WebRTC Room Mesh',
    flow: [
      'Local Pointer-Lock FPS Input & Fixed-Step Loop',
      'Three.js Voxel Geometry & Hitbox Raycasting',
      'Coordinate Quantization (r2/r3/r4 Net Packing)',
      'STUN NAT Discovery & P2P Room Broadcast (net.js)',
    ],
    uiUx: 'Crisp tactical HUD, instant room-code invite sharing (?room=CODE), selectable weapon camos, and immediate mouse-capture feedback.',
    development: 'Structured around an explicit runtime namespace (window.__VOXFIRE__) isolating rendering, procedural sound, bot difficulty states, and WebRTC transport cleanly.',
    challenges: [
      'Bandwidth Bloat in P2P State Sync: Sending full 64-bit IEEE floats for every player transform saturates browser DataChannels rapidly.',
      'NAT Traversal Without Paid Infrastructure: Browser-to-browser connections across residential networks fail without reliable ICE negotiation.',
      'Zero-Download Asset Startup: Loading complex 3D weapons and maps cleanly inside initial browser memory limits.',
    ],
    solutions: [
      'Applied deterministic scalar precision rounding (r2/r3/r4 helper quantization in net.js) alongside throttled delta updates to compress transform payloads.',
      'Configured multi-provider STUN ICE fallback (Google STUN 19302 + Cloudflare STUN 3478) paired with deterministic upper-case invite room codes.',
      'Generated procedural voxel geometry, custom Three.js weapon models, and synthesized Web Audio effects directly in code to keep startup fast.',
    ],
    demonstration: [
      { label: '4 Game Modes', detail: 'FFA, Team Deathmatch, 4v4 T vs AT & 16-weapon Gun Game ladder.' },
      { label: 'Serverless P2P Lobbies', detail: 'Instant shareable room URLs (?room=...) over WebRTC DataChannels.' },
      { label: 'Bot AI & Mutators', detail: 'Offline/hybrid bot tiers plus Low Gravity and Headshots-Only rules.' },
    ],
    resultsLearnings:
      'Demonstrated practical mastery of 3D math, frame-time stability, WebRTC peer networking, and modular Vanilla ES engine boundaries without relying on heavy third-party game frameworks.',
    technicalQa: [
      {
        q: 'How would you scale VOXFIRE.io from casual P2P rooms to cheat-resistant competitive ranked play for our studio?',
        a: 'Keep Three.js rendering and local client prediction identical while swapping the thin net.js transport adapter to an authoritative WebSocket/WebRTC SFU tick server that validates line-of-sight raycasts and fire-rate cooldowns server-side.',
      },
      {
        q: 'Why build custom Three.js geometry and net.js quantization instead of importing a massive full-featured game engine?',
        a: 'Shipping a 15–40MB compiled runtime kills instant URL click-through conversion. Decoupled ES modules boot immediately, isolate bugs between rendering and transport, and keep bundle weight tiny.',
      },
      {
        q: 'What makes the networking layer maintainable when debugging desyncs across clients?',
        a: 'All room parsing, URL generation, and numeric precision clamping (r2/r3/r4) are centralized in net.js behind clean exports so transport fixes never entangle rendering or menu logic.',
      },
    ],
  },
  'safar-ai': {
    title: 'SAFAR AI',
    subtitle: 'Full-Stack AI Travel Architect for Personalized Budgets, Itineraries & Trip Discovery',
    category: 'AI & Machine Learning',
    stack: ['Next.js', 'TypeScript', 'Gemini API', 'Supabase', 'Zod', 'Tailwind CSS'],
    intro:
      'SAFAR AI transforms vague travel preferences into budget-validated, day-by-day itineraries with interactive trip discovery and AI copilot planning built on Next.js, TypeScript, Gemini, and Supabase.',
    overview:
      'End-to-end production web platform combining strict Zod request/response schemas, Gemini generative planning, SSR cookie authentication via Supabase, and a polished editorial Radix/Tailwind interface deployed to global edge infrastructure.',
    problem:
      'Generic chatbot prompts produce unformatted walls of text with hallucinated opening hours and broken daily budgets that users still have to manually put into spreadsheets.',
    whyBuilt:
      'To turn conversational AI into a structured, database-backed travel planning tool where constraints like duration, budget caps, and travel style drive verified UI cards directly.',
    research:
      'Combined Next.js App Router with @supabase/ssr session handling and Zod runtime validation so AI outputs conform reliably to typed itinerary models rather than brittle markdown text.',
    pattern: 'Typed Full-Stack Next.js App Router + Structured Gemini Inference + Supabase Storage',
    flow: [
      'Typed Client Travel Brief & Budget Input',
      'Zod Boundary Schema Validation',
      'Gemini Structured Itinerary Generation',
      'Supabase Auth & Trip State Persistence',
    ],
    uiUx: 'Editorial emerald/warm-cream design system with theme switching, interactive destination cards, trip budget breakdowns, and an integrated Copilot Concierge workflow.',
    development: 'Typed end-to-end in TypeScript with Radix UI primitives, Framer Motion transitions, and automated lint, typecheck, and test scripts in package.json.',
    challenges: [
      'Unpredictable LLM Response Formats: Free-form generative outputs easily break downstream UI itinerary and budget widgets.',
      'SSR Auth & Client State Sync: Keeping authenticated trip history consistent across Next.js server components and client interactions.',
      'Product-Grade UI Responsiveness: Supporting rich itinerary drawers, markdown, tooltips, and dark/light themes cleanly.',
    ],
    solutions: [
      'Enforced Zod validation schemas at the boundary between Gemini API responses and React state so malformed generations fail safely or recover cleanly.',
      'Integrated @supabase/ssr cookie session adapters alongside @supabase/supabase-js for seamless SSR-safe user state persistence.',
      'Standardized interactive overlays on Radix UI accessible primitives, Framer Motion, and Tailwind CSS typography utilities.',
    ],
    demonstration: [
      { label: 'AI Copilot & Planner', detail: 'Generates structured multi-day itineraries tuned to user budget constraints.' },
      { label: 'Type-Safe Full Stack', detail: 'End-to-end TypeScript + Zod validation across Gemini & Supabase layers.' },
      { label: 'Automated Checks', detail: 'Configured lint, typecheck, and test pipelines alongside GitHub Pages/Netlify.' },
    ],
    resultsLearnings:
      'Proved how wrapping LLM APIs in strict Zod contracts, SSR persistence, and domain-specific UI workflows turns raw prompts into a reliable, shippable SaaS product.',
    technicalQa: [
      {
        q: 'How does SAFAR AI prevent LLM hallucinations from crashing frontend budget and itinerary cards?',
        a: 'Every generative payload passes through strict Zod schema guards before hydration, separating transport validation from UI rendering and giving predictable fallbacks on edge cases.',
      },
      {
        q: 'If our company acquired or expanded SAFAR AI, how ready is the codebase for production team handoff?',
        a: 'Built on mainstream maintainable primitives — Next.js, TypeScript, Supabase PostgreSQL/SSR auth, Radix UI, plus dedicated typecheck, lint, and test scripts in package.json — allowing zero friction onboarding.',
      },
      {
        q: 'Why combine Gemini inference with Supabase instead of keeping trips in stateless browser storage?',
        a: 'Persisting structured user plans in Postgres behind Supabase SSR lets users revisit, compare, and share trips across devices while laying the groundwork for collaborative booking workflows.',
      },
    ],
  },
  aegisgrid: {
    title: 'AegisGrid',
    subtitle: 'Privacy-First Offline Multimodal AI Safety Copilot for Snapdragon Edge PCs',
    category: 'AI & Machine Learning',
    stack: ['Python', 'ONNX Runtime', 'OpenCV', 'Audio Classification', 'Arduino', 'FastAPI'],
    intro:
      'AegisGrid (MVP: LabShield) is an edge-native safety monitoring system designed to detect smoke, fire, and lab hazards locally on Snapdragon PCs by fusing computer vision, audio classification, and Arduino environmental telemetry completely offline.',
    overview:
      'Runs 100% locally without cloud round-trips so sensitive lab or home camera feeds never leave the device. Combines OpenCV visual inspection, local acoustic event inference, and real-time Arduino UNO temperature/air-quality readings into a unified explainable risk score.',
    problem:
      'Cloud-based safety cameras introduce unacceptable privacy risks, recurring bandwidth costs, and fatal latency or outages during network failures — especially in critical hazard scenarios.',
    whyBuilt:
      'To harness local ONNX Runtime NPU acceleration alongside inexpensive physical microcontrollers, proving privacy-first multimodal safety monitoring is practical on edge hardware.',
    research:
      'Selected ONNX Runtime targeting Snapdragon hardware acceleration paired with deterministic OpenCV preprocessing and physical Arduino UNO sensor verification to reduce false alarms caused by any single sensor alone.',
    pattern: 'Offline Multimodal Sensor-Fusion & Edge Inference Pipeline',
    flow: [
      'OpenCV Camera Stream + Audio Buffer Capture',
      'Arduino UNO Temp & Air-Quality Serial Read',
      'Local ONNX Runtime Edge Inference',
      'Explainable Multimodal Risk Scoring & Alert Trigger',
    ],
    uiUx: 'Real-time LabShield operator dashboard exposing live sensor streams, contributing risk weights (explainability), and immediate physical/local alerts.',
    development: 'Built cleanly in Python bridging FastAPI/Streamlit serving with OpenCV computer vision pipelines, audio classification, and embedded Arduino alert firmware.',
    challenges: [
      'False Positives From Single Sensors: Visual steam or sudden loud noises can individually trigger false alarms if evaluated in isolation.',
      'Edge Latency Without Cloud GPUs: Running vision and audio inference concurrently must stay responsive within local device thermal/CPU budgets.',
      'Opaque Risk Decisions: Operators need to know why an alert fired (smoke visual vs thermal spike) rather than a black-box siren.',
    ],
    solutions: [
      'Implemented multimodal fusion requiring corroborating signals across camera vision, audio classification, and Arduino temperature/air-quality sensors.',
      'Targeted ONNX Runtime model execution for hardware-accelerated Snapdragon inference with zero external network dependencies.',
      'Designed an explainable weighted risk-scoring layer powering both the dashboard readout and Arduino physical alert output.',
    ],
    demonstration: [
      { label: 'Zero-Cloud Privacy', detail: '100% offline processing — raw video and audio never leave the machine.' },
      { label: 'LabShield Smoke/Fire MVP', detail: 'Fuses vision, audio, temperature & air-quality into live risk alerts.' },
      { label: 'Hardware + AI Integration', detail: 'Connects Arduino UNO serial sensors directly to ONNX edge models.' },
    ],
    resultsLearnings:
      'Strengthened practical edge systems thinking: cross-domain fusion beats single-model complexity, and ONNX + microcontroller telemetry creates resilient physical-digital AI systems.',
    technicalQa: [
      {
        q: 'Why fuse Arduino temperature/air-quality sensors with OpenCV and audio instead of just training a heavier vision model?',
        a: 'Hardware sensors provide unambiguous physical ground truth (heat + particulates) at near-zero compute cost, eliminating false smoke triggers from lighting glare or steam while keeping edge compute lean.',
      },
      {
        q: 'How does AegisGrid guarantee enterprise privacy compliance for sensitive labs or industrial sites?',
        a: 'Because ONNX inference, OpenCV streams, and FastAPI/Streamlit dashboards execute completely offline on local hardware, raw audio/video feeds never cross public internet boundaries.',
      },
      {
        q: 'What makes this architecture valuable to an edge AI / IoT engineering team?',
        a: 'It bridges three layers few engineers handle together cleanly: embedded microcontroller telemetry (Arduino), optimized local AI runtime (ONNX Runtime), and real-time operator dashboards.',
      },
    ],
  },
}

const DOMAIN_PLAYBOOKS = {
  'AI & Machine Learning': {
    pattern: 'Modular Inference Pipeline + Deterministic Guardrails',
    problemPrefix: 'Unstructured model outputs, latency bottlenecks, and tight validation boundaries across intelligent workflows for',
    whyBuilt: 'Built to bridge raw AI capabilities into predictable, verifiable user software with transparent architecture and source control.',
    research: 'Evaluated inference boundaries, schema contracts, and fallback strategies to balance capability with predictable latency.',
    challenges: [
      'Model Output Reliability: Probabilistic outputs need strict boundary validation before reaching application state.',
      'Latency vs Cost Trade-offs: Real-time user flows degrade quickly without structured caching and concise payload routing.',
    ],
    solutions: [
      'Isolated model invocation behind typed validation and deterministic fallback layers so UI state never breaks cleanly.',
      'Kept client/server boundaries modular for easy provider upgrades, observability, and quantized edge/API scaling.',
    ],
    technicalQa: [
      {
        q: 'How do you make AI-powered projects reliable enough for production teams?',
        a: 'By separating model orchestration behind explicit input/output contracts, deterministic error recovery, and version-controlled environments on GitHub.',
      },
      {
        q: 'How fast could a team extend this repository for enterprise workloads?',
        a: 'Because inference and UI logic remain cleanly decoupled, swapping model providers, adding rate limits, or attaching observability takes minimal refactoring.',
      },
    ],
  },
  Experiments: {
    pattern: 'Real-Time Interactive Rendering Loop + Modular State Core',
    problemPrefix: 'Achieving responsive frame rates and tactile browser interactivity without bloated frameworks in',
    whyBuilt: 'Engineered to push interactive graphics, physics, and latency discipline inside native web runtimes.',
    research: 'Benchmarked render loop overhead, GPU/canvas allocation patterns, and zero-dependency ES modularity.',
    challenges: [
      'Frame-Time Stability: Avoiding garbage-collection spikes or heavy DOM churn inside 60 FPS interactive loops.',
      'Immediate Browser Portability: Delivering rich interactive behavior across screens without heavy install steps.',
    ],
    solutions: [
      'Decoupled compute/update ticks cleanly from presentation and reused object allocations inside animation frames.',
      'Packaged lightweight static assets ready for CDN and GitHub Pages delivery.',
    ],
    technicalQa: [
      {
        q: 'Why invest time in low-level interactive graphics and simulation experiments?',
        a: 'Building 60 FPS loops from scratch sharpens deep browser debugging, GPU memory intuition, and state-synchronization skills that transfer directly into demanding product engineering.',
      },
      {
        q: 'How are real-time failures or lag handled gracefully?',
        a: 'Delta-time clamping, decoupled update state, and browser-native feature detection keep simulation physics stable regardless of display refresh rate.',
      },
    ],
  },
  'SaaS & Products': {
    pattern: 'Scalable Product Service Layer + Responsive Client Delivery',
    problemPrefix: 'Converting messy operational manual workflows into repeatable, maintainable product infrastructure for',
    whyBuilt: 'Created to solve real end-user friction with pragmatic product scope, clean UX, and reliable deployment.',
    research: 'Modeled core domain entities and streamlined onboarding steps to reduce cognitive load on real users.',
    challenges: [
      'Maintainability Under Growth: Feature creep creates tight coupling between UI views and backend business rules.',
      'Zero-Friction Onboarding: Users abandon tools that demand complex setup before showing immediate value.',
    ],
    solutions: [
      'Organized core logic into self-contained modules with clear boundaries for configuration and data persistence.',
      'Shipped clean responsive interfaces backed by repeatable CDN/cloud deployments.',
    ],
    technicalQa: [
      {
        q: 'How do you balance shipping velocity with clean architecture on product builds?',
        a: 'Keep business state explicit, avoid premature over-abstraction, and ship iterative end-to-end slices verified in real browser and API runs.',
      },
      {
        q: 'What does this project show a hiring company about product ownership?',
        a: 'End-to-end execution from identifying user pain points and data modeling to live deployment and documentation.',
      },
    ],
  },
  'Web Development': {
    pattern: 'Static / Edge-Delivered Frontend Architecture',
    problemPrefix: 'Delivering fast, accessible, zero-clutter web experiences across desktop and mobile devices for',
    whyBuilt: 'Shipped publicly to combine responsive visual design discipline with reliable static edge delivery.',
    research: 'Prioritized lightweight bundle footprints, semantic structure, and instant first-paint performance across devices.',
    challenges: [
      'Cross-Viewport Responsiveness: Maintaining editorial hierarchy and crisp typography from narrow mobile screens to wide desktops.',
      'Fast Global Delivery: Eliminating backend cold starts for content-forward or interactive web apps.',
    ],
    solutions: [
      'Used mobile-first CSS tokens, semantic markup, and hardware-accelerated layout primitives.',
      'Automated static bundle output configured cleanly for CDN and GitHub Pages hosting.',
    ],
    technicalQa: [
      {
        q: 'What engineering habits keep your frontend work maintainable for larger teams?',
        a: 'Modular component isolation, responsive testing across real viewports, zero external bloat, and consistent styling tokens.',
      },
      {
        q: 'How do you verify a web deployment before considering it shipped?',
        a: 'Checking live production builds across mobile and desktop viewports for layout stability, interactive accessibility, and clean console logs.',
      },
    ],
  },
}

const PALETTE_ROTATION = [
  ['#c8f53c', '#8be28a'],
  ['#d8b375', '#f4f1ea'],
  ['#8be28a', '#c8f53c'],
  ['#f4f1ea', '#d8b375'],
]

let inflightFetchPromise = null

const DEFAULT_STATS = {
  username: GITHUB_USERNAME,
  publicRepos: 6,
  followers: 0,
  latestRepo: 'parshva-portfolio',
  latestPushedAt: 'Today',
  statusText: 'Active Builder · Code pushed today to GitHub',
  profileUrl: `https://github.com/${GITHUB_USERNAME}`,
  topLanguages: ['JavaScript', 'TypeScript', 'HTML', 'Python'],
  isLive: false,
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Today'
  const date = new Date(dateString)
  const now = new Date()
  const diffSec = Math.floor((now - date) / 1000)

  if (diffSec < 3600) {
    const mins = Math.max(1, Math.floor(diffSec / 60))
    return `${mins}m ago`
  }
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600)
    return `${hours}h ago`
  }
  const days = Math.floor(diffSec / 86400)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function normalizeSlug(str = '') {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function formatRepoTitle(repo) {
  const rawName = repo.name || 'GitHub Project'
  const descHead = (repo.description || '').split(/[—–-]/)[0]?.trim()
  if (descHead && descHead.length <= 24 && descHead.toLowerCase().includes(rawName.split('-')[0].toLowerCase())) {
    return descHead
  }
  return rawName
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => {
      if (['ai', 'ml', 'io', 'api', 'ui', '3d', 'mcp', 'fps'].includes(part.toLowerCase())) {
        return part.toUpperCase()
      }
      if (/[A-Z]/.test(part.slice(1))) return part // preserve CamelCase like AegisGrid
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(' ')
    .replace(/\s+IO$/i, '.io')
}

function resolveRepoLiveUrl(repo) {
  const rawHomepage = (repo.homepage || '').trim()
  if (rawHomepage && /^https?:\/\//i.test(rawHomepage)) {
    return rawHomepage
  }
  // Prefer official GitHub Pages URL whenever a repository is hosted on GitHub Pages
  if (repo.has_pages) {
    return `https://${GITHUB_USERNAME}.github.io/${repo.name}/`
  }
  const key = (repo.name || '').toLowerCase()
  if (KNOWN_LIVE_URLS[key]) {
    return KNOWN_LIVE_URLS[key]
  }
  return ''
}

function inferRepoCategory(repo) {
  const text = `${repo.name || ''} ${repo.description || ''} ${(repo.topics || []).join(' ')} ${repo.language || ''}`
  if (/\b(ai|ml|llm|copilot|gpt|claude|mcp|agent|rag|neural|vision|ocr|opencv|mediapipe|safar|aegis)\b/i.test(text)) {
    return 'AI & Machine Learning'
  }
  if (/\b(three|webgl|glsl|shader|fps|game|voxel|audio|canvas|3d|experiment|particle|voxfire)\b/i.test(text)) {
    return 'Experiments'
  }
  if (/\b(saas|bot|platform|dashboard|planner|crm|tenant|engine|api|backend|fastapi)\b/i.test(text)) {
    return 'SaaS & Products'
  }
  return 'Web Development'
}

function buildProjectFromRepo(repo, indexNum, slotOffset) {
  const slugKey = (repo.name || '').toLowerCase()
  const blueprint = REPO_CASE_STUDY_BLUEPRINTS[slugKey] || null
  const liveUrl = resolveRepoLiveUrl(repo)
  const category = blueprint?.category || inferRepoCategory(repo)
  const playbook = DOMAIN_PLAYBOOKS[category] || DOMAIN_PLAYBOOKS['Web Development']
  const title = blueprint?.title || formatRepoTitle(repo)
  const summary =
    repo.description ||
    blueprint?.overview ||
    `Open-source ${repo.language || 'software'} application engineered and shipped publicly on GitHub.`
  const [color, secondaryColor] = PALETTE_ROTATION[slotOffset % PALETTE_ROTATION.length]
  const year = repo.pushed_at ? String(new Date(repo.pushed_at).getFullYear()) : '2026'
  const topicTags = Array.isArray(repo.topics) ? repo.topics.slice(0, 3) : []
  const stack = blueprint?.stack
    ? [...blueprint.stack]
    : Array.from(
        new Set(
          [
            repo.language || 'JavaScript',
            ...topicTags,
            repo.has_pages ? 'GitHub Pages' : null,
            'GitHub Repo',
          ].filter(Boolean)
        )
      ).slice(0, 5)

  const challenges = blueprint?.challenges || playbook.challenges
  const solutions = blueprint?.solutions || playbook.solutions
  const technicalQa = blueprint?.technicalQa || playbook.technicalQa
  const archFlow = blueprint?.flow || [
    `${repo.language || 'Source'} Application Layer`,
    'Validated State & Logic Processing',
    liveUrl ? 'Static Edge / GitHub Pages Delivery' : 'Modular GitHub Artifact Release',
  ]

  return {
    id: `gh-${normalizeSlug(repo.name)}`,
    num: String(indexNum).padStart(2, '0'),
    title,
    subtitle:
      blueprint?.subtitle ||
      (liveUrl
        ? `Live Hosted ${category} Build · ${repo.language || 'Web Stack'}`
        : `${category} System · ${repo.language || 'Open Source'}`),
    tag: liveUrl ? (liveUrl.includes('github.io') ? 'GitHub Pages' : 'Live Deployed') : 'Public Repo',
    category,
    year,
    status: liveUrl ? 'Live Public Deployment' : 'Open Source Architecture',
    stack,
    description: summary,
    link: liveUrl,
    linkLabel: liveUrl.includes('github.io') ? 'View GitHub Pages' : 'Open Live App',
    github: repo.html_url,
    color,
    secondaryColor,
    isGitHubSynced: true,
    githubRepoName: repo.name,
    repoStars: repo.stargazers_count || 0,
    repoForks: repo.forks_count || 0,
    repoLanguage: repo.language || (blueprint?.stack?.[0] || 'Web'),
    updatedRelative: formatRelativeTime(repo.pushed_at || repo.updated_at),
    sections: {
      intro: blueprint?.intro || summary,
      heroVisual: {
        headline: blueprint?.subtitle || `${title} — Production Architecture & Source Walkthrough`,
        caption: `Verified repository at github.com/${GITHUB_USERNAME}/${repo.name} · Updated ${formatRelativeTime(repo.pushed_at || repo.updated_at)}.`,
      },
      overview: blueprint?.overview || summary,
      problem: blueprint?.problem || `${playbook.problemPrefix} ${title}.`,
      whyBuilt: blueprint?.whyBuilt || playbook.whyBuilt,
      research: blueprint?.research || playbook.research,
      architecture: {
        pattern: blueprint?.pattern || playbook.pattern,
        description:
          blueprint?.overview ||
          `Structured modular codebase combining ${stack.slice(0, 3).join(', ')} with clear separation between core logic and interface delivery.`,
        flow: archFlow,
      },
      uiUx: blueprint?.uiUx || 'Designed with responsive clarity, accessible interaction states, and clean visual hierarchy.',
      development:
        blueprint?.development ||
        `Engineered on ${repo.default_branch || 'main'} in ${repo.language || 'modern web'} tooling with clean modular boundaries.`,
      techStackDetails: stack.map((item) => ({
        name: item,
        role:
          TECH_RATIONALE_MAP[item] ||
          `Selected for dependable ${category.toLowerCase()} delivery within ${title}'s architecture.`,
      })),
      challenges,
      solutions,
      technicalQa,
      demonstration: blueprint?.demonstration || [
        { label: 'Domain Focus', detail: category },
        { label: 'Primary Stack', detail: stack.slice(0, 3).join(' · ') },
        { label: 'Delivery Status', detail: liveUrl ? 'Live Public URL Active' : `Active Repo (${formatRelativeTime(repo.pushed_at || repo.updated_at)})` },
      ],
      resultsLearnings:
        blueprint?.resultsLearnings ||
        `Demonstrates end-to-end ownership of ${category.toLowerCase()} architecture — turning clean engineering constraints into shippable, verifiable code.`,
    },
  }
}

export function buildMergedProjects(repos = []) {
  const enrichedStatic = staticProjects.map((proj) => ({ ...proj }))
  const matchedIds = new Set()

  // Match any existing GitHub repos against curated caseStudies first so they never duplicate
  repos.forEach((repo) => {
    const lowerName = (repo.name || '').toLowerCase()
    const aliasedId = REPO_ALIAS_TO_CASE_STUDY_ID[lowerName]
    const slug = normalizeSlug(repo.name)
    const idx = enrichedStatic.findIndex(
      (p) => p.id === aliasedId || normalizeSlug(p.id) === slug || normalizeSlug(p.title) === slug
    )
    if (idx !== -1) {
      matchedIds.add(repo.name.toLowerCase())
      enrichedStatic[idx] = {
        ...enrichedStatic[idx],
        github: repo.html_url || enrichedStatic[idx].github,
        repoStars: repo.stargazers_count || 0,
        updatedRelative: formatRelativeTime(repo.pushed_at || repo.updated_at),
      }
    }
  })

  // Append newly pushed / hosted GitHub repos automatically into The Work & 3D Sphere Universe
  const syncedRepos = repos
    .filter((repo) => {
      const lower = (repo.name || '').toLowerCase()
      if (EXCLUDED_REPOS.has(lower) || matchedIds.has(lower)) return false
      if (repo.archived || repo.disabled) return false
      // Include all original repos, or hosted forks
      if (repo.fork && !repo.homepage && !repo.has_pages) return false
      return true
    })
    .map((repo, idx) =>
      buildProjectFromRepo(repo, enrichedStatic.length + idx + 1, idx)
    )

  return {
    projects: [...enrichedStatic, ...syncedRepos],
    syncedCount: syncedRepos.length,
  }
}

export async function fetchGitHubPortfolioData({ force = false } = {}) {
  if (typeof window === 'undefined') {
    return {
      stats: DEFAULT_STATS,
      projects: staticProjects,
      syncedCount: 0,
      lastSyncedAt: null,
    }
  }

  if (!force) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.timestamp < CACHE_DURATION_MS && Array.isArray(parsed.repos)) {
          const { projects, syncedCount } = buildMergedProjects(parsed.repos)
          return {
            stats: { ...parsed.stats, isLive: true },
            projects,
            syncedCount,
            lastSyncedAt: parsed.timestamp,
          }
        }
      }
    } catch (e) {
      // Ignore storage errors
    }

    if (inflightFetchPromise) return inflightFetchPromise
  }

  const runFetch = async () => {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
      ])

      if (!userRes.ok || !reposRes.ok) {
        return {
          stats: DEFAULT_STATS,
          projects: staticProjects,
          syncedCount: 0,
          lastSyncedAt: null,
        }
      }

      const userData = await userRes.json()
      const reposData = await reposRes.json()
      const repos = Array.isArray(reposData) ? reposData : []

      const latestRepo = repos.length > 0 ? repos[0] : null
      const relativePush = latestRepo ? formatRelativeTime(latestRepo.pushed_at || latestRepo.updated_at) : 'Today'
      const languages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean)))

      const stats = {
        username: userData.login || GITHUB_USERNAME,
        publicRepos: userData.public_repos || DEFAULT_STATS.publicRepos,
        followers: userData.followers || 0,
        latestRepo: latestRepo?.name || DEFAULT_STATS.latestRepo,
        latestPushedAt: relativePush,
        statusText: `Pushed ${relativePush} to ${latestRepo?.name || 'GitHub'}`,
        profileUrl: userData.html_url || DEFAULT_STATS.profileUrl,
        topLanguages: languages.length > 0 ? languages.slice(0, 4) : DEFAULT_STATS.topLanguages,
        isLive: true,
      }

      const nowTs = Date.now()
      try {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: nowTs, stats, repos })
        )
      } catch (e) {
        // Ignore quota errors
      }

      const { projects, syncedCount } = buildMergedProjects(repos)
      return { stats, projects, syncedCount, lastSyncedAt: nowTs }
    } catch (err) {
      console.debug('GitHub sync fallback:', err)
      return {
        stats: DEFAULT_STATS,
        projects: staticProjects,
        syncedCount: 0,
        lastSyncedAt: null,
      }
    } finally {
      inflightFetchPromise = null
    }
  }

  inflightFetchPromise = runFetch()
  return inflightFetchPromise
}

export async function fetchGitHubStats() {
  const data = await fetchGitHubPortfolioData()
  return data.stats
}

/**
 * React hook for live GitHub statistics
 */
export function useGitHubStats() {
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    let isMounted = true
    fetchGitHubPortfolioData().then((data) => {
      if (isMounted && data?.stats) setStats(data.stats)
    })
    return () => {
      isMounted = false
    }
  }, [])

  return stats
}

/**
 * React hook returning curated case studies seamlessly merged with all live GitHub repos
 */
export function usePortfolioProjects() {
  const [state, setState] = useState(() => ({
    projects: staticProjects,
    syncedCount: 0,
    isLoading: true,
    lastSyncedAt: null,
  }))

  const loadProjects = useCallback((force = false) => {
    let cancelled = false
    if (force) {
      setState((prev) => ({ ...prev, isLoading: true }))
    }
    fetchGitHubPortfolioData({ force }).then((data) => {
      if (cancelled) return
      setState({
        projects: data.projects,
        syncedCount: data.syncedCount,
        isLoading: false,
        lastSyncedAt: data.lastSyncedAt,
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const cancel = loadProjects(false)
    return cancel
  }, [loadProjects])

  const refreshProjects = useCallback(() => loadProjects(true), [loadProjects])

  return { ...state, refreshProjects }
}

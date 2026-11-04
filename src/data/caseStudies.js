/**
 * Parshva Shah — Comprehensive Project Archive & Case Studies
 * Each case study follows the complete 16-point editorial structure:
 * 01. Intro  02. Hero/Visual  03. Overview  04. Problem  05. Why Built
 * 06. Research  07. Architecture  08. UI/UX  09. Development  10. Tech Stack
 * 11. Challenges  12. Solutions  13. Demonstration  14. Results & Learnings
 * 15. Links  16. Navigation
 */

export const caseStudies = [
  {
    id: 'whatsapp-bot',
    num: '01',
    title: 'Multi-Tenant WhatsApp Bot',
    subtitle: 'Config-Driven Finite State Machine Engine for Local Business Automation',
    tag: 'SaaS Engine',
    category: 'SaaS & Products',
    year: '2026',
    status: 'Live Demo & Production Ready',
    color: '#c8f53c',
    secondaryColor: '#8ba352',
    stack: ['FastAPI', 'SQLAlchemy', 'Twilio Webhooks', 'Python 3.12', 'Pydantic v2', 'PostgreSQL'],
    liveUrl: 'https://github.com/parshvashah2008',
    linkLabel: 'Architecture Spec',
    githubUrl: 'https://github.com/parshvashah2008',
    summary: 'A configuration-driven FSM engine enabling one FastAPI instance to onboard unlimited local businesses via isolated JSON declarative state schemas.',
    
    // 16-Point Case Study Breakdown
    sections: {
      intro: 'In urban India, millions of local service businesses—salons, coaching centers, textile wholesalers, clinics—run 90% of their customer interactions over WhatsApp. Yet existing automation software is either overpriced enterprise SaaS (e.g., Yellow.ai, Wati) or fragile no-code Zapier zaps that break on state conflicts. I designed and implemented a production-grade, multi-tenant conversational engine built entirely from first principles.',
      heroVisual: {
        headline: 'Declarative State Engine Handling Complex Multi-Branch Dialogues',
        caption: 'Architecture isolates client routing, user state persistence, and Twilio webhooks behind a zero-redeploy configuration schema.'
      },
      overview: 'The Multi-Tenant WhatsApp Bot is a backend system written in FastAPI and SQLAlchemy. A single server deployment can serve completely distinct companies simultaneously. Each tenant defines its dialogue tree, data validation rules, trigger keywords, and booking slots inside an isolated JSON configuration schema. Incoming Twilio webhooks are authenticated, matched to the recipient business phone number, routed to the tenant\'s active FSM graph, and executed atomically.',
      problem: 'Every business has bespoke dialogue requirements: a salon needs appointment time slot validation and stylist assignment; a tuition institute needs syllabus brochures and batch selection; a textile shop needs catalog PDFs and bulk inquiries. Building bespoke bots for each client results in maintenance sprawl and technical debt. Conversely, rigid bot builders fail when clients ask for custom database queries or payment hooks.',
      whyBuilt: 'During my independent freelance work with local businesses in Mumbai and Surat, I noticed owners wasting 3 to 5 hours daily answering the exact same 10 repetitive queries. I wanted to build an engine that I could deploy once, configure in 15 minutes per client via declarative JSON, and host on affordable infrastructure with zero marginal per-client server cost.',
      research: 'I evaluated existing state machine libraries (such as transitions and pytransitions) and found them unsuitable for stateless multi-tenant webhooks where thousands of concurrent users occupy different nodes across different business graphs. The decision was made to design an explicit Declarative Graph schema where node states, input validators (regex, datetime, choice lists), and side-effects (email notifications, database write) are decoupled from the HTTP transport.',
      architecture: {
        pattern: 'Hexagonal / Ports & Adapters Architecture',
        description: '1. Ingestion Layer: FastAPI webhook receives Twilio POST payload with Twilio signature validation.\n2. Tenant Resolution: Incoming destination number maps to Tenant Configuration cached in memory.\n3. Session Persistence: SQLAlchemy queries UserSession by (tenant_id, phone_number) with optimistic concurrency locks.\n4. FSM Evaluator: State machine evaluates current state node, executes validator on user message, triggers side-effects, and computes the transition state.\n5. Dispatcher: Response message is formatted and pushed to Twilio Messaging API via asynchronous HTTP client.',
        flow: ['Twilio Webhook POST', 'Signature Auth & Tenant Lookup', 'Load User State from DB', 'Execute State Transition & Validator', 'Persist New State & History', 'Async Response Dispatch']
      },
      uiUx: 'Conversational UX is optimized for Indian vernacular usage: numbered menus for error-free selection, forgiving fuzzy-matching for keywords (e.g., "timings", "timing", "time", "schedule"), automatic fallback to human handover when confidence drops, and instant acknowledgment within 800ms.',
      development: 'The project was developed in iterative phases: first, modeling the mathematical state machine and serialization schema in Pydantic; second, writing the SQLAlchemy repository with PostgreSQL/SQLite drivers; third, Twilio webhook integration and signature verification middleware; and fourth, end-to-end stress testing with concurrent asynchronous test scripts simulating 100 simultaneous user conversations.',
      techStackDetails: [
        { name: 'FastAPI', role: 'High-throughput async ASGI web framework for handling webhook spikes' },
        { name: 'SQLAlchemy 2.0', role: 'Async ORM for bulletproof multi-tenant session queries and migration safety' },
        { name: 'Pydantic v2', role: 'Strict runtime schema validation for declarative tenant state files' },
        { name: 'Twilio API', role: 'Carrier-grade WhatsApp Business API transport' },
        { name: 'PostgreSQL', role: 'Relational ACID store for user states, appointment logs, and audit trails' }
      ],
      challenges: [
        'Out-of-Order Webhook Delivery: Cellular networks frequently deliver rapid consecutive messages out of order, causing state machine transitions to fail.',
        'Session Memory Bloat: Inactive users left in intermediate state nodes could indefinitely consume memory.',
        'Tenant Config Hot-Reloading: Updating a client\'s menu without restarting the FastAPI server or dropping active user sessions.'
      ],
      solutions: [
        'Implemented message sequence numbering and an idempotency cache with short Redis/memory locks. Duplicate or stale webhooks are discarded automatically.',
        'Configured automated state expiration timeouts: sessions reset to the Root Entrypoint after 2 hours of inactivity with an polite notification on next resume.',
        'Built a dynamic file watcher and cache invalidation endpoint that safely swaps tenant JSON definitions in memory without dropping connections.'
      ],
      demonstration: [
        { label: 'Multi-Tenant Onboarding', detail: 'New business onboarded in < 15 minutes by committing a single JSON specification.' },
        { label: 'Booking Automation', detail: 'Collects name, preferred service, date, and confirms slot with 0 human intervention.' },
        { label: 'Human Handover', detail: 'Typing "agent" or "human" flags the session and pings business owner with full chat transcript.' }
      ],
      resultsLearnings: 'Successfully validated with local clients in salons and tuition centers. Reduced manual WhatsApp query load by over 70%. Demonstrated that clean architectural separation (decoupling state graphs from network webhooks) makes complex systems reliable and maintainable.',
      links: {
        live: 'https://github.com/parshvashah2008',
        github: 'https://github.com/parshvashah2008'
      },
      nextProjectId: 'jee-doubt-solver'
    }
  },
  {
    id: 'jee-doubt-solver',
    num: '02',
    title: 'JEE Doubt Solver',
    subtitle: 'Intelligent Multi-Provider STEM Tutor with Vision-Language Fallbacks',
    tag: 'Production AI',
    category: 'AI & Machine Learning',
    year: '2026',
    status: 'Live In Production',
    color: '#d8b375',
    secondaryColor: '#c8f53c',
    stack: ['React', 'Vite', 'Tailwind CSS', 'OpenAI API', 'Google Gemini 1.5 Pro', 'Groq LPU', 'DeepSeek', 'KaTeX'],
    liveUrl: 'https://jee-doubts-solver.netlify.app/',
    linkLabel: 'Open Application',
    githubUrl: 'https://github.com/parshvashah2008',
    summary: 'A resilient STEM solving engine routing queries across 5 LLM providers with automatic visual OCR inspection, LaTeX math typesetting, and zero-downtime key rotation.',
    
    sections: {
      intro: 'Competitive engineering entrance exams like JEE Advanced require rigorous step-by-step mathematical reasoning, complex diagram parsing (circuit diagrams, coordinate geometry, organic chemistry reaction mechanisms), and LaTeX notation. Single-model applications regularly fail due to rate limits, hallucinated formulas, or high token latency. I engineered a multi-provider platform built specifically for Indian STEM students.',
      heroVisual: {
        headline: 'Dynamic Multi-LLM Routing Engine for Complex STEM Question Parsing',
        caption: 'Routes equations, diagrams, and handwritten notes through optimal vision and reasoning models.'
      },
      overview: 'JEE Doubt Solver is a full-featured web application that lets students upload handwritten or printed questions, specify their desired depth of explanation (concept primer, formula breakdown, or full derivation), and receive verified step-by-step solutions rendered in clean KaTeX math notation. The backend architecture intelligently routes between OpenAI GPT-4o, Google Gemini 1.5 Pro, Groq Llama-3-70B, Kimi, and DeepSeek-V3 based on provider health, vision capability requirements, and latency targets.',
      problem: 'Students preparing for JEE study late at night when offline tutoring is unavailable. When using standard ChatGPT or consumer chatbots, formulas are formatted as unreadable plain text, complex physics diagrams are misinterpreted, and hitting rate limits abruptly halts study sessions. Furthermore, different frontier models excel at different domains: Gemini has superior multimodal diagram vision, while DeepSeek and Llama-3-70B on Groq provide near-instantaneous mathematical derivation.',
      whyBuilt: 'Having prepared for competitive entrance exams myself as an engineering student at KJ Somaiya, I experienced firsthand the friction of getting stuck on a single rotational mechanics problem for hours without verification. I wanted to build a dedicated tool that never goes down and formats math properly.',
      research: 'Benchmarked 6 different LLM APIs against 50 past JEE Advanced physics and mathematics questions. Found that: 1. Gemini 1.5 Pro had the highest accuracy on hand-drawn circuit and mechanics diagrams; 2. DeepSeek and OpenAI excelled at step-by-step calculus proofs; 3. Groq provided sub-second time-to-first-token for quick conceptual queries. This evidence mandated a multi-provider fallback strategy.',
      architecture: {
        pattern: 'Client-Side Key Vault & Adaptive Provider Router',
        description: '1. Input Processor: Image uploaded via drag-and-drop or camera capture, scaled and converted to base64 with dimension clamping.\n2. Capability Detector: If visual image is present, the router filters available providers down to vision-capable models (Gemini 1.5, GPT-4o).\n3. Provider Health Check: Evaluates cached latency and failure states. Attempts primary selected provider.\n4. Fallback Circuit Breaker: If primary model throws 429 (rate limit) or 503 (overload), the engine seamlessly shifts payload to fallback model without discarding student input.\n5. LaTeX Pipeline: Markdown stream parsed incrementally, identifying KaTeX delimiters ($...$ and $$...$$) and rendering math symbols without layout shifts.',
        flow: ['Student Upload / Equation Input', 'Vision Detection & Prompt Normalization', 'Provider Selection & API Dispatch', 'Stream Decoding & KaTeX Math Parsing', 'Bookmark / Solution History Cache']
      },
      uiUx: 'Designed with a high-contrast dark theme optimized for long study sessions. Includes one-click equation copy, toggleable solution stages, history drawer saved in localStorage, and LaTeX render toggle.',
      development: 'Built using React and Vite with strict component separation: EquationInput, ProviderSelector, SolutionStreamer, and KaTeXRenderer. Leveraged browser native Streams API for real-time token rendering.',
      techStackDetails: [
        { name: 'Google Gemini 1.5 Pro', role: 'Primary vision model for diagram, circuit, and geometry OCR' },
        { name: 'Groq Cloud', role: 'Ultra-low latency inference for quick concept checks and formula queries' },
        { name: 'DeepSeek & OpenAI', role: 'Rigorous derivation engine for calculus and multi-step proofs' },
        { name: 'KaTeX', role: 'Fast math typesetting rendering complex integral and matrix equations' },
        { name: 'Tailwind CSS', role: 'Responsive layout tested across desktop and mobile screens' }
      ],
      challenges: [
        'LaTeX Delimiter Inconsistencies: Different LLMs output math in inconsistent notations (\\[...\\] vs $$...$$ vs equation blocks).',
        'Large Image Payload Latency: High-resolution smartphone camera photos exceeded 10MB, causing payload timeouts.',
        'Handling API Rate Limits Gracefully: Free-tier API keys hitting 429s during peak evening hours.'
      ],
      solutions: [
        'Built an input normalization regex pipeline that standardizes all mathematical blocks before feeding them into the KaTeX rendering DOM node.',
        'Implemented client-side canvas downsampling: high-res photos are compressed to 1400px JPEG at 82% quality in < 120ms before upload.',
        'Designed an automatic fallback ladder: if Provider A returns 429, the engine automatically catches the error, notifies the UI with a subtle badge ("Switching to Gemini backup"), and delivers the answer without student interruption.'
      ],
      demonstration: [
        { label: 'Diagram Recognition', detail: 'Extracts resistor values, current directions, and capacitor charges from photos.' },
        { label: 'Step-by-Step Derivation', detail: 'Breaks complex proofs into Concept -> Formula -> Numerical Substitution -> Final Answer.' },
        { label: 'Zero-Downtime Resilience', detail: 'Survives individual provider outages through multi-cloud failover.' }
      ],
      resultsLearnings: 'Deployed live on Netlify with active daily student usage across peer groups. Demonstrated the value of building resilience at the application layer rather than relying on a single AI provider.',
      links: {
        live: 'https://jee-doubts-solver.netlify.app/',
        github: 'https://github.com/parshvashah2008'
      },
      nextProjectId: 'scholars-hub'
    }
  },
  {
    id: 'scholars-hub',
    num: '03',
    title: 'Scholars Hub',
    subtitle: 'Modern Digital Presence & Admissions Funnel for Premier Education Academy',
    tag: 'Client Work',
    category: 'Web Development',
    year: '2026',
    status: 'Live Client Deployment',
    color: '#f4f1ea',
    secondaryColor: '#d8b375',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Netlify Edge', 'SEO Meta'],
    liveUrl: 'https://scholars-hub-surat.netlify.app/',
    linkLabel: 'View Live Website',
    githubUrl: 'https://github.com/parshvashah2008',
    summary: 'A fast, responsive web platform engineered for a leading coaching institute in Surat, transforming student enrollment and parent discovery.',
    
    sections: {
      intro: 'Scholars Hub is a prominent coaching academy in Surat catering to board exams and competitive foundation courses. Prior to this project, their online presence relied solely on static local listings and informal WhatsApp inquiries. I was commissioned to architect, design, and deploy their official web platform.',
      heroVisual: {
        headline: 'Clean Educational Interface Built for High Parent Trust and Fast Mobile Browsing',
        caption: 'Features structured course catalogs, faculty credentials, interactive fee inquiries, and direct admissions routing.'
      },
      overview: 'The website serves as the primary digital anchor for Scholars Hub. It showcases curriculum paths for grades 8th through 12th, foundation science/math batches, past toppers, faculty backgrounds, and an interactive admission inquiry form linked directly to the academy management.',
      problem: 'Parents evaluating coaching institutes require instant reassurance regarding faculty credentials, batch sizes, test series rigor, and center location. The client previously lost dozens of prospective admissions every admissions season because parents could not easily browse course specifics on mobile devices.',
      whyBuilt: 'This was an end-to-end client engagement where I operated as both the technical architect and product designer. My objective was to deliver a site that outperforms competing institutional websites in load speed, clarity, and mobile responsiveness.',
      research: 'Analyzed top regional coaching portals in Gujarat and Mumbai. Identified that over 82% of visits originated from smartphones on mobile cellular connections, and the average parent spent less than 45 seconds before seeking contact details. The architecture therefore demanded zero layout shift, instant phone/WhatsApp CTAs, and digestible modular information.',
      architecture: {
        pattern: 'Static-Site Generation (SSG) with Edge Delivery',
        description: 'Built with React and Vite, compiled to pure static assets with pre-baked SEO metadata, and hosted on Netlify\'s distributed global edge CDN with HTTP/2 and asset hashing for sub-second mobile loads.',
        flow: ['Edge CDN Cached Asset Request', 'Instant Hydration & Zero CLS Paint', 'Interactive Course Filter & Fee Explorer', 'Validated Lead Submission via Direct API']
      },
      uiUx: 'Designed with an approachable, academic color palette of deep navy, clean white, and warm gold accents. Features clear typography hierarchy, tap-friendly action buttons for parents, and prominent Google Maps location embeds.',
      development: 'Conducted stakeholder interviews with the institute director, drafted wireframes, built modular components in React, integrated Framer Motion for subtle scroll-reveals, and optimized all assets for Core Web Vitals.',
      techStackDetails: [
        { name: 'React 18', role: 'Component hierarchy for modular course and testimonial sections' },
        { name: 'Vite', role: 'Lightning-fast bundle tooling and asset chunking' },
        { name: 'Tailwind CSS', role: 'Utility-first styling with custom fluid typography and spacing scale' },
        { name: 'Netlify Edge', role: 'Global CDN distribution with automated continuous deployment from Git' }
      ],
      challenges: [
        'Image Optimization for Faculty and Center Photos: High-res client photography initially caused 8MB bundle bloat.',
        'Mobile Tap Ergonomics: Parents with varied technical literacy needed seamless one-tap communication.',
        'Local SEO Visibility: Ensuring the institute ranks prominently for local Surat education queries.'
      ],
      solutions: [
        'Converted all client photography to next-gen WebP formats with responsive srcset sizes, reducing initial page payload by 84%.',
        'Implemented persistent floating quick-action docks (Direct Call, WhatsApp Chat, Google Maps Location) anchored to mobile viewports.',
        'Implemented schema.org LocalBusiness and EducationalOrganization structured JSON-LD data for Google search indexing.'
      ],
      demonstration: [
        { label: '100% Core Web Vitals', detail: 'Scores 98+ on Google Lighthouse Mobile for performance and SEO.' },
        { label: 'Direct WhatsApp Routing', detail: 'Pre-fills prospective student class and subject query into chat.' },
        { label: 'Responsive Course Matrix', detail: 'Allows parents to quickly filter batches by standard and stream.' }
      ],
      resultsLearnings: 'Successfully launched in production. The client reported a noticeable increase in direct digital inquiries during the subsequent academic enrollment cycle.',
      links: {
        live: 'https://scholars-hub-surat.netlify.app/',
        github: 'https://github.com/parshvashah2008'
      },
      nextProjectId: 'particle-storm'
    }
  },
  {
    id: 'particle-storm',
    num: '04',
    title: 'Particle Storm',
    subtitle: 'Camera-Based Hand Tracking Particle Simulation via Computer Vision',
    tag: 'Live Experiment',
    category: 'Experiments',
    year: '2025',
    status: 'Live Interactive Web Experience',
    color: '#8be28a',
    secondaryColor: '#c8f53c',
    stack: ['MediaPipe Hands', 'HTML5 Canvas', 'JavaScript ES6', 'OpenCV', 'WebGL', 'Vector Physics'],
    liveUrl: 'https://particlestormz.netlify.app/',
    linkLabel: 'Launch Experiment',
    githubUrl: 'https://github.com/parshvashah2008',
    summary: 'A real-time spatial interaction experiment where physical hand gestures tracked via webcam become gravitational attractors controlling thousands of kinetic particles.',
    
    sections: {
      intro: 'Modern digital interfaces remain overwhelmingly constrained by the 2D bounding box of keyboards and touchscreens. Particle Storm is an exploratory creative technology project that turns the user\'s physical hands into an invisible magnetic force field controlling a swirling cosmos of particles in real time through webcam optical tracking.',
      heroVisual: {
        headline: 'Natural Spatial Human-Computer Interaction in the Web Browser',
        caption: 'Over 3,000 real-time particles reacting at 60 FPS to 21 hand landmarks detected via MediaPipe.'
      },
      overview: 'Using Google\'s MediaPipe Hands ML model executed entirely client-side via WebAssembly, Particle Storm isolates 21 3D hand keypoints from a live video stream. The fingertip coordinates (index tip, thumb tip, palm center) are mapped into a custom physics engine running on HTML5 Canvas. Pinching your fingers increases gravitational mass, opening your hand triggers kinetic explosion pulses, and moving through 3D space creates cosmic fluid vortexes.',
      problem: 'Computer vision models in the browser often suffer from severe frame drops, thermal throttling, and input lag. Running deep neural networks alongside physics calculations with thousands of particles typically causes choppy framerates that ruin the illusion of physical touch.',
      whyBuilt: 'I built Particle Storm to explore the boundaries of natural user interfaces (NUI) and real-time computer vision in standard web browsers without requiring specialized hardware like Leap Motion or depth cameras.',
      research: 'Benchmarked TensorFlow.js vs MediaPipe WebAssembly runtimes. MediaPipe offered 3x lower inference latency on commodity laptop webcams by offloading tensor ops to WebGL shaders. Formulated an Euler numerical integration particle simulation with velocity damping and distance-squared gravitational attraction.',
      architecture: {
        pattern: 'Double-Buffered CV & Kinetic Vector Loop',
        description: '1. Video Capture: getUserMedia grabs camera feed at 640x480 resolution.\n2. Keypoint Inference: MediaPipe Hands processes frames asynchronously, emitting 21 normalized 3D landmarks.\n3. Landmark Smoothing: Exponential moving average filter removes sensor jitter.\n4. Physics Step: 3,000 particle vectors updated against active finger attractor coordinates (F = G * (m1*m2)/r^2).\n5. Render Step: Double-buffered canvas clears with alpha trail to create cinematic light-streaking motion blur.',
        flow: ['Camera Stream', 'MediaPipe WASM Landmark Detection', 'Jitter Smoothing Filter', 'Kinetic Vector Gravitation Step', 'Alpha-Trail Canvas Render']
      },
      uiUx: 'Designed as a dark minimalist laboratory. Users see minimal HUD guides indicating tracking confidence, current particle count, and gesture modes (Gravity Well, Supernova Repel, Vortex Flow).',
      development: 'Iterated through mathematical models for particle dissipation and boundary bounce. Optimized memory allocation by pre-allocating TypedArrays (Float32Array) for particle positions, velocities, and color vectors to eliminate garbage collection pauses.',
      techStackDetails: [
        { name: 'MediaPipe Hands', role: 'Machine learning pipeline for real-time 21 3D hand landmark detection' },
        { name: 'HTML5 Canvas 2D', role: 'Direct hardware-accelerated drawing context with alpha blending' },
        { name: 'JavaScript ES6+', role: 'Custom vector math and physics simulation without external dependencies' },
        { name: 'Netlify', role: 'HTTPS edge hosting required for browser getUserMedia camera security policy' }
      ],
      challenges: [
        'Garbage Collection Frame Drops: Dynamically allocating new particle objects in requestAnimationFrame created periodic 50ms stutters.',
        'Lighting and Skin Tone Variance: Optical tracking degraded under dim desk lighting.',
        'Lag Between Finger Movement and Particle Motion: High latency ruins spatial immersion.'
      ],
      solutions: [
        'Implemented Object Pooling with flat TypedArrays, ensuring zero heap allocations during the 60 FPS animation loop.',
        'Added dynamic tracking confidence thresholds and landmark extrapolation that smoothly bridges momentary frame drops.',
        'Synchronized the physics tick with the requestVideoFrameCallback API where available, reducing input-to-display latency by 35%.'
      ],
      demonstration: [
        { label: 'Pinch Singularity', detail: 'Pinching thumb and index finger condenses particles into a dense gravitational core.' },
        { label: 'Supernova Burst', detail: 'Rapidly opening a fist releases stored kinetic energy, blasting particles outward.' },
        { label: 'Dual-Hand Orbit', detail: 'Two hands create binary orbital centers simulating binary star systems.' }
      ],
      resultsLearnings: 'Deepened my mastery of real-time computer vision, linear algebra, vector physics, and browser performance profiling. Demonstrated that web browsers can deliver spatial experiences once reserved for native desktop apps.',
      links: {
        live: 'https://particlestormz.netlify.app/',
        github: 'https://github.com/parshvashah2008'
      },
      nextProjectId: 'virtual-blackboard'
    }
  },
  {
    id: 'virtual-blackboard',
    num: '05',
    title: 'Virtual Blackboard',
    subtitle: 'Touchless Air-Drawing & Gesture Annotation Canvas for Remote Education',
    tag: 'CV Application',
    category: 'AI & Machine Learning',
    year: '2025',
    status: 'Live Web & Desktop Tool',
    color: '#c8f53c',
    secondaryColor: '#8be28a',
    stack: ['MediaPipe Hands', 'Python OpenCV', 'HTML5 Canvas', 'Geometric Gesture Recognition', 'Fast Fourier Smoothing'],
    liveUrl: 'https://blackboardz.netlify.app/',
    linkLabel: 'Launch Blackboard',
    githubUrl: 'https://github.com/parshvashah2008',
    summary: 'A computer vision application allowing teachers and students to write, draw geometric shapes, switch colors, and clear the canvas in mid-air using hand gestures.',
    
    sections: {
      intro: 'Digital pens and drawing tablets remain inaccessible or inconvenient for many students and educators. Virtual Blackboard turns any standard webcam into a touchless whiteboard. By analyzing finger orientation and spatial proximity in 3D space, users can naturally sketch diagrams, write mathematical formulas, and highlight concepts directly in mid-air.',
      heroVisual: {
        headline: 'Natural Spatial In-Air Handwriting Without Hardware Styluses',
        caption: 'Shipped as both a Python OpenCV desktop engine and an accessible client-side browser application.'
      },
      overview: 'The system recognizes specific hand postures: raising only the index finger activates "Draw Mode"; raising both index and middle fingers activates "Selection / Pointer Mode" (allowing users to navigate menus and pick ink colors); and opening all five fingers in a wiping motion activates the "Eraser Mode".',
      problem: 'Writing in mid-air lacks tactile feedback (no glass or paper resistance), resulting in shaky lines, unintended pen strokes, and inaccurate letterforms if raw tracking coordinates are piped directly to canvas drawing commands.',
      whyBuilt: 'During remote lectures and technical study sessions, quickly sketching a circuit or math diagram requires either buying a graphic tablet or awkwardly dragging a computer mouse. I wanted to build an intuitive, zero-cost alternative accessible to anyone with a webcam.',
      research: 'Studied digital ink smoothing algorithms, specifically Catmull-Rom splines, Bézier curve interpolation, and Kalman filtering. Explored gesture state debounce mechanisms to prevent accidental stroke creation when moving the hand between screen regions.',
      architecture: {
        pattern: 'Gesture State Machine & Stroke Interpolator',
        description: '1. Frame Acquisition: Webcam stream fed to MediaPipe hand pose tracker.\n2. Posture Classification: Calculates Euclidean distances between fingertip landmarks and MCP joints to determine extended fingers.\n3. State Resolution: Decodes active state (Idle, Hover, Draw, Erase, Color Select).\n4. Spline Smoothing: Incoming draw points passed through a running quadratic Bézier curve smoother.\n5. Layered Canvas: Background image/video layer, drawing vector layer, and UI overlay layer updated independently.',
        flow: ['Webcam Stream', 'Fingertip Distance Vector Math', 'Posture State Machine', 'Bézier Spline Smoothing', 'Multi-Layer Canvas Paint']
      },
      uiUx: 'Features an unobtrusive top toolbar with high-contrast color pills (Lime, Emerald, Amber, Bone White), stroke thickness selectors, an instant clear button, and an overlay mirror mode so users see where their hand aligns with their drawings.',
      development: 'Initially built and benchmarked in Python with OpenCV and NumPy for algorithmic verification; subsequently ported to modern JavaScript and HTML5 Canvas using MediaPipe WebAssembly for instant web deployment without installation barriers.',
      techStackDetails: [
        { name: 'MediaPipe Hands', role: 'Real-time 3D landmarking and depth approximation' },
        { name: 'OpenCV (Python prototype)', role: 'Initial morphological filtering and video testing' },
        { name: 'HTML5 Canvas API', role: 'Smooth vector stroke rendering with anti-aliasing' },
        { name: 'JavaScript Math Utilities', role: 'Quadratic spline interpolation and gesture classification' }
      ],
      challenges: [
        'Z-Axis Ambiguity: Determining when the user intends to "press down" to write vs hover in air.',
        'Hand Tremor Jitter: Natural human hand tremor causing jagged handwriting.',
        'Accidental Erasing: Wiping gestures triggering during regular writing.'
      ],
      solutions: [
        'Implemented geometric finger posture logic: Drawing requires index finger extended while thumb and middle finger are tucked, eliminating the need for unreliable Z-depth thresholding.',
        'Applied moving-window Bézier interpolation that smooths raw noisy coordinates into fluid, calligraphic strokes.',
        'Required a minimum 3-frame confirmation before transitioning between Draw and Erase states.'
      ],
      demonstration: [
        { label: 'Mid-Air Sketching', detail: 'Enables clean geometry drawing, arrows, and handwritten annotations.' },
        { label: 'Touchless Palette', detail: 'Hovering over color swatches switches ink without touching keyboards.' },
        { label: 'One-Click Export', detail: 'Saves annotated canvas as high-resolution PNG for class notes.' }
      ],
      resultsLearnings: 'Demonstrated how intelligent software filtering and computer vision heuristics can overcome the physical absence of tactile hardware.',
      links: {
        live: 'https://blackboardz.netlify.app/',
        github: 'https://github.com/parshvashah2008'
      },
      nextProjectId: 'speak-smart-club'
    }
  },
  {
    id: 'speak-smart-club',
    num: '06',
    title: 'Speak Smart Club',
    subtitle: 'Dynamic Academy Portal & Lead Generation Hub for English Communication',
    tag: 'Client Work',
    category: 'Web Development',
    year: '2026',
    status: 'Live Client Deployment',
    color: '#d8b375',
    secondaryColor: '#f4f1ea',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Accessible UX', 'Netlify Edge', 'WhatsApp Business Linkage'],
    liveUrl: 'https://speaksmartclub.netlify.app/',
    linkLabel: 'View Live Portal',
    githubUrl: 'https://github.com/parshvashah2008',
    summary: 'A client website built for an English communication academy featuring structured batch schedules, curriculum guides, student audio testimonials, and direct WhatsApp enrollment.',
    
    sections: {
      intro: 'Speak Smart Club is a specialized training institute empowering students, professionals, and job seekers with spoken English fluency and public speaking confidence. The institute required an engaging digital portal to articulate their pedagogy, publish upcoming batch schedules, and drive prospective student registrations.',
      heroVisual: {
        headline: 'Empathetic Visual Communication Designed to Convert Hesitant Learners',
        caption: 'Features interactive level assessments, clear course outcomes, and frictionless enrollment CTAs.'
      },
      overview: 'The web application provides an overview of training tiers (Foundation, Intermediate, Executive Business Communication), introduces certified trainers, addresses common student anxieties through structured FAQs, and directs visitors to a streamlined assessment consultation.',
      problem: 'Adult learners seeking spoken English coaching frequently feel self-conscious or intimidated by academic jargon. Traditional institutional websites exacerbate this with dense text walls and clinical layouts that discourage prospective students from reaching out.',
      whyBuilt: 'Commissioned as a complete client build. The objective was to craft a warm, welcoming, modern digital brand identity that lowers the psychological barrier to inquiry while maintaining professional credibility.',
      research: 'Conducted interviews with current students and trainers. Discovered that the majority of enrollments happen after a personalized 10-minute diagnostic call. The primary conversion metric for the site was therefore designed to be initiating that initial diagnostic connection.',
      architecture: {
        pattern: 'Jamstack Architecture with Modular Section Hydration',
        description: 'Vite-powered React single page application optimized for fast client-side navigation, minimal initial JavaScript bundle size (< 48KB gzipped), and pre-rendered semantic HTML for accessibility and search visibility.',
        flow: ['Fast Edge Initial Load', 'Curriculum & Level Exploration', 'Confidence Assessment Tool', 'Direct WhatsApp / Phone Lead Dispatch']
      },
      uiUx: 'Warm, encouraging visual atmosphere featuring friendly human photography, clear typographic hierarchy, subtle interactive hover cards, and accessible color contrast meeting WCAG AA standards.',
      development: 'Developed from initial wireframe prototypes to production deployment within two weeks. Configured automated git-based continuous integration on Netlify.',
      techStackDetails: [
        { name: 'React', role: 'Component structure for reusable course cards and interactive FAQs' },
        { name: 'Tailwind CSS', role: 'Consistent typography, responsive grids, and design token enforcement' },
        { name: 'Vite', role: 'Fast developer ergonomics and optimized tree-shaken production bundles' },
        { name: 'Netlify', role: 'Global edge hosting with automated SSL and asset caching' }
      ],
      challenges: [
        'Curriculum Density vs Mobile Readability: Packing extensive course outlines into small smartphone screens without overwhelming the user.',
        'High Mobile Bounce Rate Risk: Keeping users engaged on 4G cellular connections.',
        'Lead Attribution: Enabling the client to know which specific course batch a student was viewing when they tapped contact.'
      ],
      solutions: [
        'Designed accordion-based modular course drawers that allow visitors to expand and collapse detailed syllabus modules on demand.',
        'Aggressively audited asset weight and eliminated unused CSS, achieving a sub-1.2s first contentful paint.',
        'Built dynamic URL query parameters into the WhatsApp click-to-chat button so messages arrive with pre-populated batch tags (e.g., "Hi, I am interested in the Weekend Executive Batch").'
      ],
      demonstration: [
        { label: 'Course Navigator', detail: 'Visual level breakdown guiding students to their ideal starting tier.' },
        { label: 'Direct WhatsApp Funnel', detail: 'Pre-formatted inquiries connecting directly to academy admissions.' },
        { label: 'Interactive FAQ', detail: 'Resolves common student hesitations regarding batch timing and fees.' }
      ],
      resultsLearnings: 'Successfully transitioned the client away from unstructured social media messaging to an organized digital admissions pipeline, increasing consultation bookings.',
      links: {
        live: 'https://speaksmartclub.netlify.app/',
        github: 'https://github.com/parshvashah2008'
      },
      nextProjectId: 'agentic-mcp-explorer'
    }
  },
  {
    id: 'agentic-mcp-explorer',
    num: '07',
    title: 'Model Context Protocol (MCP) & AI Agent Lab',
    subtitle: 'Explorations in Model Context Protocol, Autonomous Tool Routing & Agentic Workflows',
    tag: 'Research & Labs',
    category: 'AI & Machine Learning',
    year: '2026',
    status: 'Research & Active Lab',
    color: '#c8f53c',
    secondaryColor: '#8ba352',
    stack: ['Anthropic Claude Agent SDK', 'Model Context Protocol (MCP)', 'Python 3.12', 'JSON-RPC', 'Pydantic'],
    liveUrl: '#experiments',
    linkLabel: 'Explore Playground',
    githubUrl: 'https://github.com/parshvashah2008',
    summary: 'A systems architecture lab implementing Anthropic Model Context Protocol (MCP) servers, multi-agent tool routing, structured output validators, and autonomous debugging pipelines.',
    
    sections: {
      intro: 'The frontier of AI engineering has shifted from single-prompt generation to multi-step agentic execution. Backed by 18 Anthropic technical certifications across Claude Platform, Model Context Protocol, subagents, and agent skills, I established this lab to construct and benchmark reliable agentic architectures using the open Model Context Protocol (MCP) standard.',
      heroVisual: {
        headline: 'Open Standard Agent Interoperability via Model Context Protocol (MCP)',
        caption: 'Connecting LLMs to local SQLite databases, workspace file systems, and external APIs with zero proprietary lock-in.'
      },
      overview: 'This project implements custom MCP servers communicating over stdio and SSE transport protocols. It exposes typed tools (database querying, file modification, log triage, API testing) with rigorous JSON Schema validation, allowing Claude and autonomous subagents to solve complex multi-turn developer tasks while respecting sandboxed security boundaries.',
      problem: 'Building custom integrations for LLMs typically requires vendor-specific function-calling glue code that must be rewritten for every provider. Furthermore, agents given unrestricted tool access frequently hallucinate invalid arguments or enter infinite execution loops.',
      whyBuilt: 'To understand the fundamental systems engineering beneath production AI agents. Rather than treating LLMs as magic black boxes, I wanted to master tool definition, schema declaration, capability negotiation, and stateful multi-agent coordination.',
      research: 'Studied the Model Context Protocol specification published by Anthropic. Compared stdio subprocess communication against HTTP/SSE transports. Analyzed failure modes in tool-calling loops, including parameter truncation, error feedback propagation, and agent self-correction dynamics.',
      architecture: {
        pattern: 'Client-Host-Server MCP Architecture',
        description: '1. Agent Host: Python-based supervisor managing the LLM conversation loop and tool dispatch.\n2. MCP Protocol Layer: Standardized JSON-RPC 2.0 messages encoding tool definitions, resource templates, and prompt workflows.\n3. Custom Tool Servers: Sandboxed Python micro-servers exposing validated operations (e.g., SQLite query engine, Git repository analyzer).\n4. Guardrails & Context Pruning: Pydantic v2 validates all incoming tool parameters; results are compressed before being added back into the agent context window.',
        flow: ['User Intent', 'Agent Reasoning Step', 'JSON-RPC Tool Call via MCP', 'Server Execution & Sandboxed DB Query', 'Structured Response Feedback', 'Final Synthesis']
      },
      uiUx: 'Designed as a developer CLI and interactive web inspector allowing engineers to view raw JSON-RPC traffic, inspect active tool schemas, and monitor token consumption per reasoning step.',
      development: 'Developed alongside completing Anthropic\'s certification suite (Model Context Protocol, Advanced MCP, Subagents, and Claude Code). Implemented end-to-end integration tests verifying tool failure recovery.',
      techStackDetails: [
        { name: 'Model Context Protocol (MCP)', role: 'Open protocol standardizing agent tool discovery and execution' },
        { name: 'Claude 3.5 Sonnet / Haiku', role: 'Frontier reasoning engine with high tool-calling precision' },
        { name: 'Python asyncio', role: 'Concurrent non-blocking stdio and network transport management' },
        { name: 'Pydantic v2', role: 'Runtime typing and JSON schema auto-generation' }
      ],
      challenges: [
        'Agent Infinite Tool Loops: LLM repeatedly invoking the same tool with minor parameter variations when queries return empty results.',
        'Context Window Exhaustion: Large tool responses (e.g. whole database tables) blowing past token budgets.',
        'Transport Reliability: Managing subprocess lifecycle and socket disconnections on Windows and Linux.'
      ],
      solutions: [
        'Implemented max-iteration circuit breakers and explicit negative feedback prompting guiding the agent toward alternative hypotheses.',
        'Built automated result chunking and summary filters on MCP server responses, returning at most 1KB of relevant context per invocation.',
        'Constructed robust process supervisor wrappers with graceful SIGTERM handling and automatic heartbeat health checks.'
      ],
      demonstration: [
        { label: 'Self-Documenting Tools', detail: 'Exposes schemas dynamically to any MCP-compliant client (Claude Desktop, Antigravity, custom CLI).' },
        { label: 'Subagent Delegation', detail: 'Dispatches specialized child agents for research and code verification.' },
        { label: 'Security Boundary', detail: 'Restricts filesystem tools to explicit working directory whitelists.' }
      ],
      resultsLearnings: 'Solidified deep architectural knowledge of enterprise AI agent deployment. Directly informs my freelance automation systems and client AI architectures.',
      links: {
        live: '#experiments',
        github: 'https://github.com/parshvashah2008'
      },
      nextProjectId: 'cybernetic-audiovisual-lab'
    }
  },
  {
    id: 'cybernetic-audiovisual-lab',
    num: '08',
    title: 'Cybernetic Audio-Visual Reactive Field',
    subtitle: 'Real-Time WebGL Shader & Audio Synthesis Experiment',
    tag: 'Creative WebGL',
    category: 'Experiments',
    year: '2025',
    status: 'Live Creative Experiment',
    color: '#8be28a',
    secondaryColor: '#c8f53c',
    stack: ['Three.js', 'Custom GLSL Shaders', 'Web Audio API', 'Simplex Noise', 'WebGL 2.0'],
    liveUrl: '#experiments',
    linkLabel: 'Launch Visualizer',
    githubUrl: 'https://github.com/parshvashah2008',
    summary: 'A high-performance procedural graphics and sound synthesis laboratory rendering mathematical audio-reactive manifolds and cybernetic particle surfaces at 60 FPS.',
    
    sections: {
      intro: 'The modern web is capable of delivering desktop-class real-time graphics and sound synthesis. Cybernetic Audio-Visual Lab is a digital playground exploring procedural GPU shaders, Simplex noise wave functions, and dynamic frequency analysis via the Web Audio API.',
      heroVisual: {
        headline: 'Mathematical Landscapes Powered by GPU Fragment and Vertex Shaders',
        caption: 'Over 10,000 vertices modulated in real-time by audio harmonic frequencies and cursor gravitation.'
      },
      overview: 'Visitors can interact with live generative surfaces: tweaking noise frequencies, switching between cybernetic wireframes and shaded volumetric fields, and activating sound synthesis that modulates vertex displacement in real time.',
      problem: 'Complex 3D animations in JavaScript often bottleneck the CPU main thread. Achieving fluid 60 FPS wave dynamics with thousands of vertices requires offloading geometric computation directly to the GPU via custom GLSL shaders.',
      whyBuilt: 'To master low-level computer graphics, matrix transformations, and GLSL shading language, moving beyond canned UI templates to build bespoke digital worlds.',
      research: 'Explored fractional Brownian motion (fBm), domain warping, and perlin/simplex noise implementations in GLSL. Studied Fast Fourier Transform (FFT) frequency binning using the Web Audio AnalyserNode.',
      architecture: {
        pattern: 'GPU Vertex/Fragment Shader Pipeline',
        description: '1. Audio Engine: Web Audio API generates procedural harmonic chords or analyzes mic input.\n2. FFT Binning: AnalyserNode extracts frequency data (bass, mid, treble) into Uint8Array.\n3. Uniform Passing: Audio energy levels, elapsed time, and pointer coordinates sent as uniforms to the GLSL shader.\n4. Vertex Shader: Computes displacement on GPU using 3D Simplex noise modulated by bass frequency.\n5. Fragment Shader: Calculates chromatic dispersion, normal-based lighting, and atmospheric fog.',
        flow: ['Web Audio Oscillator / FFT', 'Pass Uniforms to GPU', 'GLSL Vertex Displacement', 'Fragment Chromatic Shader', 'WebGL Screen Buffer']
      },
      uiUx: 'Minimalist editorial controls: floating glass sliders for Noise Octaves, Wave Amplitude, Speed, and Color Chromatic Aberration.',
      development: 'Authored custom vertex and fragment shader strings; integrated with Three.js BufferGeometry; tuned performance across mobile GPUs.',
      techStackDetails: [
        { name: 'Three.js', role: 'WebGL scene graph, camera rig, and WebGLRenderer management' },
        { name: 'GLSL (OpenGL Shading Language)', role: 'High-performance GPU code running per-vertex and per-pixel' },
        { name: 'Web Audio API', role: 'In-browser sound synthesis and real-time frequency analysis' },
        { name: 'Simplex Noise', role: 'Organic continuous mathematical noise functions' }
      ],
      challenges: [
        'Mobile GPU Shader Compatibility: Precision differences (mediump vs highp) causing visual artifacts on older mobile chips.',
        'Browser Audio Autoplay Policies: Modern browsers block audio initialization until explicit user gesture.',
        'Maintaining 60 FPS on Integrated GPUs: Complex noise loops causing thermal throttling.'
      ],
      solutions: [
        'Standardized shader precision qualifiers and validated against WebGL 2.0 and WebGL 1.0 fallback contexts.',
        'Designed an elegant "Initialize Audio Engine" modal trigger that binds cleanly to user tap without jarring prompts.',
        'Optimized GLSL noise calculation by using analytical normal derivatives instead of multi-sample finite difference queries.'
      ],
      demonstration: [
        { label: 'Real-Time Audio Reactive', detail: 'Vertices pulse and distort synchronously with sound harmonic spikes.' },
        { label: 'Interactive Gravity', detail: 'Cursor movement warps spatial coordinate matrices in real time.' },
        { label: 'Customizable Shaders', detail: 'Live controls for distortion frequency, wireframe mode, and palette themes.' }
      ],
      resultsLearnings: 'Deepened foundational understanding of graphics programming, GPU pipeline architecture, and mathematical simulation. Direct inspiration for the 3D portfolio experience.',
      links: {
        live: '#experiments',
        github: 'https://github.com/parshvashah2008'
      },
      nextProjectId: 'whatsapp-bot'
    }
  }
]

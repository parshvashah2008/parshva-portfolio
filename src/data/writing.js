/**
 * Parshva Shah — Technical Articles & Engineering Thoughts
 * Editorial essays on AI engineering, systems architecture, and product building.
 */

export const articles = [
  {
    id: 'multi-provider-llm-routing',
    title: 'Architecting Multi-Provider LLM Fallbacks: Lessons from Production',
    subtitle: 'Why single-model reliance is a single point of failure, and how to build resilient token routing.',
    date: 'October 2026',
    readTime: '6 min read',
    tags: ['AI Engineering', 'Systems', 'LLMs', 'Resilience'],
    excerpt: 'Frontier AI models are commodities with unpredictable latency and rate limits. By decoupling reasoning from transport and deploying adaptive fallback ladders, we achieved 99.8% uptime on JEE Doubt Solver without breaking student sessions.',
    content: `
### The Illusion of Model Monoliths

When building modern AI-powered applications, the most common beginner mistake is coupling the entire user experience to a single proprietary API endpoint. Whether it is OpenAI's GPT-4o, Google's Gemini, or Anthropic's Claude, treating an external LLM as a 100% reliable utility leads inevitably to production fragility.

During peak study hours (10 PM to 2 AM IST), our STEM doubt solving platform experienced sudden 429 rate limit errors and 503 gateway timeouts from tier-1 cloud providers. For a student wrestling with a complex rotational mechanics problem, an unhandled API error isn't just an inconvenience—it breaks flow state and destroys trust.

### Designing the Capability-Aware Router

The solution was not simply wrapping API calls in generic exponential retry loops. Standard exponential backoff still causes 5 to 15 seconds of blank loading spinners. Instead, we architected a **Dynamic Capability Router**:

\`\`\`
User Upload (Image + Equation)
       │
       ▼
[Image Present?] ──Yes──► Filter: [Gemini 1.5 Pro, GPT-4o]
       │ No
       ▼
Filter: [DeepSeek-V3, Groq Llama-3-70B, GPT-4o, Gemini 1.5]
       │
       ▼
Circuit Breaker Check ──► Active Provider Selection
       │
       ▼
Primary Request (Timeout: 4500ms)
       │
       ├──► Success ──► Stream to KaTeX Engine
       │
       └──► Error (429/500/Timeout) ──► Failover Ladder (Zero User Interruption)
\`\`\`

### Key Architectural Takeaways

1. **Normalize at the Boundaries:** Every provider formats mathematical notation differently. Some emit \`\\[ ... \\]\`, others emit \`$$ ... $$\`, and others use raw text. We placed a strict normalization transform immediately after the stream decoder before feeding tokens into KaTeX.
2. **Vision Detection Must Precede Dispatch:** Routing an image prompt to a text-only high-speed model like Groq results in an immediate 400 Bad Request. Inspecting the payload mime-type dynamically bounds the fallback candidate set before dispatch.
3. **Decouple the Key Vault:** By allowing users to provide their own keys or using pool rotation on our backend proxies, rate limits become non-blocking events.
    `
  },
  {
    id: 'config-driven-fsm-whatsapp',
    title: 'Config-Driven Finite State Machines: Scaling WhatsApp Automation',
    subtitle: 'How a single FastAPI codebase onboards diverse local businesses via declarative JSON schemas.',
    date: 'September 2026',
    readTime: '8 min read',
    tags: ['FastAPI', 'Architecture', 'Python', 'State Machines'],
    excerpt: 'Building custom bots for salons, coaching classes, and textile merchants causes nightmare codebases. Here is how we decoupled the dialogue graph into JSON state schemas executed over an async ASGI runtime.',
    content: `
### The Local Business Bottleneck

In India, WhatsApp is not just a chat app; it is the commercial operating system of the nation. When I started working with local business owners—from salons booking haircut appointments to tuition centers sharing test schedules—every single owner complained about losing hours answering identical queries.

Yet, every client's workflow had subtle, distinct nuances:
- **The Salon:** Needs stylist availability checks, service duration calculation, and booking time confirmation.
- **The Tuition Academy:** Needs grade selection (8th, 9th, 10th), syllabus PDF dispatch, and demo class booking.
- **The Textile Merchant:** Needs wholesale catalog links, minimum order quantity rules, and direct sales rep handover.

Building three separate codebases meant fixing the same webhook bugs three times. The answer was a **Config-Driven Finite State Machine**.

### Decoupling Graph Definition from Webhook Transport

We designed an explicit JSON schema that represents any business interaction as a directed graph of state nodes:

\`\`\`json
{
  "tenant_id": "salon_01",
  "root_state": "welcome",
  "states": {
    "welcome": {
      "message": "Welcome to Glamour Studio! Please choose an option:\\n1. Hair Styling\\n2. Facial & Spa\\n3. Speak with Receptionist",
      "validator": "choice_in_range",
      "valid_range": [1, 3],
      "transitions": {
        "1": "select_stylist",
        "2": "select_spa_package",
        "3": "human_handover"
      }
    }
  }
}
\`\`\`

### Execution Mechanics

When Twilio fires an incoming webhook, FastAPI executes the following pipeline:
1. **Tenant Identification:** Maps \`To\` phone number to \`tenant_id\` in memory.
2. **Session Fetch:** Retrieves \`UserSession\` from PostgreSQL based on \`(tenant_id, user_phone)\`.
3. **Transition Validation:** Feeds user input through the node's assigned Pydantic validator.
4. **Side-Effect Invocation:** If the node defines an action (e.g. \`send_email_notification\` or \`reserve_slot\`), it fires asynchronously via background tasks.
5. **State Persist:** Updates current state pointer and appends to audit history.

This architecture reduced client onboarding from 4 days of coding to 15 minutes of JSON composition.
    `
  },
  {
    id: 'model-context-protocol-future',
    title: 'The Model Context Protocol (MCP): The Emerging Standard for AI Agent Tooling',
    subtitle: 'Why Anthropic’s open protocol is replacing fragile proprietary function calling frameworks.',
    date: 'August 2026',
    readTime: '7 min read',
    tags: ['Anthropic', 'MCP', 'Agent Systems', 'Protocols'],
    excerpt: 'Having completed 18 Anthropic technical certifications across Claude Platform, MCP, and Subagents, here is an in-depth analysis of why open protocol standardization is crucial for enterprise agents.',
    content: `
### Beyond Vendor Function Calling

Until recently, connecting an LLM to external systems required proprietary function calling specifications: OpenAI has tools, Google has Gemini functions, and LangChain had its own custom abstraction layer. If an engineer wanted to connect an AI to an internal database, they had to rebuild the tool wrapper for every target runtime.

Anthropic introduced the **Model Context Protocol (MCP)** as an open standard. Think of MCP as the Language Server Protocol (LSP) for AI models:
- **LSP** decoupled programming languages from IDEs (one Python language server works across VS Code, Neovim, and Sublime).
- **MCP** decouples tools and resources from AI clients (one SQLite MCP server works across Claude Desktop, Antigravity, and custom agent runtimes).

### Core Primitives of MCP

An MCP server exposes three fundamental primitives:
1. **Tools:** Actionable functions the model can execute with parameters (e.g. \`query_database\`, \`deploy_container\`).
2. **Resources:** Read-only data streams and files the model can inspect (e.g. log files, repository documentation).
3. **Prompts:** Pre-engineered interaction workflows and templates.

### Engineering Production Guardrails

In our agent lab, we discovered three critical failure modes when deploying MCP servers:
- **Infinite Loop Hallucinations:** When a query returns zero results, naive agents re-invoke the same tool with slight syntax mutations. We solved this with an iteration-budget limiter and explicit error feedback prompts.
- **Context Bloat:** Returning raw JSON payloads from databases quickly overwhelms context windows. MCP servers should perform aggressive projections, returning only the top-N relevant keys.
- **Security Boundaries:** Any MCP server exposing filesystem or database write tools must enforce directory path whitelisting and read-only connection strings by default.
    `
  },
  {
    id: 'computer-vision-in-browser',
    title: 'Computer Vision in the Browser: Lessons from Real-Time Gesture Tracking',
    subtitle: 'Extracting 60 FPS performance from MediaPipe WebAssembly and HTML5 Canvas without specialized hardware.',
    date: 'July 2026',
    readTime: '5 min read',
    tags: ['Computer Vision', 'WebAssembly', 'Canvas', 'Performance'],
    excerpt: 'Building Particle Storm and Virtual Blackboard taught me how to eliminate garbage collection pauses and sensor jitter when tracking human motion through consumer webcams.',
    content: `
### The Challenge of In-Air Interaction

Translating raw camera feeds into natural human gestures in a standard web browser presents a formidable technical challenge. When developing **Particle Storm** (camera-driven particle physics) and **Virtual Blackboard** (air-writing tool), we encountered two immediate roadblocks:

1. **Garbage Collection Stutters:** Generating new Vector objects or landmark arrays inside \`requestAnimationFrame\` at 60 FPS causes the browser's V8 engine to trigger periodic GC pauses, dropping framerates from 60 FPS down to 18 FPS.
2. **The "Air Writing" Tremor:** Unlike drawing on a physical iPad or paper, human hands floating in mid-air have natural micro-tremors. If raw fingertip pixel coordinates are rendered directly to canvas, handwriting looks completely illegible.

### The Zero-Allocation Object Pool

To eliminate GC pauses, we eradicated dynamic heap allocations during the render loop. Instead of:
\`\`\`javascript
// BAD: Allocates 3,000 objects every 16 milliseconds
particles.forEach(p => {
  p.position = new Vector(p.x + p.vx, p.y + p.vy);
});
\`\`\`

We migrated to flat typed arrays (\`Float32Array\`) holding all particle positions, velocities, and lifetimes contiguously in memory:

\`\`\`javascript
// GOOD: Zero heap allocation, cache-friendly vector processing
const positions = new Float32Array(MAX_PARTICLES * 2);
const velocities = new Float32Array(MAX_PARTICLES * 2);
\`\`\`

### Bézier Smoothing for Fluid In-Air Strokes

To solve the handwriting tremor without introducing perceptible lag, we implemented a three-point moving-window quadratic Bézier curve interpolator:
- Each incoming fingertip coordinate is added to a 3-point rolling buffer.
- The control point is calculated as the midpoint between the previous coordinate and the current estimate.
- This creates silky, calligraphic ink strokes while maintaining sub-40ms response times.
    `
  }
]

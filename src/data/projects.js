import { caseStudies } from './caseStudies'

export const projects = caseStudies.map((cs) => ({
  id: cs.id,
  num: cs.num,
  title: cs.title,
  subtitle: cs.subtitle,
  tag: cs.tag,
  category: cs.category,
  year: cs.year,
  status: cs.status,
  stack: cs.stack,
  description: cs.summary,
  link: cs.liveUrl,
  linkLabel: cs.linkLabel,
  github: cs.githubUrl,
  color: cs.color,
  secondaryColor: cs.secondaryColor,
  sections: cs.sections,
}))

export const skillCategories = [
  {
    category: 'SOFTWARE ENGINEERING',
    icon: 'Terminal',
    summary: 'Core computer science fundamentals, systems, low-level architecture, and algorithmic design.',
    skills: [
      { name: 'Python', level: 'Advanced', note: 'FastAPI, asyncio, NumPy, scientific tooling & backend engines' },
      { name: 'C++', level: 'Proficient', note: 'Data structures, algorithm optimization, memory & systems fundamentals' },
      { name: 'TypeScript', level: 'Proficient', note: 'Type-safe frontend & full-stack application development' },
      { name: 'JavaScript (ES6+)', level: 'Advanced', note: 'Asynchronous event loops, Canvas API, DOM, WebGL integration' },
      { name: 'Data Structures & Algorithms', level: 'Proficient', note: 'Graph traversal, trees, DP, algorithmic complexity analysis' },
      { name: 'Databases (SQL & NoSQL)', level: 'Proficient', note: 'PostgreSQL, SQLAlchemy, SQLite, schema normalization & indexing' },
      { name: 'Operating Systems', level: 'Proficient', note: 'Process management, concurrency, IPC, memory virtualization' },
      { name: 'Computer Networks', level: 'Proficient', note: 'TCP/IP, HTTP/2, WebSockets, DNS, RESTful network architectures' },
    ],
  },
  {
    category: 'AI & MACHINE LEARNING',
    icon: 'Cpu',
    summary: 'Applied LLM engineering, agentic workflows, computer vision, and model evaluation.',
    skills: [
      { name: 'Machine Learning & Deep Learning', level: 'Proficient', note: 'Supervised/unsupervised models, neural nets, feature engineering' },
      { name: 'LLM Engineering & Routing', level: 'Advanced', note: 'Multi-provider fallback (OpenAI, Gemini, Groq, DeepSeek), token economics' },
      { name: 'RAG (Retrieval-Augmented Generation)', level: 'Proficient', note: 'Vector indexing, semantic search, hybrid retrieval & chunking' },
      { name: 'AI Agents & MCP', level: 'Advanced', note: 'Model Context Protocol, subagents, tool routing, 18 Anthropic certs' },
      { name: 'Model Evaluation & Benchmarking', level: 'Proficient', note: 'Systematic prompt testing, latency/accuracy trade-off analysis' },
      { name: 'Computer Vision (MediaPipe & OpenCV)', level: 'Proficient', note: 'Real-time gesture tracking, 3D hand landmarks, optical flows' },
    ],
  },
  {
    category: 'DEVELOPMENT',
    icon: 'Layers',
    summary: 'Full-stack web architecture, responsive interfaces, and developer workflows.',
    skills: [
      { name: 'React', level: 'Advanced', note: 'Custom hooks, concurrent rendering, state architectures, performance' },
      { name: 'Next.js', level: 'Proficient', note: 'App router, server-side rendering, dynamic API routes, edge delivery' },
      { name: 'Node.js & FastAPI', level: 'Advanced', note: 'High-throughput async backends, webhook ingestion, REST endpoints' },
      { name: 'REST & Webhook APIs', level: 'Advanced', note: 'Twilio API, WhatsApp Business API, Claude/Gemini API integration' },
      { name: 'Full-Stack Integration', level: 'Advanced', note: 'End-to-end client systems from database schema to UI delivery' },
      { name: 'Git & GitHub Workflows', level: 'Advanced', note: 'Branching strategies, CI/CD actions, code reviews & release management' },
    ],
  },
  {
    category: 'INFRASTRUCTURE',
    icon: 'Server',
    summary: 'Containerization, cloud platforms, continuous delivery, and Linux administration.',
    skills: [
      { name: 'Docker', level: 'Proficient', note: 'Multi-stage builds, container orchestration, reproducible environments' },
      { name: 'Cloud Platforms', level: 'Proficient', note: 'Netlify Edge, Vercel, Supabase, basic GCP services' },
      { name: 'CI/CD Pipelines', level: 'Proficient', note: 'Automated testing, linting, build pipelines & continuous deployment' },
      { name: 'Deployment & Webhooks', level: 'Advanced', note: 'Production zero-downtime deploys, webhook verification & SSL' },
      { name: 'Linux Environments', level: 'Proficient', note: 'Shell scripting, POSIX tools, server configuration & debugging' },
    ],
  },
  {
    category: 'DESIGN & PRODUCT',
    icon: 'Compass',
    summary: 'Art-directed digital experiences, typography, prototyping, and product thinking.',
    skills: [
      { name: 'UI/UX Architecture', level: 'Advanced', note: 'Information architecture, design systems, editorial layouts' },
      { name: 'Product Thinking', level: 'Advanced', note: 'Translating business problems into viable, scalable software tools' },
      { name: 'Interactive Prototyping', level: 'Advanced', note: 'Framer Motion, GSAP, rapid user flow validation' },
      { name: 'Creative Development (Three.js/WebGL)', level: 'Proficient', note: '3D spatial scenes, shaders, particle simulations, camera physics' },
    ],
  },
]

export const skills = skillCategories.flatMap((c) =>
  c.skills.map((s) => ({ label: s.name, group: c.category, level: s.level, note: s.note }))
)

export const contact = {
  name: 'Parshva Shah',
  role: 'AI Engineer & Independent Builder',
  location: 'Mumbai / Surat, India',
  email: 'parshvashah2203@gmail.com',
  linkedin: 'https://www.linkedin.com/in/parshva-shah-592022328/',
  github: 'https://github.com/parshvashah2008',
}

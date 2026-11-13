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
    label: 'AI',
    items: ['LLM Engineering', 'ChatGPT', 'Groq / Gemini / Claude', 'MediaPipe / OpenCV'],
  },
  {
    label: 'Backend',
    items: ['Python', 'FastAPI', 'Node.js'],
  },
  {
    label: 'Languages',
    items: ['Java', 'C', 'C++'],
  },
  {
    label: 'Frontend',
    items: ['React / Next.js', 'Three.js / WebGL', 'HTML'],
  },
  {
    label: 'Databases',
    items: ['Supabase / SQL'],
  },
  {
    label: 'Automation & Messaging',
    items: ['WhatsApp / Telegram API', 'Make.com / Zapier'],
  },
  {
    label: 'Dev Tools',
    items: ['Git / GitHub'],
  },
]

export const skills = skillCategories.flatMap((c) =>
  c.items.map((label) => ({ label, group: c.label }))
)

export const contact = {
  name: 'Parshva Shah',
  role: 'AI Engineer & Independent Builder',
  location: 'Mumbai / Surat, India',
  email: 'parshvashah2203@gmail.com',
  linkedin: 'https://www.linkedin.com/in/parshva-shah-592022328/',
  github: 'https://github.com/parshvashah2008',
}

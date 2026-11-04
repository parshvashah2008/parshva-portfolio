import { contact } from '../data/projects'

const icons = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#c8f53c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" />
      <circle cx="7.5" cy="6.7" r="0.6" fill="#c8f53c" />
      <path d="M12 17v-4.2c0-1.5 1.1-2.3 2.3-2.3 1.2 0 2.2.8 2.2 2.3V17" />
      <line x1="12" y1="10" x2="12" y2="17" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#f4f1ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.4c0-1 .1-1.4-.5-2 2-.2 4.5-1 4.5-4.5a3.5 3.5 0 0 0-1-2.5 3.3 3.3 0 0 0-.1-2.5s-.9-.3-2.9 1a10 10 0 0 0-5 0c-2-1.3-2.9-1-2.9-1a3.3 3.3 0 0 0-.1 2.5 3.5 3.5 0 0 0-1 2.5c0 3.5 2.5 4.3 4.5 4.5-.6.6-.6 1.2-.5 2V21" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#d8b375" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
}

const links = [
  { key: 'linkedin', href: contact.linkedin, label: 'LinkedIn' },
  { key: 'github', href: contact.github, label: 'GitHub' },
  { key: 'email', href: `mailto:${contact.email}`, label: 'Send an Email' },
]

export default function FloatRail() {
  return (
    <div className="fixed z-[90] flex gap-3 right-5 top-1/2 -translate-y-1/2 flex-col md:right-5 max-md:right-auto max-md:left-1/2 max-md:-translate-x-1/2 max-md:top-auto max-md:bottom-4 max-md:flex-row">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noopener"
          aria-label={l.label}
          className="w-11 h-11 rounded-full bg-[var(--panel)] border border-[var(--line)] flex items-center justify-center hover:border-[#c8f53c]/45 hover:bg-[var(--panel-2)] transition-all hover:-translate-x-1 max-md:hover:translate-x-0 max-md:hover:-translate-y-1 shadow-lg"
        >
          <span className="w-[19px] h-[19px]">{icons[l.key]}</span>
        </a>
      ))}
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { projects as staticProjects } from '../data/projects'

const GITHUB_USERNAME = 'parshvashah2008'
const CACHE_KEY = 'parshva_github_universe_cache_v2'
const CACHE_DURATION_MS = 5 * 60 * 1000 // 5 minutes for fast auto-discovery of newly pushed repos

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
  const key = (repo.name || '').toLowerCase()
  if (KNOWN_LIVE_URLS[key]) {
    return KNOWN_LIVE_URLS[key]
  }
  if (repo.has_pages) {
    return `https://${GITHUB_USERNAME}.github.io/${repo.name}/`
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
  const liveUrl = resolveRepoLiveUrl(repo)
  const category = inferRepoCategory(repo)
  const title = formatRepoTitle(repo)
  const summary = repo.description || `Open-source ${repo.language || 'software'} repository actively developed and hosted via GitHub.`
  const [color, secondaryColor] = PALETTE_ROTATION[slotOffset % PALETTE_ROTATION.length]
  const year = repo.pushed_at ? String(new Date(repo.pushed_at).getFullYear()) : '2026'
  const topicTags = Array.isArray(repo.topics) ? repo.topics.slice(0, 3) : []
  const stack = Array.from(
    new Set([
      repo.language || 'JavaScript',
      ...topicTags,
      repo.has_pages ? 'GitHub Pages' : null,
      'GitHub Repo',
    ].filter(Boolean))
  ).slice(0, 5)

  return {
    id: `gh-${normalizeSlug(repo.name)}`,
    num: String(indexNum).padStart(2, '0'),
    title,
    subtitle: liveUrl
      ? `Live Hosted GitHub Build · ${repo.language || 'Web Stack'}`
      : `Live GitHub Repository · ${repo.language || 'Engineering Build'}`,
    tag: liveUrl ? 'Live GitHub Sync' : 'GitHub Sync',
    category,
    year,
    status: liveUrl ? 'Live Public Deployment' : 'Public GitHub Repository',
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
    repoLanguage: repo.language || 'Web',
    updatedRelative: formatRelativeTime(repo.pushed_at || repo.updated_at),
    sections: {
      intro: summary,
      heroVisual: {
        headline: `${title} — Synchronized Directly from GitHub`,
        caption: `Automatically imported from github.com/${GITHUB_USERNAME}/${repo.name} (${formatRelativeTime(repo.pushed_at || repo.updated_at)}).`,
      },
      overview: `${summary} Published in github.com/${GITHUB_USERNAME}/${repo.name} and integrated automatically into this portfolio's live Project Universe.`,
      problem: `Built and published to explore practical engineering around ${category.toLowerCase()} with transparent, version-controlled delivery on GitHub.`,
      whyBuilt: `Every new repository or GitHub Pages deployment pushed to @${GITHUB_USERNAME} is discovered via the GitHub API and surfaced automatically with live links and stack metadata.`,
      research: `Repository metadata, topic tags, primary language (${repo.language || 'Mixed'}), and live deployment endpoints are parsed dynamically cleanly without manual portfolio edits.`,
      architecture: {
        pattern: liveUrl ? 'Live Static / Hosted Build + GitHub Sync' : 'GitHub Public Repository Pipeline',
        description: `Direct GitHub REST integration syncs source telemetry, deployment status, and stack metadata from ${repo.html_url}.`,
        flow: [
          `Push to github.com/${GITHUB_USERNAME}/${repo.name}`,
          liveUrl ? 'Hosted Live Endpoint Active' : 'Public Source Repository Indexed',
          'GitHub REST API v3 Discovery',
          '3D Sphere & Editorial Universe Sync',
        ],
      },
      uiUx: 'Automatically styled with the signature high-contrast dark obsidian palette, card thumbnail preview, and 360° spherical orbit placement.',
      development: `Maintained on the ${repo.default_branch || 'main'} branch with ${repo.language || 'modern web'} tooling.`,
      techStackDetails: stack.map((item) => ({
        name: item,
        role: item === repo.language ? 'Primary repository language' : 'Detected stack & hosting layer',
      })),
      challenges: ['Zero-config auto-discovery alongside curated case studies'],
      solutions: ['Dynamic category classification, deduplication against existing projects, and GitHub Pages URL detection'],
      demonstration: [
        { label: 'Repository', detail: `${GITHUB_USERNAME}/${repo.name}` },
        { label: 'Last Push', detail: formatRelativeTime(repo.pushed_at || repo.updated_at) },
        { label: 'Hosting', detail: liveUrl ? 'Live Deployed' : 'GitHub Source' },
      ],
      resultsLearnings: `Live synchronization keeps the 3D Project Universe automatically up-to-date whenever new projects or hosted apps are shipped to GitHub.`,
      nextProjectId: 'whatsapp-bot',
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

import { useState, useEffect } from 'react'

const GITHUB_USERNAME = 'parshvashah2008'
const CACHE_KEY = 'parshva_github_stats_cache'
const CACHE_DURATION_MS = 15 * 60 * 1000 // 15 minutes

const DEFAULT_STATS = {
  username: GITHUB_USERNAME,
  publicRepos: 5,
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

export async function fetchGitHubStats() {
  if (typeof window === 'undefined') return DEFAULT_STATS

  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
        return { ...parsed.data, isLive: true }
      }
    }

    // Fetch user and recent repos in parallel
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=10&sort=updated`),
    ])

    if (!userRes.ok || !reposRes.ok) {
      return DEFAULT_STATS
    }

    const userData = await userRes.json()
    const reposData = await reposRes.json()

    const latestRepo = Array.isArray(reposData) && reposData.length > 0 ? reposData[0] : null
    const relativePush = latestRepo ? formatRelativeTime(latestRepo.updated_at) : 'Today'

    // Extract unique languages
    const languages = Array.isArray(reposData)
      ? Array.from(new Set(reposData.map((r) => r.language).filter(Boolean)))
      : DEFAULT_STATS.topLanguages

    const result = {
      username: userData.login || GITHUB_USERNAME,
      publicRepos: userData.public_repos || DEFAULT_STATS.publicRepos,
      followers: userData.followers || 0,
      latestRepo: latestRepo?.name || DEFAULT_STATS.latestRepo,
      latestPushedAt: relativePush,
      statusText: `Pushed ${relativePush} to ${latestRepo?.name || 'GitHub'}`,
      profileUrl: userData.html_url || DEFAULT_STATS.profileUrl,
      topLanguages: languages.slice(0, 4),
      isLive: true,
    }

    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data: result })
    )

    return result
  } catch (err) {
    console.debug('GitHub stats fetch fallback:', err)
    return DEFAULT_STATS
  }
}

/**
 * React hook for live GitHub statistics
 */
export function useGitHubStats() {
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    let isMounted = true
    fetchGitHubStats().then((data) => {
      if (isMounted) setStats(data)
    })
    return () => {
      isMounted = false
    }
  }, [])

  return stats
}

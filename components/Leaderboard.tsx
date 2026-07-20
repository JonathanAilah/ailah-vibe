'use client'

import { useState, useEffect } from 'react'
import { useAppContext } from '@/app/context'

interface LeaderboardEntry {
  id: string
  rank: number
  avatar: string
  title: string
  category: 'App' | 'Game' | 'Site'
  handle: string
  votes: number
  description: string
  builtWith: string[]
  tryItUrl: string
}

const categoryColors: Record<string, string> = {
  App: 'bg-violet-accent/20 text-violet-accent border border-violet-accent/50',
  Game: 'bg-orange-primary/20 text-orange-primary border border-orange-primary/50',
  Site: 'bg-success-green/20 text-success-green border border-success-green/50',
}

export const Leaderboard = () => {
  const { votes: appVotes, voteOnBuild, userVotes, user, isLoggedIn } = useAppContext()
  const [filter, setFilter] = useState<'ALL' | 'APPS' | 'GAMES' | 'SITES'>('ALL')
  const [localVotes, setLocalVotes] = useState<Record<string, number>>({})
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null)
  const [dbProjects, setDbProjects] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real projects from the database on mount
  useEffect(() => {
    fetch('/api/leaderboard', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const projects = (data.projects || []) as Array<{
          id: string
          title: string
          description: string
          category: string
          handle: string
          avatar: string
          votes: number
          liveUrl: string
          rank: number
        }>
        const entries: LeaderboardEntry[] = projects.map((p) => ({
          id: p.id,
          rank: p.rank,
          avatar: p.avatar,
          title: p.title,
          category: (p.category as 'App' | 'Game' | 'Site') || 'App',
          handle: p.handle,
          votes: p.votes,
          description: p.description,
          builtWith: ['AI'],
          tryItUrl: p.liveUrl || '#',
        }))
        setDbProjects(entries)
      })
      .catch(() => setDbProjects([]))
      .finally(() => setLoading(false))
  }, [])

  // Live vote overlay: whatever the DB says, plus any local unsaved votes this session
  const allEntries = dbProjects
    .map((e) => ({
      ...e,
      liveVotes: appVotes[e.id] ?? (e.votes + (localVotes[e.id] || 0)),
    }))
    .sort((a, b) => b.liveVotes - a.liveVotes)
    .map((e, i) => ({ ...e, rank: i + 1 }))

  const hasVoted = (buildId: string) =>
    Array.from(userVotes).some((vote) => vote === `${buildId}_${user?.email}`)

  const maxVotes = Math.max(1, ...allEntries.map((e) => e.liveVotes))

  const handleVote = (buildId: string) => {
    if (!isLoggedIn) {
      window.location.href = '/login'
      return
    }
    const success = voteOnBuild(buildId)
    if (success) setLocalVotes((prev) => ({ ...prev, [buildId]: (prev[buildId] || 0) + 1 }))
  }

  const filtered = allEntries.filter((e) => {
    if (filter === 'ALL') return true
    if (filter === 'APPS') return e.category === 'App'
    if (filter === 'GAMES') return e.category === 'Game'
    if (filter === 'SITES') return e.category === 'Site'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-4 border-b border-violet-border pb-4">
        {(['ALL', 'APPS', 'GAMES', 'SITES'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`font-mono text-sm uppercase transition-colors ${
              filter === tab
                ? 'text-orange-primary border-b-2 border-orange-primary'
                : 'text-lavender-muted/70 hover:text-lavender-muted'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-lavender-muted font-mono text-sm text-center py-8">Loading leaderboard...</p>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center space-y-3">
            <div className="text-4xl">🚀</div>
            <p className="font-chakra font-bold text-white">No projects yet</p>
            <p className="text-sm text-lavender-muted">
              Be the first to ship something and enter a vibe-a-thon.
            </p>
          </div>
        ) : filtered.map((entry) => {
          const totalVotes = entry.liveVotes
          const voteShareWidth = (totalVotes / maxVotes) * 100
          const voted = hasVoted(entry.id)

          return (
            <div
              key={entry.id}
              className="card p-6 flex items-center gap-4 sm:gap-6"
            >
              {/* Rank */}
              <div className={`text-xl font-chakra font-bold w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-sm ${
                entry.rank === 1 ? 'bg-orange-primary/20 text-orange-primary'
                  : entry.rank === 2 ? 'bg-lavender/20 text-lavender'
                  : entry.rank === 3 ? 'bg-orange-bright/20 text-orange-bright'
                  : 'bg-panel-raised text-lavender-dim'
              }`}>
                #{entry.rank}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 flex-shrink-0 rounded-sm bg-gradient-card flex items-center justify-center text-white font-chakra font-bold border border-violet-border">
                {entry.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="text-white font-chakra font-bold">{entry.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${categoryColors[entry.category]}`}>
                    {entry.category}
                  </span>
                </div>
                <p className="text-lavender-dim text-sm font-mono mb-2">{entry.handle}</p>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 bg-panel-deep rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-accent h-full" style={{ width: `${voteShareWidth}%` }} />
                  </div>
                  <span className="text-orange-primary font-mono font-bold text-sm min-w-[60px] text-right">
                    {totalVotes.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedEntry(entry)}
                  className="px-4 py-2 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-xs uppercase transition-all hover:bg-surface-violet hover:-translate-y-0.5"
                >
                  READ MORE
                </button>
                <button
                  onClick={() => handleVote(entry.id)}
                  disabled={voted}
                  className={`px-4 py-2 rounded-sm font-chakra font-bold text-xs uppercase transition-all ${
                    voted
                      ? 'bg-success-green/20 text-success-green cursor-default'
                      : 'bg-orange-primary text-ink hover:shadow-orange-glow-hover hover:-translate-y-0.5'
                  }`}
                >
                  {voted ? '✓ VOTED' : isLoggedIn ? '▲ VOTE' : '🔒 LOGIN'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(10,6,17,0.92)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedEntry(null) }}
        >
          <div className="card w-full max-w-lg p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEntry(null)}
              className="absolute top-4 right-4 text-lavender-dim hover:text-lavender transition-colors font-mono text-lg"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 pr-8">
              <div className="w-12 h-12 flex-shrink-0 rounded-sm bg-gradient-card flex items-center justify-center text-white font-chakra font-bold border border-violet-border text-xl">
                {selectedEntry.avatar}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h3 className="text-xl font-chakra font-bold text-white">{selectedEntry.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${categoryColors[selectedEntry.category]}`}>
                    {selectedEntry.category}
                  </span>
                </div>
                <p className="text-lavender-dim text-sm font-mono">{selectedEntry.handle}</p>
              </div>
            </div>

            {/* Rank & Votes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-panel-deep rounded p-4 border border-violet-border text-center">
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-1">Current Rank</p>
                <p className="text-2xl font-chakra font-bold text-orange-primary">#{selectedEntry.rank}</p>
              </div>
              <div className="bg-panel-deep rounded p-4 border border-violet-border text-center">
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-1">Total Votes</p>
                <p className="text-2xl font-chakra font-bold text-white">
                  {(appVotes[selectedEntry.id] || selectedEntry.votes + (localVotes[selectedEntry.id] || 0)).toLocaleString()}
                </p>
              </div>
            </div>

            {/* About */}
            <div>
              <p className="eyebrow mb-3">// ABOUT THIS PROJECT</p>
              <p className="text-lavender-muted text-sm leading-relaxed">{selectedEntry.description}</p>
            </div>

            {/* Built with */}
            <div>
              <p className="eyebrow mb-3">// BUILT WITH</p>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.builtWith.map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-surface-violet border border-violet-border text-lavender-muted font-mono text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <a
                href={selectedEntry.tryItUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 text-center px-4 py-3 rounded-sm font-chakra font-bold text-sm uppercase transition-all ${
                  selectedEntry.tryItUrl && selectedEntry.tryItUrl !== '#'
                    ? 'border border-violet-accent text-lavender-muted hover:bg-surface-violet'
                    : 'border border-violet-border text-lavender-dim cursor-not-allowed opacity-50'
                }`}
                onClick={(e) => selectedEntry.tryItUrl === '#' && e.preventDefault()}
              >
                {selectedEntry.tryItUrl && selectedEntry.tryItUrl !== '#' ? 'TRY IT LIVE →' : 'NO URL YET'}
              </a>
              <button
                onClick={() => { handleVote(selectedEntry.id); setSelectedEntry(null) }}
                disabled={hasVoted(selectedEntry.id)}
                className={`flex-1 px-4 py-3 rounded-sm font-chakra font-bold text-sm uppercase transition-all ${
                  hasVoted(selectedEntry.id)
                    ? 'bg-success-green/20 text-success-green cursor-default'
                    : 'bg-orange-primary text-ink hover:shadow-orange-glow-hover'
                }`}
              >
                {hasVoted(selectedEntry.id) ? '✓ VOTED' : '▲ VOTE FOR THIS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

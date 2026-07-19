'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AdminProject {
  id: string
  title: string
  description: string
  category: string
  submitted_at: string
  profiles: { username: string; email: string } | null
  vote_count: { count: number }[] | null
}

const categoryColors: Record<string, string> = {
  App: 'bg-violet-accent/20 text-violet-accent border border-violet-accent/50',
  Game: 'bg-orange-primary/20 text-orange-primary border border-orange-primary/50',
  Site: 'bg-success-green/20 text-success-green border border-success-green/50',
}

export default function AdminProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) {
      router.push('/admin/login')
      return
    }
    fetch('/api/admin/projects', { headers: { 'x-admin-key': key } })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem('vibeCoden_admin_key')
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setProjects(data.projects || [])
      })
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false))
  }, [router])

  const handleDelete = async (projectId: string) => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) return
    setDeletingId(projectId)
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ projectId }),
      })
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
      }
    } catch {
      // ignore
    }
    setDeletingId(null)
    setConfirmId(null)
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 py-12 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex gap-4 items-center">
          <Link href="/" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">← BACK TO SITE</Link>
          <span className="font-mono text-xs text-lavender-dim">·</span>
          <Link href="/admin" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">BACK TO OVERVIEW</Link>
        </div>
          <h1 className="text-3xl sm:text-4xl font-chakra font-bold text-white mt-2">Projects</h1>
        </div>
        <p className="font-mono text-sm text-lavender-dim">{projects.length} total</p>
      </div>

      {loading ? (
        <p className="text-lavender-muted font-mono text-sm">Loading projects...</p>
      ) : error ? (
        <p className="text-red-400 font-mono text-sm bg-red-500/10 border border-red-500/30 rounded p-4">⚠ {error}</p>
      ) : projects.length === 0 ? (
        <p className="text-lavender-muted font-mono text-sm">No project submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="card p-6 space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-chakra font-bold text-white">{p.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${categoryColors[p.category] || ''}`}>
                      {p.category}
                    </span>
                  </div>
                  <p className="text-sm text-lavender-dim font-mono">
                    {p.profiles?.username ? `@${p.profiles.username}` : 'Unknown'} · {p.profiles?.email || ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-orange-primary font-mono font-bold">{p.vote_count?.[0]?.count ?? 0} votes</p>
                  <p className="text-xs text-lavender-dim font-mono">{new Date(p.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="text-sm text-lavender-muted leading-relaxed">{p.description}</p>

              <div className="flex justify-end">
                {confirmId === p.id ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-red-400 font-mono">Delete this submission?</span>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="px-3 py-1.5 rounded-sm bg-red-500 text-white font-chakra font-bold text-xs uppercase disabled:opacity-50"
                    >
                      {deletingId === p.id ? '...' : 'YES'}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="px-3 py-1.5 rounded-sm border border-violet-border text-lavender-muted font-chakra font-bold text-xs uppercase"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(p.id)}
                    className="px-4 py-2 rounded-sm border border-red-500/50 text-red-400 font-chakra font-bold text-xs uppercase transition-all hover:bg-red-500/10"
                  >
                    REMOVE SUBMISSION
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

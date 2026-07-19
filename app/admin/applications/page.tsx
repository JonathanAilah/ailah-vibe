'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Application {
  id: string
  full_name: string
  email: string
  age: number
  city: string
  state: string
  parent_name: string | null
  parent_email: string | null
  goal: string
  story: string
  heard_about: string | null
  status: 'pending' | 'approved' | 'rejected' | 'funded'
  applied_at: string
}

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-primary/20 text-orange-primary border-orange-primary/50',
  approved: 'bg-success-green/20 text-success-green border-success-green/50',
  funded: 'bg-violet-accent/20 text-violet-accent border-violet-accent/50',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/50',
}

export default function AdminApplications() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'funded'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = (key: string) => {
    fetch('/api/admin/applications', { headers: { 'x-admin-key': key } })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem('vibeCoden_admin_key')
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setApplications(data.applications || [])
      })
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) { router.push('/admin/login'); return }
    load(key)
  }, [router])

  const updateStatus = async (id: string, status: Application['status']) => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) return
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
      }
    } catch { /* ignore */ }
  }

  const filtered = statusFilter === 'all' ? applications : applications.filter((a) => a.status === statusFilter)

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 py-12 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex gap-4 items-center">
          <Link href="/" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">← BACK TO SITE</Link>
          <span className="font-mono text-xs text-lavender-dim">·</span>
          <Link href="/admin" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">BACK TO OVERVIEW</Link>
        </div>
          <h1 className="text-3xl sm:text-4xl font-chakra font-bold text-white mt-2">Scholarship Applications</h1>
        </div>
        <p className="font-mono text-sm text-lavender-dim">{applications.length} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'funded', 'rejected'] as const).map((s) => {
          const count = s === 'all' ? applications.length : applications.filter((a) => a.status === s).length
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-sm font-chakra font-bold text-xs uppercase transition-all border ${
                statusFilter === s
                  ? 'bg-orange-primary text-ink border-orange-primary'
                  : 'border-violet-border text-lavender-muted hover:bg-surface-violet'
              }`}
            >
              {s} ({count})
            </button>
          )
        })}
      </div>

      {loading ? (
        <p className="text-lavender-muted font-mono text-sm">Loading applications...</p>
      ) : error ? (
        <p className="text-red-400 font-mono text-sm bg-red-500/10 border border-red-500/30 rounded p-4">⚠ {error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-lavender-muted font-mono text-sm">No applications in this category.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="card p-6 space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[250px]">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-chakra font-bold text-white text-lg">{a.full_name}</h3>
                    <span className={`text-xs px-2 py-1 rounded font-mono font-bold border uppercase ${statusStyles[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm text-lavender-dim font-mono">
                    Age {a.age} · {a.city}, {a.state} · {a.email}
                  </p>
                </div>
                <p className="text-xs text-lavender-dim font-mono">
                  {new Date(a.applied_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-mono text-lavender-dim uppercase tracking-widest mb-1">Wants to build</p>
                <p className="text-sm text-lavender-muted">{a.goal}</p>
              </div>

              {expandedId === a.id ? (
                <>
                  <div>
                    <p className="text-xs font-mono text-lavender-dim uppercase tracking-widest mb-1">Their story</p>
                    <p className="text-sm text-lavender-muted whitespace-pre-wrap">{a.story}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-violet-border/40">
                    <div>
                      <p className="text-xs font-mono text-lavender-dim uppercase tracking-widest mb-1">Parent/Guardian</p>
                      <p className="text-sm text-lavender-muted">{a.parent_name || '—'}</p>
                      <p className="text-xs text-lavender-dim font-mono">{a.parent_email || ''}</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-lavender-dim uppercase tracking-widest mb-1">Heard about us via</p>
                      <p className="text-sm text-lavender-muted">{a.heard_about || '—'}</p>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setExpandedId(a.id)}
                  className="font-mono text-xs text-orange-primary hover:underline"
                >
                  Read full application →
                </button>
              )}

              {/* Status actions */}
              <div className="flex gap-2 flex-wrap pt-3 border-t border-violet-border/40">
                <button
                  onClick={() => updateStatus(a.id, 'approved')}
                  disabled={a.status === 'approved'}
                  className="px-3 py-1.5 rounded-sm bg-success-green/20 border border-success-green/50 text-success-green font-chakra font-bold text-xs uppercase transition-all hover:bg-success-green/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✓ APPROVE
                </button>
                <button
                  onClick={() => updateStatus(a.id, 'funded')}
                  disabled={a.status === 'funded'}
                  className="px-3 py-1.5 rounded-sm bg-violet-accent/20 border border-violet-accent/50 text-violet-accent font-chakra font-bold text-xs uppercase transition-all hover:bg-violet-accent/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ♥ MARK FUNDED
                </button>
                <button
                  onClick={() => updateStatus(a.id, 'rejected')}
                  disabled={a.status === 'rejected'}
                  className="px-3 py-1.5 rounded-sm bg-red-500/10 border border-red-500/40 text-red-400 font-chakra font-bold text-xs uppercase transition-all hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ✕ REJECT
                </button>
                {a.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus(a.id, 'pending')}
                    className="px-3 py-1.5 rounded-sm border border-violet-border text-lavender-muted font-chakra font-bold text-xs uppercase transition-all hover:bg-surface-violet"
                  >
                    ↺ Reset to Pending
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

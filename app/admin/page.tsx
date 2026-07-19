'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
  totalUsers: number
  totalProjects: number
  totalVotes: number
  totalApplications: number
  totalDonations: number
  totalDonationsCount: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) {
      router.push('/admin/login')
      return
    }

    fetch('/api/admin/stats', {
      headers: { 'x-admin-key': key },
    })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem('vibeCoden_admin_key')
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setStats(data)
      })
      .catch(() => setError('Failed to load stats.'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('vibeCoden_admin_key')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow mb-2">// ADMIN PANEL</p>
          <h1 className="text-3xl sm:text-4xl font-chakra font-bold text-white">Overview</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/vibe-a-thons" className="px-5 py-2.5 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
            VIBE-A-THONS
          </Link>
          <Link href="/admin/applications" className="px-5 py-2.5 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
            APPLICATIONS
          </Link>
          <Link href="/admin/users" className="px-5 py-2.5 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
            USERS
          </Link>
          <Link href="/admin/projects" className="px-5 py-2.5 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
            PROJECTS
          </Link>
          <button onClick={handleLogout} className="px-5 py-2.5 rounded-sm border border-red-500/50 text-red-400 font-chakra font-bold text-sm uppercase transition-all hover:bg-red-500/10">
            LOG OUT
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-lavender-muted font-mono text-sm">Loading stats...</p>
      ) : error ? (
        <p className="text-red-400 font-mono text-sm bg-red-500/10 border border-red-500/30 rounded p-4">⚠ {error}</p>
      ) : stats ? (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: '👥' },
              { label: 'Total Projects', value: stats.totalProjects.toLocaleString(), icon: '🚀' },
              { label: 'Total Votes', value: stats.totalVotes.toLocaleString(), icon: '🗳️' },
              { label: 'Scholarship Apps', value: stats.totalApplications.toLocaleString(), icon: '🎓' },
            ].map((stat) => (
              <div key={stat.label} className="card p-6 space-y-3">
                <div className="text-2xl">{stat.icon}</div>
                <p className="text-3xl font-chakra font-bold text-white">{stat.value}</p>
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Donations card */}
          <div className="card bg-gradient-hero p-8 border border-orange-border">
            <p className="eyebrow mb-3">// DONATIONS</p>
            <div className="flex items-end gap-8 flex-wrap">
              <div>
                <p className="text-4xl font-chakra font-bold text-orange-primary">
                  ${stats.totalDonations.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mt-1">Total Raised</p>
              </div>
              <div>
                <p className="text-2xl font-chakra font-bold text-white">{stats.totalDonationsCount}</p>
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mt-1">Donations Received</p>
              </div>
            </div>
            {stats.totalDonationsCount === 0 && (
              <p className="text-xs text-lavender-dim font-mono mt-4">
                No donations yet — Stripe payments aren't connected to the donation flow yet.
              </p>
            )}
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/admin/applications" className="card p-6 space-y-2 hover:border-violet-accent transition-all group">
              <p className="font-chakra font-bold text-white group-hover:text-orange-primary transition-colors">Review Scholarship Applications →</p>
              <p className="text-sm text-lavender-muted">Read student applications and approve, fund, or reject them.</p>
            </Link>
            <Link href="/admin/vibe-a-thons" className="card p-6 space-y-2 hover:border-violet-accent transition-all group">
              <p className="font-chakra font-bold text-white group-hover:text-orange-primary transition-colors">Manage Vibe-a-thons →</p>
              <p className="text-sm text-lavender-muted">Create competitions, set themes, deadlines, and prizes.</p>
            </Link>
            <Link href="/admin/users" className="card p-6 space-y-2 hover:border-violet-accent transition-all group">
              <p className="font-chakra font-bold text-white group-hover:text-orange-primary transition-colors">Manage Users →</p>
              <p className="text-sm text-lavender-muted">View all students, check their progress, or remove accounts.</p>
            </Link>
            <Link href="/admin/projects" className="card p-6 space-y-2 hover:border-violet-accent transition-all group">
              <p className="font-chakra font-bold text-white group-hover:text-orange-primary transition-colors">Moderate Projects →</p>
              <p className="text-sm text-lavender-muted">Review vibe-a-thon submissions and remove anything inappropriate.</p>
            </Link>
          </div>
        </>
      ) : null}
    </div>
  )
}

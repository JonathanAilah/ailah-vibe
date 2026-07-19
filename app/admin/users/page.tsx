'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AdminUser {
  id: string
  full_name: string
  username: string
  email: string
  age: number
  city: string
  state: string
  xp: number
  level: number
  created_at: string
}

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const loadUsers = (key: string) => {
    fetch('/api/admin/users', { headers: { 'x-admin-key': key } })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem('vibeCoden_admin_key')
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setUsers(data.users || [])
      })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) {
      router.push('/admin/login')
      return
    }
    loadUsers(key)
  }, [router])

  const handleDelete = async (userId: string) => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) return
    setDeletingId(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ userId }),
      })
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      }
    } catch {
      // ignore
    }
    setDeletingId(null)
    setConfirmId(null)
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16 py-12 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex gap-4 items-center">
          <Link href="/" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">← BACK TO SITE</Link>
          <span className="font-mono text-xs text-lavender-dim">·</span>
          <Link href="/admin" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">BACK TO OVERVIEW</Link>
        </div>
          <h1 className="text-3xl sm:text-4xl font-chakra font-bold text-white mt-2">Users</h1>
        </div>
        <p className="font-mono text-sm text-lavender-dim">{users.length} total</p>
      </div>

      <input
        type="text"
        placeholder="Search by name, username, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim"
      />

      {loading ? (
        <p className="text-lavender-muted font-mono text-sm">Loading users...</p>
      ) : error ? (
        <p className="text-red-400 font-mono text-sm bg-red-500/10 border border-red-500/30 rounded p-4">⚠ {error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-lavender-muted font-mono text-sm">No users found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <div key={u.id} className="card p-5 flex items-center gap-4 flex-wrap">
              <div className="w-10 h-10 rounded-sm bg-gradient-card flex items-center justify-center text-white font-chakra font-bold border border-violet-border flex-shrink-0">
                {u.full_name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="font-chakra font-bold text-white">{u.full_name}</p>
                <p className="text-sm text-lavender-dim font-mono">@{u.username} · {u.email}</p>
              </div>
              <div className="flex gap-6 text-sm text-lavender-muted font-mono">
                <span>Age {u.age}</span>
                <span>{u.city}, {u.state}</span>
                <span className="text-orange-primary">LVL {u.level} · {u.xp} XP</span>
              </div>
              {confirmId === u.id ? (
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-red-400 font-mono">Delete permanently?</span>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={deletingId === u.id}
                    className="px-3 py-1.5 rounded-sm bg-red-500 text-white font-chakra font-bold text-xs uppercase disabled:opacity-50"
                  >
                    {deletingId === u.id ? '...' : 'YES'}
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
                  onClick={() => setConfirmId(u.id)}
                  className="px-4 py-2 rounded-sm border border-red-500/50 text-red-400 font-chakra font-bold text-xs uppercase transition-all hover:bg-red-500/10"
                >
                  DELETE
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

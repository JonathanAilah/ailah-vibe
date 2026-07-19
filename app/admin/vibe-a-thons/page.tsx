'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface VibeAThon {
  id: string
  theme: string
  description: string
  start_date: string
  end_date: string
  first_prize: number
  second_prize: number
  third_prize: number
}

function getStatus(v: VibeAThon): 'upcoming' | 'live' | 'ended' {
  const now = new Date()
  const start = new Date(v.start_date)
  const end = new Date(v.end_date)
  if (now < start) return 'upcoming'
  if (now > end) return 'ended'
  return 'live'
}

const statusStyles: Record<string, string> = {
  upcoming: 'bg-violet-accent/20 text-violet-accent border-violet-accent/50',
  live: 'bg-success-green/20 text-success-green border-success-green/50',
  ended: 'bg-lavender-dim/20 text-lavender-dim border-lavender-dim/50',
}

// Format a Date for a datetime-local input value
function toLocalInputValue(dateStr: string) {
  const d = new Date(dateStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminVibeAThons() {
  const router = useRouter()
  const [vibeAThons, setVibeAThons] = useState<VibeAThon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [theme, setTheme] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [firstPrize, setFirstPrize] = useState('1500')
  const [secondPrize, setSecondPrize] = useState('700')
  const [thirdPrize, setThirdPrize] = useState('300')
  const [formError, setFormError] = useState('')

  const loadVibeAThons = (key: string) => {
    fetch('/api/admin/vibe-a-thons', { headers: { 'x-admin-key': key } })
      .then(async (res) => {
        if (res.status === 401) {
          sessionStorage.removeItem('vibeCoden_admin_key')
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setVibeAThons(data.vibeAThons || [])
      })
      .catch(() => setError('Failed to load vibe-a-thons.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) {
      router.push('/admin/login')
      return
    }
    loadVibeAThons(key)
  }, [router])

  const resetForm = () => {
    setTheme('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setFirstPrize('1500')
    setSecondPrize('700')
    setThirdPrize('300')
    setFormError('')
    setEditingId(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditForm = (v: VibeAThon) => {
    setTheme(v.theme)
    setDescription(v.description)
    setStartDate(toLocalInputValue(v.start_date))
    setEndDate(toLocalInputValue(v.end_date))
    setFirstPrize(String(v.first_prize))
    setSecondPrize(String(v.second_prize))
    setThirdPrize(String(v.third_prize))
    setEditingId(v.id)
    setFormError('')
    setShowForm(true)
  }

  const handleSave = async () => {
    setFormError('')
    if (!theme.trim()) { setFormError('Please enter a theme.'); return }
    if (!description.trim()) { setFormError('Please enter a description.'); return }
    if (!startDate) { setFormError('Please set a start date.'); return }
    if (!endDate) { setFormError('Please set an end date.'); return }
    if (new Date(endDate) <= new Date(startDate)) { setFormError('End date must be after start date.'); return }

    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) return
    setSaving(true)

    const payload = {
      theme: theme.trim(),
      description: description.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      firstPrize: parseInt(firstPrize) || 0,
      secondPrize: parseInt(secondPrize) || 0,
      thirdPrize: parseInt(thirdPrize) || 0,
    }

    try {
      const res = editingId
        ? await fetch(`/api/admin/vibe-a-thons/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/vibe-a-thons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
            body: JSON.stringify(payload),
          })

      if (res.ok) {
        setShowForm(false)
        resetForm()
        loadVibeAThons(key)
      } else {
        const data = await res.json()
        setFormError(data.error || 'Failed to save.')
      }
    } catch {
      setFormError('Something went wrong. Please try again.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const key = sessionStorage.getItem('vibeCoden_admin_key')
    if (!key) return
    try {
      const res = await fetch(`/api/admin/vibe-a-thons/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      })
      if (res.ok) {
        setVibeAThons((prev) => prev.filter((v) => v.id !== id))
      }
    } catch {
      // ignore
    }
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
          <h1 className="text-3xl sm:text-4xl font-chakra font-bold text-white mt-2">Vibe-a-thons</h1>
        </div>
        <button
          onClick={openCreateForm}
          className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover"
        >
          + CREATE NEW
        </button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="card p-8 space-y-5 border border-orange-border">
          <h2 className="text-xl font-chakra font-bold text-white">
            {editingId ? 'Edit Vibe-a-thon' : 'Create Vibe-a-thon'}
          </h2>

          <div className="space-y-2">
            <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Theme *</label>
            <input
              type="text"
              placeholder="e.g. Make People Laugh"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Description *</label>
            <textarea
              placeholder="Build a game, app, or website that makes people laugh..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Start Date & Time *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">End Date & Time *</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">1st Prize ($)</label>
              <input
                type="number"
                value={firstPrize}
                onChange={(e) => setFirstPrize(e.target.value)}
                className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">2nd Prize ($)</label>
              <input
                type="number"
                value={secondPrize}
                onChange={(e) => setSecondPrize(e.target.value)}
                className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">3rd Prize ($)</label>
              <input
                type="number"
                value={thirdPrize}
                onChange={(e) => setThirdPrize(e.target.value)}
                className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent"
              />
            </div>
          </div>

          {formError && <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {formError}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover disabled:opacity-60"
            >
              {saving ? 'SAVING...' : editingId ? 'SAVE CHANGES' : 'CREATE VIBE-A-THON'}
            </button>
            <button
              onClick={() => { setShowForm(false); resetForm() }}
              className="px-6 py-3 rounded-sm border border-violet-border text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-lavender-muted font-mono text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-400 font-mono text-sm bg-red-500/10 border border-red-500/30 rounded p-4">⚠ {error}</p>
      ) : vibeAThons.length === 0 ? (
        <p className="text-lavender-muted font-mono text-sm">No vibe-a-thons created yet. Click "+ CREATE NEW" to get started.</p>
      ) : (
        <div className="space-y-3">
          {vibeAThons.map((v) => {
            const status = getStatus(v)
            return (
              <div key={v.id} className="card p-6 space-y-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className="font-chakra font-bold text-white text-lg">{v.theme}</h3>
                      <span className={`text-xs px-2 py-1 rounded font-mono font-bold border uppercase ${statusStyles[status]}`}>
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-lavender-muted">{v.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(v)}
                      className="px-4 py-2 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-xs uppercase transition-all hover:bg-surface-violet"
                    >
                      EDIT
                    </button>
                    {confirmId === v.id ? (
                      <div className="flex gap-2 items-center">
                        <button onClick={() => handleDelete(v.id)} className="px-3 py-2 rounded-sm bg-red-500 text-white font-chakra font-bold text-xs uppercase">YES</button>
                        <button onClick={() => setConfirmId(null)} className="px-3 py-2 rounded-sm border border-violet-border text-lavender-muted font-chakra font-bold text-xs uppercase">CANCEL</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(v.id)}
                        className="px-4 py-2 rounded-sm border border-red-500/50 text-red-400 font-chakra font-bold text-xs uppercase transition-all hover:bg-red-500/10"
                      >
                        DELETE
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-6 text-sm font-mono text-lavender-dim flex-wrap">
                  <span>Starts: {new Date(v.start_date).toLocaleString()}</span>
                  <span>Ends: {new Date(v.end_date).toLocaleString()}</span>
                  <span className="text-orange-primary">🥇 ${v.first_prize} · 🥈 ${v.second_prize} · 🥉 ${v.third_prize}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

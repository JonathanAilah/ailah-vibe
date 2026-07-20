'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!password) { setError('Please enter the admin password.'); return }
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (res.ok) {
        sessionStorage.setItem('vibeCoden_admin_key', password)
        router.push('/admin')
      } else {
        setError(data.error || 'Incorrect password.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">
            ← BACK TO SITE
          </Link>
          <Link href="/" className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity">
            <span className="font-chakra font-bold text-3xl" style={{ WebkitTextStroke: '1px #E7DEF8', color: 'transparent', letterSpacing: '3px' }}>VIBE</span>
            <span className="font-chakra font-bold text-3xl" style={{ WebkitTextStroke: '1px #FF8A21', color: 'transparent', letterSpacing: '3px' }}>CODEN</span>
          </Link>
          <p className="font-mono text-xs text-lavender-dim tracking-widest">ADMIN ACCESS</p>
        </div>

        <div className="card p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-chakra font-bold text-white">Admin Login</h1>
            <p className="text-sm text-lavender-muted mt-1">Restricted area. Authorized staff only.</p>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim"
            />
          </div>

          {error && <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover disabled:opacity-60"
          >
            {loading ? 'CHECKING...' : 'ENTER ADMIN PANEL →'}
          </button>
        </div>
      </div>
    </div>
  )
}

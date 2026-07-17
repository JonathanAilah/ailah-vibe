'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ResetPassword() {
  const [accessToken, setAccessToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [validLink, setValidLink] = useState(true)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const type = params.get('type')
    if (token && type === 'recovery') {
      setAccessToken(token)
    } else {
      setValidLink(false)
    }
    setChecked(true)
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          apikey: anonKey || '',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setDone(true)
      } else {
        setError('Something went wrong. Please request a new reset link.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (!checked) return null

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="font-chakra font-bold text-3xl" style={{ WebkitTextStroke: '1px #E7DEF8', color: 'transparent', letterSpacing: '3px' }}>VIBE</span>
            <span className="font-chakra font-bold text-3xl" style={{ WebkitTextStroke: '1px #FF8A21', color: 'transparent', letterSpacing: '3px' }}>CODEN</span>
          </Link>
        </div>

        <div className="card p-8 space-y-6">
          {!validLink ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">⚠️</div>
              <h1 className="text-2xl font-chakra font-bold text-white">Invalid or expired link</h1>
              <p className="text-sm text-lavender-muted">Please request a new password reset link.</p>
              <Link href="/forgot-password" className="inline-block px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase mt-4">
                REQUEST NEW LINK
              </Link>
            </div>
          ) : done ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">✅</div>
              <h1 className="text-2xl font-chakra font-bold text-white">Password updated!</h1>
              <p className="text-sm text-lavender-muted">You can now log in with your new password.</p>
              <Link href="/login" className="inline-block px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase mt-4">
                GO TO LOG IN
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-chakra font-bold text-white">Set new password</h1>
                <p className="text-sm text-lavender-muted mt-1">Choose a new password for your account.</p>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">New Password</label>
                <input
                  type="password"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim"
                />
              </div>
              {error && <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover disabled:opacity-60"
              >
                {loading ? 'UPDATING...' : 'UPDATE PASSWORD →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

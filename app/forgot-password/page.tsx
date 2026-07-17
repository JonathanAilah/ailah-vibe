'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email.'); return }
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
    } catch {
      // Even on network error, show the same message for security
    }
    setLoading(false)
    setSent(true)
  }

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
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">📧</div>
              <h1 className="text-2xl font-chakra font-bold text-white">Check your email</h1>
              <p className="text-sm text-lavender-muted">
                If an account exists for <span className="text-white">{email}</span>, we've sent a password reset link. Click it to set a new password.
              </p>
              <Link href="/login" className="inline-block px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase mt-4">
                BACK TO LOG IN
              </Link>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-chakra font-bold text-white">Reset your password</h1>
                <p className="text-sm text-lavender-muted mt-1">Enter your email and we'll send you a reset link.</p>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
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
                {loading ? 'SENDING...' : 'SEND RESET LINK →'}
              </button>
              <p className="text-center text-sm text-lavender-dim">
                Remembered it? <Link href="/login" className="text-orange-primary font-bold">Log in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

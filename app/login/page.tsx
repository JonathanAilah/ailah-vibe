'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppContext } from '@/app/context'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

export default function LoginPage() {
  const router = useRouter()
  const { login, signup } = useAppContext()
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Signup fields
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [signupError, setSignupError] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleLogin = async () => {
    setLoginError('')
    if (!loginEmail.trim()) { setLoginError('Please enter your email.'); return }
    if (!loginPassword) { setLoginError('Please enter your password.'); return }
    setLoginLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        setLoginError(data.error || 'Login failed. Please try again.')
      } else {
        // Save user to context (localStorage fallback)
        login(loginEmail.trim().toLowerCase(), loginPassword)
        // Also save full profile from Supabase
        if (typeof window !== 'undefined') {
          localStorage.setItem('vibeCoden_user', JSON.stringify(data.user))
        }
        router.push('/dashboard')
      }
    } catch (err) {
      // Fallback to localStorage login if API fails
      const success = login(loginEmail.trim().toLowerCase(), loginPassword)
      if (success) {
        router.push('/dashboard')
      } else {
        setLoginError('Email or password is incorrect. Please try again.')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const handleSignup = async () => {
    setSignupError('')
    if (!fullName.trim()) { setSignupError('Please enter your full name.'); return }
    if (!username.trim()) { setSignupError('Please enter a username.'); return }
    if (username.includes(' ')) { setSignupError('Username cannot contain spaces.'); return }
    if (!email.trim() || !email.includes('@')) { setSignupError('Please enter a valid email.'); return }
    if (password.length < 8) { setSignupError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setSignupError('Passwords do not match.'); return }
    if (!age) { setSignupError('Please enter your age.'); return }
    const ageNum = parseInt(age)
    if (ageNum < 13 || ageNum > 100) { setSignupError('You must be at least 13 years old to join.'); return }
    if (!city.trim()) { setSignupError('Please enter your city.'); return }
    if (!state) { setSignupError('Please select your state.'); return }
    if (!agreedToTerms) { setSignupError('Please agree to the Terms of Service.'); return }

    setSignupLoading(true)

    try {
      // Try Supabase signup via secure API route
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          fullName: fullName.trim(),
          username: username.trim().toLowerCase(),
          age,
          city: city.trim(),
          state,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setSignupError(data.error || 'Signup failed. Please try again.')
        setSignupLoading(false)
        return
      }

      // Also save to localStorage as backup
      signup({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        age,
        city: city.trim(),
        state,
      })

      router.push('/dashboard')
    } catch (err) {
      // Fallback to localStorage if API unavailable
      const success = signup({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        age,
        city: city.trim(),
        state,
      })
      if (success) {
        router.push('/dashboard')
      } else {
        setSignupError('An account with this email already exists. Try logging in instead.')
      }
    } finally {
      setSignupLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-1 mb-2">
            <span className="font-chakra font-bold text-3xl"
              style={{ WebkitTextStroke: '1px #E7DEF8', color: 'transparent', letterSpacing: '3px' }}>
              VIBE
            </span>
            <span className="font-chakra font-bold text-3xl"
              style={{ WebkitTextStroke: '1px #FF8A21', color: 'transparent', letterSpacing: '3px' }}>
              CODEN
            </span>
          </Link>
          <p className="font-mono text-xs text-lavender-dim tracking-widest">501(c)(3) NONPROFIT</p>
        </div>

        {/* Toggle */}
        <div className="card p-1 flex rounded-sm">
          <button onClick={() => { setMode('login'); setLoginError('') }}
            className={`flex-1 py-3 rounded-sm font-chakra font-bold text-sm uppercase transition-all ${mode === 'login' ? 'bg-orange-primary text-ink' : 'text-lavender-muted hover:text-lavender'}`}>
            Log In
          </button>
          <button onClick={() => { setMode('signup'); setSignupError('') }}
            className={`flex-1 py-3 rounded-sm font-chakra font-bold text-sm uppercase transition-all ${mode === 'signup' ? 'bg-orange-primary text-ink' : 'text-lavender-muted hover:text-lavender'}`}>
            Sign Up
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <div className="card p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-chakra font-bold text-white">Welcome back</h1>
              <p className="text-sm text-lavender-muted mt-1">Log in to your Vibe Coden account.</p>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Email</label>
              <input type="email" placeholder="you@example.com" value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); setLoginError('') }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Password</label>
              <div className="relative">
                <input type={showLoginPassword ? 'text' : 'password'} placeholder="Your password" value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 pr-16 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
                />
                <button onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lavender-dim hover:text-lavender font-mono text-xs">
                  {showLoginPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {loginError && <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {loginError}</p>}

            <button onClick={handleLogin} disabled={loginLoading}
              className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed">
              {loginLoading ? 'LOGGING IN...' : 'LOG IN →'}
            </button>

            <p className="text-center text-sm text-lavender-dim">
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-orange-primary hover:text-orange-bright font-bold">Sign up free</button>
            </p>
          </div>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <div className="card p-8 space-y-5">
            <div>
              <h1 className="text-2xl font-chakra font-bold text-white">Join Vibe Coden</h1>
              <p className="text-sm text-lavender-muted mt-1">Free to join. Start building today.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Full Name *</label>
                <input type="text" placeholder="Alex Johnson" value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setSignupError('') }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Username *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lavender-dim font-mono text-sm">@</span>
                  <input type="text" placeholder="alexcodes" value={username}
                    onChange={(e) => { setUsername(e.target.value.replace(/\s/g, '')); setSignupError('') }}
                    className="w-full bg-panel-deep border border-violet-border rounded-sm pl-7 pr-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Email *</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => { setEmail(e.target.value); setSignupError('') }}
                className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={password}
                    onChange={(e) => { setPassword(e.target.value); setSignupError('') }}
                    className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 pr-14 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
                  />
                  <button onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-lavender-dim hover:text-lavender font-mono text-xs">
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {password && (
                  <div className="flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        password.length >= i * 3
                          ? password.length >= 12 ? 'bg-success-green' : password.length >= 8 ? 'bg-orange-primary' : 'bg-red-500'
                          : 'bg-panel-raised'
                      }`} />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Confirm *</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setSignupError('') }}
                    className={`w-full bg-panel-deep border rounded-sm px-4 py-3 pr-14 text-lavender font-grotesk text-sm outline-none transition-colors placeholder-lavender-dim ${
                      confirmPassword && confirmPassword !== password ? 'border-red-500'
                        : confirmPassword && confirmPassword === password ? 'border-success-green'
                        : 'border-violet-border focus:border-violet-accent'
                    }`}
                  />
                  <button onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-lavender-dim hover:text-lavender font-mono text-xs">
                    {showConfirm ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Age *</label>
                <input type="number" placeholder="16" min="13" max="100" value={age}
                  onChange={(e) => { setAge(e.target.value); setSignupError('') }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">City *</label>
                <input type="text" placeholder="Atlanta" value={city}
                  onChange={(e) => { setCity(e.target.value); setSignupError('') }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">State *</label>
                <select value={state} onChange={(e) => { setState(e.target.value); setSignupError('') }}
                  className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors">
                  <option value="">--</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {age && parseInt(age) < 18 && (
              <div className="bg-orange-primary/10 border border-orange-primary/30 rounded p-3">
                <p className="font-mono text-xs text-orange-primary uppercase tracking-widest mb-1">⚠ Under 18 Notice</p>
                <p className="text-xs text-lavender-muted">Students under 18 may require parental consent. We comply with COPPA guidelines.</p>
              </div>
            )}

            <div className="flex gap-3 items-start">
              <button onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded border flex items-center justify-center transition-all ${agreedToTerms ? 'bg-orange-primary border-orange-primary text-ink' : 'border-violet-border hover:border-violet-accent'}`}>
                {agreedToTerms && <span className="text-xs font-bold">✓</span>}
              </button>
              <p className="text-xs text-lavender-muted leading-relaxed">
                I agree to the <a href="#" className="text-orange-primary hover:text-orange-bright">Terms of Service</a> and <a href="#" className="text-orange-primary hover:text-orange-bright">Privacy Policy</a>.
                I understand that Vibe Coden is a nonprofit educational platform.
              </p>
            </div>

            {signupError && <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {signupError}</p>}

            <button onClick={handleSignup} disabled={signupLoading}
              className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed">
              {signupLoading ? 'CREATING ACCOUNT...' : 'CREATE FREE ACCOUNT →'}
            </button>

            <p className="text-center text-sm text-lavender-dim">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-orange-primary hover:text-orange-bright font-bold">Log in</button>
            </p>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors uppercase tracking-widest">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

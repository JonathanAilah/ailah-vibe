'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppContext } from '@/app/context'

const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC']

export default function LoginPage() {
  const router = useRouter()
  const { login, signup } = useAppContext()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
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
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleLogin = async () => {
    setLoginError('')
    if (!loginEmail.trim()) { setLoginError('Please enter your email.'); return }
    if (!loginPassword) { setLoginError('Please enter your password.'); return }
    setLoginLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const success = login(loginEmail.trim().toLowerCase(), loginPassword)
    setLoginLoading(false)
    if (success) { router.push('/dashboard') }
    else { setLoginError('Email or password is incorrect.') }
  }

  const handleSignup = async () => {
    setSignupError('')
    if (!fullName.trim()) { setSignupError('Please enter your full name.'); return }
    if (!username.trim()) { setSignupError('Please enter a username.'); return }
    if (!email.includes('@')) { setSignupError('Please enter a valid email.'); return }
    if (password.length < 8) { setSignupError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setSignupError('Passwords do not match.'); return }
    if (!age || parseInt(age) < 13) { setSignupError('You must be at least 13.'); return }
    if (!city.trim()) { setSignupError('Please enter your city.'); return }
    if (!state) { setSignupError('Please select your state.'); return }
    if (!agreedToTerms) { setSignupError('Please agree to the Terms of Service.'); return }
    setSignupLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const success = signup({ fullName: fullName.trim(), username: username.trim().toLowerCase(), email: email.trim().toLowerCase(), password, age, city: city.trim(), state })
    setSignupLoading(false)
    if (success) { router.push('/dashboard') }
    else { setSignupError('An account with this email already exists.') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="font-chakra font-bold text-3xl" style={{ WebkitTextStroke: '1px #E7DEF8', color: 'transparent', letterSpacing: '3px' }}>VIBE</span>
            <span className="font-chakra font-bold text-3xl" style={{ WebkitTextStroke: '1px #FF8A21', color: 'transparent', letterSpacing: '3px' }}>CODEN</span>
          </Link>
        </div>

        <div className="card p-1 flex rounded-sm">
          <button onClick={() => { setMode('login'); setLoginError('') }} className={`flex-1 py-3 rounded-sm font-chakra font-bold text-sm uppercase transition-all ${mode === 'login' ? 'bg-orange-primary text-ink' : 'text-lavender-muted'}`}>Log In</button>
          <button onClick={() => { setMode('signup'); setSignupError('') }} className={`flex-1 py-3 rounded-sm font-chakra font-bold text-sm uppercase transition-all ${mode === 'signup' ? 'bg-orange-primary text-ink' : 'text-lavender-muted'}`}>Sign Up</button>
        </div>

        {mode === 'login' && (
          <div className="card p-8 space-y-6">
            <h1 className="text-2xl font-chakra font-bold text-white">Welcome back</h1>
            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Email</label>
              <input type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">Password</label>
              <input type="password" placeholder="Your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim" />
            </div>
            {loginError && <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {loginError}</p>}
            <button onClick={handleLogin} disabled={loginLoading} className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase disabled:opacity-60">
              {loginLoading ? 'LOGGING IN...' : 'LOG IN →'}
            </button>
            <p className="text-center text-sm text-lavender-dim">No account? <button onClick={() => setMode('signup')} className="text-orange-primary font-bold">Sign up free</button></p>
          </div>
        )}

        {mode === 'signup' && (
          <div className="card p-8 space-y-4">
            <h1 className="text-2xl font-chakra font-bold text-white">Join Vibe Coden</h1>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="font-mono text-xs text-lavender-dim uppercase">Full Name *</label><input type="text" placeholder="Alex Johnson" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim mt-1" /></div>
              <div><label className="font-mono text-xs text-lavender-dim uppercase">Username *</label><input type="text" placeholder="@alexcodes" value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g,''))} className="w-full bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim mt-1" /></div>
            </div>
            <div><label className="font-mono text-xs text-lavender-dim uppercase">Email *</label><input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="font-mono text-xs text-lavender-dim uppercase">Password *</label><input type="password" placeholder="Min 8 chars" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim mt-1" /></div>
              <div><label className="font-mono text-xs text-lavender-dim uppercase">Confirm *</label><input type="password" placeholder="Repeat" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim mt-1" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="font-mono text-xs text-lavender-dim uppercase">Age *</label><input type="number" placeholder="16" min="13" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim mt-1" /></div>
              <div><label className="font-mono text-xs text-lavender-dim uppercase">City *</label><input type="text" placeholder="Atlanta" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent placeholder-lavender-dim mt-1" /></div>
              <div><label className="font-mono text-xs text-lavender-dim uppercase">State *</label><select value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-panel-deep border border-violet-border rounded-sm px-3 py-2 text-lavender text-sm outline-none focus:border-violet-accent mt-1"><option value="">--</option>{US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div className="flex gap-3 items-start">
              <button onClick={() => setAgreedToTerms(!agreedToTerms)} className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded border flex items-center justify-center ${agreedToTerms ? 'bg-orange-primary border-orange-primary text-ink' : 'border-violet-border'}`}>{agreedToTerms && '✓'}</button>
              <p className="text-xs text-lavender-muted">I agree to the <a href="#" className="text-orange-primary">Terms of Service</a> and <a href="#" className="text-orange-primary">Privacy Policy</a>.</p>
            </div>
            {signupError && <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {signupError}</p>}
            <button onClick={handleSignup} disabled={signupLoading} className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase disabled:opacity-60">
              {signupLoading ? 'CREATING ACCOUNT...' : 'CREATE FREE ACCOUNT →'}
            </button>
            <p className="text-center text-sm text-lavender-dim">Have an account? <button onClick={() => setMode('login')} className="text-orange-primary font-bold">Log in</button></p>
          </div>
        )}
        <div className="text-center"><Link href="/" className="font-mono text-xs text-lavender-dim hover:text-lavender uppercase">← Back to Home</Link></div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]

const HEARD_ABOUT_OPTIONS = [
  'Friend or family',
  'School / teacher',
  'Social media',
  'A donor',
  'Vibe Coden website',
  'Other',
]

export default function ApplyForScholarship() {
  // Form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [goal, setGoal] = useState('')
  const [story, setStory] = useState('')
  const [heardAbout, setHeardAbout] = useState('')
  const [agree1, setAgree1] = useState(false)
  const [agree2, setAgree2] = useState(false)

  // Submit state
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setError('')

    if (!fullName.trim()) return setError('Please enter your full name.')
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address.')
    if (!age) return setError('Please select your age.')
    if (!city.trim()) return setError('Please enter your city.')
    if (!state) return setError('Please select your state.')
    if (!parentName.trim()) return setError('Please enter your parent or guardian\u2019s name.')
    if (!parentEmail.trim() || !parentEmail.includes('@')) return setError('Please enter a valid parent/guardian email.')
    if (!goal.trim() || goal.trim().length < 15) return setError('Please tell us what you want to build (at least a sentence).')
    if (!story.trim() || story.trim().length < 40) return setError('Please share a bit more of your story (at least a couple of sentences).')
    if (!agree1) return setError('Please confirm your parent or guardian has agreed to this application.')
    if (!agree2) return setError('Please confirm your commitment to the program.')

    setLoading(true)
    try {
      const res = await fetch('/api/scholarship-applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          age,
          city: city.trim(),
          state,
          parentName: parentName.trim(),
          parentEmail: parentEmail.trim(),
          goal: goal.trim(),
          story: story.trim(),
          heardAbout,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center card bg-gradient-hero p-10 space-y-5 border border-success-green/40">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-chakra font-bold text-white">Application submitted!</h1>
          <p className="text-lavender-muted">
            Thank you for applying, <span className="text-white">{fullName.split(' ')[0]}</span>. Our team will review your application and get back to you (and your parent/guardian) by email within 7 days.
          </p>
          <div className="pt-4 flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover"
            >
              BACK TO HOME
            </Link>
            <Link
              href="/learn/lesson-1"
              className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
            >
              START LESSON 1 →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16">

      {/* Header */}
      <div className="mb-10">
        <Link href="/" className="font-mono text-xs text-lavender-dim hover:text-lavender transition-colors">← BACK TO HOME</Link>
        <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] text-orange-primary bg-orange-primary/10 border border-orange-primary/30 rounded-full px-3 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-primary animate-glow-pulse" />
          AI SCHOLARSHIPS · APPLICATIONS OPEN
        </div>
        <h1 className="text-3xl sm:text-5xl font-chakra font-bold text-white leading-tight mb-3">
          Apply for a scholarship
        </h1>
        <p className="text-lavender-muted max-w-xl">
          Vibe Coden scholarships cover full access to AI tools, mentorship, and vibe-a-thon entry — <span className="text-white">$0 cost to you.</span> If you\u2019re curious and willing to learn, money shouldn\u2019t stand in your way. Tell us about yourself below.
        </p>
      </div>

      <div className="card p-8 sm:p-10 space-y-8">

        {/* About you */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="font-chakra font-bold text-orange-primary text-lg">01</span>
            <h2 className="text-xl font-chakra font-bold text-white">About you</h2>
          </div>

          <FormField label="Full name *">
            <input
              type="text" placeholder="Your first and last name"
              value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="input"
            />
          </FormField>

          <FormField label="Email *">
            <input
              type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </FormField>

          <div className="grid sm:grid-cols-3 gap-4">
            <FormField label="Age *">
              <select value={age} onChange={(e) => setAge(e.target.value)} className="input">
                <option value="">Select age</option>
                {[13,14,15,16,17,18,19].map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormField>
            <FormField label="City *">
              <input
                type="text" placeholder="City"
                value={city} onChange={(e) => setCity(e.target.value)}
                className="input"
              />
            </FormField>
            <FormField label="State *">
              <select value={state} onChange={(e) => setState(e.target.value)} className="input">
                <option value="">Select</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </div>

        {/* Parent/Guardian */}
        <div className="space-y-5 pt-2 border-t border-violet-border/40">
          <div className="flex items-center gap-3 pt-4">
            <span className="font-chakra font-bold text-orange-primary text-lg">02</span>
            <h2 className="text-xl font-chakra font-bold text-white">Parent or guardian</h2>
          </div>
          <p className="text-sm text-lavender-dim -mt-3">
            We\u2019ll copy them on any communication about your application.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Parent/Guardian name *">
              <input
                type="text" placeholder="Their full name"
                value={parentName} onChange={(e) => setParentName(e.target.value)}
                className="input"
              />
            </FormField>
            <FormField label="Parent/Guardian email *">
              <input
                type="email" placeholder="their@example.com"
                value={parentEmail} onChange={(e) => setParentEmail(e.target.value)}
                className="input"
              />
            </FormField>
          </div>
        </div>

        {/* Your story */}
        <div className="space-y-5 pt-2 border-t border-violet-border/40">
          <div className="flex items-center gap-3 pt-4">
            <span className="font-chakra font-bold text-orange-primary text-lg">03</span>
            <h2 className="text-xl font-chakra font-bold text-white">Your story</h2>
          </div>

          <FormField label="What do you want to build? *" hint="Tell us your project idea. It's okay if it's rough — we love ambition.">
            <textarea
              placeholder="e.g. An app that connects neighbors with local food banks..."
              value={goal} onChange={(e) => setGoal(e.target.value)}
              rows={3}
              className="input resize-none"
            />
          </FormField>

          <FormField label="Tell us about yourself and why this scholarship matters to you *" hint="What's your background? Why does this program matter for you specifically? (A few sentences is plenty.)">
            <textarea
              placeholder="I'm 16 and live in..."
              value={story} onChange={(e) => setStory(e.target.value)}
              rows={6}
              className="input resize-none"
            />
          </FormField>

          <FormField label="How did you hear about Vibe Coden?">
            <select value={heardAbout} onChange={(e) => setHeardAbout(e.target.value)} className="input">
              <option value="">Optional</option>
              {HEARD_ABOUT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>
        </div>

        {/* Agreements */}
        <div className="space-y-4 pt-2 border-t border-violet-border/40">
          <div className="pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox" checked={agree1} onChange={(e) => setAgree1(e.target.checked)}
                className="mt-1 w-5 h-5 accent-orange-primary flex-shrink-0"
              />
              <span className="text-sm text-lavender-muted group-hover:text-lavender">
                My parent or guardian has agreed to this application and is okay being contacted at the email above.
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox" checked={agree2} onChange={(e) => setAgree2(e.target.checked)}
                className="mt-1 w-5 h-5 accent-orange-primary flex-shrink-0"
              />
              <span className="text-sm text-lavender-muted group-hover:text-lavender">
                I\u2019m ready to commit to the program and give it my honest effort.
              </span>
            </label>
          </div>
        </div>

        {/* Error + submit */}
        {error && (
          <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">⚠ {error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover disabled:opacity-60"
        >
          {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION →'}
        </button>

        <p className="text-xs text-lavender-dim text-center font-mono">
          You\u2019ll hear back within 7 days · Applications are reviewed by real humans
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          background: var(--panel-deep, #120a1e);
          border: 1px solid rgba(139, 92, 246, 0.24);
          border-radius: 4px;
          padding: 12px 16px;
          color: #E7DEF8;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: rgba(139, 92, 246, 0.7); }
        .input::placeholder { color: #7A6AA0; }
      `}</style>
    </div>
  )
}

// Small reusable field component
function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-xs text-lavender-dim uppercase tracking-widest">{label}</label>
      {children}
      {hint && <p className="text-xs text-lavender-dim">{hint}</p>}
    </div>
  )
}

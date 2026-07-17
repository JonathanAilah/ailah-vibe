'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAppContext } from '@/app/context'

export default function Dashboard() {
  const { projects, submitProject, user, isLoggedIn } = useAppContext()
  const userName = user ? user.fullName.split(' ')[0].toUpperCase() : 'BUILDER'
  const streakDays = 0
  const currentLevel = 1
  const nextLevel = 2
  const currentXP = 0
  const maxXP = 500
  const xpProgress = (currentXP / maxXP) * 100

  // Submission form state
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitTitle, setSubmitTitle] = useState('')
  const [submitDescription, setSubmitDescription] = useState('')
  const [submitCategory, setSubmitCategory] = useState<'App' | 'Game' | 'Site'>('App')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!submitTitle.trim()) { setError('Please enter a project title.'); return }
    if (!submitDescription.trim()) { setError('Please enter a project description.'); return }
    if (submitDescription.trim().length < 20) { setError('Description must be at least 20 characters.'); return }
    submitProject(submitTitle.trim(), submitDescription.trim(), submitCategory)
    setSubmitted(true)
    setError('')
  }

  const handleCloseModal = () => {
    setShowSubmitModal(false)
    setSubmitted(false)
    setSubmitTitle('')
    setSubmitDescription('')
    setSubmitCategory('App')
    setError('')
  }

  // Only show real submitted projects
  const allBuilds = projects.map((p) => ({
    id: p.id,
    status: 'SHIPPED',
    title: p.title,
    category: p.category,
    votes: 0,
    total: 0,
    isNew: true,
  }))

  const lessons = [
    { id: 1, title: 'Getting Started with AI', done: true, current: false },
    { id: 2, title: 'Building Your First App', done: true, current: false },
    { id: 3, title: 'Deploying to Production', done: false, current: true },
    { id: 4, title: 'Advanced AI Prompting', done: false, current: false },
    { id: 5, title: 'Community & Collaboration', done: false, current: false },
  ]

  const badges = [
    { id: 1, name: 'First Ship', earned: projects.length > 0 },
    { id: 2, name: '1K Votes', earned: false },
    { id: 3, name: 'Podium', earned: false },
    { id: 4, name: 'Legend', earned: false },
  ]

  return (
    <div className="space-y-16">

      {/* Not logged in banner */}
      {!isLoggedIn && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8">
          <div className="card bg-gradient-hero p-6 flex items-center justify-between gap-4 flex-wrap border border-orange-border">
            <div>
              <p className="font-chakra font-bold text-white">You are browsing as a guest</p>
              <p className="text-sm text-lavender-muted">Log in or sign up to track your progress, submit projects, and earn XP.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/login" className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover">
                LOG IN / SIGN UP →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16">
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <div>
            <p className="eyebrow mb-2">// WELCOME BACK</p>
            <h1 className="text-4xl sm:text-5xl font-chakra font-bold text-white">
              {userName} <span className="text-orange-primary">↗</span>
            </h1>
          </div>
          <div className="card px-6 py-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-success-green rounded-full animate-glow-pulse" />
            <span className="font-chakra font-bold text-white">
              {streakDays > 0 ? `${streakDays}-DAY STREAK · KEEP IT ALIVE` : 'START YOUR STREAK TODAY'}
            </span>
          </div>
        </div>
      </section>

      {/* Level Card + Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="space-y-6">
          <div className="card bg-gradient-hero p-8 sm:p-12 space-y-6 border border-orange-border">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div>
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-2">BUILDER LEVEL</p>
                <p className="text-4xl font-chakra font-bold text-white">LVL {currentLevel}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-2">NEXT: LVL {nextLevel}</p>
                <p className="text-4xl font-chakra font-bold text-orange-primary">{maxXP - currentXP}</p>
                <p className="text-xs text-lavender-dim">XP to go</p>
              </div>
              <div className="col-span-2">
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-2">PROGRESS</p>
                <div className="flex gap-3 items-center">
                  <div className="flex-1 bg-panel-deep rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-accent h-full" style={{ width: `${xpProgress}%` }} />
                  </div>
                  <span className="text-lg font-chakra font-bold text-white min-w-[80px] text-right">
                    {xpProgress.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-lavender-dim mt-2">
                  {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Projects Shipped', value: String(projects.length) },
              { label: 'Total Votes', value: '0' },
              { label: 'Best Rank', value: '--' },
              { label: 'Vibe-a-thons', value: '0' },
            ].map((stat, i) => (
              <div key={i} className="card p-6 text-center">
                <p className="font-mono text-xs text-lavender-dim uppercase tracking-widest mb-3">{stat.label}</p>
                <p className="text-3xl font-chakra font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Entry — only show if user has submitted a project */}
      {projects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="card bg-gradient-hero p-8 sm:p-12 space-y-6 border border-orange-border">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-orange-primary rounded-full animate-live-pulse" />
              <span className="font-chakra font-bold text-orange-primary uppercase tracking-widest">● YOUR LATEST SUBMISSION</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white mb-4">{projects[0].title}</h2>
                <div className="space-y-3">
                  <div>
                    <p className="font-mono text-xs text-lavender-dim uppercase mb-1">Category</p>
                    <p className="text-lg font-chakra font-bold text-white">{projects[0].category}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-lavender-dim uppercase mb-1">Submitted by</p>
                    <p className="text-lg font-chakra font-bold text-white">{projects[0].handle}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30">
                  <p className="font-mono text-xs text-lavender-dim mb-2">VOTES</p>
                  <p className="text-3xl font-chakra font-bold text-orange-primary">0</p>
                </div>
                <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30">
                  <p className="font-mono text-xs text-lavender-dim mb-2">STATUS</p>
                  <p className="text-3xl font-chakra font-bold text-success-green">LIVE</p>
                </div>
                <Link
                  href="/vibe-a-thons"
                  className="lg:col-span-2 px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5 text-center"
                >
                  VIEW ON LEADERBOARD →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* No submissions yet CTA */}
      {projects.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-6 border border-violet-border">
            <div className="text-5xl">🚀</div>
            <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">Ready to compete?</h2>
            <p className="text-lavender-muted max-w-lg mx-auto">
              Submit your first build to the vibe-a-thon leaderboard. Build something, describe it, and let the community vote.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/learn/lesson-1"
                className="px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet">
                TAKE A LESSON FIRST →
              </Link>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
                SUBMIT YOUR FIRST BUILD →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Your Builds */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mb-8">
          <h2 className="text-3xl font-chakra font-bold text-white">YOUR BUILDS</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allBuilds.map((build) => (
            <div key={build.id} className="card overflow-hidden group">
              <div className={`h-48 flex items-center justify-center ${'isNew' in build && build.isNew ? 'bg-stripe-orange' : 'bg-stripe-violet'}`}>
                <span className="text-lavender-dim text-sm font-mono text-center px-4">{build.title}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-chakra font-bold text-white text-sm">{build.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${
                      build.status === 'SHIPPED'
                        ? 'bg-success-green/20 text-success-green'
                        : 'bg-orange-primary/20 text-orange-primary'
                    }`}>
                      {build.status}
                    </span>
                  </div>
                  <p className="text-sm text-lavender-dim">
                    {build.category} · {build.votes} votes
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Submit New Build tile */}
          <div
            onClick={() => {
              if (!isLoggedIn) {
                window.location.href = '/login'
              } else {
                setShowSubmitModal(true)
              }
            }}
            className="card border-2 border-dashed border-violet-accent/50 min-h-80 flex items-center justify-center hover:border-violet-accent transition-colors cursor-pointer group"
          >
            <div className="text-center space-y-2">
              <div className="text-4xl text-lavender-dim group-hover:text-lavender transition-colors">
                {isLoggedIn ? '+' : '🔒'}
              </div>
              <p className="font-chakra font-bold text-lavender-muted group-hover:text-lavender transition-colors">
                {isLoggedIn ? 'SUBMIT NEW BUILD' : 'LOGIN TO SUBMIT'}
              </p>
              <p className="font-mono text-xs text-lavender-dim">
                {isLoggedIn ? 'Enter the vibe-a-thon' : 'Members only'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path + Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card p-8 space-y-6">
            <h3 className="eyebrow">// LEARNING PATH</h3>
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex gap-4 items-start">
                  <div className="mt-1">
                    {lesson.done ? (
                      <div className="w-5 h-5 rounded-sm bg-success-green flex items-center justify-center text-panel-deep text-sm">✓</div>
                    ) : lesson.current ? (
                      <div className="w-5 h-5 rounded-sm bg-orange-primary flex items-center justify-center text-panel-deep text-sm">▶</div>
                    ) : (
                      <div className="w-5 h-5 rounded-sm border border-lavender-dim" />
                    )}
                  </div>
                  <p className={`font-chakra font-bold text-sm ${lesson.done ? 'line-through text-success-green' : 'text-white'}`}>
                    {lesson.title}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/learn/lesson-1"
              className="w-full block text-center px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
            >
              RESUME LESSON →
            </Link>
          </div>

          <div className="card p-8 space-y-6">
            <h3 className="eyebrow">// BADGES</h3>
            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`px-4 py-2 rounded-full font-mono text-xs font-bold uppercase text-center border ${
                    badge.earned
                      ? 'bg-orange-primary/20 text-orange-primary border-orange-primary/50'
                      : 'bg-panel-raised text-lavender-dim border-lavender-dim/30'
                  }`}
                >
                  {badge.earned ? '◆' : '◇'} {badge.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-8" />

      {/* Submit Project Modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(10,6,17,0.92)' }}
          onClick={(e) => { if (e.target === e.currentTarget && !submitted) handleCloseModal() }}
        >
          <div className="card w-full max-w-lg p-8 space-y-6 relative">

            {/* Close */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-lavender-dim hover:text-lavender transition-colors font-mono text-lg"
            >
              ✕
            </button>

            {submitted ? (
              /* Success */
              <div className="text-center space-y-6 py-4">
                <div className="text-6xl">🚀</div>
                <h3 className="text-2xl font-chakra font-bold text-white">Project Submitted!</h3>
                <p className="text-lavender-muted">
                  Your project is now live on the leaderboard. Voters can click "Read More" to see your description and cast their vote!
                </p>
                <div className="bg-panel-deep rounded p-4 border border-success-green/30 text-left space-y-2">
                  <p className="font-mono text-xs text-success-green uppercase tracking-widest">✓ Submitted</p>
                  <p className="font-chakra font-bold text-white">{submitTitle}</p>
                  <p className="text-sm text-lavender-muted">{submitCategory}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
                  >
                    CLOSE
                  </button>
                  <Link
                    href="/vibe-a-thons"
                    onClick={handleCloseModal}
                    className="flex-1 text-center px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover"
                  >
                    VIEW LEADERBOARD →
                  </Link>
                </div>
              </div>
            ) : (
              /* Form */
              <>
                <div>
                  <p className="eyebrow mb-2">// SUBMIT YOUR BUILD</p>
                  <h3 className="text-xl font-chakra font-bold text-white">Enter the Vibe-a-thon</h3>
                  <p className="text-sm text-lavender-muted mt-1">
                    Your submission will appear on the leaderboard instantly.
                  </p>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Neon Pong Deluxe"
                    value={submitTitle}
                    onChange={(e) => { setSubmitTitle(e.target.value); setError('') }}
                    maxLength={60}
                    className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim"
                  />
                  <p className="text-xs text-lavender-dim text-right font-mono">{submitTitle.length}/60</p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">
                    Category *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['App', 'Game', 'Site'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSubmitCategory(cat)}
                        className={`py-3 rounded-sm font-chakra font-bold text-sm uppercase transition-all ${
                          submitCategory === cat
                            ? 'bg-orange-primary text-ink'
                            : 'bg-panel-deep border border-violet-border text-lavender-muted hover:border-violet-accent'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="font-mono text-xs text-lavender-dim uppercase tracking-widest">
                    Project Description *
                  </label>
                  <textarea
                    placeholder="Describe your project. What does it do? What makes it special? Why should people vote for it? (min 20 characters)"
                    value={submitDescription}
                    onChange={(e) => { setSubmitDescription(e.target.value); setError('') }}
                    maxLength={500}
                    rows={5}
                    className="w-full bg-panel-deep border border-violet-border rounded-sm px-4 py-3 text-lavender font-grotesk text-sm outline-none focus:border-violet-accent transition-colors placeholder-lavender-dim resize-none"
                  />
                  <p className="text-xs text-lavender-dim text-right font-mono">{submitDescription.length}/500</p>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/30 rounded p-3">
                    ⚠ {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full px-6 py-4 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
                >
                  SUBMIT TO LEADERBOARD →
                </button>

                <p className="text-xs text-lavender-dim text-center font-mono">
                  Your project will appear on the Vibe-a-thons leaderboard immediately
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

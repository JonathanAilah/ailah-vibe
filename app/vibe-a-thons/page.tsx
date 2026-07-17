'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TerminalWindow } from '@/components/TerminalWindow'
import { Leaderboard } from '@/components/Leaderboard'
import { Countdown } from '@/components/Countdown'

interface VibeAThon {
  id: string
  theme: string
  description: string
  start_date: string
  end_date: string
  first_prize: number
  second_prize: number
  third_prize: number
  status: 'upcoming' | 'live' | 'ended'
}

interface Winner {
  id: string
  title: string
  category: string
  username: string
  voteCount: number
}

export default function VibeatThons() {
  const [current, setCurrent] = useState<VibeAThon | null>(null)
  const [upcomingList, setUpcomingList] = useState<VibeAThon[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/vibe-a-thons/current')
      .then((r) => r.json())
      .then((data) => setCurrent(data.vibeAThon || null))
      .catch(() => setCurrent(null))
      .finally(() => setLoading(false))

    fetch('/api/vibe-a-thons/list')
      .then((r) => r.json())
      .then((data) => {
        const all: VibeAThon[] = data.vibeAThons || []
        setUpcomingList(all.filter((v) => v.status === 'upcoming'))
      })
      .catch(() => setUpcomingList([]))
  }, [])

  useEffect(() => {
    if (current?.status === 'ended') {
      fetch(`/api/vibe-a-thons/${current.id}/winners`)
        .then((r) => r.json())
        .then((data) => setWinners(data.winners || []))
        .catch(() => setWinners([]))
    }
  }, [current])

  const medalColors = ['text-orange-primary', 'text-lavender', 'text-orange-bright']

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-4">THE ARENA · WHERE BUILDERS COMPETE</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-chakra font-bold text-white leading-tight">
                Stop watching. Start{' '}
                <span className="text-orange-primary">shipping.</span>
              </h1>
            </div>
            <p className="text-base sm:text-lg text-lavender-muted max-w-xl">
              Build something in a weekend. Compete against builders worldwide. Community votes. Real cash prizes.
            </p>
            <div className="flex gap-4">
              <Link
                href="/learn/lesson-1"
                className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
              >
                START LEARNING FREE →
              </Link>
              <a
                href="#arena-live"
                className="px-6 py-3 rounded-sm border border-lavender-muted text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet hover:-translate-y-0.5 text-center"
              >
                SEE WHAT'S LIVE ↓
              </a>
            </div>
          </div>

          {/* Right - Terminal */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero blur-3xl opacity-20 -z-10" />
            <TerminalWindow />

            <div className="absolute -top-4 -right-8 animate-floaty">
              <div className="bg-panel-raised border border-violet-border rounded-full px-4 py-2 font-mono text-xs text-lavender-muted">
                {'</> APPS'}
              </div>
            </div>
            <div className="absolute -bottom-4 -left-8 animate-floaty2">
              <div className="bg-panel-raised border border-orange-border rounded-full px-4 py-2 font-mono text-xs text-orange-primary">
                {'▶ GAMES'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Steps */}
      <section id="three-steps" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mb-12">
          <p className="eyebrow mb-4">THE PROCESS</p>
          <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white">
            Three steps. Zero gatekeeping.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Describe It', desc: 'Tell AI what you want to build', code: 'vibe build.ai "make a pong game"' },
            { num: '02', title: 'AI Builds It', desc: 'AI generates working code', code: '→ generating code...\n✓ build ready' },
            { num: '03', title: 'You Ship It', desc: 'Deploy with one click', code: 'npm run deploy\n✓ shipped! 🚀' },
          ].map((step, i) => (
            <div key={i} className="card p-8 space-y-4">
              <div className="text-4xl font-chakra font-bold text-orange-primary">{step.num}</div>
              <div>
                <h3 className="text-xl font-chakra font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-lavender-muted">{step.desc}</p>
              </div>
              <div className="bg-panel-deep rounded p-4 font-mono text-xs text-lavender-dim">
                <pre>{step.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white">
            Real projects. Not tutorials.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {['App', 'Game', 'Site'].map((category) => (
            <div key={category} className="card overflow-hidden">
              <div className="bg-stripe-violet h-48 flex items-center justify-center">
                <span className="text-lavender-dim text-sm font-mono">{category}</span>
              </div>
              <div className="p-6">
                <h3 className="font-chakra font-bold text-white">{category} Example</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Event Band */}
      <section id="arena-live" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {loading ? (
          <div className="card p-12 text-center">
            <p className="text-lavender-muted font-mono text-sm">Loading current event...</p>
          </div>
        ) : !current ? (
          <div className="card bg-gradient-hero p-8 sm:p-12 text-center space-y-4 border border-violet-border">
            <div className="text-5xl">🗓️</div>
            <h2 className="text-2xl sm:text-3xl font-chakra font-bold text-white">No vibe-a-thon scheduled right now</h2>
            <p className="text-lavender-muted">Check back soon — new competitions are announced regularly.</p>
          </div>
        ) : current.status === 'live' ? (
          <div className="card bg-gradient-hero p-8 sm:p-12 space-y-6 border border-orange-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-3 h-3 bg-orange-primary rounded-full animate-glow-pulse" />
              <span className="font-chakra font-bold text-orange-primary uppercase tracking-widest">
                LIVE NOW · VOTING OPEN
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white mb-4">{current.theme}</h2>
                <p className="text-base text-lavender-muted mb-6">{current.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                  <p className="font-mono text-xs text-lavender-dim mb-2">ENDS IN</p>
                  <p className="text-lg font-chakra font-bold text-white truncate">
                    <Countdown targetDate={new Date(current.end_date)} format="HMs" />
                  </p>
                </div>
                <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                  <p className="font-mono text-xs text-lavender-dim mb-2">PRIZE POOL</p>
                  <p className="text-lg font-chakra font-bold text-white">
                    ${(current.first_prize + current.second_prize + current.third_prize).toLocaleString()}
                  </p>
                </div>
                <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                  <p className="font-mono text-xs text-lavender-dim mb-2">1ST PLACE</p>
                  <p className="text-lg font-chakra font-bold text-orange-primary">${current.first_prize.toLocaleString()}</p>
                </div>
                <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                  <p className="font-mono text-xs text-lavender-dim mb-2">2ND / 3RD</p>
                  <p className="text-lg font-chakra font-bold text-white">${current.second_prize} / ${current.third_prize}</p>
                </div>
              </div>
            </div>
          </div>
        ) : current.status === 'upcoming' ? (
          <div className="card bg-gradient-hero p-8 sm:p-12 space-y-6 border border-violet-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-3 h-3 bg-violet-accent rounded-full animate-glow-pulse" />
              <span className="font-chakra font-bold text-violet-accent uppercase tracking-widest">STARTING SOON</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white mb-4">{current.theme}</h2>
                <p className="text-base text-lavender-muted mb-6">{current.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                  <p className="font-mono text-xs text-lavender-dim mb-2">STARTS IN</p>
                  <p className="text-lg font-chakra font-bold text-white truncate">
                    <Countdown targetDate={new Date(current.start_date)} format="DHms" />
                  </p>
                </div>
                <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                  <p className="font-mono text-xs text-lavender-dim mb-2">PRIZE POOL</p>
                  <p className="text-lg font-chakra font-bold text-white">
                    ${(current.first_prize + current.second_prize + current.third_prize).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-gradient-hero p-8 sm:p-12 space-y-6 border border-violet-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-chakra font-bold text-lavender-dim uppercase tracking-widest">● EVENT ENDED</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white mb-2">{current.theme}</h2>
            <p className="text-base text-lavender-muted mb-6">{current.description}</p>

            {winners.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {winners.map((w, i) => (
                  <div key={w.id} className="bg-panel-deep/50 rounded p-6 border border-violet-border/30 text-center space-y-2">
                    <div className="text-3xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                    <p className={`font-chakra font-bold ${medalColors[i]}`}>{w.title}</p>
                    <p className="text-xs text-lavender-dim font-mono">@{w.username}</p>
                    <p className="text-sm text-lavender-muted">{w.voteCount} votes</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lavender-dim font-mono text-sm">No submissions were recorded for this event.</p>
            )}
          </div>
        )}
      </section>

      {/* Leaderboard Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white">The Leaderboard</h2>
            </div>
            <Leaderboard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h3 className="eyebrow">// HOW JUDGING WORKS</h3>
              <p className="text-sm text-lavender-muted">
                Community votes. One vote per person per build. Top 3 at deadline win prizes.
              </p>
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="eyebrow">// PRIZES</h3>
              {current ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-orange-primary font-chakra font-bold">1st Place</div>
                    <p className="text-sm text-lavender-muted">${current.first_prize.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="text-lavender font-chakra font-bold">2nd Place</div>
                    <p className="text-sm text-lavender-muted">${current.second_prize.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="text-orange-bright font-chakra font-bold">3rd Place</div>
                    <p className="text-sm text-lavender-muted">${current.third_prize.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-lavender-dim font-mono">No active event</p>
              )}
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="eyebrow">// UPCOMING</h3>
              {upcomingList.length > 0 ? (
                <div className="space-y-3 text-sm">
                  {upcomingList.slice(0, 3).map((v, i) => {
                    const colors = ['border-orange-primary', 'border-violet-accent', 'border-success-green']
                    return (
                      <div key={v.id} className={`border-l-2 ${colors[i % 3]} pl-3`}>
                        <div className="font-chakra font-bold text-white">{v.theme}</div>
                        <div className="text-lavender-dim">{new Date(v.start_date).toLocaleDateString()}</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-lavender-dim font-mono">No upcoming events scheduled yet</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  )
}

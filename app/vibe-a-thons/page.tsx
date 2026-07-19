'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { TerminalWindow } from '@/components/TerminalWindow'
import { Leaderboard } from '@/components/Leaderboard'

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

interface Stats {
  students: number
  projects_shipped: number
  prizes_awarded: number
  scholarships_awarded: number
}

// Countdown hook — takes a timestamp (number) for stable reference equality
function useCountdown(targetTimestamp: number) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, targetTimestamp - Date.now())
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [targetTimestamp])
  return time
}

export default function VibeatThons() {
  const [current, setCurrent] = useState<VibeAThon | null>(null)
  const [upcomingList, setUpcomingList] = useState<VibeAThon[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ students: 0, projects_shipped: 0, prizes_awarded: 0, scholarships_awarded: 0 })

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

    fetch('/api/site-stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => null)
  }, [])

  useEffect(() => {
    if (current?.status === 'ended') {
      fetch(`/api/vibe-a-thons/${current.id}/winners`)
        .then((r) => r.json())
        .then((data) => setWinners(data.winners || []))
        .catch(() => setWinners([]))
    }
  }, [current])

  const endTimestamp = useMemo(() => (current ? new Date(current.end_date).getTime() : 0), [current])
  const startTimestamp = useMemo(() => (current ? new Date(current.start_date).getTime() : 0), [current])
  const endCd = useCountdown(endTimestamp)
  const startCd = useCountdown(startTimestamp)

  const totalPrizePool = current
    ? current.first_prize + current.second_prize + current.third_prize
    : 0

  return (
    <div className="space-y-0">

      {/* ── HERO SECTION ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] py-[clamp(44px,6vw,84px)] grid lg:grid-cols-[1.05fr_0.95fr] gap-[clamp(28px,4vw,60px)] items-center">

        {/* Left */}
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[2px] text-lavender-muted border border-violet-accent/40 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-primary animate-glow-pulse" />
            THE ARENA · WHERE BUILDERS COMPETE
          </div>

          <h1 className="font-chakra font-bold text-[clamp(42px,6vw,84px)] leading-[0.95] tracking-tight uppercase mb-6 text-white">
            Stop watching.<br />Start{' '}
            <span style={{ WebkitTextStroke: '2px #FF8A21', WebkitTextFillColor: 'transparent' }}>
              shipping.
            </span>
          </h1>

          <p className="text-[clamp(16px,1.5vw,19px)] leading-relaxed text-lavender-muted max-w-[540px] mb-8">
            Describe what you want, let AI write the code, and ship real apps, games &amp; sites — then throw down in vibe-a-thons where the community votes and winners take real prizes.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Link
              href="/learn/lesson-1"
              className="font-chakra font-bold text-[15px] tracking-wide text-ink bg-orange-primary px-6 py-4 rounded-[11px] transition-all hover:-translate-y-0.5 hover:shadow-orange-glow-hover"
            >
              START LEARNING FREE →
            </Link>
            <a
              href="#arena-live"
              className="font-chakra font-bold text-[15px] tracking-wide text-lavender-muted border border-lavender-muted/40 px-6 py-4 rounded-[11px] transition-all hover:-translate-y-0.5 hover:bg-surface-violet text-center"
            >
              SEE WHAT'S LIVE ↓
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-[500px]">
            <div>
              <p className="font-chakra font-bold text-[clamp(24px,2.8vw,32px)] text-orange-primary leading-none">
                {stats.students >= 1000 ? (stats.students / 1000).toFixed(1) + 'K' : stats.students.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] text-lavender-dim uppercase tracking-widest mt-2">Students</p>
            </div>
            <div>
              <p className="font-chakra font-bold text-[clamp(24px,2.8vw,32px)] text-white leading-none">
                {stats.projects_shipped.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] text-lavender-dim uppercase tracking-widest mt-2">Shipped</p>
            </div>
            <div>
              <p className="font-chakra font-bold text-[clamp(24px,2.8vw,32px)] text-orange-primary leading-none">
                ${stats.prizes_awarded >= 1000 ? (stats.prizes_awarded / 1000).toFixed(1) + 'K' : stats.prizes_awarded.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] text-lavender-dim uppercase tracking-widest mt-2">In Prizes</p>
            </div>
          </div>
        </div>

        {/* Right — Terminal */}
        <div className="relative min-w-0">
          <div className="absolute inset-0 bg-gradient-hero blur-3xl opacity-20 -z-10 pointer-events-none" />
          <TerminalWindow />

          <div className="absolute -top-4 -right-8 animate-floaty pointer-events-none">
            <div className="bg-panel-raised border border-violet-border rounded-full px-4 py-2 font-mono text-xs text-lavender-muted">
              {'</> APPS'}
            </div>
          </div>
          <div className="absolute -bottom-4 -left-8 animate-floaty2 pointer-events-none">
            <div className="bg-panel-raised border border-orange-border rounded-full px-4 py-2 font-mono text-xs text-orange-primary">
              {'▶ GAMES'}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW THE VIBE WORKS ── */}
      <section id="three-steps" className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] pb-[clamp(48px,7vw,90px)]">
        <div className="mb-10">
          <p className="font-mono text-[11px] tracking-[2px] text-orange-primary mb-3">// HOW THE VIBE WORKS</p>
          <h2 className="font-chakra font-bold text-[clamp(32px,4.5vw,56px)] uppercase text-white leading-tight">
            Three steps. Zero gatekeeping.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              num: '01',
              title: 'Describe it',
              desc: 'Say what you want in plain English. No syntax, no setup, no fear.',
              code: '> make a 2-player pong game',
            },
            {
              num: '02',
              title: 'AI builds it',
              desc: 'The AI writes the code while you steer. You learn by watching it work.',
              code: '✦ writing game loop + controls…',
            },
            {
              num: '03',
              title: 'You ship it',
              desc: 'Deploy it, share the link, and enter it in the next vibe-a-thon.',
              code: '✓ live · vibecoden.dev/@you',
            },
          ].map((step) => (
            <div key={step.num} className="card p-7 space-y-5">
              <div className="flex items-baseline gap-3">
                <span className="font-chakra font-bold text-[36px] text-orange-primary leading-none">{step.num}</span>
                <h3 className="font-chakra font-bold text-[22px] text-white">{step.title}</h3>
              </div>
              <p className="text-[15px] text-lavender-muted leading-relaxed">{step.desc}</p>
              <div className="bg-panel-deep rounded-[10px] p-4 font-mono text-xs text-lavender-dim border border-violet-border/40">
                {step.code}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU CAN BUILD ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] pb-[clamp(48px,7vw,90px)]">
        <div className="mb-10">
          <p className="font-mono text-[11px] tracking-[2px] text-orange-primary mb-3">// WHAT YOU CAN BUILD</p>
          <h2 className="font-chakra font-bold text-[clamp(32px,4.5vw,56px)] uppercase text-white leading-tight mb-3">
            Real projects.<br />
            <span className="text-lavender-muted">Not tutorials.</span>
          </h2>
          <p className="text-[clamp(15px,1.4vw,17px)] text-lavender-muted max-w-[600px]">
            Everything here was vibe-coded by a student who started at zero.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              label: 'APP',
              title: 'Habit & streak trackers',
              desc: 'Tools your friends will actually use every day.',
              bg: 'repeating-linear-gradient(45deg,#1E1233,#1E1233 14px,#160D24 14px,#160D24 28px)',
              accent: 'text-violet-accent',
              placeholder: '[ app screenshot ]',
            },
            {
              label: 'GAME',
              title: 'Browser games & clones',
              desc: 'Pong, Flappy, Wordle — playable in one link.',
              bg: 'repeating-linear-gradient(45deg,#2a1a12,#2a1a12 14px,#160D24 14px,#160D24 28px)',
              accent: 'text-orange-primary',
              placeholder: '[ game screenshot ]',
            },
            {
              label: 'SITE',
              title: 'Sites & link-in-bios',
              desc: 'A portfolio, a mixtape drop, a startup landing.',
              bg: 'repeating-linear-gradient(45deg,#0f2a1e,#0f2a1e 14px,#160D24 14px,#160D24 28px)',
              accent: 'text-success-green',
              placeholder: '[ site screenshot ]',
            },
          ].map((item) => (
            <div key={item.label} className="card overflow-hidden transition-transform hover:-translate-y-1">
              <div className="aspect-[4/3] flex items-center justify-center" style={{ background: item.bg }}>
                <span className="font-mono text-[11px] tracking-wide text-lavender-dim">{item.placeholder}</span>
              </div>
              <div className="p-6 space-y-2">
                <span className={`font-mono text-[10px] tracking-widest font-bold ${item.accent}`}>{item.label}</span>
                <h3 className="font-chakra font-bold text-[19px] text-white">{item.title}</h3>
                <p className="text-sm text-lavender-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE EVENT BAND ── */}
      <section id="arena-live" className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] pb-[clamp(48px,7vw,90px)]">
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
          <div className="relative overflow-hidden rounded-[22px] p-[clamp(28px,4vw,52px)] border border-orange-border/40" style={{ background: 'linear-gradient(120deg,#2a1550,#3A2A5C 55%,#1a0f2e)' }}>
            <div className="absolute top-[-60px] right-[-30px] w-[260px] h-[260px] rounded-full opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,138,33,.4),transparent 65%)', filter: 'blur(20px)' }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] text-[#FFCE9A] mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-primary animate-live-pulse" />
                LIVE NOW · VOTING OPEN
              </div>
              <h2 className="font-chakra font-bold text-[clamp(28px,3.8vw,48px)] uppercase text-white leading-none mb-2">
                {current.theme}
              </h2>
              <p className="text-lavender-muted mb-8">solo builds · community-voted · 3 winners</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[720px]">
                <div className="bg-panel-deep/40 border border-white/12 rounded-[12px] p-4">
                  <p className="font-mono text-[10px] tracking-widest text-lavender-dim mb-2">ENDS IN</p>
                  <p className="font-chakra font-bold text-[clamp(24px,3vw,32px)] text-white leading-none">
                    {String(endCd.h).padStart(2, '0')}:{String(endCd.m).padStart(2, '0')}:{String(endCd.s).padStart(2, '0')}
                  </p>
                </div>
                <div className="bg-panel-deep/40 border border-white/12 rounded-[12px] p-4">
                  <p className="font-mono text-[10px] tracking-widest text-lavender-dim mb-2">PRIZE POOL</p>
                  <p className="font-chakra font-bold text-[clamp(24px,3vw,32px)] text-orange-primary leading-none">
                    ${totalPrizePool.toLocaleString()}
                  </p>
                </div>
                <div className="bg-panel-deep/40 border border-white/12 rounded-[12px] p-4 col-span-2 md:col-span-1">
                  <p className="font-mono text-[10px] tracking-widest text-lavender-dim mb-2">1ST / 2ND / 3RD</p>
                  <p className="font-chakra font-bold text-[15px] text-white leading-none">
                    ${current.first_prize} · ${current.second_prize} · ${current.third_prize}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : current.status === 'upcoming' ? (
          <div className="relative overflow-hidden rounded-[22px] p-[clamp(28px,4vw,52px)] border border-violet-accent/40" style={{ background: 'linear-gradient(120deg,#1a0f2e,#3A2A5C 55%,#2a1550)' }}>
            <div className="relative">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] text-violet-accent mb-4">
                <span className="w-2 h-2 rounded-full bg-violet-accent animate-live-pulse" />
                STARTING SOON
              </div>
              <h2 className="font-chakra font-bold text-[clamp(28px,3.8vw,48px)] uppercase text-white leading-none mb-2">
                {current.theme}
              </h2>
              <p className="text-lavender-muted mb-8">{current.description}</p>

              <div className="grid grid-cols-2 gap-4 max-w-[500px]">
                <div className="bg-panel-deep/40 border border-white/12 rounded-[12px] p-4">
                  <p className="font-mono text-[10px] tracking-widest text-lavender-dim mb-2">STARTS IN</p>
                  <p className="font-chakra font-bold text-[clamp(20px,2.8vw,28px)] text-white leading-none">
                    {startCd.d}d {String(startCd.h).padStart(2, '0')}:{String(startCd.m).padStart(2, '0')}
                  </p>
                </div>
                <div className="bg-panel-deep/40 border border-white/12 rounded-[12px] p-4">
                  <p className="font-mono text-[10px] tracking-widest text-lavender-dim mb-2">PRIZE POOL</p>
                  <p className="font-chakra font-bold text-[clamp(20px,2.8vw,28px)] text-orange-primary leading-none">
                    ${totalPrizePool.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[22px] p-[clamp(28px,4vw,52px)] border border-violet-border" style={{ background: 'linear-gradient(120deg,#160D24,#2a1550 55%,#1a0f2e)' }}>
            <div className="relative">
              <p className="font-mono text-[11px] tracking-[2px] text-lavender-dim mb-4">● EVENT ENDED</p>
              <h2 className="font-chakra font-bold text-[clamp(28px,3.8vw,48px)] uppercase text-white leading-none mb-2">
                {current.theme}
              </h2>
              <p className="text-lavender-muted mb-8">{current.description}</p>

              {winners.length > 0 ? (
                <div className="grid sm:grid-cols-3 gap-4">
                  {winners.map((w, i) => (
                    <div key={w.id} className="bg-panel-deep/40 border border-white/12 rounded-[12px] p-6 text-center space-y-2">
                      <div className="text-3xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                      <p className="font-chakra font-bold text-white">{w.title}</p>
                      <p className="text-xs text-lavender-dim font-mono">@{w.username}</p>
                      <p className="text-sm text-lavender-muted">{w.voteCount} votes</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lavender-dim font-mono text-sm">No submissions were recorded for this event.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── LEADERBOARD + SIDEBAR ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] pb-[clamp(48px,7vw,90px)]">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main leaderboard */}
          <div>
            <div className="mb-6">
              <h2 className="font-chakra font-bold text-[clamp(28px,3.5vw,40px)] uppercase text-white leading-tight">
                The Leaderboard
              </h2>
            </div>
            <Leaderboard />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-6 space-y-3">
              <p className="font-mono text-[11px] tracking-[2px] text-orange-primary">// HOW JUDGING WORKS</p>
              <p className="text-sm text-lavender-muted leading-relaxed">
                No panel of experts. The <span className="text-white font-semibold">community votes</span> — one vote per person, per build. The top 3 by votes when the clock hits zero take the prizes.
              </p>
            </div>

            <div className="card p-6 space-y-4">
              <p className="font-mono text-[11px] tracking-[2px] text-orange-primary">// PRIZES</p>
              {current ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-lavender-dim">1ST</span>
                    <span className="font-chakra font-bold text-orange-primary">${current.first_prize.toLocaleString()} + featured</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-lavender-dim">2ND</span>
                    <span className="font-chakra font-bold text-lavender">${current.second_prize.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-lavender-dim">3RD</span>
                    <span className="font-chakra font-bold text-lavender-muted">${current.third_prize.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-lavender-dim font-mono">No active event</p>
              )}
            </div>

            <div className="card p-6 space-y-3">
              <p className="font-mono text-[11px] tracking-[2px] text-orange-primary">// UPCOMING</p>
              {upcomingList.length > 0 ? (
                <div className="space-y-3 text-sm">
                  {upcomingList.slice(0, 3).map((v, i) => {
                    const colors = ['border-orange-primary', 'border-violet-accent', 'border-success-green']
                    const start = new Date(v.start_date)
                    const daysUntil = Math.ceil((start.getTime() - Date.now()) / 86400000)
                    return (
                      <div key={v.id} className={`border-l-2 ${colors[i % 3]} pl-3`}>
                        <div className="font-chakra font-bold text-white">{v.theme}</div>
                        <div className="text-lavender-dim font-mono text-xs">
                          {daysUntil > 0 ? `starts in ${daysUntil} day${daysUntil === 1 ? '' : 's'}` : 'starting soon'}
                        </div>
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

      <div className="h-8" />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
// Countdown handled inline via hook

// Live Activity feed — simulated for now, can be wired to real Supabase events later
const FEED_ITEMS = [
  { icon: '🚀', text: 'Marcus T. shipped "Neighborhood Connect" app', tag: 'NEW', color: '#7EE0A8', ago: '2m ago' },
  { icon: '🏆', text: 'Jasmine R. placed 2nd in Make People Laugh', tag: 'WINNER', color: '#FF8A21', ago: '14m ago' },
  { icon: '♥', text: 'Anonymous donor funded a scholarship', tag: 'FUNDED', color: '#C9B6EF', ago: '28m ago' },
  { icon: '⭐', text: 'Devon W. leveled up to Builder Level 4', tag: '', color: '#8B5CF6', ago: '45m ago' },
  { icon: '🎯', text: 'New vibe-a-thon submitted: "Fix My Life" utility app', tag: 'LIVE', color: '#FF8A21', ago: '1h ago' },
]

// Simple countdown hook - takes a stable timestamp number, not a Date object
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

// Vibe-a-thon teaser — wired to real API
function useNextVibeAThon() {
  const [vibeAThon, setVibeAThon] = useState<{
    theme: string
    start_date: string
    end_date: string
    status: string
    first_prize: number
    second_prize: number
    third_prize: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/vibe-a-thons/current')
      .then((r) => r.json())
      .then((d) => setVibeAThon(d.vibeAThon || null))
      .catch(() => null)
  }, [])

  return vibeAThon
}

export default function Home() {
  const vibeAThon = useNextVibeAThon()
  const [feedIndex, setFeedIndex] = useState(0)

  // Rotate live activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex((i) => (i + 1) % FEED_ITEMS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const visibleFeed = Array.from({ length: 4 }, (_, i) =>
    FEED_ITEMS[(feedIndex + i) % FEED_ITEMS.length]
  )

  const nextEventTimestamp = useMemo(() => {
    if (vibeAThon) {
      return new Date(vibeAThon.status === 'upcoming' ? vibeAThon.start_date : vibeAThon.end_date).getTime()
    }
    return Date.now() + 5 * 24 * 60 * 60 * 1000
  }, [vibeAThon])
  const cd = useCountdown(nextEventTimestamp)

  return (
    <div className="space-y-0">

      {/* ── HERO SECTION ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] py-[clamp(44px,6vw,84px)] grid lg:grid-cols-[1.08fr_0.92fr] gap-[clamp(28px,4vw,60px)] items-center">

        {/* Left: Mission */}
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[2px] text-lavender-muted border border-violet-accent/40 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-accent animate-glow-pulse" />
            OUR MISSION · 501(c)(3) NONPROFIT
          </div>

          <h1 className="font-chakra font-bold text-[clamp(42px,6vw,84px)] leading-[0.95] tracking-tight uppercase mb-6 text-white">
            Talent is<br />everywhere.<br />
            <span style={{ WebkitTextStroke: '2px #FF8A21', WebkitTextFillColor: 'transparent' }}>
              Opportunity isn't.
            </span>
          </h1>

          <p className="text-[clamp(16px,1.5vw,19px)] leading-relaxed text-lavender-muted max-w-[540px] mb-4">
            Vibe Coden is a <strong className="text-white">nonprofit</strong> on a mission to empower tech beginners, most in underserved communities. AI is the great equalizer — and no teen should be locked out of it. We teach students with zero experience how to build with AI, so it can position them for real opportunity.
          </p>
          <p className="text-[clamp(16px,1.5vw,19px)] leading-relaxed text-lavender-muted max-w-[540px] mb-8">
            We're powered by donors so that <strong className="text-white">cost is never the reason a kid doesn't start.</strong>
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/fund-a-scholarship"
              className="font-chakra font-bold text-[15px] tracking-wide text-[#1a0f2e] bg-[#C9B6EF] px-7 py-4 rounded-[11px] transition-all hover:-translate-y-0.5 hover:shadow-card-lg"
            >
              FUND A BUILDER ♥
            </Link>
            <Link
              href="/learn/lesson-1"
              className="font-chakra font-bold text-[15px] tracking-wide text-ink bg-orange-primary px-6 py-4 rounded-[11px] transition-all hover:-translate-y-0.5 hover:shadow-orange-glow-hover"
            >
              START LEARNING FREE →
            </Link>
          </div>
        </div>

        {/* Right: Scholarship fund + Live Activity */}
        <div className="min-w-0 flex flex-col gap-4">

          {/* Scholarship Fund Card */}
          <div className="relative overflow-hidden rounded-[18px] p-6 border border-orange-border" style={{ background: 'linear-gradient(160deg,#1E1233,#120A1E)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs tracking-[1.5px] text-lavender-muted">SCHOLARSHIP FUND</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[1.5px] text-orange-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-primary animate-live-pulse" />
                LIVE
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-chakra font-bold text-[clamp(34px,4.4vw,46px)] text-white leading-none">
                $14,800
              </span>
              <span className="font-mono text-sm text-lavender-dim">raised of $20,000 goal</span>
            </div>
            <div className="h-3 rounded-full bg-panel-deep overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-accent"
                style={{ width: '74%', backgroundSize: '200% 100%', animation: 'sheen 2.4s linear infinite' }}
              />
            </div>
            <p className="font-mono text-[11px] text-lavender-dim">74% funded this quarter · $400 sends one student</p>
          </div>

          {/* Live Activity Feed */}
          <div className="rounded-[18px] p-5 border border-violet-border" style={{ background: 'linear-gradient(160deg,#160D24,#120A1E)' }}>
            <p className="font-mono text-[11px] tracking-[2px] text-violet-accent mb-3">// LIVE ACTIVITY</p>
            <div className="flex flex-col gap-2">
              {visibleFeed.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[11px] border border-violet-border/50 transition-all"
                  style={{ background: 'rgba(30,18,51,0.5)' }}
                >
                  <span className="text-sm flex-shrink-0 w-4 text-center">{ev.icon}</span>
                  <span className="flex-1 min-w-0 font-grotesk text-[13px] text-lavender overflow-hidden text-ellipsis whitespace-nowrap">
                    {ev.text}
                  </span>
                  {ev.tag && (
                    <span className="font-mono text-[11px] font-bold text-success-green flex-shrink-0">{ev.tag}</span>
                  )}
                  <span className="font-mono text-[10px] text-lavender-dim flex-shrink-0">{ev.ago}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SCHOLARSHIP SPOTLIGHT ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] pb-[clamp(48px,7vw,90px)]">
        <div className="relative overflow-hidden rounded-[22px] p-[clamp(28px,4vw,52px)] border border-violet-accent/32" style={{ background: 'linear-gradient(120deg,#1a0f2e,#3A2A5C 60%,#2a1550)' }}>
          <div className="absolute bottom-[-70px] right-[-30px] w-[280px] h-[280px] rounded-full opacity-50 pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,138,33,.32),transparent 65%)', filter: 'blur(24px)' }} />
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-[clamp(24px,4vw,48px)] items-center">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] text-[#FFCE9A] mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-primary animate-live-pulse" />
                AI SCHOLARSHIPS · APPLICATIONS OPEN
              </div>
              <h2 className="font-chakra font-bold text-[clamp(28px,3.8vw,48px)] uppercase text-white leading-none mb-4">
                Learn AI — on us.
              </h2>
              <p className="text-[clamp(15px,1.4vw,17px)] leading-relaxed text-lavender-muted max-w-[480px] mb-6">
                Every scholarship fully covers a student's path into AI. If you're curious and willing to learn, money should never stand in your way.
              </p>
              <div className="flex flex-wrap gap-2 mb-7">
                {['✓ Premium AI tools access', '✓ 1-on-1 mentorship', '✓ Free vibe-a-thon entry'].map((item) => (
                  <span key={item} className="font-mono text-xs text-white bg-panel-deep/35 border border-white/14 rounded-[9px] px-3 py-2">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/fund-a-scholarship" className="font-chakra font-bold text-[15px] tracking-wide text-[#1a0f2e] bg-[#C9B6EF] px-7 py-4 rounded-[11px] transition-all hover:-translate-y-0.5">
                  APPLY FOR A SCHOLARSHIP →
                </Link>
                <Link href="/fund-a-scholarship" className="font-chakra font-bold text-[15px] tracking-wide text-ink bg-orange-primary px-6 py-4 rounded-[11px] transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5">
                  FUND A SCHOLARSHIP ♥
                </Link>
              </div>
            </div>

            <div className="bg-panel-deep/40 border border-white/14 rounded-[16px] p-6">
              <p className="font-mono text-[11px] tracking-[1.5px] text-lavender-muted mb-2">THIS COHORT</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-chakra font-bold text-[48px] text-orange-primary leading-none">13</span>
                <span className="font-mono text-sm text-lavender-muted">spots left</span>
              </div>
              <div className="h-3 rounded-full bg-panel-deep overflow-hidden mb-2">
                <div className="h-full w-[74%] rounded-full bg-gradient-accent" style={{ backgroundSize: '200% 100%', animation: 'sheen 2.6s linear infinite' }} />
              </div>
              <p className="font-mono text-[11px] text-lavender-dim">37 of 50 scholarships funded</p>
              <div className="h-px bg-white/12 my-5" />
              <p className="font-mono text-xs text-lavender-muted leading-relaxed">
                $400 sends one student<br />through the full program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section id="impact-stats" className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] pb-[clamp(30px,4vw,44px)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: 12480, label: 'BEGINNERS EMPOWERED', color: 'text-white', border: 'border-violet-border' },
            { value: 214, label: 'SCHOLARSHIPS AWARDED', color: 'text-[#FFA24D]', border: 'border-orange-border/28' },
            { value: 48200, label: 'PRIZES TO STUDENTS', prefix: '$', color: 'text-[#FFA24D]', border: 'border-orange-border/28' },
            { value: 0, label: 'COST TO STUDENTS', prefix: '$', color: 'text-white', border: 'border-violet-border' },
          ].map((stat) => (
            <div key={stat.label} className={`p-6 rounded-[16px] border ${stat.border}`} style={{ background: 'linear-gradient(180deg,rgba(30,18,51,.7),rgba(18,10,30,.7))' }}>
              <p className={`font-chakra font-bold text-[clamp(28px,3.2vw,40px)] leading-none ${stat.color}`}>
                {stat.value === 0 ? `${stat.prefix || ''}0` : `${stat.prefix || ''}${stat.value.toLocaleString()}`}
              </p>
              <p className="font-mono text-[11px] tracking-wide text-lavender-dim mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden whitespace-nowrap py-4 border-t border-violet-border/14 border-b border-b-violet-border/14 font-chakra font-semibold text-[15px] tracking-[3px] text-lavender-dim">
        <div className="inline-flex gap-6" style={{ animation: 'marquee 26s linear infinite' }}>
          <span>NO EXPERIENCE NEEDED ✦ BUILD REAL THINGS ✦ WIN PRIZES ✦ EMPOWER BEGINNERS ✦&nbsp;</span>
          <span>NO EXPERIENCE NEEDED ✦ BUILD REAL THINGS ✦ WIN PRIZES ✦ EMPOWER BEGINNERS ✦&nbsp;</span>
        </div>
      </div>

      {/* ── VIBE-A-THON TEASER ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] py-[clamp(48px,6vw,90px)]">
        <div className="relative overflow-hidden rounded-[22px] p-[clamp(30px,5vw,56px)] border border-orange-border/30" style={{ background: 'linear-gradient(120deg,#2a1550,#3A2A5C 55%,#1a0f2e)' }}>
          <div className="absolute top-[-60px] right-[-30px] w-[260px] h-[260px] rounded-full opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,138,33,.4),transparent 65%)', filter: 'blur(20px)' }} />
          <div className="relative flex flex-wrap items-center justify-between gap-7">
            <div className="min-w-[260px]">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] text-[#FFCE9A] mb-4">
                <span className="w-2 h-2 rounded-full bg-orange-primary animate-live-pulse" />
                {vibeAThon?.status === 'live' ? 'LIVE NOW · ENDS IN' : 'NEXT VIBE-A-THON DROPS IN'}
              </div>
              <div className="flex gap-3 mb-5">
                {[
                  { label: 'DAYS', val: String(cd.d) },
                  { label: 'HRS', val: String(cd.h).padStart(2,'0') },
                  { label: 'MIN', val: String(cd.m).padStart(2,'0') },
                  { label: 'SEC', val: String(cd.s).padStart(2,'0'), orange: true },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-3">
                    {i > 0 && <span className="font-chakra font-bold text-[clamp(34px,5vw,52px)] text-white/30">:</span>}
                    <div className="text-center">
                      <div className={`font-chakra font-bold text-[clamp(34px,5vw,52px)] leading-none ${(unit as {orange?: boolean}).orange ? 'text-orange-primary' : 'text-white'}`}>
                        {unit.val}
                      </div>
                      <div className="font-mono text-[10px] text-lavender-muted tracking-wide mt-1">{unit.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="font-chakra font-bold text-[clamp(22px,3vw,32px)] uppercase text-white">
                {vibeAThon?.theme || 'Build something that makes people laugh'}
              </h2>
            </div>
            <Link
              href="/vibe-a-thons#three-steps"
              className="font-chakra font-bold text-[16px] tracking-[1.5px] text-ink bg-orange-primary px-8 py-5 rounded-[12px] transition-all hover:-translate-y-0.5 hover:shadow-orange-glow-hover whitespace-nowrap"
            >
              ENTER THE ARENA →
            </Link>
          </div>
        </div>
      </section>

      {/* ── MERCH SECTION ── */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-[clamp(16px,5vw,64px)] pb-[clamp(48px,6vw,90px)]">
        <div className="relative overflow-hidden rounded-[22px] p-[clamp(28px,4vw,48px)] border border-violet-border/30" style={{ background: 'linear-gradient(120deg,#160D24,#2a1550 72%,#1a0f2e)' }}>
          <div className="absolute top-[-60px] left-[-30px] w-[260px] h-[260px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,138,33,.28),transparent 65%)', filter: 'blur(24px)' }} />
          <div className="relative grid lg:grid-cols-[0.82fr_1.18fr] gap-[clamp(24px,4vw,44px)] items-center">
            <div>
              <p className="font-mono text-[11px] tracking-[2px] text-[#FFCE9A] mb-4">◆ MERCH DROP · SUPPORT THE MISSION</p>
              <h2 className="font-chakra font-bold text-[clamp(28px,3.8vw,48px)] uppercase text-white leading-none mb-4">
                Wear the vibe.<br />Fund the mission.
              </h2>
              <p className="text-[clamp(15px,1.4vw,17px)] leading-relaxed text-lavender-muted max-w-[400px] mb-6">
                Rep Vibe Coden and put a student in the program — <strong className="text-white">100% of profits</strong> go straight to scholarships.
              </p>
              <Link
                href="/shop"
                className="inline-block font-chakra font-bold text-[15px] tracking-wide text-ink bg-orange-primary px-7 py-4 rounded-[11px] transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
              >
                SHOP MERCH →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'tee', name: 'Outline Tee', price: '$28', funds: 'funds one lesson', border: 'border-violet-border/24', bg: 'repeating-linear-gradient(45deg,#1E1233,#1E1233 12px,#160D24 12px,#160D24 24px)', labelColor: '#7A6AA0' },
                { label: 'hoodie', name: 'Vibe Hoodie', price: '$54', funds: 'funds one week', border: 'border-orange-border/30', bg: 'repeating-linear-gradient(45deg,#2a1a12,#2a1a12 12px,#160D24 12px,#160D24 24px)', labelColor: '#B0865A' },
                { label: 'stickers', name: 'Sticker Pack', price: '$9', funds: 'funds supplies', border: 'border-violet-border/24', bg: 'repeating-linear-gradient(45deg,#1E1233,#1E1233 12px,#160D24 12px,#160D24 24px)', labelColor: '#7A6AA0' },
              ].map((item) => (
                <div key={item.name} className={`rounded-[14px] overflow-hidden border ${item.border} bg-panel-deep transition-transform hover:-translate-y-1.5`}>
                  <div className="aspect-square flex items-center justify-center" style={{ background: item.bg }}>
                    <span className="font-mono text-[10px] tracking-wide" style={{ color: item.labelColor }}>[ {item.label} ]</span>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-baseline gap-2 mb-1">
                      <span className="font-chakra font-semibold text-[15px] text-white">{item.name}</span>
                      <span className="font-mono font-bold text-sm text-orange-primary">{item.price}</span>
                    </div>
                    <p className="font-mono text-[10px] text-lavender-dim">{item.funds}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

'use client'

import Link from 'next/link'
import { CountUpStat } from '@/components/CountUpStat'
import { Countdown } from '@/components/Countdown'

export default function Home() {
  const nextVibeatthonDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-20 lg:py-32">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-chakra font-bold text-white leading-tight">
              Learn AI. Build Real.{' '}
              <span className="text-orange-primary">Win Prizes.</span>
            </h1>
          </div>
          <p className="text-base sm:text-lg text-lavender-muted max-w-2xl">
            Vibe Coden teaches non-technical teens to describe what they want, let AI build it, and ship real apps,
            games, and websites. Then compete in vibe-a-thons for cash prizes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/learn/lesson-1"
              className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
            >
              START LEARNING FREE →
            </Link>
            <a
              href="#impact-stats"
              className="px-6 py-3 rounded-sm border border-lavender-muted text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet hover:-translate-y-0.5 text-center"
            >
              LEARN MORE ↓
            </a>
            <Link
              href="/fund-a-scholarship"
              className="px-6 py-3 rounded-sm border border-orange-primary text-orange-primary font-chakra font-bold text-sm uppercase transition-all hover:bg-orange-primary/10 hover:-translate-y-0.5 text-center"
            >
              ♥ DONATE
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact-stats" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 sm:p-8">
            <CountUpStat end={12480} label="Beginners Empowered" />
          </div>
          <div className="card p-6 sm:p-8">
            <CountUpStat end={214} label="Scholarships Awarded" />
          </div>
          <div className="card p-6 sm:p-8">
            <CountUpStat end={74200} label="Prizes to Students" prefix="$" />
          </div>
          <div className="card p-6 sm:p-8">
            <CountUpStat end={0} label="Cost to Students" prefix="$" />
          </div>
        </div>
      </section>

      {/* Scholarships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="card p-8 sm:p-12 space-y-6">
            <div>
              <p className="eyebrow mb-4">AI SCHOLARSHIPS · APPLICATIONS OPEN</p>
              <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white mb-4">
                Learn AI — On Us.
              </h2>
              <p className="text-base text-lavender-muted">
                We believe every teen should have access to AI learning, regardless of their background. Our scholarship
                program removes the barrier to entry.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-success-green text-lg">✓</span>
                <span className="text-lavender">Premium AI tools access</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-success-green text-lg">✓</span>
                <span className="text-lavender">1-on-1 mentorship</span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-success-green text-lg">✓</span>
                <span className="text-lavender">Free vibe-a-thon entry</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="px-6 py-3 rounded-sm bg-lavender-muted text-purple-deep-2 font-chakra font-bold text-sm uppercase transition-all hover:shadow-lg hover:-translate-y-0.5">
                APPLY FOR A SCHOLARSHIP →
              </button>
              <Link
                href="/fund-a-scholarship"
                className="px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
              >
                ♥ FUND A SCHOLARSHIP
              </Link>
            </div>
          </div>

          <div className="card p-8 sm:p-12 space-y-4">
            <h3 className="text-[22px] font-chakra font-bold text-white leading-tight">Scholarship Cohort</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-lavender-muted">13 spots left</span>
                  <span className="text-orange-primary font-bold">74%</span>
                </div>
                <div className="w-full bg-panel-deep rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-accent h-full"
                    style={{ width: '74%' }}
                  />
                </div>
              </div>
              <p className="text-sm text-lavender-dim">
                37 of 50 scholarships funded
              </p>
              <p className="text-base font-chakra font-bold text-white">
                $400 sends one student
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <section className="py-8 border-y border-violet-border overflow-hidden">
        <div className="flex animate-marquee">
          <span className="whitespace-nowrap text-xl font-chakra font-bold text-white mx-8">
            NO EXPERIENCE NEEDED ✦ BUILD REAL THINGS ✦ WIN PRIZES ✦ EMPOWER BEGINNERS ✦
          </span>
          <span className="whitespace-nowrap text-xl font-chakra font-bold text-white mx-8">
            NO EXPERIENCE NEEDED ✦ BUILD REAL THINGS ✦ WIN PRIZES ✦ EMPOWER BEGINNERS ✦
          </span>
        </div>
      </section>

      {/* Next Vibe-a-thon Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="card bg-gradient-hero p-8 sm:p-12 space-y-6">
          <div>
            <p className="eyebrow mb-4">NEXT EVENT</p>
            <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white mb-4">
              The Arena Awaits
            </h2>
            <p className="text-base text-lavender-muted mb-8">
              Build something that makes people laugh. Compete. Win cash prizes.
            </p>
          </div>

          <div className="bg-panel-deep rounded-lg p-6 border border-violet-border">
            <p className="font-mono text-sm text-lavender-dim uppercase tracking-widest mb-2">
              Event starts in
            </p>
            <div className="text-3xl font-chakra font-bold text-white">
              <Countdown targetDate={nextVibeatthonDate} format="DHms" />
            </div>
          </div>

          <Link
            href="/vibe-a-thons#three-steps"
            className="inline-block px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
          >
            ENTER THE ARENA →
          </Link>
        </div>
      </section>

      {/* Merch Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="space-y-8">
          <div>
            <p className="eyebrow mb-4">100% FUNDS SCHOLARSHIPS</p>
            <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white">
              Wear the Vibe.
              <br />
              <span className="text-orange-primary">Fund the Mission.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="bg-stripe-violet h-48 flex items-center justify-center">
                  <span className="text-lavender-dim text-sm font-mono">Product {i}</span>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-panel-raised rounded mb-3" />
                  <div className="h-3 bg-panel-raised rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover hover:-translate-y-0.5"
          >
            SHOP MERCH →
          </Link>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { TerminalWindow } from '@/components/TerminalWindow'
import { Leaderboard } from '@/components/Leaderboard'
import { Countdown } from '@/components/Countdown'

export default function VibeatThons() {
  const eventEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now

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

            {/* Floating chips */}
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
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mb-12">
          <p className="eyebrow mb-4">THE PROCESS</p>
          <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white">
            Three steps. Zero gatekeeping.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              num: '01',
              title: 'Describe It',
              desc: 'Tell AI what you want to build',
              code: 'vibe build.ai "make a pong game"',
            },
            {
              num: '02',
              title: 'AI Builds It',
              desc: 'AI generates working code',
              code: '→ generating code...\n✓ build ready',
            },
            {
              num: '03',
              title: 'You Ship It',
              desc: 'Deploy with one click',
              code: 'npm run deploy\n✓ shipped! 🚀',
            },
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
        <div className="card bg-gradient-hero p-8 sm:p-12 space-y-6 border border-orange-border">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block w-3 h-3 bg-orange-primary rounded-full animate-glow-pulse" />
            <span className="font-chakra font-bold text-orange-primary uppercase tracking-widest">
              LIVE NOW · VOTING OPEN
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white mb-4">
                Make people laugh.
              </h2>
              <p className="text-base text-lavender-muted mb-6">
                Build a game, app, or website that makes people laugh. Solo builds. Community voted. 3 winners.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                <p className="font-mono text-xs text-lavender-dim mb-2">ENDS IN</p>
                <p className="text-lg font-chakra font-bold text-white truncate">
                  <Countdown targetDate={eventEndDate} format="HMs" />
                </p>
              </div>
              <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                <p className="font-mono text-xs text-lavender-dim mb-2">PRIZE POOL</p>
                <p className="text-lg font-chakra font-bold text-white">$2,500</p>
              </div>
              <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                <p className="font-mono text-xs text-lavender-dim mb-2">ENTRANTS</p>
                <p className="text-lg font-chakra font-bold text-white">47</p>
              </div>
              <div className="bg-panel-deep/50 rounded p-4 border border-violet-border/30 overflow-hidden">
                <p className="font-mono text-xs text-lavender-dim mb-2">1ST PLACE</p>
                <p className="text-lg font-chakra font-bold text-orange-primary">$1,500</p>
              </div>
            </div>
          </div>
        </div>
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
              <div className="space-y-3">
                <div>
                  <div className="text-orange-primary font-chakra font-bold">1st Place</div>
                  <p className="text-sm text-lavender-muted">$1,500 + featured</p>
                </div>
                <div>
                  <div className="text-lavender font-chakra font-bold">2nd Place</div>
                  <p className="text-sm text-lavender-muted">$700</p>
                </div>
                <div>
                  <div className="text-orange-bright font-chakra font-bold">3rd Place</div>
                  <p className="text-sm text-lavender-muted">$300</p>
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="eyebrow">// UPCOMING</h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-2 border-orange-primary pl-3">
                  <div className="font-chakra font-bold text-white">Weekend Warriors</div>
                  <div className="text-lavender-dim">Jan 15</div>
                </div>
                <div className="border-l-2 border-violet-accent pl-3">
                  <div className="font-chakra font-bold text-white">AI Challenge</div>
                  <div className="text-lavender-dim">Jan 22</div>
                </div>
                <div className="border-l-2 border-success-green pl-3">
                  <div className="font-chakra font-bold text-white">Build-a-Thon</div>
                  <div className="text-lavender-dim">Jan 29</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  )
}

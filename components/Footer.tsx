'use client'

import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="border-t border-violet-border bg-ink/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
        <div className="flex justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span
                className="font-chakra font-bold text-xl tracking-wide"
                style={{
                  WebkitTextStroke: '0.8px #E7DEF8',
                  color: 'transparent',
                  letterSpacing: '2px',
                }}
              >
                VIBE
              </span>
              <span
                className="font-chakra font-bold text-xl tracking-wide"
                style={{
                  WebkitTextStroke: '0.8px #FF8A21',
                  color: 'transparent',
                  letterSpacing: '2px',
                }}
              >
                CODEN
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div className="font-mono text-xs tracking-widest text-muted-purple">
            EMPOWERING THE NEXT GEN OF BUILDERS · © 2026
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/fund-a-scholarship"
              className="px-4 py-2 rounded-sm bg-orange-primary text-ink font-chakra font-bold text-sm uppercase transition-all hover:shadow-orange-glow-hover"
            >
              ♥ DONATE
            </Link>
            <Link
              href="/shop"
              className="px-4 py-2 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
            >
              ◆ SHOP MERCH
            </Link>
            <a
              href="#"
              className="px-4 py-2 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
            >
              JOIN THE DISCORD →
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

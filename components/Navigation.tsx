'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppContext } from '@/app/context'

export const Navigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { cart, isLoggedIn, user, logout } = useAppContext()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-[14px] bg-black/45 border-b border-violet-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex flex-col gap-1 flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="font-chakra font-bold text-2xl"
                style={{ WebkitTextStroke: '1px #E7DEF8', color: 'transparent', letterSpacing: '3px' }}>
                VIBE
              </span>
              <span className="font-chakra font-bold text-2xl"
                style={{ WebkitTextStroke: '1px #FF8A21', color: 'transparent', letterSpacing: '3px' }}>
                CODEN
              </span>
            </div>
            <span className="font-mono text-xs text-lavender-darker tracking-widest">
              501(c)(3) NONPROFIT
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5 font-mono text-sm">
              <Link href="/" className={`transition-colors ${isActive('/') ? 'text-orange-primary border-b-2 border-orange-primary' : 'text-lavender-muted/70 hover:text-lavender-muted'}`}>
                HOME
              </Link>
              <Link href="/vibe-a-thons" className={`transition-colors ${isActive('/vibe-a-thons') ? 'text-orange-primary border-b-2 border-orange-primary' : 'text-lavender-muted/70 hover:text-lavender-muted'}`}>
                VIBE-A-THONS
              </Link>
              <Link href="/dashboard" className={`transition-colors ${isActive('/dashboard') ? 'text-orange-primary border-b-2 border-orange-primary' : 'text-lavender-muted/70 hover:text-lavender-muted'}`}>
                DASHBOARD
              </Link>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-violet-border" />

            {/* Shop */}
            <Link href="/shop" className={`relative px-4 py-2 rounded-full font-chakra font-bold text-sm tracking-wide transition-all flex-shrink-0 ${
              isActive('/shop')
                ? 'bg-lavender-muted text-purple-deep-2 ring-2 ring-white'
                : 'bg-lavender-muted text-purple-deep-2 hover:bg-lavender'
            }`}>
              SHOP MERCH
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-deep-2 rounded-full flex items-center justify-center text-xs font-bold text-orange-primary border border-orange-primary">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-orange-primary/20 border border-orange-primary/50 flex items-center justify-center font-chakra font-bold text-orange-primary text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="font-mono text-xs text-lavender-muted hidden sm:block">
                  @{user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="font-mono text-xs text-lavender-dim hover:text-red-400 transition-colors uppercase tracking-widest"
                >
                  LOG OUT
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex-shrink-0 px-4 py-2 rounded-sm border border-violet-accent text-lavender-muted font-chakra font-bold text-sm uppercase transition-all hover:bg-surface-violet"
              >
                LOG IN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

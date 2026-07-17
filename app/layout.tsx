import type { Metadata } from 'next'
import { AppProvider } from '@/app/context'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vibe Coden | Learn AI. Build Real. Win Prizes.',
  description: 'Vibe Coden is a 501(c)(3) nonprofit teaching non-technical teens to build real software with AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-ink">
        <div className="global-background">
          <div className="floating-orb floating-orb-orange" />
          <div className="floating-orb floating-orb-violet" />
        </div>

        <AppProvider>
          <Navigation />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  )
}

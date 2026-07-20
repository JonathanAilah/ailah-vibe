import { type NextRequest, NextResponse } from 'next/server'

// Simplified middleware - just pass through all requests
// Supabase session management handled in API routes instead
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

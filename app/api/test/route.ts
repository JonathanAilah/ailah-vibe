import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return NextResponse.json({
    hasUrl: !!url,
    urlPreview: url ? url.substring(0, 30) + '...' : 'MISSING',
    hasServiceKey: !!key,
    hasAnonKey: !!anonKey,
  })
}

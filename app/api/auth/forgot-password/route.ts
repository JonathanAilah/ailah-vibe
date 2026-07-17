import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const siteUrl = 'https://ailah-vibe.vercel.app'

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
    }

    await fetch(
      `${supabaseUrl}/auth/v1/recover?redirect_to=${encodeURIComponent(siteUrl + '/reset-password')}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: anonKey },
        body: JSON.stringify({ email: email.toLowerCase() }),
      }
    )

    // Always return success — don't reveal whether the email exists
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

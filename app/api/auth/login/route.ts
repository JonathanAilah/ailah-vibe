import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
    }

    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: anonKey },
      body: JSON.stringify({ email: email.toLowerCase(), password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 })
    }

    // Fetch profile (includes xp and level)
    let profile = null
    try {
      const profRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${data.user.id}&select=*`,
        { headers: { apikey: anonKey, Authorization: `Bearer ${data.access_token}` } }
      )
      const profData = await profRes.json()
      profile = profData[0] || null
    } catch {
      // profile fetch is optional
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || '',
        username: profile?.username || data.user.user_metadata?.username || '',
        age: profile?.age?.toString() || data.user.user_metadata?.age?.toString() || '',
        city: profile?.city || data.user.user_metadata?.city || '',
        state: profile?.state || data.user.user_metadata?.state || '',
        xp: profile?.xp ?? 0,
        level: profile?.level ?? 1,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

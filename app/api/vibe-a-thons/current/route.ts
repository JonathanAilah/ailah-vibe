import { NextResponse } from 'next/server'

interface VibeAThonRow {
  id: string
  theme: string
  description: string
  start_date: string
  end_date: string
  first_prize: number
  second_prize: number
  third_prize: number
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    return NextResponse.json({ vibeAThon: null })
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/vibe_a_thons?select=*&order=start_date.desc`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    })
    const all: VibeAThonRow[] = await res.json()
    const now = new Date()

    const withStatus = (Array.isArray(all) ? all : []).map((v) => {
      const start = new Date(v.start_date)
      const end = new Date(v.end_date)
      let status: 'upcoming' | 'live' | 'ended'
      if (now < start) status = 'upcoming'
      else if (now > end) status = 'ended'
      else status = 'live'
      return { ...v, status }
    })

    // Prefer a currently-live event
    const live = withStatus.find((v) => v.status === 'live')
    if (live) return NextResponse.json({ vibeAThon: live })

    // Otherwise the soonest upcoming one
    const upcoming = withStatus
      .filter((v) => v.status === 'upcoming')
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]
    if (upcoming) return NextResponse.json({ vibeAThon: upcoming })

    // Otherwise the most recently ended one (so winners can still be shown)
    const ended = withStatus
      .filter((v) => v.status === 'ended')
      .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0]
    if (ended) return NextResponse.json({ vibeAThon: ended })

    return NextResponse.json({ vibeAThon: null })
  } catch {
    return NextResponse.json({ vibeAThon: null })
  }
}

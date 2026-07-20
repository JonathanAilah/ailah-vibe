import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
  // Use service role key to bypass RLS — this is public read-only data anyway
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('vibe-a-thons/current: missing env vars')
    return NextResponse.json({ vibeAThon: null })
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/vibe_a_thons?select=*&order=start_date.desc`,
      {
        cache: 'no-store',
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('vibe-a-thons/current: Supabase error', res.status, errText)
      return NextResponse.json({ vibeAThon: null, error: errText })
    }

    const all: unknown = await res.json()

    if (!Array.isArray(all)) {
      console.error('vibe-a-thons/current: unexpected response', all)
      return NextResponse.json({ vibeAThon: null })
    }

    const now = new Date()
    const withStatus = (all as VibeAThonRow[]).map((v) => {
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

    // Otherwise the most recently ended one
    const ended = withStatus
      .filter((v) => v.status === 'ended')
      .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())[0]
    if (ended) return NextResponse.json({ vibeAThon: ended })

    return NextResponse.json({ vibeAThon: null })
  } catch (err) {
    console.error('vibe-a-thons/current: fetch failed', err)
    return NextResponse.json({ vibeAThon: null })
  }
}

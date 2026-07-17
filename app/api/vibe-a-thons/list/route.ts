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
    return NextResponse.json({ vibeAThons: [] })
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/vibe_a_thons?select=*&order=start_date.asc`, {
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

    return NextResponse.json({ vibeAThons: withStatus })
  } catch {
    return NextResponse.json({ vibeAThons: [] })
  }
}

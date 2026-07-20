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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('vibe-a-thons/list: missing env vars')
    return NextResponse.json({ vibeAThons: [] })
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/vibe_a_thons?select=*&order=start_date.asc`,
      {
        cache: 'no-store',
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('vibe-a-thons/list: Supabase error', res.status, errText)
      return NextResponse.json({ vibeAThons: [] })
    }

    const all: unknown = await res.json()
    if (!Array.isArray(all)) {
      console.error('vibe-a-thons/list: unexpected response', all)
      return NextResponse.json({ vibeAThons: [] })
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

    return NextResponse.json({ vibeAThons: withStatus })
  } catch (err) {
    console.error('vibe-a-thons/list: fetch failed', err)
    return NextResponse.json({ vibeAThons: [] })
  }
}

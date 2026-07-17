import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/verify'

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/vibe_a_thons?select=*&order=start_date.desc`, {
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    })
    const vibeAThons = await res.json()
    return NextResponse.json({ vibeAThons })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch vibe-a-thons' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { theme, description, startDate, endDate, firstPrize, secondPrize, thirdPrize } = body

    if (!theme || !description || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/vibe_a_thons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        theme,
        description,
        start_date: startDate,
        end_date: endDate,
        first_prize: firstPrize || 0,
        second_prize: secondPrize || 0,
        third_prize: thirdPrize || 0,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to create vibe-a-thon' }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, vibeAThon: data[0] })
  } catch {
    return NextResponse.json({ error: 'Failed to create vibe-a-thon' }, { status: 500 })
  }
}

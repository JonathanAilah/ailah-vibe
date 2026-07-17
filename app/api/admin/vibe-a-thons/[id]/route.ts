import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/verify'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const res = await fetch(`${supabaseUrl}/rest/v1/vibe_a_thons?id=eq.${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        theme,
        description,
        start_date: startDate,
        end_date: endDate,
        first_prize: firstPrize,
        second_prize: secondPrize,
        third_prize: thirdPrize,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to update vibe-a-thon' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update vibe-a-thon' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/vibe_a_thons?id=eq.${params.id}`, {
      method: 'DELETE',
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to delete vibe-a-thon' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete vibe-a-thon' }, { status: 500 })
  }
}

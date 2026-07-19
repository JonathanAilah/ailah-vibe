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
    // Fund settings
    const settingsRes = await fetch(`${supabaseUrl}/rest/v1/fund_settings?select=*&id=eq.1`, {
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    })
    const settingsRows = await settingsRes.json()
    const settings = Array.isArray(settingsRows) && settingsRows[0] ? settingsRows[0] : null

    // Sum Stripe donations too so the admin can see the breakdown
    let stripeTotalCents = 0
    let stripeCount = 0
    try {
      const donRes = await fetch(`${supabaseUrl}/rest/v1/donations?select=amount_cents`, {
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
      })
      const donRows = await donRes.json()
      if (Array.isArray(donRows)) {
        stripeCount = donRows.length
        stripeTotalCents = donRows.reduce(
          (sum: number, r: { amount_cents?: number }) => sum + (r.amount_cents || 0),
          0
        )
      }
    } catch {
      // ignore
    }

    return NextResponse.json({
      settings,
      stripeTotal: stripeTotalCents / 100,
      stripeCount,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load fund settings' }, { status: 500 })
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
    const { goalAmount, offlineRaised, cohortSpotsTotal, cohortSpotsFunded } = await request.json()

    const payload: Record<string, number | string> = {
      updated_at: new Date().toISOString(),
    }
    if (typeof goalAmount === 'number') payload.goal_amount = Math.max(0, Math.floor(goalAmount))
    if (typeof offlineRaised === 'number') payload.offline_raised = Math.max(0, Math.floor(offlineRaised))
    if (typeof cohortSpotsTotal === 'number') payload.cohort_spots_total = Math.max(0, Math.floor(cohortSpotsTotal))
    if (typeof cohortSpotsFunded === 'number') payload.cohort_spots_funded = Math.max(0, Math.floor(cohortSpotsFunded))

    const res = await fetch(`${supabaseUrl}/rest/v1/fund_settings?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to update fund settings' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update fund settings' }, { status: 500 })
  }
}

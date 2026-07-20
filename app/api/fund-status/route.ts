import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    // Fall back to reasonable defaults so the page never breaks
    return NextResponse.json({
      raised: 0,
      goal: 20000,
      percentage: 0,
      cohort_spots_total: 50,
      cohort_spots_funded: 0,
      spots_left: 50,
    })
  }

  try {
    // 1. Load fund settings (goal, offline donations, cohort info)
    const settingsRes = await fetch(`${supabaseUrl}/rest/v1/fund_settings?select=*&id=eq.1`, { cache: 'no-store', headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    })
    const settingsRows = await settingsRes.json()
    const settings = Array.isArray(settingsRows) && settingsRows[0] ? settingsRows[0] : {
      goal_amount: 20000,
      offline_raised: 0,
      cohort_spots_total: 50,
      cohort_spots_funded: 0,
    }

    // 2. Sum online donations from Stripe (empty for now, populated once Stripe is live)
    let stripeTotalCents = 0
    try {
      const donRes = await fetch(`${supabaseUrl}/rest/v1/donations?select=amount_cents`, { cache: 'no-store', headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      })
      const donRows = await donRes.json()
      if (Array.isArray(donRows)) {
        stripeTotalCents = donRows.reduce(
          (sum: number, r: { amount_cents?: number }) => sum + (r.amount_cents || 0),
          0
        )
      }
    } catch {
      // ignore — donations might not be readable publicly, that's fine
    }

    const raised = settings.offline_raised + Math.floor(stripeTotalCents / 100)
    const goal = settings.goal_amount
    const percentage = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0
    const spots_left = Math.max(0, settings.cohort_spots_total - settings.cohort_spots_funded)

    return NextResponse.json({
      raised,
      goal,
      percentage,
      cohort_spots_total: settings.cohort_spots_total,
      cohort_spots_funded: settings.cohort_spots_funded,
      spots_left,
    })
  } catch {
    // If anything fails, return safe defaults so the page still loads
    return NextResponse.json({
      raised: 0,
      goal: 20000,
      percentage: 0,
      cohort_spots_total: 50,
      cohort_spots_funded: 0,
      spots_left: 50,
    })
  }
}

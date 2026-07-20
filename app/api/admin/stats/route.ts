import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/verify'

export const dynamic = 'force-dynamic'

async function getCount(supabaseUrl: string, serviceRoleKey: string, table: string): Promise<number> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
      method: 'HEAD',
      cache: 'no-store',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'count=exact',
      },
    })
    const range = res.headers.get('content-range')
    if (!range) return 0
    const total = range.split('/')[1]
    return total ? parseInt(total, 10) : 0
  } catch {
    return 0
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
  }

  const [totalUsers, totalProjects, totalVotes, totalApplications] = await Promise.all([
    getCount(supabaseUrl, serviceRoleKey, 'profiles'),
    getCount(supabaseUrl, serviceRoleKey, 'projects'),
    getCount(supabaseUrl, serviceRoleKey, 'votes'),
    getCount(supabaseUrl, serviceRoleKey, 'scholarship_applications'),
  ])

  // Sum Stripe (online) donations
  let stripeCents = 0
  let stripeCount = 0
  try {
    const donRes = await fetch(`${supabaseUrl}/rest/v1/donations?select=amount_cents`, {
      cache: 'no-store',
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    })
    const rows = await donRes.json()
    if (Array.isArray(rows)) {
      stripeCount = rows.length
      stripeCents = rows.reduce((sum: number, r: { amount_cents?: number }) => sum + (r.amount_cents || 0), 0)
    }
  } catch {
    // leave at 0
  }

  // Get offline donations from fund_settings (added by admin manually)
  let offlineRaised = 0
  try {
    const fsRes = await fetch(`${supabaseUrl}/rest/v1/fund_settings?select=offline_raised&id=eq.1`, {
      cache: 'no-store',
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    })
    const fsRows = await fsRes.json()
    if (Array.isArray(fsRows) && fsRows[0]) {
      offlineRaised = fsRows[0].offline_raised || 0
    }
  } catch {
    // leave at 0
  }

  const stripeDollars = stripeCents / 100
  const totalDonations = stripeDollars + offlineRaised

  return NextResponse.json({
    totalUsers,
    totalProjects,
    totalVotes,
    totalApplications,
    totalDonations,          // combined stripe + offline
    totalDonationsCount: stripeCount,  // count of individual online transactions
    stripeDollars,
    offlineRaised,
  })
}

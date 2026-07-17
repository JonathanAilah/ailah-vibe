import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/verify'

async function getCount(supabaseUrl: string, serviceRoleKey: string, table: string): Promise<number> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=id`, {
      method: 'HEAD',
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

  // Sum donations (small scale — fine to fetch and sum in JS for now)
  let totalDonationsCents = 0
  let totalDonationsCount = 0
  try {
    const donRes = await fetch(`${supabaseUrl}/rest/v1/donations?select=amount_cents`, {
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    })
    const rows = await donRes.json()
    if (Array.isArray(rows)) {
      totalDonationsCount = rows.length
      totalDonationsCents = rows.reduce((sum: number, r: { amount_cents?: number }) => sum + (r.amount_cents || 0), 0)
    }
  } catch {
    // leave at 0
  }

  return NextResponse.json({
    totalUsers,
    totalProjects,
    totalVotes,
    totalApplications,
    totalDonations: totalDonationsCents / 100,
    totalDonationsCount,
  })
}

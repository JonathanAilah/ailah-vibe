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
    const res = await fetch(
      `${supabaseUrl}/rest/v1/scholarship_applications?select=*&order=applied_at.desc`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } }
    )
    const applications = await res.json()
    return NextResponse.json({ applications })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}

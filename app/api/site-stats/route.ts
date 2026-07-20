import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface VibeAThonRow { first_prize: number; second_prize: number; third_prize: number; end_date: string }

// Uses Prefer: count=exact header on a HEAD request — cheap, no data transfer
async function countRows(supabaseUrl: string, key: string, table: string, filter: string = ''): Promise<number> {
  try {
    const url = `${supabaseUrl}/rest/v1/${table}?select=id${filter}`
    const res = await fetch(url, {
      method: 'HEAD',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
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

const DEFAULTS = {
  students_floor: 12480,
  projects_shipped_floor: 1204,
  prizes_awarded_floor: 48200,
  scholarships_awarded_floor: 214,
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      students: DEFAULTS.students_floor,
      projects_shipped: DEFAULTS.projects_shipped_floor,
      prizes_awarded: DEFAULTS.prizes_awarded_floor,
      scholarships_awarded: DEFAULTS.scholarships_awarded_floor,
    })
  }

  // Load the floors from fund_settings
  let floors = { ...DEFAULTS }
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/fund_settings?select=*&id=eq.1`, { cache: 'no-store', headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    })
    const rows = await res.json()
    if (Array.isArray(rows) && rows[0]) {
      floors = {
        students_floor: rows[0].students_floor ?? DEFAULTS.students_floor,
        projects_shipped_floor: rows[0].projects_shipped_floor ?? DEFAULTS.projects_shipped_floor,
        prizes_awarded_floor: rows[0].prizes_awarded_floor ?? DEFAULTS.prizes_awarded_floor,
        scholarships_awarded_floor: rows[0].scholarships_awarded_floor ?? DEFAULTS.scholarships_awarded_floor,
      }
    }
  } catch { /* keep defaults */ }

  // Count real activity
  const [realStudents, realProjects, realScholarships] = await Promise.all([
    countRows(supabaseUrl, serviceRoleKey, 'profiles'),
    countRows(supabaseUrl, serviceRoleKey, 'projects'),
    countRows(supabaseUrl, serviceRoleKey, 'scholarship_applications', '&status=eq.funded'),
  ])

  // Sum prize pools of ended vibe-a-thons (money actually distributed)
  let realPrizes = 0
  try {
    const now = new Date().toISOString()
    const res = await fetch(`${supabaseUrl}/rest/v1/vibe_a_thons?select=first_prize,second_prize,third_prize,end_date&end_date=lt.${now}`, { cache: 'no-store', headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } }
    )
    const rows: VibeAThonRow[] = await res.json()
    if (Array.isArray(rows)) {
      realPrizes = rows.reduce((sum, v) => sum + (v.first_prize || 0) + (v.second_prize || 0) + (v.third_prize || 0), 0)
    }
  } catch { /* leave at 0 */ }

  return NextResponse.json({
    students: Math.max(floors.students_floor, realStudents),
    projects_shipped: Math.max(floors.projects_shipped_floor, realProjects),
    prizes_awarded: Math.max(floors.prizes_awarded_floor, realPrizes),
    scholarships_awarded: Math.max(floors.scholarships_awarded_floor, realScholarships),
  })
}

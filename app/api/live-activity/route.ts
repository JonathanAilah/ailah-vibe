import { NextResponse } from 'next/server'

interface ActivityEvent {
  id: string
  icon: string
  text: string
  tag: string
  timestamp: string
}

interface ProfileRow { id: string; full_name: string; username: string; city: string; state: string; created_at: string }
interface ProjectRow { id: string; title: string; category: string; submitted_at: string; profiles: { full_name: string; username: string } | null }
interface DonationRow { id: string; amount_cents: number; donated_at: string }
interface ApplicationRow { id: string; applied_at: string }

// Format "3m ago", "2h ago", etc.
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
  return new Date(iso).toLocaleDateString()
}

// Build "First L." from a full name — never expose full last names publicly
function shortName(fullName?: string, username?: string): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/)
    const first = parts[0]
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] + '.' : ''
    return lastInitial ? `${first} ${lastInitial}` : first
  }
  return username ? `@${username}` : 'A builder'
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ events: [] })
  }

  // Use service role to bypass RLS for the read-only public feed
  const authHeaders = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }
  const events: ActivityEvent[] = []

  try {
    // Recent signups (last 10)
    const profRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id,full_name,username,city,state,created_at&order=created_at.desc&limit=10`,
      { headers: authHeaders }
    )
    const profiles: ProfileRow[] = await profRes.json()
    if (Array.isArray(profiles)) {
      profiles.forEach((p) => {
        const location = [p.city, p.state].filter(Boolean).join(', ')
        events.push({
          id: `signup-${p.id}`,
          icon: '⭐',
          text: location ? `New builder from ${location} joined` : 'New builder joined',
          tag: 'NEW',
          timestamp: p.created_at,
        })
      })
    }
  } catch { /* skip */ }

  try {
    // Recent project submissions (last 10)
    const projRes = await fetch(
      `${supabaseUrl}/rest/v1/projects?select=id,title,category,submitted_at,profiles(full_name,username)&order=submitted_at.desc&limit=10`,
      { headers: authHeaders }
    )
    const projects: ProjectRow[] = await projRes.json()
    if (Array.isArray(projects)) {
      projects.forEach((p) => {
        const name = shortName(p.profiles?.full_name, p.profiles?.username)
        events.push({
          id: `project-${p.id}`,
          icon: '🚀',
          text: `${name} shipped "${p.title}"`,
          tag: 'SHIPPED',
          timestamp: p.submitted_at,
        })
      })
    }
  } catch { /* skip */ }

  try {
    // Recent donations (last 10)
    const donRes = await fetch(
      `${supabaseUrl}/rest/v1/donations?select=id,amount_cents,donated_at&order=donated_at.desc&limit=10`,
      { headers: authHeaders }
    )
    const donations: DonationRow[] = await donRes.json()
    if (Array.isArray(donations)) {
      donations.forEach((d) => {
        const amount = (d.amount_cents / 100).toFixed(0)
        events.push({
          id: `donation-${d.id}`,
          icon: '♥',
          text: `Anonymous donor gave $${amount}`,
          tag: 'FUNDED',
          timestamp: d.donated_at,
        })
      })
    }
  } catch { /* skip */ }

  try {
    // Recent scholarship applications (last 10)
    const appRes = await fetch(
      `${supabaseUrl}/rest/v1/scholarship_applications?select=id,applied_at&order=applied_at.desc&limit=10`,
      { headers: authHeaders }
    )
    const applications: ApplicationRow[] = await appRes.json()
    if (Array.isArray(applications)) {
      applications.forEach((a) => {
        events.push({
          id: `app-${a.id}`,
          icon: '🎓',
          text: 'New scholarship application received',
          tag: 'APPLIED',
          timestamp: a.applied_at,
        })
      })
    }
  } catch { /* skip */ }

  // Merge and sort by time (newest first)
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Attach human-readable "ago" strings and cap the feed
  const withAgo = events.slice(0, 20).map((e) => ({ ...e, ago: timeAgo(e.timestamp) }))

  return NextResponse.json({ events: withAgo })
}

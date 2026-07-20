import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ProjectRow {
  id: string
  title: string
  description: string
  category: string
  live_url: string | null
  submitted_at: string
  vibe_a_thon_id: string | null
  profiles: { full_name: string; username: string } | null
  vote_count: { count: number }[] | null
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('leaderboard: missing env vars')
    return NextResponse.json({ projects: [] })
  }

  try {
    // Pull all projects with their author (profiles) and vote count
    const res = await fetch(
      `${supabaseUrl}/rest/v1/projects?select=id,title,description,category,live_url,submitted_at,vibe_a_thon_id,profiles(full_name,username),vote_count:votes(count)&order=submitted_at.desc`,
      {
        cache: 'no-store',
        headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('leaderboard: Supabase error', res.status, errText)
      return NextResponse.json({ projects: [] })
    }

    const rows: unknown = await res.json()
    if (!Array.isArray(rows)) {
      console.error('leaderboard: unexpected response', rows)
      return NextResponse.json({ projects: [] })
    }

    // Flatten & sort by vote count descending
    const projects = (rows as ProjectRow[])
      .map((p) => {
        const username = p.profiles?.username || 'anonymous'
        const fullName = p.profiles?.full_name || ''
        const avatar = fullName ? fullName.charAt(0).toUpperCase() : username.charAt(0).toUpperCase()
        return {
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category,
          handle: `@${username}`,
          avatar,
          votes: p.vote_count?.[0]?.count ?? 0,
          liveUrl: p.live_url || '#',
          submittedAt: p.submitted_at,
          vibeAThonId: p.vibe_a_thon_id,
        }
      })
      .sort((a, b) => b.votes - a.votes)
      .map((p, i) => ({ ...p, rank: i + 1 }))

    return NextResponse.json({ projects })
  } catch (err) {
    console.error('leaderboard: fetch failed', err)
    return NextResponse.json({ projects: [] })
  }
}

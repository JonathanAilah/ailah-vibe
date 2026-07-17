import { NextResponse } from 'next/server'

interface ProjectRow {
  id: string
  title: string
  category: string
  profiles: { username: string } | null
  vote_count: { count: number }[] | null
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ winners: [] })
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/projects?vibe_a_thon_id=eq.${params.id}&select=id,title,category,profiles(username),vote_count:votes(count)`,
      { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` } }
    )
    const projects: ProjectRow[] = await res.json()

    const ranked = (Array.isArray(projects) ? projects : [])
      .map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        username: p.profiles?.username || 'unknown',
        voteCount: p.vote_count?.[0]?.count ?? 0,
      }))
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 3)

    return NextResponse.json({ winners: ranked })
  } catch {
    return NextResponse.json({ winners: [] })
  }
}

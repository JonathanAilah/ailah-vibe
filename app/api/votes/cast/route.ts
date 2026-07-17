import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, projectId } = await request.json()

    if (!userId || !projectId) {
      return NextResponse.json({ error: 'Missing userId or projectId' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
    }

    // The votes table has a unique(user_id, project_id) constraint —
    // this insert will fail on its own if the user already voted for this project.
    const res = await fetch(`${supabaseUrl}/rest/v1/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ user_id: userId, project_id: projectId }),
    })

    if (!res.ok) {
      // Likely a duplicate vote (unique constraint) — not a real error
      return NextResponse.json({ success: false, alreadyVoted: true }, { status: 200 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

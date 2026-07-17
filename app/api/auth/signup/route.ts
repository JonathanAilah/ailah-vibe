import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, username, age, city, state } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('Supabase URL:', supabaseUrl)
    console.log('Has service key:', !!serviceRoleKey)

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
    }

    const targetUrl = `${supabaseUrl}/auth/v1/admin/users`
    console.log('Calling:', targetUrl)

    let response
    try {
      response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName, username: username.toLowerCase(), age: parseInt(age), city, state },
        }),
      })
      console.log('Response status:', response.status)
    } catch (fetchErr: unknown) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
      console.error('Fetch to Supabase failed:', msg)
      return NextResponse.json({ error: `Cannot reach Supabase: ${msg}` }, { status: 500 })
    }

    const data = await response.json()
    console.log('Supabase response:', JSON.stringify(data).substring(0, 200))

    if (!response.ok) {
      return NextResponse.json({ error: data.message || data.msg || 'Signup failed' }, { status: 400 })
    }

    if (data.id) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            id: data.id,
            full_name: fullName,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            age: parseInt(age),
            city,
            state,
          }),
        })
      } catch (profileErr) {
        console.error('Profile save failed:', profileErr)
      }
    }

    return NextResponse.json({ success: true, userId: data.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Signup error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

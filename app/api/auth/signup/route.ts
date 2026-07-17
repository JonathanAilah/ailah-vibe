import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, username, age, city, state } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Missing configuration' }, { status: 500 })
    }

    if (!email || !password || !fullName || !username || !age || !city || !state) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Use Supabase REST API directly instead of SDK
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
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
        user_metadata: {
          full_name: fullName,
          username: username.toLowerCase(),
          age: parseInt(age),
          city,
          state,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.message?.includes('already registered') || data.msg?.includes('already registered')) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: data.message || data.msg || 'Signup failed' }, { status: 400 })
    }

    // Save profile using REST API
    if (data.id) {
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
    }

    return NextResponse.json({ success: true, userId: data.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Signup error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

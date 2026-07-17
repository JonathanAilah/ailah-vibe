import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, username, age, city, state } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Debug: check if env vars are loaded
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        error: `Missing env vars: URL=${!!supabaseUrl} KEY=${!!serviceRoleKey}`
      }, { status: 500 })
    }

    // Validate required fields
    if (!email || !password || !fullName || !username || !age || !city || !state) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
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
    })

    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Save profile
    if (authData.user) {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        full_name: fullName,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        age: parseInt(age),
        city,
        state,
      })
    }

    return NextResponse.json({ success: true, userId: authData.user?.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Signup error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

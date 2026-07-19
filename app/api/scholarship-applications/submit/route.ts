import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName, email, age, city, state,
      parentName, parentEmail,
      goal, story, heardAbout,
    } = body

    // Basic validation
    if (!fullName || !email || !age || !city || !state || !parentName || !parentEmail || !goal || !story) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 19) {
      return NextResponse.json({ error: 'Age must be between 13 and 19.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server not configured.' }, { status: 500 })
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/scholarship_applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email.toLowerCase(),
        age: ageNum,
        city,
        state,
        parent_name: parentName,
        parent_email: parentEmail.toLowerCase(),
        goal,
        story,
        heard_about: heardAbout || null,
        status: 'pending',
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Supabase error:', errText)
      return NextResponse.json({ error: 'Could not submit application. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Application submit error:', message)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

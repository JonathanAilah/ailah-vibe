import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const results: Record<string, string> = {
    fullUrl: url || 'MISSING',
    hasServiceKey: String(!!key),
    hasAnonKey: String(!!anonKey),
  }

  // Test 1: Can we reach the general internet at all?
  try {
    const testRes = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    results.generalInternetTest = `OK - status ${testRes.status}`
  } catch (e: unknown) {
    results.generalInternetTest = `FAILED - ${e instanceof Error ? e.message : String(e)}`
  }

  // Test 2: Can we reach Supabase's base URL?
  if (url) {
    try {
      const supaRes = await fetch(url)
      results.supabaseBaseTest = `OK - status ${supaRes.status}`
    } catch (e: unknown) {
      results.supabaseBaseTest = `FAILED - ${e instanceof Error ? e.message : String(e)}`
    }

    // Test 3: Can we reach Supabase's auth endpoint specifically?
    try {
      const authRes = await fetch(`${url}/auth/v1/settings`, {
        headers: { 'apikey': anonKey || '' },
      })
      results.supabaseAuthTest = `OK - status ${authRes.status}`
    } catch (e: unknown) {
      results.supabaseAuthTest = `FAILED - ${e instanceof Error ? e.message : String(e)}`
    }
  }

  return NextResponse.json(results)
}

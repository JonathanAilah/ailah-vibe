import { NextRequest } from 'next/server'

// Verifies the x-admin-key header matches the server's ADMIN_PASSWORD.
// Every admin API route calls this before touching any data.
export function verifyAdmin(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key')
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) return false
  return key === adminPassword
}

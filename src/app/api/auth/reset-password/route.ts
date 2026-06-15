import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Max 3 reset requests per email per hour
const resetAttempts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(email: string): boolean {
  const now = Date.now()
  const entry = resetAttempts.get(email)
  if (!entry || now > entry.resetAt) {
    resetAttempts.set(email, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return false
  }
  if (entry.count >= 3) return true
  entry.count++
  return false
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.email !== 'string') {
    return NextResponse.json({ success: true }) // Ne pas révéler l'erreur
  }

  const email = body.email.trim().toLowerCase()
  if (!email.includes('@') || email.length > 255) {
    return NextResponse.json({ success: true })
  }

  if (isRateLimited(email)) {
    return NextResponse.json({ success: true }) // Silencieux pour ne pas révéler
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin}/auth/nouveau-mot-de-passe`

  // Use anon client with resetPasswordForEmail to actually send the email
  const anonSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { error } = await anonSupabase.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) console.error('reset-password error:', error.message)

  return NextResponse.json({ success: true })
}

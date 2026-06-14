import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin}/auth/nouveau-mot-de-passe`

  const { error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo },
  })

  // On retourne toujours succès pour ne pas révéler si l'email existe
  if (error) console.error('reset-password error:', error.message)

  return NextResponse.json({ success: true })
}

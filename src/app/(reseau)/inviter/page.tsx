import { getCurrentProfile } from '@/lib/supabase/actions/reseau'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import InviterClient from './client'

export const dynamic = 'force-dynamic'

async function inviterAmi(data: FormData) {
  'use server'
  const email = data.get('email') as string
  const full_name = data.get('full_name') as string

  const supabase = await createAdminClient()

  // Invite via Supabase Auth — statut restera "pending" (pas de mise à jour à "active")
  const { data: invited, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { full_name },
  })
  if (error) return { error: error.message }

  // Profil créé avec status pending par défaut
  if (invited.user) {
    await supabase.from('profiles').update({
      full_name,
      status: 'pending',
      role: 'membre',
    }).eq('id', invited.user.id)
  }

  revalidatePath('/admin/membres')
  return { success: true }
}

export default async function InviterPage() {
  const profil = await getCurrentProfile()
  if (!profil || profil.status !== 'active') redirect('/auth/connexion')

  return <InviterClient onInviter={inviterAmi} />
}

'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMembres() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function updateMembreRole(id: string, role: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  if (error) throw error
  revalidatePath('/admin/membres')
}

export async function updateMembreStatus(id: string, status: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('profiles').update({ status }).eq('id', id)
  if (error) throw error
  revalidatePath('/admin/membres')
}

export async function validerMembre(id: string) {
  return updateMembreStatus(id, 'active')
}

export async function suspendMembre(id: string) {
  return updateMembreStatus(id, 'suspended')
}

export async function reactiverMembre(id: string) {
  return updateMembreStatus(id, 'active')
}

export async function deleteMembre(id: string) {
  const supabase = await createAdminClient()
  // Supprimer l'utilisateur auth (cascade sur profiles via trigger)
  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) {
    // Fallback: supprimer juste le profil si l'auth delete échoue
    await supabase.from('profiles').delete().eq('id', id)
  }
  revalidatePath('/admin/membres')
}

export async function creerMembre(form: {
  email: string
  full_name: string
  role?: string
  promotion?: string
  phone?: string
  profession?: string
  ville?: string
}) {
  const supabase = await createAdminClient()

  // Invite l'utilisateur par email — il reçoit un lien pour définir son mot de passe
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(form.email, {
    data: { full_name: form.full_name },
  })
  if (error) return { error: error.message }

  // Mettre à jour le profil avec les infos supplémentaires et le statut actif
  if (data.user) {
    await supabase.from('profiles').update({
      full_name:  form.full_name,
      role:       form.role ?? 'membre',
      status:     'active',
      promotion:  form.promotion  || null,
      phone:      form.phone      || null,
      profession: form.profession || null,
      ville:      form.ville      || null,
    }).eq('id', data.user.id)
  }

  revalidatePath('/admin/membres')
  return { success: true }
}

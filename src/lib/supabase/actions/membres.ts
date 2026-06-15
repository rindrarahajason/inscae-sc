'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const ROLES_ALLOWED = ['membre', 'bureau', 'admin', 'super_admin']
const STATUS_ALLOWED = ['pending', 'active', 'suspended']
const ADMIN_ROLES = ['super_admin', 'admin', 'bureau']

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { data: profil } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (!profil || !ADMIN_ROLES.includes(profil.role) || profil.status !== 'active') {
    throw new Error('Accès refusé')
  }
}

export async function getMembres() {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function updateMembreRole(id: string, role: string) {
  await requireAdmin()
  if (!ROLES_ALLOWED.includes(role)) throw new Error('Rôle invalide')
  const supabase = await createAdminClient()
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
  if (error) throw error
  revalidatePath('/admin/membres')
}

export async function updateMembreStatus(id: string, status: string) {
  await requireAdmin()
  if (!STATUS_ALLOWED.includes(status)) throw new Error('Statut invalide')
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
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) await supabase.from('profiles').delete().eq('id', id)
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
  avatar_url?: string
}) {
  await requireAdmin()

  // Validation
  if (!form.email?.includes('@') || form.email.length > 255) return { error: 'Email invalide' }
  if (!form.full_name?.trim() || form.full_name.length > 100) return { error: 'Nom invalide' }
  const role = ROLES_ALLOWED.includes(form.role ?? '') ? form.role : 'membre'

  const supabase = await createAdminClient()
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(form.email.trim().toLowerCase(), {
    data: { full_name: form.full_name.trim() },
  })
  if (error) return { error: error.message }

  if (data.user) {
    await supabase.from('profiles').update({
      full_name:  form.full_name.trim(),
      role:       role ?? 'membre',
      status:     'pending',
      promotion:  form.promotion?.slice(0, 100) || null,
      phone:      form.phone?.slice(0, 20) || null,
      profession: form.profession?.slice(0, 100) || null,
      ville:      form.ville?.slice(0, 100) || null,
      avatar_url: form.avatar_url?.startsWith('https://') ? form.avatar_url : null,
    }).eq('id', data.user.id)
  }

  revalidatePath('/admin/membres')
  return { success: true }
}

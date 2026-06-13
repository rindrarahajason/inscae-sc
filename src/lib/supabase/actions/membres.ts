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
  // Supprimer le profil (la suppression du user auth se fait via Supabase dashboard ou edge function)
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/membres')
}

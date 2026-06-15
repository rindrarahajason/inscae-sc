'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from './_requireAdmin'
import { revalidatePath } from 'next/cache'

const STATUTS_ALLOWED = ['a_venir', 'en_cours', 'termine']

export async function getActivites() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .order('date_debut', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createActivite(form: {
  titre: string; description: string; lieu?: string
  date_debut: string; date_fin?: string; statut: string; image_url?: string
}) {
  await requireAdmin()
  if (!STATUTS_ALLOWED.includes(form.statut)) throw new Error('Statut invalide')
  const supabase = await createAdminClient()
  const { error } = await supabase.from('activites').insert({
    ...form,
    titre: form.titre?.trim().slice(0, 200),
    image_url: form.image_url?.startsWith('https://') ? form.image_url : null,
  })
  if (error) throw error
  revalidatePath('/activites')
  revalidatePath('/admin/activites')
}

export async function updateActivite(id: string, form: Record<string, unknown>) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('activites').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/activites')
  revalidatePath('/admin/activites')
}

export async function deleteActivite(id: string) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('activites').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/activites')
  revalidatePath('/admin/activites')
}

export async function getActivite(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('activites')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

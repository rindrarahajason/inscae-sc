'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
  const supabase = await createClient()
  const { error } = await supabase.from('activites').insert(form)
  if (error) throw error
  revalidatePath('/activites')
  revalidatePath('/admin/activites')
}

export async function updateActivite(id: string, form: Record<string, unknown>) {
  const supabase = await createClient()
  const { error } = await supabase.from('activites').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/activites')
  revalidatePath('/admin/activites')
}

export async function deleteActivite(id: string) {
  const supabase = await createClient()
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

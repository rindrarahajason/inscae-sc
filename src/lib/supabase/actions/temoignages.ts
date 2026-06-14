'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTemoignages(valideSeulement = false) {
  const supabase = await createAdminClient()
  let q = supabase.from('temoignages').select('*').order('created_at', { ascending: false })
  if (valideSeulement) q = q.eq('valide', true)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function createTemoignage(form: {
  auteur_nom: string; contenu: string; auteur_promo?: string
}) {
  // On utilise le client admin pour contourner RLS (soumission publique sans auth)
  const supabase = await createAdminClient()
  const { error } = await supabase.from('temoignages').insert({ ...form, valide: false })
  if (error) throw error
  revalidatePath('/admin/temoignages')
}

export async function validerTemoignage(id: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('temoignages').update({ valide: true }).eq('id', id)
  if (error) throw error
  revalidatePath('/temoignages')
  revalidatePath('/admin/temoignages')
}

export async function depublierTemoignage(id: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('temoignages').update({ valide: false }).eq('id', id)
  if (error) throw error
  revalidatePath('/temoignages')
  revalidatePath('/admin/temoignages')
}

export async function deleteTemoignage(id: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('temoignages').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/temoignages')
  revalidatePath('/admin/temoignages')
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getActualites(publieSeulement = false) {
  const supabase = await createClient()
  let q = supabase
    .from('actualites')
    .select('*, auteur:profiles(full_name)')
    .order('created_at', { ascending: false })
  if (publieSeulement) q = q.eq('publie', true)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function createActualite(form: {
  titre: string; contenu: string; extrait?: string; categorie: string; image_url?: string; publie: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('actualites').insert({
    ...form, auteur_id: user?.id,
  })
  if (error) throw error
  revalidatePath('/actualites')
  revalidatePath('/admin/actualites')
}

export async function updateActualite(id: string, form: Partial<{
  titre: string; contenu: string; extrait: string; categorie: string; image_url: string; publie: boolean
}>) {
  const supabase = await createClient()
  const { error } = await supabase.from('actualites').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/actualites')
  revalidatePath('/admin/actualites')
}

export async function deleteActualite(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('actualites').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/actualites')
  revalidatePath('/admin/actualites')
}

export async function togglePublieActualite(id: string, publie: boolean) {
  return updateActualite(id, { publie })
}

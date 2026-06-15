'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from './_requireAdmin'
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
  await requireAdmin()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminSupabase = await createAdminClient()
  const { error } = await adminSupabase.from('actualites').insert({
    titre: form.titre?.trim().slice(0, 200),
    contenu: form.contenu?.trim().slice(0, 50000),
    extrait: form.extrait?.trim().slice(0, 500) || null,
    categorie: form.categorie,
    image_url: form.image_url?.startsWith('https://') ? form.image_url : null,
    publie: form.publie,
    auteur_id: user?.id,
  })
  if (error) throw error
  revalidatePath('/actualites')
  revalidatePath('/admin/actualites')
}

export async function updateActualite(id: string, form: Partial<{
  titre: string; contenu: string; extrait: string; categorie: string; image_url: string; publie: boolean
}>) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('actualites').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/actualites')
  revalidatePath('/admin/actualites')
}

export async function deleteActualite(id: string) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('actualites').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/actualites')
  revalidatePath('/admin/actualites')
}

export async function togglePublieActualite(id: string, publie: boolean) {
  return updateActualite(id, { publie })
}

export async function getActualite(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('actualites')
    .select('*, auteur:profiles(full_name)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

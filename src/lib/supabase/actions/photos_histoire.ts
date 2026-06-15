'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from './_requireAdmin'
import { revalidatePath } from 'next/cache'

export async function getPhotosHistoire() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('photos_histoire')
    .select('*')
    .order('annee', { ascending: true })
    .order('ordre', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function addPhotoHistoire(form: { annee: number; url: string; legende?: string; ordre?: number }) {
  await requireAdmin()
  if (!form.url?.startsWith('https://')) throw new Error('URL invalide')
  if (form.annee < 1999 || form.annee > new Date().getFullYear()) throw new Error('Année invalide')
  const supabase = await createAdminClient()
  const { error } = await supabase.from('photos_histoire').insert({
    annee: form.annee,
    url: form.url,
    legende: form.legende?.trim().slice(0, 200) || null,
    ordre: form.ordre ?? 0,
  })
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath('/admin/histoire')
}

export async function deletePhotoHistoire(id: string) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('photos_histoire').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath('/admin/histoire')
}

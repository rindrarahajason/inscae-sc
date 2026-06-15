'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from './_requireAdmin'
import { revalidatePath } from 'next/cache'

export async function getPresidents() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('presidents')
    .select('*')
    .order('debut_mandat', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createPresident(form: {
  full_name: string; debut_mandat: string; fin_mandat?: string; bio?: string; photo_url?: string; actuel?: boolean
}) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('presidents').insert({
    ...form,
    full_name: form.full_name?.trim().slice(0, 100),
    photo_url: form.photo_url?.startsWith('https://') ? form.photo_url : null,
  })
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath('/admin/presidents')
}

export async function updatePresident(id: string, form: Record<string, unknown>) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('presidents').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath('/admin/presidents')
}

export async function deletePresident(id: string) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('presidents').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath('/admin/presidents')
}

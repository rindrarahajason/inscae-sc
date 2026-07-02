'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from './_requireAdmin'
import { revalidatePath } from 'next/cache'

export async function getMembresBureau(presidentId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('membres_bureau')
    .select('*')
    .eq('president_id', presidentId)
    .order('ordre', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createMembreBureau(form: {
  president_id: string
  full_name: string
  role_bureau: string
  photo_url?: string
  ordre?: number
}) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('membres_bureau').insert(form)
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath(`/presidents/${form.president_id}`)
}

export async function updateMembreBureau(id: string, form: Record<string, unknown>) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('membres_bureau').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/histoire')
}

export async function deleteMembreBureau(id: string) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('membres_bureau').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/histoire')
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getHistoire() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('histoire')
    .select('*')
    .order('id', { ascending: true })
    .single()
  // Table optionnelle — pas d'erreur si vide
  return data ?? null
}

export async function upsertHistoire(form: {
  contenu_origines: string
  contenu_mission: string
}) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from('histoire').select('id').single()
  if (existing) {
    await supabase.from('histoire').update(form).eq('id', existing.id)
  } else {
    await supabase.from('histoire').insert(form)
  }
  revalidatePath('/histoire')
  revalidatePath('/admin/presidents')
}

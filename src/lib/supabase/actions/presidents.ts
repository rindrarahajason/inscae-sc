'use server'

import { createClient } from '@/lib/supabase/server'
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
  full_name: string; debut_mandat: string; fin_mandat?: string; bio?: string; photo_url?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('presidents').insert(form)
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath('/admin/presidents')
}

export async function updatePresident(id: string, form: Record<string, unknown>) {
  const supabase = await createClient()
  const { error } = await supabase.from('presidents').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath('/admin/presidents')
}

export async function deletePresident(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('presidents').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/histoire')
  revalidatePath('/admin/presidents')
}

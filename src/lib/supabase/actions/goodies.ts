'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getGoodies(actifSeulement = false) {
  const supabase = await createClient()
  let q = supabase.from('goodies').select('*').order('created_at', { ascending: false })
  if (actifSeulement) q = q.eq('actif', true)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function createGoodie(form: {
  nom: string; description?: string; prix: number; stock: number
  image_url?: string; stripe_price_id?: string; actif: boolean
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('goodies').insert({
    ...form,
    stripe_price_id: form.stripe_price_id || 'price_placeholder',
  })
  if (error) throw error
  revalidatePath('/goodies')
  revalidatePath('/admin/goodies')
}

export async function updateGoodie(id: string, form: Record<string, unknown>) {
  const supabase = await createClient()
  const { error } = await supabase.from('goodies').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/goodies')
  revalidatePath('/admin/goodies')
}

export async function deleteGoodie(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('goodies').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/goodies')
  revalidatePath('/admin/goodies')
}

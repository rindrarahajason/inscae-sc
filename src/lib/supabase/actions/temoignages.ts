'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const ADMIN_ROLES = ['super_admin', 'admin', 'bureau']

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { data: profil } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (!profil || !ADMIN_ROLES.includes(profil.role) || profil.status !== 'active') throw new Error('Accès refusé')
}

export async function getTemoignages(valideSeulement = false) {
  await requireAdmin()
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
  // Validation basique (soumission publique)
  if (!form.auteur_nom?.trim() || form.auteur_nom.length > 100) throw new Error('Nom invalide')
  if (!form.contenu?.trim() || form.contenu.length > 2000) throw new Error('Contenu invalide')

  const supabase = await createAdminClient()
  const { error } = await supabase.from('temoignages').insert({
    auteur_nom: form.auteur_nom.trim().slice(0, 100),
    contenu: form.contenu.trim().slice(0, 2000),
    auteur_promo: form.auteur_promo?.trim().slice(0, 50) || null,
    valide: false,
  })
  if (error) throw error
  revalidatePath('/admin/temoignages')
}

export async function validerTemoignage(id: string) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('temoignages').update({ valide: true }).eq('id', id)
  if (error) throw error
  revalidatePath('/temoignages')
  revalidatePath('/admin/temoignages')
}

export async function depublierTemoignage(id: string) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('temoignages').update({ valide: false }).eq('id', id)
  if (error) throw error
  revalidatePath('/temoignages')
  revalidatePath('/admin/temoignages')
}

export async function deleteTemoignage(id: string) {
  await requireAdmin()
  const supabase = await createAdminClient()
  const { error } = await supabase.from('temoignages').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/temoignages')
  revalidatePath('/admin/temoignages')
}

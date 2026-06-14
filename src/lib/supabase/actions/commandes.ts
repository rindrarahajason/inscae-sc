'use server'
import { createAdminClient } from '@/lib/supabase/server'

export async function creerCommande(form: {
  goodie_id: string
  goodie_nom: string
  quantite: number
  nom_client: string
  telephone: string
  adresse: string
  mode_paiement: string
  numero_operation?: string
  message?: string
}) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('commandes').insert({
    ...form,
    statut: 'en_attente',
  })
  if (error) return { error: error.message }
  return { success: true }
}

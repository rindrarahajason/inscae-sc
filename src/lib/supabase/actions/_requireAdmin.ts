'use server'

import { createClient } from '@/lib/supabase/server'

const ADMIN_ROLES = ['super_admin', 'admin', 'bureau']

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { data: profil } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
  if (!profil || !ADMIN_ROLES.includes(profil.role) || profil.status !== 'active') {
    throw new Error('Accès refusé')
  }
}

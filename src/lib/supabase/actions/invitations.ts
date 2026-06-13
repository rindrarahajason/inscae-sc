'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

export async function getInvitations() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invitations')
    .select('*, invite_par:profiles(full_name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createInvitation(email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const token = randomBytes(32).toString('hex')

  const { error } = await supabase.from('invitations').insert({
    email,
    invite_par: user?.id,
    token,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })
  if (error) throw error

  // TODO: envoyer l'email via Resend / Supabase Auth
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/inscription?token=${token}`
  console.log('[Invitation] URL:', inviteUrl)

  revalidatePath('/admin/invitations')
  return { token, inviteUrl }
}

export async function revoquerInvitation(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('invitations').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/invitations')
}

export async function verifierToken(token: string) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .eq('utilisee', false)
    .gt('expires_at', new Date().toISOString())
    .single()
  if (error || !data) return null
  return data
}

export async function marquerInvitationUtilisee(token: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('invitations')
    .update({ utilisee: true })
    .eq('token', token)
  if (error) throw error
}

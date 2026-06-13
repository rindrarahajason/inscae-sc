'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function signUp(form: {
  email: string; password: string; full_name: string
  promotion?: string; phone?: string; profession?: string; ville?: string; bio?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: { full_name: form.full_name },
    },
  })
  if (error) return { error: error.message }

  // Le profil est créé avec le statut 'pending' (trigger).
  // On complète les infos fournies pour que l'admin sache de qui il s'agit.
  if (data.user) {
    const admin = await createAdminClient()
    await admin.from('profiles').update({
      promotion:  form.promotion  || null,
      phone:      form.phone      || null,
      profession: form.profession || null,
      ville:      form.ville      || null,
      bio:        form.bio        || null,
    }).eq('id', data.user.id)
  }

  // Déconnexion immédiate : l'accès n'est ouvert qu'après validation par l'admin.
  await supabase.auth.signOut()
  return { success: true }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function resetPassword(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/nouveau-mot-de-passe`,
  })
  if (error) return { error: error.message }
  return { success: true }
}

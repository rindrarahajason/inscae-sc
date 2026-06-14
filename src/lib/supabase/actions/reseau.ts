'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCurrentProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data
}

// ----- POSTS -----
export async function getPosts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      auteur:profiles(id, full_name, avatar_url, promotion),
      likes(user_id),
      commentaires(id, contenu, created_at, auteur_id, auteur:profiles(id, full_name))
    `)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error

  return (data ?? []).map((p) => {
    const likes = (p.likes ?? []) as { user_id: string }[]
    const commentaires = ((p.commentaires ?? []) as {
      id: string; contenu: string; created_at: string; auteur_id: string
      auteur: { id: string; full_name: string } | null
    }[]).sort((a, b) => a.created_at.localeCompare(b.created_at))
    return {
      id: p.id,
      contenu: p.contenu,
      image_url: p.image_url ?? null,
      created_at: p.created_at,
      auteur_id: p.auteur_id,
      auteur: p.auteur,
      likeCount: likes.length,
      likedByMe: !!user && likes.some((l) => l.user_id === user.id),
      commentaires,
    }
  })
}

export async function createPost(contenu: string, image_url?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }
  const { error } = await supabase.from('posts').insert({ auteur_id: user.id, contenu, image_url: image_url || null })
  if (error) return { error: error.message }
  revalidatePath('/feed')
  return { success: true }
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/feed')
  return { success: true }
}

// ----- LIKES -----
export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()
  if (existing) {
    const { error } = await supabase.from('likes').delete().eq('id', existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
    if (error) return { error: error.message }
  }
  revalidatePath('/feed')
  return { success: true }
}

// ----- COMMENTAIRES -----
export async function addComment(postId: string, contenu: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }
  const { error } = await supabase.from('commentaires').insert({
    post_id: postId,
    auteur_id: user.id,
    contenu,
  })
  if (error) return { error: error.message }
  revalidatePath('/feed')
  return { success: true }
}

export async function deleteComment(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('commentaires').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/feed')
  return { success: true }
}

// ----- ANNUAIRE -----
export async function getMembresActifs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, promotion, profession, ville, bio, email')
    .eq('status', 'active')
    .order('full_name', { ascending: true })
  if (error) throw error
  return data ?? []
}

// ----- PROFIL -----
export async function updateMonProfil(fields: {
  full_name: string
  bio?: string
  phone?: string
  profession?: string
  ville?: string
  promotion?: string
  avatar_url?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }
  const { error } = await supabase.from('profiles').update(fields).eq('id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/profil')
  return { success: true }
}

// ----- MESSAGERIE -----
export async function getConversations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('messages')
    .select('*, expediteur:profiles!messages_expediteur_id_fkey(id, full_name, avatar_url), destinataire:profiles!messages_destinataire_id_fkey(id, full_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error

  // Regrouper par interlocuteur
  const convs = new Map<string, { autre: { id: string; full_name: string; avatar_url: string | null }; dernier: string; date: string; nonLu: number }>()
  for (const m of data ?? []) {
    const autre = m.expediteur_id === user.id ? m.destinataire : m.expediteur
    if (!autre) continue
    if (!convs.has(autre.id)) {
      convs.set(autre.id, {
        autre,
        dernier: m.contenu,
        date: m.created_at,
        nonLu: m.destinataire_id === user.id && !m.lu ? 1 : 0,
      })
    } else if (m.destinataire_id === user.id && !m.lu) {
      convs.get(autre.id)!.nonLu += 1
    }
  }
  return Array.from(convs.values())
}

export async function getMessagesAvec(autreId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(expediteur_id.eq.${user.id},destinataire_id.eq.${autreId}),and(expediteur_id.eq.${autreId},destinataire_id.eq.${user.id})`)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function envoyerMessage(destinataireId: string, contenu: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non connecté' }
  const { error } = await supabase.from('messages').insert({
    expediteur_id: user.id,
    destinataire_id: destinataireId,
    contenu,
  })
  if (error) return { error: error.message }
  revalidatePath('/messagerie')
  return { success: true }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getVideos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createVideo(form: {
  titre: string; youtube_url: string; description?: string; categorie?: string
}) {
  const supabase = await createClient()
  // Extraire l'ID YouTube depuis l'URL ou l'ID direct
  const youtubeId = extractYoutubeId(form.youtube_url)
  const { error } = await supabase.from('videos').insert({
    titre: form.titre,
    description: form.description,
    youtube_url: youtubeId,
    thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
  })
  if (error) throw error
  revalidatePath('/videos')
  revalidatePath('/admin/contenus')
}

export async function updateVideo(id: string, form: Record<string, unknown>) {
  const supabase = await createClient()
  if (form.youtube_url) {
    form.youtube_url = extractYoutubeId(form.youtube_url as string)
    form.thumbnail_url = `https://img.youtube.com/vi/${form.youtube_url}/maxresdefault.jpg`
  }
  const { error } = await supabase.from('videos').update(form).eq('id', id)
  if (error) throw error
  revalidatePath('/videos')
  revalidatePath('/admin/contenus')
}

export async function deleteVideo(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/videos')
  revalidatePath('/admin/contenus')
}

function extractYoutubeId(input: string): string {
  // Si c'est déjà un ID (11 chars sans slash)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input
  // Depuis URL youtube.com/watch?v=ID
  const m1 = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (m1) return m1[1]
  // Depuis URL youtu.be/ID
  const m2 = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (m2) return m2[1]
  return input
}

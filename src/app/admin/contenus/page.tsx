import { getVideos, createVideo, updateVideo, deleteVideo } from '@/lib/supabase/actions/videos'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminContenusClient from './client'

export const dynamic = 'force-dynamic'

async function create(data: FormData) {
  'use server'
  await createVideo({
    titre:       data.get('titre') as string,
    youtube_url: data.get('youtube_url') as string,
    description: data.get('description') as string || undefined,
    categorie:   data.get('categorie') as string || undefined,
  })
}

async function update(data: FormData) {
  'use server'
  const id = data.get('id') as string
  await updateVideo(id, {
    titre:          data.get('titre') as string,
    youtube_url:    data.get('youtube_url') as string,
    description:    data.get('description') as string || null,
    categorie:      data.get('categorie') as string || null,
    date_affichage: data.get('date_affichage') as string || null,
  })
}

async function remove(data: FormData) {
  'use server'
  await deleteVideo(data.get('id') as string)
}

export default async function AdminContenusPage() {
  const items = await safeFetch(() => getVideos(), [] as Awaited<ReturnType<typeof getVideos>>)
  const data = items

  return (
    <div>
      <PageHeader titre="Vidéos & Contenus" description="Gérez les vidéos YouTube affichées sur la page Vidéos." />
      <AdminContenusClient
        items={data}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
      />
    </div>
  )
}

import { getPhotosHistoire, addPhotoHistoire, deletePhotoHistoire } from '@/lib/supabase/actions/photos_histoire'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminHistoireClient from './client'

export const dynamic = 'force-dynamic'

async function add(data: FormData) {
  'use server'
  try {
    await addPhotoHistoire({
      annee: parseInt(data.get('annee') as string),
      url: data.get('url') as string,
      legende: data.get('legende') as string,
      ordre: parseInt(data.get('ordre') as string) || 0,
    })
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
}

async function remove(data: FormData) {
  'use server'
  try {
    await deletePhotoHistoire(data.get('id') as string)
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : String(e) }
  }
}

export default async function AdminHistoirePage() {
  const photos = await safeFetch(() => getPhotosHistoire(), [] as Awaited<ReturnType<typeof getPhotosHistoire>>)

  return (
    <div>
      <PageHeader titre="Galerie Histoire" description="Gérez les photos par année pour le carousel de la page Histoire." />
      <AdminHistoireClient photos={photos} onAdd={add} onDelete={remove} />
    </div>
  )
}

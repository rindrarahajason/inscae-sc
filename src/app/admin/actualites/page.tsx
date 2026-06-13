import { getActualites, createActualite, updateActualite, deleteActualite, togglePublieActualite } from '@/lib/supabase/actions/actualites'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminActualitesClient from './client'

export const dynamic = 'force-dynamic'

async function create(data: FormData) {
  'use server'
  await createActualite({
    titre:     data.get('titre') as string,
    contenu:   data.get('contenu') as string,
    extrait:   data.get('extrait') as string,
    categorie: data.get('categorie') as string,
    image_url: data.get('image_url') as string || undefined,
    publie:    data.get('publie') === 'on',
  } as Parameters<typeof createActualite>[0])
}

async function update(data: FormData) {
  'use server'
  const id = data.get('id') as string
  await updateActualite(id, {
    titre:     data.get('titre') as string,
    contenu:   data.get('contenu') as string,
    extrait:   data.get('extrait') as string,
    categorie: data.get('categorie') as string,
    image_url: data.get('image_url') as string || undefined,
    publie:    data.get('publie') === 'on',
  })
}

async function remove(data: FormData) {
  'use server'
  await deleteActualite(data.get('id') as string)
}

async function togglePublie(data: FormData) {
  'use server'
  await togglePublieActualite(data.get('id') as string, data.get('publie') === 'true')
}

export default async function AdminActualitesPage() {
  const items = await safeFetch(() => getActualites(), [] as Awaited<ReturnType<typeof getActualites>>)
  const data = items

  return (
    <div>
      <PageHeader titre="Actualités" description="Gérez les articles publiés sur le site." />
      <AdminActualitesClient
        items={data}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
        onTogglePublie={togglePublie}
      />
    </div>
  )
}

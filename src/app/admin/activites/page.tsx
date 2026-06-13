import { getActivites, createActivite, updateActivite, deleteActivite } from '@/lib/supabase/actions/activites'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminActivitesClient from './client'

export const dynamic = 'force-dynamic'

async function create(data: FormData) {
  'use server'
  await createActivite({
    titre:       data.get('titre') as string,
    description: data.get('description') as string,
    lieu:        data.get('lieu') as string || undefined,
    date_debut:  data.get('date_debut') as string,
    date_fin:    data.get('date_fin') as string || undefined,
    statut:      data.get('statut') as string,
    image_url:   data.get('image_url') as string || undefined,
  })
}

async function update(data: FormData) {
  'use server'
  const id = data.get('id') as string
  await updateActivite(id, {
    titre:       data.get('titre') as string,
    description: data.get('description') as string,
    lieu:        data.get('lieu') as string || undefined,
    date_debut:  data.get('date_debut') as string,
    date_fin:    data.get('date_fin') as string || undefined,
    statut:      data.get('statut') as string,
    image_url:   data.get('image_url') as string || undefined,
  })
}

async function remove(data: FormData) {
  'use server'
  await deleteActivite(data.get('id') as string)
}

export default async function AdminActivitesPage() {
  const items = await safeFetch(() => getActivites(), [] as Awaited<ReturnType<typeof getActivites>>)
  const data = items

  return (
    <div>
      <PageHeader titre="Activités" description="Gérez les événements et activités affichés sur le site." />
      <AdminActivitesClient
        items={data}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
      />
    </div>
  )
}

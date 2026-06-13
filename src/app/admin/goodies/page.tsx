import { getGoodies, createGoodie, updateGoodie, deleteGoodie } from '@/lib/supabase/actions/goodies'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminGoodiesClient from './client'

export const dynamic = 'force-dynamic'

async function create(data: FormData) {
  'use server'
  await createGoodie({
    nom:         data.get('nom') as string,
    description: data.get('description') as string || undefined,
    prix:        Number(data.get('prix')),
    stock:       Number(data.get('stock')),
    image_url:   data.get('image_url') as string || undefined,
    actif:       data.get('actif') === 'on',
  })
}

async function update(data: FormData) {
  'use server'
  const id = data.get('id') as string
  await updateGoodie(id, {
    nom:         data.get('nom') as string,
    description: data.get('description') as string || null,
    prix:        Number(data.get('prix')),
    stock:       Number(data.get('stock')),
    image_url:   data.get('image_url') as string || null,
    actif:       data.get('actif') === 'on',
    nouveau:     data.get('nouveau') === 'on',
  })
}

async function remove(data: FormData) {
  'use server'
  await deleteGoodie(data.get('id') as string)
}

export default async function AdminGoodiesPage() {
  const items = await safeFetch(() => getGoodies(), [] as Awaited<ReturnType<typeof getGoodies>>)
  const data = items

  return (
    <div>
      <PageHeader titre="Boutique Goodies" description="Gérez les produits affichés dans la boutique." />
      <AdminGoodiesClient
        items={data}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
      />
    </div>
  )
}

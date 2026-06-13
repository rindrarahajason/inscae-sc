import { getTemoignages, validerTemoignage, depublierTemoignage, deleteTemoignage } from '@/lib/supabase/actions/temoignages'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminTemoignagesClient from './client'

export const dynamic = 'force-dynamic'

async function valider(data: FormData) {
  'use server'
  await validerTemoignage(data.get('id') as string)
}

async function depublier(data: FormData) {
  'use server'
  await depublierTemoignage(data.get('id') as string)
}

async function remove(data: FormData) {
  'use server'
  await deleteTemoignage(data.get('id') as string)
}

export default async function AdminTemoignagesPage() {
  const items = await safeFetch(() => getTemoignages(), [] as Awaited<ReturnType<typeof getTemoignages>>)
  const data = items

  return (
    <div>
      <PageHeader titre="Témoignages" description="Validez et modérez les témoignages soumis par les visiteurs." />
      <AdminTemoignagesClient
        items={data}
        onValider={valider}
        onDepublier={depublier}
        onDelete={remove}
      />
    </div>
  )
}

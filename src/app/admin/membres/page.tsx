import { getMembres, updateMembreRole, updateMembreStatus, deleteMembre } from '@/lib/supabase/actions/membres'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminMembresClient from './client'

export const dynamic = 'force-dynamic'

async function setRole(data: FormData) {
  'use server'
  await updateMembreRole(data.get('id') as string, data.get('role') as string)
}

async function setStatus(data: FormData) {
  'use server'
  await updateMembreStatus(data.get('id') as string, data.get('status') as string)
}

async function remove(data: FormData) {
  'use server'
  await deleteMembre(data.get('id') as string)
}

export default async function AdminMembresPage() {
  const items = await safeFetch(() => getMembres(), [] as Awaited<ReturnType<typeof getMembres>>)
  const data = items

  return (
    <div>
      <PageHeader titre="Membres" description="Gérez les comptes membres, validez les inscriptions et assignez les rôles." />
      <AdminMembresClient
        items={data}
        onSetRole={setRole}
        onSetStatus={setStatus}
        onDelete={remove}
      />
    </div>
  )
}

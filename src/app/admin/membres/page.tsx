import { getMembres, updateMembreRole, updateMembreStatus, deleteMembre, creerMembre } from '@/lib/supabase/actions/membres'
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

async function create(data: FormData) {
  'use server'
  return creerMembre({
    email:      data.get('email') as string,
    full_name:  data.get('full_name') as string,
    role:       data.get('role') as string,
    promotion:  data.get('promotion') as string,
    phone:      data.get('phone') as string,
    profession: data.get('profession') as string,
    ville:      data.get('ville') as string,
  })
}

export default async function AdminMembresPage() {
  const items = await safeFetch(() => getMembres(), [] as Awaited<ReturnType<typeof getMembres>>)

  return (
    <div>
      <PageHeader titre="Membres" description="Gérez les comptes membres, validez les inscriptions et assignez les rôles." />
      <AdminMembresClient
        items={items}
        onSetRole={setRole}
        onSetStatus={setStatus}
        onDelete={remove}
        onCreate={create}
      />
    </div>
  )
}

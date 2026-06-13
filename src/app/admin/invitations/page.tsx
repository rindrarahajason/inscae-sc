import { getInvitations, createInvitation, revoquerInvitation } from '@/lib/supabase/actions/invitations'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminInvitationsClient from './client'

export const dynamic = 'force-dynamic'

async function invite(data: FormData) {
  'use server'
  const email = data.get('email') as string
  if (!email) return
  const result = await createInvitation(email)
  return { inviteUrl: result.inviteUrl }
}

async function revoquer(data: FormData) {
  'use server'
  await revoquerInvitation(data.get('id') as string)
}

export default async function AdminInvitationsPage() {
  const items = await safeFetch(() => getInvitations(), [] as Awaited<ReturnType<typeof getInvitations>>)
  const data = items

  return (
    <div>
      <PageHeader titre="Invitations" description="Gérez les invitations envoyées pour rejoindre l'espace membres." />
      <AdminInvitationsClient
        items={data}
        onInvite={invite}
        onRevoquer={revoquer}
      />
    </div>
  )
}

import { getConversations, getMessagesAvec, getMembresActifs, getCurrentProfile, envoyerMessage } from '@/lib/supabase/actions/reseau'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import MessagerieClient from './client'

export const dynamic = 'force-dynamic'

export default async function MessageriePage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>
}) {
  const { to } = await searchParams

  const [convs, membres, profil] = await Promise.all([
    safeFetch(() => getConversations(), [] as Awaited<ReturnType<typeof getConversations>>),
    safeFetch(() => getMembresActifs(), [] as Awaited<ReturnType<typeof getMembresActifs>>),
    safeFetch(() => getCurrentProfile(), null),
  ])

  const messages = to ? await safeFetch(() => getMessagesAvec(to), [] as Awaited<ReturnType<typeof getMessagesAvec>>) : []
  const cible = to ? membres.find(m => m.id === to) ?? null : null

  async function envoyer(destinataireId: string, contenu: string) {
    'use server'
    return envoyerMessage(destinataireId, contenu)
  }

  return (
    <MessagerieClient
      conversations={convs}
      membres={membres.map(m => ({ id: m.id, full_name: m.full_name }))}
      activeTo={to ?? null}
      cibleNom={cible?.full_name ?? null}
      messages={messages}
      currentUserId={profil?.id ?? null}
      onSend={envoyer}
    />
  )
}

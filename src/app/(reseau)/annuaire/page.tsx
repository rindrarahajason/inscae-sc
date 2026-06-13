import { getMembresActifs } from '@/lib/supabase/actions/reseau'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import AnnuaireClient from './client'

export const dynamic = 'force-dynamic'

type Membre = {
  id: string
  full_name: string
  avatar_url: string | null
  promotion: string | null
  profession: string | null
  ville: string | null
  bio: string | null
  email: string
}

export default async function AnnuairePage() {
  const membres = await safeFetch(() => getMembresActifs() as Promise<Membre[]>, [] as Membre[])
  return <AnnuaireClient membres={membres} />
}

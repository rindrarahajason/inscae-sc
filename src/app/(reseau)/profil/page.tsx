import { getCurrentProfile, updateMonProfil } from '@/lib/supabase/actions/reseau'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import ProfilClient from './client'

export const dynamic = 'force-dynamic'

type Profil = {
  id: string
  full_name: string
  email: string
  role: string
  status: string
  promotion: string | null
  bio: string | null
  phone: string | null
  profession: string | null
  ville: string | null
}

const EMPTY: Profil = {
  id: '', full_name: '', email: '', role: 'membre', status: 'active',
  promotion: null, bio: null, phone: null, profession: null, ville: null,
}

export default async function ProfilPage() {
  const profil = (await safeFetch(() => getCurrentProfile() as Promise<Profil>, EMPTY)) ?? EMPTY

  async function enregistrer(fields: {
    full_name: string; bio?: string; phone?: string; profession?: string; ville?: string; promotion?: string
  }) {
    'use server'
    return updateMonProfil(fields)
  }

  return <ProfilClient profil={profil} onSave={enregistrer} />
}

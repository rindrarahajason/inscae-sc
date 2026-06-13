import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/supabase/actions/reseau'
import { isSupabaseConfigured } from '@/lib/supabase/safe-fetch'
import AdminShell from '@/components/admin/AdminShell'

const ROLES_ADMIN = ['super_admin', 'admin', 'bureau']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const profil = await getCurrentProfile()
    if (!profil) redirect('/auth/connexion')
    if (!ROLES_ADMIN.includes(profil.role) || profil.status !== 'active') redirect('/feed')
  }

  return <AdminShell>{children}</AdminShell>
}

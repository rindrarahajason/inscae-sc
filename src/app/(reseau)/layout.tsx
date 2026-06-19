import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Home, MessageSquare, Users, User, LayoutDashboard, UserPlus } from 'lucide-react'
import MemberSignOut from '@/components/reseau/MemberSignOut'
import BottomNav from '@/components/reseau/BottomNav'
import ActiveNavLink from '@/components/reseau/ActiveNavLink'
import { getCurrentProfile } from '@/lib/supabase/actions/reseau'
import { isSupabaseConfigured } from '@/lib/supabase/safe-fetch'

const NAV = [
  { href: '/feed',       label: "Fil d'actualité", icon: Home },
  { href: '/annuaire',   label: 'Annuaire',         icon: Users },
  { href: '/messagerie', label: 'Messagerie',       icon: MessageSquare },
  { href: '/inviter',    label: 'Inviter un ami',   icon: UserPlus },
  { href: '/profil',     label: 'Mon profil',       icon: User },
]

const ADMIN_ROLES = ['super_admin', 'admin', 'bureau']

export default async function ReseauLayout({ children }: { children: React.ReactNode }) {
  let profil = null
  if (isSupabaseConfigured()) {
    profil = await getCurrentProfile()
    if (!profil) redirect('/auth/connexion')
    if (profil.status !== 'active') redirect('/auth/en-attente')
  }

  const isAdmin = profil && ADMIN_ROLES.includes(profil.role)

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-2 border-stone-100 p-4 sticky top-0 h-screen">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 font-black text-violet-900 text-lg">
            <span className="w-9 h-9 bg-violet-700 rounded-xl flex items-center justify-center text-white">✝</span>
            <span>INSCAE SC</span>
          </Link>
          <p className="text-xs text-stone-400 mt-1 ml-1">Espace membres</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <ActiveNavLink key={href} href={href} label={label} icon={Icon} />
          ))}
        </nav>
        <div className="border-t-2 border-stone-100 pt-4 space-y-2">
          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors text-sm font-bold">
              <LayoutDashboard size={16} />
              Tableau de bord admin
            </Link>
          )}
          <Link href="/" className="block text-xs text-stone-400 hover:text-violet-700 transition-colors px-3 py-1">
            ← Retour au site public
          </Link>
          <MemberSignOut />
        </div>
      </aside>

      {/* Bottom nav mobile — client component avec état actif */}
      <BottomNav isAdmin={!!isAdmin} />

      {/* Contenu */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}

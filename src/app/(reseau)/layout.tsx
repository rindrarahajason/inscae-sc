import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Home, MessageSquare, Users, User } from 'lucide-react'
import MemberSignOut from '@/components/reseau/MemberSignOut'
import { getCurrentProfile } from '@/lib/supabase/actions/reseau'
import { isSupabaseConfigured } from '@/lib/supabase/safe-fetch'

const NAV = [
  { href: '/feed',       label: "Fil d'actualité", icon: Home },
  { href: '/annuaire',   label: 'Annuaire',         icon: Users },
  { href: '/messagerie', label: 'Messagerie',       icon: MessageSquare },
  { href: '/profil',     label: 'Mon profil',       icon: User },
]

export default async function ReseauLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const profil = await getCurrentProfile()
    if (!profil) redirect('/auth/connexion')
    if (profil.status !== 'active') redirect('/auth/en-attente')
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex">
      {/* Sidebar */}
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
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-600 hover:bg-violet-50 hover:text-violet-800 transition-colors text-sm font-bold">
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t-2 border-stone-100 pt-4 space-y-3">
          <Link href="/" className="block text-xs text-stone-400 hover:text-violet-700 transition-colors">
            ← Retour au site public
          </Link>
          <MemberSignOut />
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t-2 border-stone-100 flex justify-around py-2 z-40">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} aria-label={label}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-stone-500 hover:text-violet-700">
            <Icon size={20} />
          </Link>
        ))}
      </nav>

      {/* Contenu */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}

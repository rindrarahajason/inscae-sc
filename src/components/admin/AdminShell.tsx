'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, Calendar,
  MessageSquare, ShoppingBag, Video, Mail, Trophy, Images
} from 'lucide-react'
import SignOutButton from '@/components/admin/SignOutButton'

const navItems = [
  { href: '/admin',              label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/membres',      label: 'Membres',       icon: Users },
  { href: '/admin/invitations',  label: 'Invitations',   icon: Mail },
  { href: '/admin/actualites',   label: 'Actualités',    icon: FileText },
  { href: '/admin/activites',    label: 'Activités',     icon: Calendar },
  { href: '/admin/temoignages',  label: 'Témoignages',   icon: MessageSquare },
  { href: '/admin/presidents',   label: 'Présidents',    icon: Trophy },
  { href: '/admin/histoire',     label: 'Galerie',       icon: Images },
  { href: '/admin/goodies',      label: 'Goodies',       icon: ShoppingBag },
  { href: '/admin/contenus',     label: 'Vidéos',        icon: Video },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-violet-900 sticky top-0 h-screen shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-violet-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-violet-900 font-black text-sm">✝</div>
            <div>
              <p className="font-black text-white text-sm leading-none">INSCAE SC</p>
              <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-amber-400 text-violet-900'
                    : 'text-violet-300 hover:bg-violet-800 hover:text-white'
                }`}>
                <Icon size={16} className="shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="p-4 border-t border-violet-700 space-y-1">
          <Link href="/" className="flex items-center gap-2 text-xs text-violet-400 hover:text-white transition-colors py-1">
            <span>←</span> Site public
          </Link>
          <Link href="/feed" className="flex items-center gap-2 text-xs text-violet-400 hover:text-white transition-colors py-1">
            <span>→</span> Espace membres
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}

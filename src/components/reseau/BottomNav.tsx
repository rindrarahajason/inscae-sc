'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, Users, UserPlus, User, LayoutDashboard } from 'lucide-react'

const NAV = [
  { href: '/feed',       label: 'Fil',       icon: Home },
  { href: '/annuaire',   label: 'Annuaire',  icon: Users },
  { href: '/messagerie', label: 'Messages',  icon: MessageSquare },
  { href: '/inviter',    label: 'Inviter',   icon: UserPlus },
  { href: '/profil',     label: 'Profil',    icon: User },
]

export default function BottomNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t-2 border-stone-100 flex justify-around items-center py-1 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} aria-label={label}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors relative"
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-1 bg-violet-700 rounded-full" />
            )}
            <Icon size={22} className={active ? 'text-violet-700' : 'text-stone-400'} />
            <span className={`text-[10px] font-bold ${active ? 'text-violet-700' : 'text-stone-400'}`}>
              {label}
            </span>
          </Link>
        )
      })}
      {isAdmin && (
        <Link href="/admin" aria-label="Admin"
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors">
          <LayoutDashboard size={22} className="text-amber-500" />
          <span className="text-[10px] font-bold text-amber-500">Admin</span>
        </Link>
      )}
    </nav>
  )
}

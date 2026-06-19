'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'

export default function ActiveNavLink({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
        active
          ? 'bg-violet-700 text-white'
          : 'text-stone-600 hover:bg-violet-50 hover:text-violet-800'
      }`}>
      <Icon size={18} />
      {label}
    </Link>
  )
}

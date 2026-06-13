'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/histoire',    label: 'Histoire' },
  { href: '/activites',   label: 'Activités' },
  { href: '/actualites',  label: 'Actualités' },
  { href: '/temoignages', label: 'Témoignages' },
  { href: '/videos',      label: 'Vidéos' },
  { href: '/dons',        label: 'Dons' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF0] border-b-2 border-violet-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center text-white font-black text-sm group-hover:bg-amber-400 group-hover:text-violet-900 transition-colors duration-200">
              ✝
            </div>
            <span className="font-black text-violet-900 text-lg tracking-tight hidden sm:block">
              INSCAE <span className="text-amber-500">SC</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-violet-700 text-white'
                      : 'text-stone-700 hover:bg-violet-100 hover:text-violet-800'
                  }`}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/auth/connexion"
              className="text-sm font-semibold text-stone-600 hover:text-violet-700 transition-colors">
              Connexion
            </Link>
            <Link href="/goodies"
              className="text-sm font-bold bg-amber-400 text-violet-900 px-4 py-2 rounded-full hover:bg-amber-300 transition-colors shadow-sm">
              🎁 Boutique
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-violet-100 text-violet-900 transition-colors">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#FFFBF0] border-t-2 border-violet-100 px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? 'bg-violet-700 text-white'
                  : 'text-stone-700 hover:bg-violet-100'
              }`}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-violet-100 flex gap-2 mt-2">
            <Link href="/auth/connexion" onClick={() => setOpen(false)}
              className="flex-1 text-center text-sm font-semibold py-2 rounded-xl border-2 border-violet-200 text-violet-700 hover:bg-violet-50">
              Connexion
            </Link>
            <Link href="/goodies" onClick={() => setOpen(false)}
              className="flex-1 text-center text-sm font-bold py-2 rounded-xl bg-amber-400 text-violet-900 hover:bg-amber-300">
              🎁 Boutique
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

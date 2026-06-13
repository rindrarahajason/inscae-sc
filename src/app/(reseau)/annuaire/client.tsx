'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Briefcase, MessageSquare } from 'lucide-react'

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

function initiales(nom: string) {
  return nom.split(' ').map(m => m[0]).slice(0, 2).join('').toUpperCase()
}

export default function AnnuaireClient({ membres }: { membres: Membre[] }) {
  const [q, setQ] = useState('')
  const filtres = membres.filter(m => {
    const t = `${m.full_name} ${m.promotion ?? ''} ${m.profession ?? ''} ${m.ville ?? ''}`.toLowerCase()
    return t.includes(q.toLowerCase())
  })

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-black text-violet-900 mb-1">Annuaire des membres</h1>
      <p className="text-stone-500 text-sm mb-6">{membres.length} membre{membres.length > 1 ? 's' : ''} actif{membres.length > 1 ? 's' : ''}</p>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Rechercher par nom, promotion, métier, ville..."
          className="w-full bg-white border-2 border-stone-200 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtres.map(m => (
          <div key={m.id} className="bg-white rounded-3xl border-2 border-stone-100 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-violet-700 text-white flex items-center justify-center font-black shrink-0">
                {initiales(m.full_name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-violet-900 leading-tight truncate">{m.full_name}</p>
                {m.promotion && <p className="text-xs text-amber-600 font-bold">{m.promotion}</p>}
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {m.profession && (
                <p className="text-xs text-stone-500 flex items-center gap-2"><Briefcase size={13} /> {m.profession}</p>
              )}
              {m.ville && (
                <p className="text-xs text-stone-500 flex items-center gap-2"><MapPin size={13} /> {m.ville}</p>
              )}
              {m.bio && <p className="text-xs text-stone-500 mt-2 line-clamp-2">{m.bio}</p>}
            </div>
            <Link
              href={`/messagerie?to=${m.id}`}
              className="mt-4 inline-flex items-center gap-2 text-xs font-black text-violet-700 hover:text-violet-900 transition-colors"
            >
              <MessageSquare size={14} /> Envoyer un message
            </Link>
          </div>
        ))}
        {filtres.length === 0 && (
          <p className="text-stone-400 text-sm text-center py-8 col-span-full">Aucun membre trouvé.</p>
        )}
      </div>
    </div>
  )
}

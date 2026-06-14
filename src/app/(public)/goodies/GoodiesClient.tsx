'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const CommandeForm = dynamic(() => import('./CommandeForm'), { ssr: false })

type Goodie = {
  id: string
  nom: string
  description: string | null
  prix: number
  stock: number
  couleur: string | null
  nouveau: boolean | null
}

type Props = {
  data: Goodie[]
}

export default function GoodiesClient({ data }: Props) {
  const [selected, setSelected] = useState<Goodie | null>(null)

  return (
    <div className="bg-[#FFFBF0]">
      <section className="relative overflow-hidden bg-amber-400 py-20 px-4">
        <div className="absolute -bottom-8 -left-8 text-[200px] opacity-15 select-none rotate-12">🎁</div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="pill bg-violet-700 text-white mb-4 inline-block font-black">🎁 Boutique</span>
          <h1 className="text-5xl md:text-6xl font-black text-violet-900 mb-5 leading-tight">Goodies<br />INSCAE SC.</h1>
          <p className="text-violet-800 text-xl font-medium max-w-xl mx-auto">
            Arborez fièrement vos couleurs. Chaque achat finance nos activités.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        {data.length === 0 && (
          <p className="text-center text-stone-400 py-12">Aucun goodie disponible pour le moment.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.map(g => (
            <div key={g.id} className="rounded-3xl overflow-hidden border-2 border-stone-100 bg-white card-lift group">
              <div className={`relative ${g.couleur ?? 'bg-violet-100'} p-4`}>
                <img src={`https://picsum.photos/seed/${g.nom.replace(/\s/g, '')}/400/400`}
                  alt={g.nom}
                  className="w-full aspect-square object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                  {g.nouveau && <span className="pill bg-violet-700 text-white text-[10px]">✨ Nouveau</span>}
                  {g.stock === 0 && <span className="pill bg-stone-700 text-white text-[10px]">Épuisé</span>}
                  {g.stock > 0 && g.stock <= 5 && <span className="pill bg-orange-400 text-white text-[10px]">🔥 Presque épuisé</span>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-black text-stone-800 text-sm leading-tight mb-1">{g.nom}</h3>
                <p className="text-xs text-stone-400 mb-3">{g.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-violet-700 text-base">{g.prix.toLocaleString('fr-FR')} Ar</span>
                  <button
                    disabled={g.stock === 0}
                    onClick={() => setSelected(g)}
                    className="text-xs font-black bg-amber-400 text-violet-900 px-3 py-1.5 rounded-full hover:bg-amber-300 transition-colors disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed">
                    {g.stock === 0 ? 'Épuisé' : 'Commander'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: '🚚', titre: 'Livraison Tana', desc: 'Gratuite dans Antananarivo.' },
            { emoji: '📱', titre: 'Paiement facile', desc: 'Espèces ou MVola.' },
            { emoji: '📦', titre: 'Commandes groupées', desc: 'Tarifs dégressifs pour 10+.' },
          ].map(info => (
            <div key={info.titre} className="bg-white rounded-2xl border-2 border-stone-100 p-5 text-center">
              <div className="text-3xl mb-2">{info.emoji}</div>
              <h3 className="font-black text-stone-800 text-sm">{info.titre}</h3>
              <p className="text-xs text-stone-400 mt-1">{info.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <CommandeForm
          goodie={{ id: selected.id, nom: selected.nom, prix: selected.prix }}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

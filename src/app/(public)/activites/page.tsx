import { getActivites } from '@/lib/supabase/actions/activites'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import Link from 'next/link'

export const metadata = { title: 'Activités — INSCAE Section Chrétienne' }
export const revalidate = 60

const statutConfig: Record<string, { label: string; bg: string; text: string }> = {
  a_venir:  { label: '🔵 À venir',  bg: 'bg-blue-100',  text: 'text-blue-800' },
  en_cours: { label: '🟢 En cours', bg: 'bg-green-100', text: 'text-green-800' },
  termine:  { label: '⚫ Terminé',  bg: 'bg-stone-100', text: 'text-stone-600' },
}
const catColor: Record<string, string> = {
  Spirituel: 'bg-violet-100 text-violet-700',
  Culte:     'bg-amber-100 text-amber-700',
  Formation: 'bg-orange-100 text-orange-700',
  Social:    'bg-teal-100 text-teal-700',
  Événement: 'bg-rose-100 text-rose-700',
}

export default async function ActivitesPage() {
  const items = await safeFetch(() => getActivites(), [] as Awaited<ReturnType<typeof getActivites>>)
  const data = items

  return (
    <div className="bg-[#FFFBF0]">
      <section className="relative overflow-hidden bg-amber-400 py-20 px-4">
        <div className="absolute -top-10 -right-10 text-[200px] opacity-10 select-none rotate-12">⛺</div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="pill bg-violet-700 text-white mb-4 inline-block">📅 Nos activités</span>
          <h1 className="text-5xl md:text-6xl font-black text-violet-900 mb-5 leading-tight">
            Vivre la foi,<br />ensemble.
          </h1>
          <p className="text-violet-800 text-xl font-medium max-w-xl mx-auto">
            Cultes, retraites, séminaires, actions sociales — il se passe toujours quelque chose !
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        {data.length === 0 && (
          <p className="text-center text-stone-400 py-12">Aucune activité prévue pour le moment.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(a => {
            const stat = statutConfig[a.statut] ?? statutConfig.a_venir
            return (
              <Link href={'/activites/' + a.id} key={a.id}>
              <div className="bg-white rounded-3xl overflow-hidden border-2 border-stone-100 card-lift group">
                <div className="relative overflow-hidden">
                  <img src={a.image_url ?? `https://picsum.photos/seed/${a.id}/600/400`}
                    alt={a.titre}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    <span className={`pill text-[11px] ${stat.bg} ${stat.text}`}>{stat.label}</span>
                    {a.categorie && (
                      <span className={`pill text-[11px] ${catColor[a.categorie] ?? 'bg-gray-100 text-gray-600'}`}>
                        {a.categorie}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 text-3xl">{a.emoji ?? '📅'}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-black text-stone-800 text-lg mb-2 leading-tight">{a.titre}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-4">
                    {a.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                      <span className="text-violet-400">📅</span> {a.date_debut}
                    </p>
                    {a.lieu && (
                      <p className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                        <span className="text-violet-400">📍</span> {a.lieu}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

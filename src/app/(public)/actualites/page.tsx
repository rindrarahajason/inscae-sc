import { getActualites } from '@/lib/supabase/actions/actualites'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import Link from 'next/link'

export const metadata = { title: 'Actualités — INSCAE Section Chrétienne' }
export const revalidate = 60

const catColor: Record<string, string> = {
  'Vie associative': 'bg-violet-100 text-violet-700',
  'Rapport':         'bg-teal-100 text-teal-700',
  "Rapport d'activité": 'bg-teal-100 text-teal-700',
  'Partenariat':     'bg-orange-100 text-orange-700',
  'Témoignage':      'bg-amber-100 text-amber-700',
  'Finances':        'bg-rose-100 text-rose-700',
  'Événement':       'bg-indigo-100 text-indigo-700',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function ActualitesPage() {
  const items = await safeFetch(() => getActualites(true), [] as Awaited<ReturnType<typeof getActualites>>)
  const [featured, ...rest] = items

  return (
    <div className="bg-[#FFFBF0]">
      <section className="relative overflow-hidden bg-rose-500 py-20 px-4">
        <div className="absolute -bottom-12 -right-8 text-[200px] opacity-10 select-none">📰</div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="pill bg-white text-rose-600 mb-4 inline-block font-black">📰 Actualités</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
            Les nouvelles<br />de la communauté.
          </h1>
          <p className="text-rose-100 text-xl font-medium max-w-xl mx-auto">
            Événements, témoignages, partenariats — tout ce qui fait vivre l&apos;ISC.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        {items.length === 0 && (
          <p className="text-center text-stone-400 py-12">Aucune actualité publiée pour le moment.</p>
        )}
        {featured && (
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-4">🔥 À la une</p>
            <Link href={'/actualites/' + featured.id} className="block">
            <div className="bg-white rounded-3xl border-2 border-stone-100 overflow-hidden grid md:grid-cols-5 card-lift">
              <div className="md:col-span-2">
                <img src={featured.image_url ?? `https://picsum.photos/seed/${featured.id}/600/400`}
                  alt={featured.titre} className="w-full h-60 md:h-full object-cover" />
              </div>
              <div className="md:col-span-3 p-8 flex flex-col justify-between">
                <div>
                  <span className={`pill text-xs mb-4 inline-block ${catColor[featured.categorie ?? ''] ?? 'bg-stone-100 text-stone-600'}`}>
                    {featured.categorie}
                  </span>
                  <h2 className="text-2xl font-black text-stone-800 mb-3 leading-tight">{featured.titre}</h2>
                  <p className="text-stone-500 leading-relaxed">{featured.extrait}</p>
                </div>
                <div className="flex items-center justify-between mt-6 text-xs text-stone-400">
                  <span className="font-semibold">
                    Par {featured.auteur?.full_name ?? 'Rédaction'}
                  </span>
                  <span>{formatDate(featured.created_at)}</span>
                </div>
              </div>
            </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rest.map((a) => (
            <Link key={a.id} href={'/actualites/' + a.id} className="block">
            <div className="bg-white rounded-3xl border-2 border-stone-100 overflow-hidden card-lift group">
              <div className="overflow-hidden">
                <img src={a.image_url ?? `https://picsum.photos/seed/${a.id}/400/300`}
                  alt={a.titre}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <span className={`pill text-[11px] mb-2 inline-block ${catColor[a.categorie ?? ''] ?? 'bg-stone-100 text-stone-600'}`}>
                  {a.categorie}
                </span>
                <h3 className="font-black text-stone-800 text-sm leading-tight mb-2 line-clamp-2">{a.titre}</h3>
                <p className="text-stone-400 text-xs line-clamp-2 mb-3">{a.extrait}</p>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span className="font-semibold">
                    {a.auteur?.full_name ?? 'Rédaction'}
                  </span>
                  <span>{formatDate(a.created_at)}</span>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

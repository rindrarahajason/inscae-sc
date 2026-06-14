import { getVideos } from '@/lib/supabase/actions/videos'
import { safeFetch } from '@/lib/supabase/safe-fetch'

export const metadata = { title: 'Vidéos — INSCAE Section Chrétienne' }
export const revalidate = 60

const catColor: Record<string, string> = {
  Retraite:    'bg-violet-100 text-violet-700',
  Culte:       'bg-amber-100 text-amber-700',
  Témoignage:  'bg-teal-100 text-teal-700',
  Séminaire:   'bg-orange-100 text-orange-700',
  Louange:     'bg-rose-100 text-rose-700',
  Présentation:'bg-indigo-100 text-indigo-700',
}

export default async function VideosPage() {
  const items = await safeFetch(() => getVideos(), [] as Awaited<ReturnType<typeof getVideos>>)
  const data = items
  const [featured, ...rest] = data

  return (
    <div className="bg-[#FFFBF0]">
      <section className="relative overflow-hidden bg-indigo-700 py-20 px-4">
        <div className="absolute -bottom-10 right-10 text-[200px] opacity-10 select-none">🎬</div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="pill bg-amber-400 text-indigo-900 mb-4 inline-block font-black">🎬 Vidéos</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">Nos moments<br />en images.</h1>
          <p className="text-indigo-200 text-xl font-medium max-w-xl mx-auto">
            Cultes, retraites, concerts — revivez les meilleurs moments.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        {data.length === 0 && (
          <p className="text-center text-stone-400 py-12">Aucune vidéo pour le moment.</p>
        )}
        {featured && (
          <>
            <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-4">🌟 En vedette</p>
            <a href={`https://www.youtube.com/watch?v=${featured.youtube_url}`} target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-3xl border-2 border-stone-100 overflow-hidden grid md:grid-cols-2 mb-12 card-lift">
                <div className="relative">
                  <img src={`https://img.youtube.com/vi/${featured.youtube_url}/maxresdefault.jpg`}
                    alt={featured.titre} className="w-full h-64 md:h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[22px] border-l-violet-900 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <span className={`pill text-xs mb-4 inline-block ${catColor[featured.categorie ?? ''] ?? 'bg-stone-100 text-stone-600'}`}>
                      {featured.categorie}
                    </span>
                    <h2 className="text-2xl font-black text-stone-800 mb-2">{featured.titre}</h2>
                  </div>
                  <p className="text-stone-400 text-sm font-semibold">{featured.date_affichage}</p>
                </div>
              </div>
            </a>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(v => (
            <a key={v.id} href={`https://www.youtube.com/watch?v=${v.youtube_url}`} target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-3xl border-2 border-stone-100 overflow-hidden card-lift group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img src={`https://img.youtube.com/vi/${v.youtube_url}/mqdefault.jpg`}
                    alt={v.titre}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors">
                    <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-violet-900 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <span className={`pill text-[11px] mb-2 inline-block ${catColor[v.categorie ?? ''] ?? 'bg-stone-100 text-stone-600'}`}>
                    {v.categorie}
                  </span>
                  <h3 className="font-black text-stone-800 text-sm leading-tight line-clamp-2">{v.titre}</h3>
                  <p className="text-stone-400 text-xs mt-1 font-semibold">{v.date_affichage}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

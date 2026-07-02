import Link from 'next/link'
import { getPresidents } from '@/lib/supabase/actions/presidents'
import { getPhotosHistoire } from '@/lib/supabase/actions/photos_histoire'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import CarouselHistoire from '@/components/public/CarouselHistoire'

export const metadata = { title: 'Histoire — INSCAE Section Chrétienne' }
export const revalidate = 3600

const AVATARS = ['1','5','3','8','11','9','15','20','12','33','47','44']

const jalons = [
  { annee: '1999', emoji: '🌱', titre: 'Fondation', desc: 'Des étudiants passionnés créent l\'INSCAE Section Chrétienne.' },
  { annee: '2003', emoji: '⛪', titre: 'Premier culte', desc: 'Culte interpromotionnel avec de nombreux participants.' },
  { annee: '2008', emoji: '🏛️', titre: 'Reconnaissance', desc: 'Reconnue officiellement par la direction INSCAE.' },
  { annee: '2012', emoji: '⛺', titre: 'Première retraite', desc: 'Retraite spirituelle annuelle à Antsirabe.' },
  { annee: '2015', emoji: '🌐', titre: 'Réseau anciens', desc: 'Lancement du réseau des anciens membres.' },
  { annee: '2020', emoji: '💻', titre: 'Transition numérique', desc: 'Cultes en ligne durant la pandémie COVID-19.' },
  { annee: '2025', emoji: '🚀', titre: 'Nouvelle plateforme', desc: 'Lancement de l\'espace membres en ligne pour connecter la communauté.' },
]

function annee(d: string | null) {
  if (!d) return 'présent'
  return new Date(d).getFullYear().toString()
}

export default async function HistoirePage() {
  const [presidents, photos] = await Promise.all([
    safeFetch(() => getPresidents(), [] as Awaited<ReturnType<typeof getPresidents>>),
    safeFetch(() => getPhotosHistoire(), [] as Awaited<ReturnType<typeof getPhotosHistoire>>),
  ])
  const data = presidents

  return (
    <div className="bg-[#FFFBF0]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-violet-900 py-24 px-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-700 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="pill bg-amber-400 text-violet-900 mb-4 inline-block">📖 Notre histoire</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Une foi qui traverse<br /><span className="text-amber-400">les générations</span>
          </h1>
          <p className="text-xl text-violet-200 max-w-2xl mx-auto font-medium">
            Depuis 1999, l&apos;INSCAE SC unit les étudiants autour des valeurs de la foi chrétienne
            et de l&apos;excellence académique.
          </p>
        </div>
      </section>

      {/* Récit */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start mb-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Les origines</p>
            <h2 className="text-3xl font-black text-violet-900 mb-5">1999 : la graine est plantée</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Des étudiants passionnés fondent l&apos;INSCAE Section Chrétienne dans les couloirs
              de l&apos;Institut National des Sciences Comptables et de l&apos;Administration des Entreprises.
              Leur rêve : vivre une foi authentique au cœur de l&apos;université.
            </p>
            <p className="text-stone-600 leading-relaxed mb-5">
              La devise qui guide chaque génération depuis les origines :
            </p>
            <div className="flex gap-3 flex-wrap">
              {['✝ Foi', '🎓 Excellence', '🤝 Service'].map(v => (
                <span key={v} className="bg-violet-100 text-violet-800 font-black text-sm px-4 py-2 rounded-full border-2 border-violet-200">{v}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://picsum.photos/seed/inscae1/500/360" alt="Campus INSCAE"
              className="rounded-3xl w-full object-cover shadow-xl rotate-1" />
            <div className="absolute -bottom-4 -left-4 bg-amber-400 rounded-2xl px-4 py-2 -rotate-2 shadow-lg">
              <p className="font-black text-violet-900 text-sm">🏛️ INSCAE · Antananarivo</p>
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { emoji: '✝', titre: 'Foi', desc: 'Ancrer notre vie académique dans les valeurs de l\'Évangile.', color: 'bg-violet-50 border-violet-200' },
            { emoji: '🎓', titre: 'Excellence', desc: 'Viser l\'excellence dans les études, le travail et le service.', color: 'bg-amber-50 border-amber-200' },
            { emoji: '🤝', titre: 'Service', desc: 'Servir la communauté étudiante, l\'Église et Madagascar.', color: 'bg-teal-50 border-teal-200' },
          ].map(v => (
            <div key={v.titre} className={`rounded-2xl border-2 p-6 ${v.color}`}>
              <div className="text-4xl mb-3">{v.emoji}</div>
              <h3 className="font-black text-stone-800 text-xl mb-2">{v.titre}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-violet-900 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Depuis 1999</p>
            <h2 className="text-3xl font-black text-white">Les grandes dates</h2>
          </div>
          <div className="space-y-4">
            {jalons.map((j, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="shrink-0 w-14 text-right pt-2">
                  <span className="text-amber-400 font-black text-sm">{j.annee}</span>
                </div>
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-sm shadow-lg">{j.emoji}</div>
                  {i < jalons.length - 1 && <div className="w-0.5 flex-1 bg-violet-700 mt-1 min-h-4" />}
                </div>
                <div className="bg-violet-800 rounded-2xl p-4 flex-1 mb-1">
                  <p className="font-bold text-white text-sm">{j.titre}</p>
                  <p className="text-violet-300 text-xs mt-0.5">{j.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel photos */}
      {photos.length > 0 && <CarouselHistoire photos={photos} />}

      {/* Présidents */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Depuis les origines</p>
          <h2 className="text-4xl font-black text-violet-900">Les présidents de l&apos;ISC</h2>
          <p className="text-stone-500 mt-2">Des hommes et femmes qui ont porté la vision</p>
        </div>
        {data.length === 0 && (
          <p className="text-center text-stone-400 py-12">Aucun président enregistré.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.map((p, i) => (
            <Link key={p.id} href={`/presidents/${p.id}`}
              className={`group text-center bg-white rounded-2xl p-4 border-2 card-lift cursor-pointer ${
                p.actuel ? 'border-amber-400 shadow-lg shadow-amber-100' : 'border-stone-100 hover:border-violet-200'
              }`}>
              <div className="relative mx-auto mb-3 w-16 h-16">
                <img
                  src={p.photo_url ?? `https://i.pravatar.cc/150?img=${AVATARS[i % AVATARS.length]}`}
                  alt={p.full_name}
                  className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-offset-2 ring-violet-200"
                />
                {p.actuel && (
                  <span className="absolute -bottom-1 -right-1 bg-amber-400 text-violet-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">NOW</span>
                )}
              </div>
              <p className="text-xs font-bold text-stone-800 leading-tight">{p.full_name}</p>
              <p className="text-[11px] text-violet-500 font-semibold mt-0.5">{annee(p.debut_mandat)}</p>
              <p className="text-[10px] text-violet-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                Voir le bureau →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

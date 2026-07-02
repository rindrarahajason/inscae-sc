import { getPresidents } from '@/lib/supabase/actions/presidents'
import { getMembresBureau } from '@/lib/supabase/actions/membres_bureau'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 3600

function annee(d: string | null | undefined) {
  if (!d) return 'présent'
  return new Date(d).getFullYear().toString()
}

function initiales(nom: string) {
  return nom.split(' ').map(m => m[0]).slice(0, 2).join('').toUpperCase()
}

export default async function PresidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const presidents = await safeFetch(() => getPresidents(), [])
  const president = presidents.find(p => p.id === id)
  if (!president) notFound()

  const bureau = await safeFetch(() => getMembresBureau(id), [])

  const idx = presidents.findIndex(p => p.id === id)
  const prev = presidents[idx - 1] ?? null
  const next = presidents[idx + 1] ?? null

  return (
    <div className="bg-[#f0fdf9] min-h-screen">

      {/* Hero président */}
      <section className="bg-violet-900 relative overflow-hidden py-20 px-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-700 opacity-30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative max-w-4xl mx-auto">
          <Link href="/histoire" className="inline-flex items-center gap-2 text-violet-300 hover:text-white text-sm font-semibold mb-8 transition-colors">
            ← Retour à l&apos;histoire
          </Link>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="shrink-0">
              {president.photo_url ? (
                <img src={president.photo_url} alt={president.full_name}
                  className="w-36 h-36 rounded-3xl object-cover border-4 border-amber-400 shadow-2xl" />
              ) : (
                <div className="w-36 h-36 rounded-3xl bg-violet-700 border-4 border-amber-400 flex items-center justify-center text-white font-black text-4xl shadow-2xl">
                  {initiales(president.full_name)}
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              {president.actuel && (
                <span className="inline-block bg-amber-400 text-violet-900 text-xs font-black px-3 py-1 rounded-full mb-3">
                  Président actuel
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
                {president.full_name}
              </h1>
              <p className="text-violet-300 text-lg font-semibold mb-4">
                Mandat {annee(president.debut_mandat)} — {annee(president.fin_mandat ?? null)}
              </p>
              {president.bio && (
                <p className="text-violet-200 leading-relaxed max-w-xl">{president.bio}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bureau */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Équipe dirigeante</p>
          <h2 className="text-3xl font-black text-violet-900">
            Le bureau {annee(president.debut_mandat)}
          </h2>
          {bureau.length === 0 && (
            <p className="text-stone-400 mt-6 text-sm">Les membres de ce bureau ne sont pas encore renseignés.</p>
          )}
        </div>

        {bureau.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {bureau.map(membre => (
              <div key={membre.id} className="flex flex-col items-center text-center bg-white rounded-2xl border-2 border-stone-100 p-5 hover:border-violet-200 transition-colors">
                {membre.photo_url ? (
                  <img src={membre.photo_url} alt={membre.full_name}
                    className="w-20 h-20 rounded-2xl object-cover mb-3 border-2 border-violet-100" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 font-black text-xl mb-3 border-2 border-violet-100">
                    {initiales(membre.full_name)}
                  </div>
                )}
                <p className="font-black text-stone-800 text-sm leading-tight">{membre.full_name}</p>
                <p className="text-xs text-violet-600 font-semibold mt-1">{membre.role_bureau}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Navigation entre présidents */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="border-t-2 border-stone-200 pt-8 flex justify-between items-center gap-4">
          {prev ? (
            <Link href={`/presidents/${prev.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border-2 border-stone-100 p-4 hover:border-violet-300 transition-colors group">
              <span className="text-stone-400 group-hover:text-violet-700">←</span>
              <div>
                <p className="text-xs text-stone-400 font-semibold">Président précédent</p>
                <p className="text-sm font-black text-stone-800">{prev.full_name}</p>
              </div>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/presidents/${next.id}`}
              className="flex items-center gap-3 bg-white rounded-2xl border-2 border-stone-100 p-4 hover:border-violet-300 transition-colors group text-right">
              <div>
                <p className="text-xs text-stone-400 font-semibold">Président suivant</p>
                <p className="text-sm font-black text-stone-800">{next.full_name}</p>
              </div>
              <span className="text-stone-400 group-hover:text-violet-700">→</span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  )
}

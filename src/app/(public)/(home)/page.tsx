import Link from 'next/link'
import Image from 'next/image'
import { getActivites } from '@/lib/supabase/actions/activites'
import { getTemoignages } from '@/lib/supabase/actions/temoignages'
import { safeFetch } from '@/lib/supabase/safe-fetch'

export const revalidate = 3600

export default async function HomePage() {
  const [activites, temoignages] = await Promise.all([
    safeFetch(() => getActivites(), [] as Awaited<ReturnType<typeof getActivites>>),
    safeFetch(() => getTemoignages(true), [] as Awaited<ReturnType<typeof getTemoignages>>),
  ])

  const prochaineActivite = activites.find(a => a.statut === 'a_venir') ?? activites[0] ?? null
  const temoignagesHome = temoignages.slice(0, 3)

  return (
    <div className="bg-[#f0f5ff]">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-violet-200 rounded-full opacity-30 blur-3xl -z-0" />
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-amber-200 rounded-full opacity-40 blur-3xl -z-0" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-violet-300 rounded-full opacity-20 blur-2xl -z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Antananarivo, Madagascar
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-violet-900 leading-none mb-6">
              La foi qui{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-white bg-violet-700 px-2 py-1 -rotate-1 inline-block">rassemble</span>
              </span>{' '}
              <br />les étudiants.
            </h1>

            <p className="text-lg text-stone-600 leading-relaxed mb-8 max-w-lg font-medium">
              L&apos;INSCAE Section Chrétienne unit les étudiants et anciens de l&apos;INSCAE
              autour de <strong className="text-violet-700">Jésus-Christ</strong> depuis 1999.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/histoire"
                className="bg-violet-700 text-white font-bold px-6 py-3 rounded-full hover:bg-violet-600 transition-colors shadow-lg shadow-violet-200">
                Découvrir notre histoire →
              </Link>
              <Link href="/dons"
                className="bg-transparent text-violet-700 font-bold px-6 py-3 rounded-full border-2 border-violet-300 hover:bg-violet-50 transition-colors">
                ❤️ Nous soutenir
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { num: '1999', label: 'Fondée en' },
                { num: '27+', label: 'Ans de foi' },
                { num: '1200+', label: 'Membres & anciens' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-violet-700">{s.num}</p>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4">
            <div className="relative">
              <div className="w-full aspect-[3/2] rounded-3xl overflow-hidden shadow-2xl shadow-violet-200 rotate-1">
                <Image
                  src="https://iafuduxsvornwngbhtcq.supabase.co/storage/v1/object/public/uploads/isc%2025.jpg"
                  alt="ISC 2025"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-amber-400 rounded-2xl p-4 shadow-xl -rotate-2">
                <p className="text-violet-900 font-black text-sm">✝ Chaque mercredi</p>
                <p className="text-violet-700 text-xs font-semibold">Séance hebdomadaire</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALEURS BANDE ────────────────────────────── */}
      <div className="bg-violet-900 py-4 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap">
          {Array(3).fill(['✝ Foi', '🎓 Excellence', '🤝 Service', '🙏 Prière', '📖 Parole', '❤️ Communauté']).flat().map((v, i) => (
            <span key={i} className="text-sm font-bold text-violet-200 uppercase tracking-widest shrink-0">
              {v} <span className="text-amber-400 mx-3">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SECTIONS CARDS ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Ce qu&apos;on fait</p>
          <h2 className="text-4xl font-black text-violet-900">Tout ce qui nous anime</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { emoji: '📖', titre: 'Notre Histoire', href: '/histoire', desc: 'De 1995 à aujourd\'hui — une aventure de foi qui traverse les générations.', color: 'bg-violet-50 border-violet-200 hover:bg-violet-100', accent: 'bg-violet-700' },
            { emoji: '📅', titre: 'Activités', href: '/activites', desc: 'Retraites, cultes, séminaires pro, actions sociales — on ne chôme pas !', color: 'bg-amber-50 border-amber-200 hover:bg-amber-100', accent: 'bg-amber-400' },
            { emoji: '📰', titre: 'Actualités', href: '/actualites', desc: 'Les dernières nouvelles et comptes-rendus de la vie de l\'ISC.', color: 'bg-rose-50 border-rose-200 hover:bg-rose-100', accent: 'bg-rose-400' },
            { emoji: '💬', titre: 'Témoignages', href: '/temoignages', desc: 'Des membres racontent comment la foi a changé leur parcours.', color: 'bg-teal-50 border-teal-200 hover:bg-teal-100', accent: 'bg-teal-500' },
            { emoji: '🎬', titre: 'Vidéos', href: '/videos', desc: 'Cultes, retraites, concerts — revivez les meilleurs moments.', color: 'bg-orange-50 border-orange-200 hover:bg-orange-100', accent: 'bg-orange-400' },
            { emoji: '🎁', titre: 'Boutique', href: '/goodies', desc: 'T-shirts, mugs, carnets — arborez les couleurs de l\'INSCAE SC.', color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100', accent: 'bg-indigo-500' },
          ].map(card => (
            <Link key={card.href} href={card.href}
              className={`group relative border-2 rounded-2xl p-6 transition-all duration-200 card-lift ${card.color}`}>
              <div className={`w-12 h-12 ${card.accent} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                {card.emoji}
              </div>
              <h3 className="text-xl font-black text-stone-800 mb-2">{card.titre}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{card.desc}</p>
              <span className="absolute bottom-4 right-4 text-stone-300 group-hover:text-violet-400 transition-colors font-bold text-lg">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ACTIVITÉ EN VEDETTE ───────────────────────── */}
      {prochaineActivite && (
        <section className="bg-violet-900 relative overflow-hidden py-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="pill bg-amber-400 text-violet-900 mb-4 inline-block">🔥 Prochainement</span>
                <h2 className="text-4xl font-black text-white mb-4 leading-tight">{prochaineActivite.titre}</h2>
                {prochaineActivite.date_debut && (
                  <p className="text-violet-200 mb-2 font-semibold">
                    📅 {new Date(prochaineActivite.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
                {prochaineActivite.lieu && (
                  <p className="text-violet-200 mb-6 font-semibold">📍 {prochaineActivite.lieu}</p>
                )}
                {prochaineActivite.description && (
                  <p className="text-violet-300 mb-8 leading-relaxed line-clamp-3">{prochaineActivite.description}</p>
                )}
                <Link href="/activites"
                  className="inline-flex items-center gap-2 bg-amber-400 text-violet-900 font-black px-6 py-3 rounded-full hover:bg-amber-300 transition-colors shadow-lg">
                  Voir toutes les activités →
                </Link>
              </div>
              <div className="relative">
                <div className="w-full aspect-[3/2] rounded-3xl bg-violet-800 flex items-center justify-center shadow-2xl -rotate-1">
                  <span className="text-8xl opacity-30">📅</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TEMOIGNAGES ──────────────────────────────── */}
      {temoignagesHome.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Ils témoignent</p>
            <h2 className="text-4xl font-black text-violet-900">Des vies transformées</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {temoignagesHome.map((t, i) => (
              <div key={t.id} className={`bg-white rounded-2xl p-6 shadow-sm border-2 card-lift ${
                i === 1 ? 'border-violet-200 md:translate-y-4' : 'border-stone-100'
              }`}>
                <div className="text-5xl text-violet-200 font-serif leading-none mb-3">&ldquo;</div>
                <p className="text-stone-600 text-sm leading-relaxed italic mb-5 line-clamp-4">{t.contenu}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-black text-sm shrink-0">
                    {(t.auteur_nom ?? '?')[0]}
                  </div>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">{t.auteur_nom}</p>
                    {t.auteur_promo && <p className="text-xs text-violet-500 font-semibold">{t.auteur_promo}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/temoignages"
              className="inline-flex items-center gap-2 text-violet-700 font-bold hover:text-violet-500 transition-colors">
              Lire tous les témoignages →
            </Link>
          </div>
        </section>
      )}

      {/* ── CTA DONS ─────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 lg:mx-auto max-w-5xl mb-16">
        <div className="bg-amber-400 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 text-9xl opacity-10 rotate-12 select-none">❤️</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-violet-900 mb-3">Soutenez notre mission</h2>
            <p className="text-violet-800 text-base max-w-md font-medium">
              Chaque don finance les retraites, aide les étudiants en difficulté
              et fait rayonner la foi à l&apos;INSCAE.
            </p>
          </div>
          <Link href="/dons"
            className="shrink-0 bg-violet-900 text-white font-black px-8 py-4 rounded-full text-lg hover:bg-violet-800 transition-colors shadow-xl whitespace-nowrap">
            ❤️ Faire un don
          </Link>
        </div>
      </section>

    </div>
  )
}

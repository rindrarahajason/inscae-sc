import { getTemoignages } from '@/lib/supabase/actions/temoignages'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { createTemoignage } from '@/lib/supabase/actions/temoignages'

export const metadata = { title: 'Témoignages — INSCAE Section Chrétienne' }
export const revalidate = 60

const COLORS = ['bg-violet-50 border-violet-200','bg-amber-50 border-amber-200','bg-teal-50 border-teal-200','bg-rose-50 border-rose-200','bg-indigo-50 border-indigo-200','bg-orange-50 border-orange-200']
const AVATARS = ['47','11','33','15','44','20']

async function submitTemoignage(data: FormData) {
  'use server'
  const nom   = data.get('nom') as string
  const promo = data.get('promo') as string
  const texte = data.get('texte') as string
  if (!nom?.trim() || !texte?.trim()) return
  await createTemoignage({ auteur_nom: nom, auteur_promo: promo, contenu: texte })
}

export default async function TemoignagesPage() {
  const items = await safeFetch(() => getTemoignages(true), [] as Awaited<ReturnType<typeof getTemoignages>>)
  const data = items

  return (
    <div className="bg-[#FFFBF0]">
      <section className="relative overflow-hidden bg-teal-600 py-20 px-4">
        <div className="absolute -top-8 left-1/2 text-[200px] opacity-10 select-none -translate-x-1/2">💬</div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="pill bg-amber-400 text-teal-900 mb-4 inline-block font-black">💬 Témoignages</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">Des vies<br />transformées.</h1>
          <p className="text-teal-100 text-xl font-medium max-w-xl mx-auto">
            Nos membres racontent comment la foi a changé leur parcours.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14">
        {data.length === 0 && (
          <p className="text-center text-stone-400 py-12">Aucun témoignage pour le moment.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((t, i) => (
            <div key={t.id}
              className={`rounded-3xl border-2 p-6 card-lift ${COLORS[i % COLORS.length]} ${i === 1 ? 'md:translate-y-6' : ''}`}>
              <div className="text-6xl text-current opacity-20 font-serif leading-none mb-3 -mt-2">&ldquo;</div>
              <p className="text-stone-700 leading-relaxed italic text-sm mb-6">{t.contenu}</p>
              <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/80?img=${AVATARS[i % AVATARS.length]}`}
                  alt={t.auteur_nom}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-offset-2 ring-white shadow-md" />
                <div>
                  <p className="font-black text-stone-800 text-sm">{t.auteur_nom}</p>
                  <p className="text-xs text-violet-500 font-bold">{t.auteur_promo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire Server Action */}
        <div className="mt-16 bg-violet-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 text-[150px] opacity-10 select-none rotate-12">✍️</div>
          <div className="relative">
            <span className="pill bg-amber-400 text-violet-900 mb-4 inline-block font-black">✍️ Partager</span>
            <h2 className="text-3xl font-black text-white mb-2">Partagez votre témoignage</h2>
            <p className="text-violet-300 mb-8 text-sm">Le bureau relira votre témoignage avant publication.</p>
            <form action={submitTemoignage} className="max-w-xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input name="nom" type="text" placeholder="Votre nom *" required
                  className="bg-violet-800 border-2 border-violet-600 text-white placeholder-violet-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400" />
                <input name="promo" type="text" placeholder="Promo (ex: INSCAE 2024)"
                  className="bg-violet-800 border-2 border-violet-600 text-white placeholder-violet-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <textarea name="texte" rows={5} placeholder="Votre témoignage..." required
                className="w-full bg-violet-800 border-2 border-violet-600 text-white placeholder-violet-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 resize-none" />
              <button type="submit"
                className="bg-amber-400 text-violet-900 font-black px-8 py-3 rounded-full hover:bg-amber-300 transition-colors shadow-lg">
                Envoyer mon témoignage →
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

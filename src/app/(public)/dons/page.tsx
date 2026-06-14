export const metadata = { title: 'Dons — INSCAE Section Chrétienne' }

const montants = [5000, 10000, 20000, 50000, 100000]

const projets = [
  { emoji: '📚', titre: 'Solidarité étudiants',  desc: 'Aide aux étudiants en difficulté financière.' },
  { emoji: '⛺', titre: 'Retraites spirituelles', desc: 'Accès aux retraites pour tous les membres.' },
  { emoji: '🎓', titre: 'Séminaires & formations', desc: 'Conférences foi & carrière.' },
  { emoji: '🤝', titre: 'Actions sociales',       desc: 'Soutien scolaire à Antananarivo.' },
]

export default function DonsPage() {
  return (
    <div className="bg-[#FFFBF0]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-rose-500 py-20 px-4">
        <div className="absolute -top-10 -right-10 text-[200px] opacity-10 select-none rotate-12">❤️</div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="pill bg-white text-rose-600 mb-4 inline-block font-black">❤️ Faire un don</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
            Soutenez<br />notre mission.
          </h1>
          <p className="text-rose-100 text-xl font-medium max-w-xl mx-auto">
            Chaque don, petit ou grand, transforme des vies d&apos;étudiants et fait rayonner la foi.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Formulaire */}
          <div className="bg-white rounded-3xl border-2 border-stone-100 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-stone-800 mb-2">Faire un don</h2>
            <p className="text-sm text-stone-400 mb-6 font-semibold">
              Le paiement est manuel — un membre du bureau confirmera votre don.
            </p>

            <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-3">Choisissez un montant</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {montants.map(m => (
                <button key={m}
                  className="border-2 border-stone-200 rounded-xl py-2.5 text-sm font-black text-stone-700 hover:bg-violet-700 hover:text-white hover:border-violet-700 transition-all">
                  {m.toLocaleString('fr-FR')} Ar
                </button>
              ))}
              <button className="border-2 border-dashed border-violet-300 rounded-xl py-2.5 text-sm font-black text-violet-600 hover:bg-violet-50 transition-colors col-span-3">
                ✏️ Autre montant
              </button>
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Affecter à un projet</p>
            <select className="w-full border-2 border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400 mb-4 bg-white">
              <option value="">Laisser le bureau décider</option>
              {projets.map(p => <option key={p.titre}>{p.emoji} {p.titre}</option>)}
            </select>

            <div className="space-y-3 mb-6">
              <input type="text" placeholder="Votre nom (optionnel)"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400" />
              <input type="email" placeholder="Email (optionnel)"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-400" />
            </div>

            {/* Payment methods */}
            <div className="space-y-3">
              {/* MVola */}
              <div className="border-2 border-violet-100 bg-violet-50 rounded-2xl p-4">
                <h3 className="font-black text-violet-900 mb-1 text-sm flex items-center gap-2">📱 Don via MVola</h3>
                <p className="text-xs text-violet-700 font-semibold mb-2">
                  Envoyez votre don au numéro MVola du bureau, puis contactez-nous avec votre numéro d&apos;opération.
                </p>
                <div className="bg-white rounded-xl px-4 py-2.5 text-sm border-2 border-violet-100">
                  <p className="text-xs text-stone-400">Numéro MVola</p>
                  <p className="font-black text-violet-900 text-lg tracking-widest">034 XX XXX XX</p>
                  <p className="text-xs text-stone-400 mt-1">Intitulé : <strong>DON ISC</strong></p>
                </div>
              </div>

              {/* PayPal */}
              <div className="border-2 border-blue-100 bg-blue-50 rounded-2xl p-4">
                <h3 className="font-black text-blue-900 mb-1 text-sm flex items-center gap-2">💳 Don via PayPal</h3>
                <p className="text-xs text-blue-700 font-semibold mb-2">
                  Effectuez votre virement PayPal à l&apos;adresse ci-dessous et envoyez-nous la confirmation.
                </p>
                <div className="bg-white rounded-xl px-4 py-2.5 text-sm border-2 border-blue-100">
                  <p className="text-xs text-stone-400">Adresse PayPal</p>
                  <p className="font-black text-blue-900 text-sm">inscae.sc@gmail.com</p>
                  <p className="text-xs text-stone-400 mt-1">Note : <strong>DON ISC</strong></p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
              <p className="text-amber-800 text-xs font-semibold">
                ℹ️ Le paiement est traité manuellement. Un membre du bureau vous contactera pour confirmer la réception de votre don.
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">Vos dons financent</p>
              <div className="space-y-3">
                {projets.map(p => (
                  <div key={p.titre} className="flex gap-4 bg-white rounded-2xl border-2 border-stone-100 p-4 card-lift">
                    <span className="text-3xl shrink-0">{p.emoji}</span>
                    <div>
                      <h3 className="font-black text-stone-800 text-sm">{p.titre}</h3>
                      <p className="text-xs text-stone-500">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

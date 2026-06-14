'use client'

import { useState } from 'react'
import { X, ShoppingBag, CheckCircle } from 'lucide-react'
import { creerCommande } from '@/lib/supabase/actions/commandes'

type Goodie = {
  id: string
  nom: string
  prix: number
}

type Props = {
  goodie: Goodie
  onClose: () => void
}

export default function CommandeForm({ goodie, onClose }: Props) {
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [quantite, setQuantite] = useState(1)
  const [modePaiement, setModePaiement] = useState<'especes' | 'mvola'>('especes')
  const [numeroOperation, setNumeroOperation] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nom || !telephone || !adresse) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    if (modePaiement === 'mvola' && !numeroOperation) {
      setError('Veuillez entrer le numéro d\'opération MVola.')
      return
    }
    setLoading(true)
    setError('')
    const result = await creerCommande({
      goodie_id: goodie.id,
      goodie_nom: goodie.nom,
      quantite,
      nom_client: nom,
      telephone,
      adresse,
      mode_paiement: modePaiement,
      numero_operation: numeroOperation || undefined,
      message: message || undefined,
    })
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Slide-up panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-violet-900">Commander</h2>
            <p className="text-sm text-stone-500 font-semibold">{goodie.nom} — {goodie.prix.toLocaleString('fr-FR')} Ar</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 max-w-lg mx-auto">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-violet-900 mb-2">Commande envoyée !</h3>
              <p className="text-stone-500 text-sm mb-2">
                Votre commande a bien été enregistrée.
              </p>
              <p className="text-stone-600 text-sm font-semibold bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                📦 Un membre du bureau vous contactera pour organiser la livraison.
              </p>
              <button onClick={onClose}
                className="mt-6 bg-violet-700 text-white font-black px-8 py-3 rounded-full hover:bg-violet-600 transition-colors">
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quantite */}
              <div>
                <label className="text-xs font-black text-stone-600 uppercase tracking-wide block mb-1.5">Quantité</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button"
                      onClick={() => setQuantite(n)}
                      className={`w-10 h-10 rounded-full font-black text-sm border-2 transition-colors ${quantite === n ? 'bg-violet-700 text-white border-violet-700' : 'bg-white text-stone-700 border-stone-200 hover:border-violet-300'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nom */}
              <div>
                <label className="text-xs font-black text-stone-600 uppercase tracking-wide block mb-1.5">Nom complet *</label>
                <input value={nom} onChange={e => setNom(e.target.value)}
                  placeholder="Jean Rakoto"
                  className="w-full border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
              </div>

              {/* Téléphone */}
              <div>
                <label className="text-xs font-black text-stone-600 uppercase tracking-wide block mb-1.5">Téléphone *</label>
                <input value={telephone} onChange={e => setTelephone(e.target.value)}
                  placeholder="034 00 000 00"
                  className="w-full border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
              </div>

              {/* Adresse */}
              <div>
                <label className="text-xs font-black text-stone-600 uppercase tracking-wide block mb-1.5">Adresse de livraison *</label>
                <input value={adresse} onChange={e => setAdresse(e.target.value)}
                  placeholder="Lot XX, Quartier, Antananarivo"
                  className="w-full border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
              </div>

              {/* Mode de paiement */}
              <div>
                <label className="text-xs font-black text-stone-600 uppercase tracking-wide block mb-1.5">Mode de paiement *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setModePaiement('especes')}
                    className={`border-2 rounded-2xl py-3 text-sm font-black transition-colors ${modePaiement === 'especes' ? 'bg-violet-700 text-white border-violet-700' : 'bg-white text-stone-700 border-stone-200 hover:border-violet-300'}`}>
                    💵 Espèces
                  </button>
                  <button type="button" onClick={() => setModePaiement('mvola')}
                    className={`border-2 rounded-2xl py-3 text-sm font-black transition-colors ${modePaiement === 'mvola' ? 'bg-violet-700 text-white border-violet-700' : 'bg-white text-stone-700 border-stone-200 hover:border-violet-300'}`}>
                    📱 MVola
                  </button>
                </div>
              </div>

              {/* Numéro MVola */}
              {modePaiement === 'mvola' && (
                <div>
                  <label className="text-xs font-black text-stone-600 uppercase tracking-wide block mb-1.5">Numéro d&apos;opération MVola *</label>
                  <input value={numeroOperation} onChange={e => setNumeroOperation(e.target.value)}
                    placeholder="Ex: 1234567890"
                    className="w-full border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 font-mono" />
                  <p className="text-xs text-stone-400 mt-1">Entrez le numéro de confirmation de votre transaction MVola.</p>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="text-xs font-black text-stone-600 uppercase tracking-wide block mb-1.5">Message (optionnel)</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Taille, couleur, précision..."
                  rows={2}
                  className="w-full border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none" />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
              )}

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                <p className="text-amber-800 text-xs font-semibold">
                  📦 Un membre du bureau vous contactera pour organiser la livraison après validation de votre commande.
                </p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-amber-400 text-violet-900 font-black py-4 rounded-full hover:bg-amber-300 transition-colors text-base shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <ShoppingBag size={18} />
                {loading ? 'Envoi en cours...' : `Commander — ${(goodie.prix * quantite).toLocaleString('fr-FR')} Ar`}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

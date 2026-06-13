'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'

type Conversation = {
  autre: { id: string; full_name: string; avatar_url: string | null }
  dernier: string
  date: string
  nonLu: number
}
type Message = {
  id: string
  expediteur_id: string
  destinataire_id: string
  contenu: string
  created_at: string
}

function initiales(nom: string) {
  return nom.split(' ').map(m => m[0]).slice(0, 2).join('').toUpperCase()
}

export default function MessagerieClient({
  conversations,
  membres,
  activeTo,
  cibleNom,
  messages,
  currentUserId,
  onSend,
}: {
  conversations: Conversation[]
  membres: { id: string; full_name: string }[]
  activeTo: string | null
  cibleNom: string | null
  messages: Message[]
  currentUserId: string | null
  onSend: (destinataireId: string, contenu: string) => Promise<{ error?: string; success?: boolean }>
}) {
  const router = useRouter()
  const [texte, setTexte] = useState('')
  const [pending, startTransition] = useTransition()

  function envoyer() {
    const contenu = texte.trim()
    if (!contenu || !activeTo) return
    startTransition(async () => {
      const r = await onSend(activeTo, contenu)
      if (!r?.error) {
        setTexte('')
        router.refresh()
      }
    })
  }

  const nomActif = cibleNom ?? conversations.find(c => c.autre.id === activeTo)?.autre.full_name ?? 'Membre'

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-black text-violet-900 mb-6">Messagerie</h1>
      <div className="grid md:grid-cols-[280px_1fr] gap-4 bg-white rounded-3xl border-2 border-stone-100 shadow-sm overflow-hidden min-h-[60vh]">
        {/* Liste conversations */}
        <div className="border-r-2 border-stone-100 p-3 overflow-y-auto">
          <select
            value={activeTo ?? ''}
            onChange={e => e.target.value && router.push(`/messagerie?to=${e.target.value}`)}
            className="w-full mb-3 border-2 border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          >
            <option value="">+ Nouveau message…</option>
            {membres.map(m => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
          {conversations.length === 0 && (
            <p className="text-stone-400 text-xs text-center py-6">Aucune conversation.</p>
          )}
          {conversations.map(c => (
            <button
              key={c.autre.id}
              onClick={() => router.push(`/messagerie?to=${c.autre.id}`)}
              className={`w-full text-left flex items-center gap-3 p-2.5 rounded-2xl transition-colors mb-1 ${
                activeTo === c.autre.id ? 'bg-violet-50' : 'hover:bg-stone-50'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-violet-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                {initiales(c.autre.full_name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-violet-900 truncate">{c.autre.full_name}</p>
                <p className="text-xs text-stone-400 truncate">{c.dernier}</p>
              </div>
              {c.nonLu > 0 && (
                <span className="bg-amber-400 text-violet-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">{c.nonLu}</span>
              )}
            </button>
          ))}
        </div>

        {/* Thread */}
        <div className="flex flex-col">
          {!activeTo ? (
            <div className="flex-1 flex items-center justify-center text-stone-400 text-sm p-6">
              Sélectionnez ou démarrez une conversation.
            </div>
          ) : (
            <>
              <div className="border-b-2 border-stone-100 px-5 py-3">
                <p className="font-black text-violet-900">{nomActif}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.length === 0 && (
                  <p className="text-stone-400 text-xs text-center py-6">Démarrez la conversation 👋</p>
                )}
                {messages.map(m => {
                  const moi = m.expediteur_id === currentUserId
                  return (
                    <div key={m.id} className={`flex ${moi ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                        moi ? 'bg-violet-700 text-white rounded-br-sm' : 'bg-stone-100 text-stone-700 rounded-bl-sm'
                      }`}>
                        {m.contenu}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t-2 border-stone-100 p-3 flex gap-2">
                <input
                  value={texte}
                  onChange={e => setTexte(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); envoyer() } }}
                  placeholder="Votre message..."
                  className="flex-1 border-2 border-stone-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={envoyer}
                  disabled={pending || !texte.trim()}
                  aria-label="Envoyer"
                  className="bg-violet-700 text-white w-11 h-11 rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors disabled:opacity-40 shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

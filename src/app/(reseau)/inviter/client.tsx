'use client'

import { useState, useTransition } from 'react'
import { UserPlus, CheckCircle } from 'lucide-react'

type Props = {
  onInviter: (data: FormData) => Promise<{ error?: string; success?: boolean }>
}

export default function InviterClient({ onInviter }: Props) {
  const [pending, startTransition] = useTransition()
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErreur('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await onInviter(fd)
      if (result?.error) {
        setErreur(result.error)
      } else {
        setSucces(true)
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <UserPlus size={20} className="text-violet-700" />
          </div>
          <h1 className="text-2xl font-black text-violet-900">Inviter un ami</h1>
        </div>
        <p className="text-stone-500 text-sm">
          Invitez quelqu'un à rejoindre l'espace membres. Un administrateur devra valider la demande avant qu'il puisse accéder à l'espace.
        </p>
      </div>

      {succes && (
        <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <CheckCircle size={20} className="text-teal-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-teal-800">Invitation envoyée !</p>
            <p className="text-sm text-teal-700 mt-1">
              La personne recevra un email pour créer son compte. Sa demande devra être validée par un administrateur avant de pouvoir accéder à l'espace membres.
            </p>
            <button onClick={() => setSucces(false)} className="text-xs text-teal-600 underline mt-2 hover:text-teal-800">
              Inviter quelqu'un d'autre
            </button>
          </div>
        </div>
      )}

      {!succes && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 shadow-sm">
          {erreur && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 mb-4 text-sm text-rose-700 font-semibold">
              {erreur === 'User already registered'
                ? 'Cette adresse email est déjà enregistrée.'
                : erreur}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wide">Nom complet *</label>
              <input name="full_name" required
                placeholder="Jean Dupont"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wide">Adresse email *</label>
              <input name="email" type="email" required
                placeholder="jean@example.com"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div className="bg-amber-50 border-2 border-amber-100 rounded-xl p-3">
              <p className="text-xs text-amber-700 font-semibold">
                ⏳ La personne invitée devra attendre la validation d'un administrateur ou du bureau avant d'accéder à l'espace membres.
              </p>
            </div>
            <button type="submit" disabled={pending}
              className="w-full bg-violet-700 text-white py-3 rounded-full font-black hover:bg-violet-600 transition-colors text-sm shadow-lg disabled:opacity-50">
              {pending ? 'Envoi en cours...' : 'Envoyer l\'invitation →'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NouveauMotDePassePage() {
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErreur('')
    const fd = new FormData(e.currentTarget)
    const password = fd.get('password') as string
    const confirm = fd.get('confirm') as string
    if (password !== confirm) {
      setErreur('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    const res = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/auth/connexion?statut=mdp_reinitialise')
    } else {
      const data = await res.json()
      setErreur(data.error ?? 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-black">✝</span>
          </div>
          <h1 className="text-2xl font-black text-violet-900">Nouveau mot de passe</h1>
          <p className="text-stone-500 mt-1 text-sm">Choisissez un nouveau mot de passe sécurisé</p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-stone-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {erreur && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-sm text-rose-700 font-semibold">
                {erreur}
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Nouveau mot de passe</label>
              <input type="password" name="password" required minLength={8} autoComplete="new-password"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
              <p className="text-xs text-stone-400 mt-1">Minimum 8 caractères</p>
            </div>
            <div>
              <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Confirmer le mot de passe</label>
              <input type="password" name="confirm" required autoComplete="new-password"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-violet-700 text-white py-3 rounded-full font-black hover:bg-violet-600 transition-colors text-sm shadow-lg disabled:opacity-50">
              {loading ? 'Enregistrement...' : 'Enregistrer →'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-stone-400 hover:text-violet-700 transition-colors">
            ← Retour au site public
          </Link>
        </div>
      </div>
    </div>
  )
}

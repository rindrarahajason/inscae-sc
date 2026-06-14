'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function MotDePasseOubliePage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [erreur, setErreur] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: fd.get('email') }),
    })
    if (res.ok) {
      setSent(true)
    } else {
      const data = await res.json()
      setErreur(data.error ?? 'Une erreur est survenue')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-black">✝</span>
          </div>
          <h1 className="text-2xl font-black text-violet-900">Mot de passe oublié</h1>
          <p className="text-stone-500 mt-1 text-sm">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-stone-100 p-8 shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="font-bold text-stone-800">Email envoyé !</p>
              <p className="text-sm text-stone-500">
                Si un compte existe avec cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe dans quelques minutes.
              </p>
              <Link href="/auth/connexion" className="block text-sm text-violet-700 font-bold hover:text-violet-900">
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {erreur && (
                <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-sm text-rose-700 font-semibold">
                  {erreur}
                </div>
              )}
              <div>
                <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" name="email" required autoComplete="email"
                  className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-violet-700 text-white py-3 rounded-full font-black hover:bg-violet-600 transition-colors text-sm shadow-lg disabled:opacity-50">
                {loading ? 'Envoi...' : 'Envoyer le lien →'}
              </button>
              <div className="text-center">
                <Link href="/auth/connexion" className="text-xs text-stone-400 hover:text-violet-700">
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

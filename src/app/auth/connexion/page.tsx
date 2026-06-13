'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ConnexionPage() {
  const [enAttente, setEnAttente] = useState(false)
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('statut') === 'attente') setEnAttente(true)
    if (p.get('erreur')) setErreur(decodeURIComponent(p.get('erreur')!))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: fd.get('email'),
        password: fd.get('password'),
      }),
    })
    if (res.ok) {
      window.location.href = '/admin'
    } else {
      const data = await res.json()
      setErreur(data.error ?? 'Erreur de connexion')
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
          <h1 className="text-2xl font-black text-violet-900">INSCAE Section Chrétienne</h1>
          <p className="text-stone-500 mt-1 text-sm">Connectez-vous à l&apos;espace membres</p>
        </div>

        {enAttente && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-800 font-semibold text-center">
            Votre demande a bien été enregistrée. Vous pourrez vous connecter dès qu&apos;un administrateur l&apos;aura validée.
          </div>
        )}

        {erreur && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 mb-4 text-sm text-rose-700 font-semibold text-center">
            {erreur}
          </div>
        )}

        <div className="bg-white rounded-3xl border-2 border-stone-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" name="email" required autoComplete="email"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Mot de passe</label>
              <input type="password" name="password" required autoComplete="current-password"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-violet-700 text-white py-3 rounded-full font-black hover:bg-violet-600 transition-colors text-sm shadow-lg disabled:opacity-50">
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-stone-400">
              Pas encore membre ?{' '}
              <Link href="/auth/inscription" className="text-violet-700 font-bold hover:text-violet-900">
                Demander un compte
              </Link>
            </p>
          </div>
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

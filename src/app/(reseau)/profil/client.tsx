'use client'

import { useState, useTransition } from 'react'
import ImageUpload from '@/components/ui/ImageUpload'
import MemberSignOut from '@/components/reseau/MemberSignOut'
import Link from 'next/link'
import { LogOut, Globe } from 'lucide-react'

type Profil = {
  id: string
  full_name: string
  email: string
  role: string
  status: string
  promotion: string | null
  bio: string | null
  phone: string | null
  profession: string | null
  ville: string | null
  avatar_url: string | null
}

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin', admin: 'Admin', bureau: 'Bureau', membre: 'Membre',
}

function initiales(nom: string) {
  return nom.split(' ').map(m => m[0]).slice(0, 2).join('').toUpperCase()
}

function Champ({ label, name, defaultValue, type = 'text' }: { label: string; name: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} name={name} defaultValue={defaultValue}
        className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
    </div>
  )
}

export default function ProfilClient({
  profil,
  onSave,
  onSaveAvatar,
}: {
  profil: Profil
  onSave: (fields: { full_name: string; bio?: string; phone?: string; profession?: string; ville?: string; promotion?: string }) => Promise<{ error?: string; success?: boolean }>
  onSaveAvatar: (avatar_url: string) => Promise<{ error?: string; success?: boolean }>
}) {
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profil.avatar_url)
  const [pending, startTransition] = useTransition()

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setMessage(''); setErreur('')
    startTransition(async () => {
      const r = await onSave({
        full_name: fd.get('full_name') as string,
        bio: fd.get('bio') as string,
        phone: fd.get('phone') as string,
        profession: fd.get('profession') as string,
        ville: fd.get('ville') as string,
        promotion: fd.get('promotion') as string,
      })
      if (r?.error) setErreur(r.error)
      else setMessage('Profil enregistré ✓')
    })
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={profil.full_name} className="w-16 h-16 rounded-2xl object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-violet-700 text-white flex items-center justify-center font-black text-xl">
              {initiales(profil.full_name)}
            </div>
          )}
          <ImageUpload
            folder="profils"
            onUpload={url => {
              setAvatarUrl(url)
              startTransition(async () => {
                const r = await onSaveAvatar(url)
                if (r?.error) setErreur(r.error)
              })
            }}
            className="mt-2"
          />
        </div>
        <div>
          <h1 className="text-2xl font-black text-violet-900 leading-tight">{profil.full_name}</h1>
          <p className="text-sm text-stone-500">{profil.email}</p>
          <span className="inline-block mt-1 text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
            {ROLE_LABEL[profil.role] ?? profil.role}
          </span>
        </div>
      </div>

      <form onSubmit={submit} className="bg-white rounded-3xl border-2 border-stone-100 p-8 shadow-sm space-y-4">
        {message && <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-sm text-emerald-700 font-semibold text-center">{message}</div>}
        {erreur && <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3 text-sm text-rose-700 font-semibold text-center">{erreur}</div>}

        <Champ label="Nom complet" name="full_name" defaultValue={profil.full_name} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Champ label="Promotion" name="promotion" defaultValue={profil.promotion ?? ''} />
          <Champ label="Téléphone" name="phone" defaultValue={profil.phone ?? ''} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Champ label="Profession" name="profession" defaultValue={profil.profession ?? ''} />
          <Champ label="Ville" name="ville" defaultValue={profil.ville ?? ''} />
        </div>
        <div>
          <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Bio</label>
          <textarea name="bio" defaultValue={profil.bio ?? ''} rows={3}
            className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none" />
        </div>
        <button type="submit" disabled={pending}
          className="w-full bg-violet-700 text-white py-3 rounded-full font-black hover:bg-violet-600 transition-colors text-sm shadow-lg disabled:opacity-50">
          {pending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>

      {/* Actions compte */}
      <div className="mt-6 bg-white rounded-3xl border-2 border-stone-100 p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-black text-stone-500 uppercase tracking-wide mb-4">Mon compte</h2>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors text-sm font-semibold">
          <Globe size={18} className="text-stone-400" />
          Retour au site public
        </Link>
        <div className="border-t border-stone-100 pt-3">
          <MemberSignOut variant="full" />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'

type Membre = {
  id: string
  full_name: string
  role_bureau: string
  photo_url?: string | null
  ordre?: number
}

type ActionResult = { success?: boolean; error?: string }

const ROLES = [
  'Président(e)', 'Vice-président(e)', 'Secrétaire général(e)',
  'Secrétaire adjoint(e)', 'Trésorier(e)', 'Trésorier(e) adjoint(e)',
  'Responsable spirituel(le)', 'Responsable communication',
  'Responsable activités', 'Responsable cellules', 'Membre actif(ve)',
]

function initiales(nom: string) {
  return nom.split(' ').map(m => m[0]).slice(0, 2).join('').toUpperCase()
}

export default function AdminBureauClient({
  membres, presidentId, onCreate, onUpdate, onDelete,
}: {
  membres: Membre[]
  presidentId: string
  onCreate: (d: FormData) => Promise<ActionResult>
  onUpdate: (d: FormData) => Promise<ActionResult>
  onDelete: (d: FormData) => Promise<ActionResult>
}) {
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Membre | null>(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function openNew() { setEditItem(null); setPhotoUrl(''); setError(''); setShowForm(true) }
  function openEdit(m: Membre) { setEditItem(m); setPhotoUrl(m.photo_url ?? ''); setError(''); setShowForm(true) }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    if (photoUrl) fd.set('photo_url', photoUrl)
    startTransition(async () => {
      const r = editItem
        ? (fd.append('id', editItem.id), await onUpdate(fd))
        : await onCreate(fd)
      if (r.error) setError(r.error)
      else { setShowForm(false); setEditItem(null) }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer ce membre ?')) return
    const fd = new FormData(); fd.append('id', id)
    startTransition(async () => {
      const r = await onDelete(fd)
      if (r.error) setError(r.error)
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-stone-500">{membres.length} membre{membres.length !== 1 ? 's' : ''} dans ce bureau</p>
        <Button onClick={openNew}>+ Ajouter un membre</Button>
      </div>

      {error && <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 mb-4 text-sm text-rose-700 font-semibold">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6">
          <h2 className="font-black text-violet-900 mb-5">{editItem ? 'Modifier le membre' : 'Nouveau membre du bureau'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Nom complet *</label>
                <input name="full_name" required defaultValue={editItem?.full_name ?? ''}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Rôle *</label>
                <select name="role_bureau" required defaultValue={editItem?.role_bureau ?? ''}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 bg-white">
                  <option value="">— Choisir un rôle —</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Ordre d&apos;affichage</label>
                <input name="ordre" type="number" min="0" defaultValue={editItem?.ordre ?? membres.length}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Photo</label>
                <ImageUpload folder="bureau" onUpload={url => setPhotoUrl(url)} currentUrl={photoUrl || undefined} className="mb-2" />
                <input placeholder="Ou URL de la photo..." value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 mt-1" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>{pending ? 'Enregistrement...' : editItem ? 'Enregistrer' : 'Ajouter'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      {/* Grille membres */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {membres.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border-2 border-stone-100 p-4 flex flex-col items-center text-center group hover:border-violet-200 transition-colors">
            {m.photo_url ? (
              <img src={m.photo_url} alt={m.full_name} className="w-16 h-16 rounded-xl object-cover mb-3 border-2 border-violet-100" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-violet-100 text-violet-700 font-black text-lg flex items-center justify-center mb-3 border-2 border-violet-100">
                {initiales(m.full_name)}
              </div>
            )}
            <p className="font-black text-stone-800 text-xs leading-tight">{m.full_name}</p>
            <p className="text-[11px] text-violet-600 font-semibold mt-0.5 mb-3">{m.role_bureau}</p>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(m)} className="text-[11px] text-violet-700 hover:text-violet-900 font-bold">Modifier</button>
              <button onClick={() => handleDelete(m.id)} className="text-[11px] text-red-400 hover:text-red-600 font-bold">Sup.</button>
            </div>
          </div>
        ))}
        {membres.length === 0 && !showForm && (
          <div className="col-span-full text-center py-10 text-stone-400 text-sm">
            Aucun membre ajouté. Cliquez sur &ldquo;+ Ajouter un membre&rdquo; pour commencer.
          </div>
        )}
      </div>
    </div>
  )
}

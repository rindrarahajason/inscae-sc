'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'

type Item = {
  id: string
  full_name: string
  debut_mandat: string
  fin_mandat?: string | null
  bio?: string | null
  actuel: boolean
  photo_url?: string | null
}

type ActionResult = { success?: boolean; error?: string }

type Props = {
  items: Item[]
  onCreate: (data: FormData) => Promise<ActionResult>
  onUpdate: (data: FormData) => Promise<ActionResult>
  onDelete: (data: FormData) => Promise<ActionResult>
}

function annee(d: string | null | undefined) {
  if (!d) return ''
  return new Date(d).getFullYear().toString()
}

export default function AdminPresidentsClient({ items, onCreate, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  function openNew() { setEditItem(null); setPhotoUrl(''); setShowForm(true) }
  function openEdit(item: Item) { setEditItem(item); setPhotoUrl(item.photo_url ?? ''); setShowForm(true) }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const r = editItem
        ? (fd.append('id', editItem.id), await onUpdate(fd))
        : await onCreate(fd)
      if (r.error) setError(r.error)
      else setShowForm(false)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer ce président ?')) return
    const fd = new FormData(); fd.append('id', id)
    startTransition(async () => {
      const r = await onDelete(fd)
      if (r.error) setError(r.error)
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={openNew}>+ Ajouter un président</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6">
          <h2 className="font-black text-violet-900 mb-5">{editItem ? 'Modifier' : 'Nouveau président'}</h2>
          {error && <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 mb-4 text-sm text-rose-700 font-semibold">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Nom complet *</label>
                <input name="full_name" required defaultValue={editItem?.full_name ?? ''}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Début mandat (année) *</label>
                <input name="debut_mandat" required type="number" min="1999" max="2099"
                  defaultValue={editItem?.debut_mandat ? new Date(editItem.debut_mandat).getFullYear() : ''}
                  placeholder="ex: 2020"
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="actuel" defaultChecked={editItem?.actuel ?? false} className="w-4 h-4 accent-violet-700" />
                  <span className="text-sm font-semibold text-stone-700">Président actuel</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Photo</label>
                <ImageUpload folder="presidents" onUpload={url => setPhotoUrl(url)} currentUrl={photoUrl || undefined} className="mb-2" />
                <input name="photo_url" type="hidden" value={photoUrl} onChange={() => {}} />
                <input placeholder="Ou coller une URL image..." value={photoUrl} onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 mt-2" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Biographie courte</label>
                <textarea name="bio" rows={3} defaultValue={editItem?.bio ?? ''}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>{pending ? 'Enregistrement...' : editItem ? 'Enregistrer' : 'Ajouter'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100 text-xs font-black text-stone-400 uppercase tracking-wide">
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Nom</th>
              <th className="text-left px-4 py-3">Mandat</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                <td className="px-4 py-3 text-stone-400 text-xs">{i + 1}</td>
                <td className="px-4 py-3 font-bold text-stone-800">{item.full_name}</td>
                <td className="px-4 py-3 text-stone-500 text-xs">
                  {annee(item.debut_mandat)}
                </td>
                <td className="px-4 py-3">
                  {item.actuel && <Badge variant="blue">Actuel</Badge>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(item)} className="text-xs text-violet-700 hover:text-violet-900 font-bold">Modifier</button>
                    <button onClick={() => handleDelete(item.id)} disabled={pending} className="text-xs text-red-400 hover:text-red-600 font-bold">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

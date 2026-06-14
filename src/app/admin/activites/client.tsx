'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'

type Item = {
  id: string
  titre: string
  lieu?: string | null
  date_debut: string
  statut: string
  categorie?: string | null
  description?: string | null
  emoji?: string | null
  image_url?: string | null
}

type Props = {
  items: Item[]
  onCreate: (data: FormData) => Promise<void>
  onUpdate: (data: FormData) => Promise<void>
  onDelete: (data: FormData) => Promise<void>
}

const statutVariant: Record<string, 'blue' | 'green' | 'gray'> = {
  a_venir: 'blue', en_cours: 'green', termine: 'gray',
}
const statutLabel: Record<string, string> = {
  a_venir: 'À venir', en_cours: 'En cours', termine: 'Terminé',
}
const CATEGORIES = ['Spirituel', 'Culte', 'Formation', 'Social', 'Événement']
const emptyForm = { titre: '', lieu: '', date_debut: '', date_fin: '', statut: 'a_venir', categorie: '', description: '', image_url: '' }

export default function AdminActivitesClient({ items, onCreate, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageUrl, setImageUrl] = useState('')
  const [pending, startTransition] = useTransition()

  function openNew() { setEditItem(null); setForm(emptyForm); setImageUrl(''); setShowForm(true) }
  function openEdit(item: Item) {
    setEditItem(item)
    setForm({ titre: item.titre, lieu: item.lieu ?? '', date_debut: item.date_debut, date_fin: '', statut: item.statut, categorie: item.categorie ?? '', description: item.description ?? '', image_url: item.image_url ?? '' })
    setImageUrl(item.image_url ?? '')
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      if (editItem) { fd.append('id', editItem.id); await onUpdate(fd) }
      else await onCreate(fd)
      setShowForm(false)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer cette activité ?')) return
    const fd = new FormData(); fd.append('id', id)
    startTransition(() => onDelete(fd))
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={openNew}>+ Nouvelle activité</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6">
          <h2 className="font-black text-violet-900 mb-5">{editItem ? 'Modifier l\'activité' : 'Nouvelle activité'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Titre *</label>
                <input name="titre" required defaultValue={form.titre}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Lieu</label>
                <input name="lieu" defaultValue={form.lieu}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Date de début</label>
                <input name="date_debut" defaultValue={form.date_debut} placeholder="ex: 14/06/2025"
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Catégorie</label>
                <select name="categorie" defaultValue={form.categorie}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500">
                  <option value="">-- Choisir --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Statut</label>
                <select name="statut" defaultValue={form.statut}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500">
                  <option value="a_venir">À venir</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Image</label>
                <ImageUpload folder="activites" onUpload={url => setImageUrl(url)} currentUrl={imageUrl || undefined} className="mb-2" />
                <input name="image_url" type="hidden" value={imageUrl} onChange={() => {}} />
                <input placeholder="Ou coller une URL image..." value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 mt-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Description</label>
                <textarea name="description" rows={3} defaultValue={form.description}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>{pending ? 'Enregistrement...' : editItem ? 'Enregistrer' : 'Créer'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100 text-xs font-black text-stone-400 uppercase tracking-wide">
              <th className="text-left px-4 py-3">Titre</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Lieu</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Catégorie</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                <td className="px-4 py-3 font-bold text-stone-800">{item.titre}</td>
                <td className="px-4 py-3 hidden md:table-cell text-stone-500 text-xs">{item.lieu}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-stone-400 text-xs">{item.date_debut}</td>
                <td className="px-4 py-3 hidden md:table-cell text-stone-500 text-xs">{item.categorie}</td>
                <td className="px-4 py-3"><Badge variant={statutVariant[item.statut] ?? 'gray'}>{statutLabel[item.statut] ?? item.statut}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(item)} className="text-xs text-violet-700 hover:text-violet-900 font-bold">Modifier</button>
                    <button onClick={() => handleDelete(item.id)} disabled={pending} className="text-xs text-red-400 hover:text-red-600 font-bold">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-stone-400">Aucune activité.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

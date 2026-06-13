'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'

type Item = {
  id: string
  titre: string
  youtube_url: string
  categorie?: string | null
  date_affichage?: string | null
  description?: string | null
}

type Props = {
  items: Item[]
  onCreate: (data: FormData) => Promise<void>
  onUpdate: (data: FormData) => Promise<void>
  onDelete: (data: FormData) => Promise<void>
}

const CATEGORIES = ['Retraite', 'Culte', 'Témoignage', 'Séminaire', 'Louange', 'Présentation']

export default function AdminContenusClient({ items, onCreate, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [pending, startTransition] = useTransition()

  function openNew() { setEditItem(null); setShowForm(true) }
  function openEdit(item: Item) { setEditItem(item); setShowForm(true) }

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
    if (!confirm('Supprimer cette vidéo ?')) return
    const fd = new FormData(); fd.append('id', id)
    startTransition(() => onDelete(fd))
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={openNew}>+ Ajouter une vidéo</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6">
          <h2 className="font-black text-violet-900 mb-5">{editItem ? 'Modifier la vidéo' : 'Nouvelle vidéo'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Titre *</label>
                <input name="titre" required defaultValue={editItem?.titre ?? ''}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">URL ou ID YouTube *</label>
                <input name="youtube_url" required defaultValue={editItem?.youtube_url ?? ''} placeholder="https://youtu.be/... ou dQw4w9WgXcQ"
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
                <p className="text-xs text-stone-400 mt-1">URL complète ou ID YouTube (11 caractères)</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Catégorie</label>
                <select name="categorie" defaultValue={editItem?.categorie ?? ''}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500">
                  <option value="">-- Choisir --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Date affichage</label>
                <input name="date_affichage" defaultValue={editItem?.date_affichage ?? ''} placeholder="ex: Juin 2024"
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Description</label>
                <textarea name="description" rows={3} defaultValue={editItem?.description ?? ''}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden card-lift">
            <div className="relative">
              <img src={`https://img.youtube.com/vi/${v.youtube_url}/mqdefault.jpg`} alt={v.titre}
                className="w-full h-36 object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[12px] border-l-violet-900 ml-1" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="font-bold text-stone-800 text-sm leading-tight mb-1">{v.titre}</p>
              <p className="text-xs text-stone-400">{v.categorie} {v.date_affichage ? `— ${v.date_affichage}` : ''}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => openEdit(v)} className="text-xs text-violet-700 hover:text-violet-900 font-bold">Modifier</button>
                <button onClick={() => handleDelete(v.id)} disabled={pending} className="text-xs text-red-400 hover:text-red-600 font-bold">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-3 text-center py-10 text-stone-400">Aucune vidéo pour l&apos;instant.</div>
        )}
      </div>
    </div>
  )
}

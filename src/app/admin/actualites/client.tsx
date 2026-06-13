'use client'

import { useState, useTransition } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type Item = {
  id: string
  titre: string
  categorie: string
  publie: boolean
  created_at: string
  extrait: string
  contenu: string
  auteur?: { full_name: string } | null
}

type Props = {
  items: Item[]
  onCreate: (data: FormData) => Promise<void>
  onUpdate: (data: FormData) => Promise<void>
  onDelete: (data: FormData) => Promise<void>
  onTogglePublie: (data: FormData) => Promise<void>
}

const CATEGORIES = ['Vie associative', 'Rapport', 'Partenariat', 'Finances', 'Événement', 'Annonce']

const emptyForm = { titre: '', contenu: '', extrait: '', categorie: '', image_url: '', publie: false }

export default function AdminActualitesClient({ items, onCreate, onUpdate, onDelete, onTogglePublie }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [pending, startTransition] = useTransition()

  function openNew() {
    setEditItem(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(item: Item) {
    setEditItem(item)
    setForm({ titre: item.titre, contenu: item.contenu, extrait: item.extrait, categorie: item.categorie, image_url: '', publie: item.publie })
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      if (editItem) {
        fd.append('id', editItem.id)
        await onUpdate(fd)
      } else {
        await onCreate(fd)
      }
      setShowForm(false)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer cet article ?')) return
    const fd = new FormData()
    fd.append('id', id)
    startTransition(() => onDelete(fd))
  }

  function handleToggle(id: string, current: boolean) {
    const fd = new FormData()
    fd.append('id', id)
    fd.append('publie', (!current).toString())
    startTransition(() => onTogglePublie(fd))
  }

  return (
    <div>
      <PageHeader
        titre="Actualités"
        description="Gérez les articles publiés sur le site."
        action={<Button onClick={openNew}>+ Nouvel article</Button>}
      />

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6 shadow-sm">
          <h2 className="font-black text-violet-900 mb-5">{editItem ? 'Modifier l\'article' : 'Nouvel article'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Titre *</label>
                <input name="titre" required defaultValue={form.titre}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Catégorie</label>
                <select name="categorie" defaultValue={form.categorie}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500">
                  <option value="">-- Choisir --</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Image URL</label>
                <input name="image_url" defaultValue={form.image_url}
                  placeholder="https://..."
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Extrait</label>
                <textarea name="extrait" rows={2} defaultValue={form.extrait}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-600 mb-1 uppercase tracking-wide">Contenu</label>
                <textarea name="contenu" rows={6} defaultValue={form.contenu}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500 resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="publie" id="publie" defaultChecked={form.publie} className="w-4 h-4 accent-violet-700" />
                <label htmlFor="publie" className="text-sm font-semibold text-stone-700 cursor-pointer">Publier immédiatement</label>
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
              <th className="text-left px-4 py-3 hidden md:table-cell">Catégorie</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Auteur</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-bold text-stone-800">{item.titre}</td>
                <td className="px-4 py-3 hidden md:table-cell text-stone-500 text-xs">{item.categorie}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-stone-400 text-xs">{item.auteur?.full_name ?? '—'}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-stone-400 text-xs">
                  {new Date(item.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(item.id, item.publie)} disabled={pending}
                    className="text-left">
                    <Badge variant={item.publie ? 'green' : 'gray'}>{item.publie ? 'Publié' : 'Brouillon'}</Badge>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(item)}
                      className="text-xs text-violet-700 hover:text-violet-900 font-bold">Modifier</button>
                    <button onClick={() => handleDelete(item.id)} disabled={pending}
                      className="text-xs text-red-400 hover:text-red-600 font-bold">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-stone-400">Aucun article pour l&apos;instant.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

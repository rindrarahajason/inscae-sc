'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'

type Item = {
  id: string
  nom: string
  description?: string | null
  prix: number
  stock: number
  actif: boolean
  nouveau?: boolean
  couleur?: string | null
  image_url?: string | null
}

type Props = {
  items: Item[]
  onCreate: (data: FormData) => Promise<void>
  onUpdate: (data: FormData) => Promise<void>
  onDelete: (data: FormData) => Promise<void>
}

export default function AdminGoodiesClient({ items, onCreate, onUpdate, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [pending, startTransition] = useTransition()

  function openNew() { setEditItem(null); setImageUrl(''); setShowForm(true) }
  function openEdit(item: Item) { setEditItem(item); setImageUrl(item.image_url ?? ''); setShowForm(true) }

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
    if (!confirm('Supprimer ce produit ?')) return
    const fd = new FormData(); fd.append('id', id)
    startTransition(() => onDelete(fd))
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={openNew}>+ Nouveau produit</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6">
          <h2 className="font-black text-violet-900 mb-5">{editItem ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Nom *</label>
                <input name="nom" required defaultValue={editItem?.nom ?? ''}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Prix (Ar)</label>
                <input type="number" name="prix" min="0" defaultValue={editItem?.prix ?? 0}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Stock</label>
                <input type="number" name="stock" min="0" defaultValue={editItem?.stock ?? 0}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="actif" defaultChecked={editItem?.actif ?? true} className="w-4 h-4 accent-violet-700" />
                  <span className="text-sm font-semibold text-stone-700">Visible sur le site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="nouveau" defaultChecked={editItem?.nouveau ?? false} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm font-semibold text-stone-700">Badge &quot;Nouveau&quot;</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Image</label>
                <ImageUpload folder="goodies" onUpload={url => setImageUrl(url)} currentUrl={imageUrl || undefined} className="mb-2" />
                <input name="image_url" type="hidden" value={imageUrl} onChange={() => {}} />
                <input placeholder="Ou coller une URL image..." value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  className="w-full border-2 border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 mt-2" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Description</label>
                <textarea name="description" rows={3} defaultValue={editItem?.description ?? ''}
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
              <th className="text-left px-4 py-3">Produit</th>
              <th className="text-left px-4 py-3">Prix</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Visibilité</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                <td className="px-4 py-3">
                  <p className="font-bold text-stone-800">{item.nom}</p>
                  {item.nouveau && <span className="text-[10px] text-violet-500 font-bold">✨ Nouveau</span>}
                </td>
                <td className="px-4 py-3 text-stone-700 font-semibold">{item.prix.toLocaleString('fr-FR')} Ar</td>
                <td className="px-4 py-3">
                  <span className={item.stock === 0 ? 'text-red-500 font-bold' : item.stock <= 5 ? 'text-orange-500 font-bold' : 'text-stone-700'}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={item.actif ? 'green' : 'gray'}>{item.actif ? 'Visible' : 'Masqué'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(item)} className="text-xs text-violet-700 hover:text-violet-900 font-bold">Modifier</button>
                    <button onClick={() => handleDelete(item.id)} disabled={pending} className="text-xs text-red-400 hover:text-red-600 font-bold">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-stone-400">Aucun produit.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

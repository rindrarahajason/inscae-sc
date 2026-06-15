'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'
import { Trash2 } from 'lucide-react'

type Photo = { id: string; annee: number; url: string; legende: string | null; ordre: number }

type Props = {
  photos: Photo[]
  onAdd: (data: FormData) => Promise<{ success?: boolean; error?: string }>
  onDelete: (data: FormData) => Promise<{ success?: boolean; error?: string }>
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1999 + 1 }, (_, i) => 1999 + i).reverse()

export default function AdminHistoireClient({ photos, onAdd, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()
  const [filterAnnee, setFilterAnnee] = useState<number | 'all'>('all')

  // Grouper par année
  const byYear: Record<number, Photo[]> = {}
  photos.forEach(p => {
    if (!byYear[p.annee]) byYear[p.annee] = []
    byYear[p.annee].push(p)
  })

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (!imageUrl) { setError('Veuillez uploader ou coller une image'); return }
    const fd = new FormData(e.currentTarget)
    fd.set('url', imageUrl)
    startTransition(async () => {
      const r = await onAdd(fd)
      if (r.error) setError(r.error)
      else { setShowForm(false); setImageUrl('') }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer cette photo ?')) return
    const fd = new FormData(); fd.append('id', id)
    startTransition(async () => { await onDelete(fd) })
  }

  const filtered = filterAnnee === 'all' ? photos : photos.filter(p => p.annee === filterAnnee)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterAnnee('all')}
            className={`px-3 py-1.5 text-xs rounded-full border-2 font-bold transition-colors ${filterAnnee === 'all' ? 'bg-violet-700 text-white border-violet-700' : 'border-stone-200 text-stone-500 hover:bg-stone-50'}`}>
            Toutes les années
          </button>
          {YEARS.map(y => (
            <button key={y} onClick={() => setFilterAnnee(y)}
              className={`px-3 py-1.5 text-xs rounded-full border-2 font-bold transition-colors ${filterAnnee === y ? 'bg-violet-700 text-white border-violet-700' : 'border-stone-200 text-stone-500 hover:bg-stone-50'}`}>
              {y} {byYear[y] ? `(${byYear[y].length})` : ''}
            </button>
          ))}
        </div>
        <Button onClick={() => { setShowForm(!showForm); setError('') }}>+ Ajouter une photo</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6 shadow-sm">
          <h2 className="font-black text-violet-900 mb-4">Ajouter une photo</h2>
          {error && <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 mb-4 text-sm text-rose-700 font-semibold">{error}</div>}
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Année *</label>
              <select name="annee" required className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Ordre d'affichage</label>
              <input name="ordre" type="number" min="0" max="10" defaultValue="0"
                className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Photo *</label>
              <ImageUpload folder="histoire" onUpload={url => setImageUrl(url)} currentUrl={imageUrl || undefined} className="mb-2" />
              <input placeholder="Ou coller une URL image..." value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                className="w-full border-2 border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 mt-2" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Légende</label>
              <input name="legende" placeholder="Description de la photo..."
                className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" disabled={pending}>{pending ? 'Ajout...' : 'Ajouter'}</Button>
              <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setImageUrl('') }}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      {/* Grille par année */}
      {Object.keys(byYear).length === 0 && !showForm && (
        <div className="text-center py-16 text-stone-400">
          <p className="text-4xl mb-3">🖼️</p>
          <p>Aucune photo pour l'instant. Cliquez sur "+ Ajouter une photo" pour commencer.</p>
        </div>
      )}

      {(filterAnnee === 'all' ? YEARS.filter(y => byYear[y]) : [filterAnnee]).map(year => (
        byYear[year as number] ? (
          <div key={year} className="mb-8">
            <h3 className="font-black text-violet-900 text-lg mb-3 flex items-center gap-2">
              <span className="bg-amber-400 text-violet-900 px-3 py-1 rounded-full text-sm">{year}</span>
              <span className="text-stone-400 text-sm font-normal">{byYear[year as number].length} photo{byYear[year as number].length > 1 ? 's' : ''}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {byYear[year as number].map(p => (
                <div key={p.id} className="relative group rounded-2xl overflow-hidden border-2 border-stone-100">
                  <div className="aspect-square relative">
                    <Image src={p.url} alt={p.legende ?? `Photo ${year}`} fill className="object-cover" />
                  </div>
                  {p.legende && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1">
                      <p className="text-white text-xs truncate">{p.legende}</p>
                    </div>
                  )}
                  <button onClick={() => handleDelete(p.id)} disabled={pending}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null
      ))}
    </div>
  )
}

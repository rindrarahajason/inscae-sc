'use client'

import { useTransition } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type Item = {
  id: string
  auteur_nom: string
  auteur_promo?: string | null
  contenu: string
  valide: boolean
  created_at: string
}

type Props = {
  items: Item[]
  onValider: (data: FormData) => Promise<void>
  onDepublier: (data: FormData) => Promise<void>
  onDelete: (data: FormData) => Promise<void>
}

export default function AdminTemoignagesClient({ items, onValider, onDepublier, onDelete }: Props) {
  const [pending, startTransition] = useTransition()

  function action(fn: (fd: FormData) => Promise<void>, id: string) {
    const fd = new FormData(); fd.append('id', id)
    startTransition(() => fn(fd))
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer ce témoignage ?')) return
    action(onDelete, id)
  }

  const enAttente = items.filter(i => !i.valide)
  const valides   = items.filter(i =>  i.valide)

  return (
    <div>
      {enAttente.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest">En attente de validation</h2>
            <Badge variant="yellow">{enAttente.length}</Badge>
          </div>
          <div className="space-y-3">
            {enAttente.map(item => (
              <div key={item.id} className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-black text-stone-800">{item.auteur_nom}</span>
                      <span className="text-xs text-stone-400">{item.auteur_promo}</span>
                      <span className="text-xs text-stone-400">— {new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed italic">&ldquo;{item.contenu}&rdquo;</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="primary" disabled={pending} onClick={() => action(onValider, item.id)}>✓ Valider</Button>
                    <Button size="sm" variant="danger" disabled={pending} onClick={() => handleDelete(item.id)}>✕ Refuser</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">Témoignages validés</h2>
        <div className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-xs font-black text-stone-400 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Auteur</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Promotion</th>
                <th className="text-left px-4 py-3">Extrait</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {valides.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-stone-400">Aucun témoignage validé.</td></tr>
              ) : valides.map(item => (
                <tr key={item.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                  <td className="px-4 py-3 font-bold text-stone-800 whitespace-nowrap">{item.auteur_nom}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-stone-500 text-xs">{item.auteur_promo}</td>
                  <td className="px-4 py-3 text-stone-500 max-w-xs">
                    <span className="line-clamp-1 italic text-xs">&ldquo;{item.contenu}&rdquo;</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-stone-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => action(onDepublier, item.id)} disabled={pending}
                        className="text-xs text-amber-600 hover:text-amber-800 font-bold">Dépublier</button>
                      <button onClick={() => handleDelete(item.id)} disabled={pending}
                        className="text-xs text-red-400 hover:text-red-600 font-bold">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

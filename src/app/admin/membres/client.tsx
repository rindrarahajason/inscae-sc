'use client'

import React, { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type Item = {
  id: string
  full_name?: string | null
  email?: string | null
  role: string
  status: string
  promotion?: string | null
  phone?: string | null
  profession?: string | null
  ville?: string | null
  bio?: string | null
  created_at: string
}

type Props = {
  items: Item[]
  onSetRole: (data: FormData) => Promise<void>
  onSetStatus: (data: FormData) => Promise<void>
  onDelete: (data: FormData) => Promise<void>
  onCreate: (data: FormData) => Promise<{ error?: string; success?: boolean } | void>
}

const statusVariant: Record<string, 'green' | 'yellow' | 'red'> = {
  active: 'green', pending: 'yellow', suspended: 'red',
}
const statusLabel: Record<string, string> = {
  active: 'Actif', pending: 'En attente', suspended: 'Suspendu',
}

export default function AdminMembresClient({ items, onSetRole, onSetStatus, onDelete, onCreate }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [createError, setCreateError] = useState('')
  const [pending, startTransition] = useTransition()

  function sendStatus(id: string, status: string) {
    const fd = new FormData(); fd.append('id', id); fd.append('status', status)
    startTransition(() => onSetStatus(fd))
  }

  function sendRole(id: string, role: string) {
    const fd = new FormData(); fd.append('id', id); fd.append('role', role)
    startTransition(() => onSetRole(fd))
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer ce membre définitivement ?')) return
    const fd = new FormData(); fd.append('id', id)
    startTransition(() => onDelete(fd))
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCreateError('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await onCreate(fd)
      if (result?.error) {
        setCreateError(result.error)
      } else {
        setShowCreate(false)
      }
    })
  }

  const filtered = items.filter(i => {
    const q = search.toLowerCase()
    const matchSearch = (i.full_name ?? '').toLowerCase().includes(q) || (i.email ?? '').toLowerCase().includes(q)
    const matchFilter = filter === 'all' || i.status === filter
    return matchSearch && matchFilter
  })

  const pending_count = items.filter(i => i.status === 'pending').length

  return (
    <div>
      {pending_count > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏳</span>
            <p className="text-sm font-bold text-amber-800">
              {pending_count} membre{pending_count > 1 ? 's' : ''} en attente de validation
            </p>
          </div>
          <button onClick={() => setFilter('pending')} className="text-xs text-amber-700 underline hover:text-amber-900 font-bold">Voir</button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="border-2 border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 w-64" />
          <div className="flex gap-2">
            {[['all', 'Tous'], ['active', 'Actifs'], ['pending', 'En attente'], ['suspended', 'Suspendus']].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`px-3 py-1.5 text-xs rounded-full border-2 font-bold transition-colors ${filter === val ? 'bg-violet-700 text-white border-violet-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={() => { setShowCreate(true); setCreateError('') }}>+ Ajouter un membre</Button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6 shadow-sm">
          <h2 className="font-black text-violet-900 mb-2">Ajouter un membre manuellement</h2>
          <p className="text-xs text-stone-400 mb-5">La personne recevra un email pour définir son mot de passe.</p>
          {createError && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 mb-4 text-sm text-rose-700 font-semibold">{createError}</div>
          )}
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Nom complet *</label>
              <input name="full_name" required className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Email *</label>
              <input name="email" type="email" required className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Rôle</label>
              <select name="role" className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500">
                <option value="membre">Membre</option>
                <option value="bureau">Bureau</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Promotion</label>
              <input name="promotion" placeholder="ex : 40e promotion" className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Téléphone</label>
              <input name="phone" type="tel" className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Profession</label>
              <input name="profession" className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Ville</label>
              <input name="ville" className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={pending}>{pending ? 'Envoi...' : 'Créer et envoyer l\'invitation'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreate(false)}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100 text-xs font-black text-stone-400 uppercase tracking-wide">
              <th className="text-left px-4 py-3">Membre</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Promotion</th>
              <th className="text-left px-4 py-3">Rôle</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-stone-400">Aucun membre trouvé.</td></tr>
            ) : filtered.map(item => {
              const hasDetails = !!(item.phone || item.profession || item.ville || item.bio)
              const isOpen = expanded === item.id
              return (
              <React.Fragment key={item.id}>
              <tr className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {hasDetails && (
                      <button onClick={() => setExpanded(isOpen ? null : item.id)}
                        className="text-stone-400 hover:text-violet-700 text-xs w-4 shrink-0" aria-label="Détails">
                        {isOpen ? '▾' : '▸'}
                      </button>
                    )}
                    <div>
                      <p className="font-bold text-stone-800">{item.full_name ?? '—'}</p>
                      <p className="text-xs text-stone-400">{item.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-stone-500 text-xs">{item.promotion ?? '—'}</td>
                <td className="px-4 py-3">
                  <select value={item.role} onChange={e => sendRole(item.id, e.target.value)} disabled={pending}
                    className="border-2 border-stone-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-violet-500">
                    <option value="membre">Membre</option>
                    <option value="bureau">Bureau</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[item.status] ?? 'gray'}>{statusLabel[item.status] ?? item.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    {item.status === 'pending' && (
                      <button onClick={() => sendStatus(item.id, 'active')} disabled={pending}
                        className="text-xs text-teal-600 hover:text-teal-800 font-bold">✓ Valider</button>
                    )}
                    {item.status !== 'suspended' ? (
                      <button onClick={() => sendStatus(item.id, 'suspended')} disabled={pending}
                        className="text-xs text-orange-500 hover:text-orange-700 font-bold">Suspendre</button>
                    ) : (
                      <button onClick={() => sendStatus(item.id, 'active')} disabled={pending}
                        className="text-xs text-teal-600 hover:text-teal-800 font-bold">Réactiver</button>
                    )}
                    <button onClick={() => handleDelete(item.id)} disabled={pending}
                      className="text-xs text-red-400 hover:text-red-600 font-bold">Supprimer</button>
                  </div>
                </td>
              </tr>
              {isOpen && hasDetails && (
                <tr className="bg-stone-50/60 border-b border-stone-50">
                  <td colSpan={5} className="px-4 py-4">
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                      {item.phone && (
                        <div><span className="font-black text-stone-400 uppercase tracking-wide">Téléphone</span> <span className="text-stone-700 ml-2">{item.phone}</span></div>
                      )}
                      {item.profession && (
                        <div><span className="font-black text-stone-400 uppercase tracking-wide">Profession</span> <span className="text-stone-700 ml-2">{item.profession}</span></div>
                      )}
                      {item.ville && (
                        <div><span className="font-black text-stone-400 uppercase tracking-wide">Ville</span> <span className="text-stone-700 ml-2">{item.ville}</span></div>
                      )}
                      {item.bio && (
                        <div className="sm:col-span-2">
                          <p className="font-black text-stone-400 uppercase tracking-wide mb-1">Présentation</p>
                          <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{item.bio}</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

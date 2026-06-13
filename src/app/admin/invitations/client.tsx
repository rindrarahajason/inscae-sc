'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type Item = {
  id: string
  email: string
  invite_par?: { full_name: string } | null
  created_at: string
  expires_at: string
  utilisee: boolean
}

type Props = {
  items: Item[]
  onInvite: (data: FormData) => Promise<{ inviteUrl: string } | void>
  onRevoquer: (data: FormData) => Promise<void>
}

export default function AdminInvitationsClient({ items, onInvite, onRevoquer }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await onInvite(fd)
      if (result?.inviteUrl) {
        setInviteUrl(result.inviteUrl)
        setShowForm(false)
      }
    })
  }

  function handleRevoke(id: string) {
    if (!confirm('Révoquer cette invitation ?')) return
    const fd = new FormData(); fd.append('id', id)
    startTransition(() => onRevoquer(fd))
  }

  const actives   = items.filter(i => !i.utilisee)
  const utilisees = items.filter(i =>  i.utilisee)

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button onClick={() => { setShowForm(true); setInviteUrl(null) }}>+ Envoyer une invitation</Button>
      </div>

      {inviteUrl && (
        <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-5 mb-6">
          <p className="text-sm font-black text-teal-800 mb-2">✓ Invitation créée — copiez ce lien et envoyez-le à la personne :</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs text-teal-700 break-all">{inviteUrl}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(inviteUrl); }}
              className="shrink-0 bg-teal-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-teal-700 transition-colors">
              Copier
            </button>
          </div>
          <p className="text-xs text-teal-600 mt-2">Ce lien expire dans 7 jours.</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-stone-100 p-6 mb-6">
          <h2 className="font-black text-violet-900 mb-5">Nouvelle invitation</h2>
          <form onSubmit={handleSend} className="max-w-lg space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wide">Email du destinataire *</label>
              <input type="email" name="email" required placeholder="prenom.nom@example.mg"
                className="w-full border-2 border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div className="bg-violet-50 border-2 border-violet-100 rounded-xl p-3 text-xs text-violet-700">
              Un lien d&apos;inscription valable 7 jours sera généré. Vous pourrez le copier et l&apos;envoyer vous-même.
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>{pending ? 'Génération...' : 'Générer le lien'}</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest">Invitations actives</h2>
          <Badge variant="blue">{actives.length}</Badge>
        </div>
        <div className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-xs font-black text-stone-400 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Invité par</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Envoyée le</th>
                <th className="text-left px-4 py-3">Expire le</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {actives.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-stone-400">Aucune invitation active.</td></tr>
              ) : actives.map(item => (
                <tr key={item.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                  <td className="px-4 py-3 font-bold text-stone-800">{item.email}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-stone-500 text-xs">{item.invite_par?.full_name ?? '—'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-stone-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-xs">
                    {new Date(item.expires_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleRevoke(item.id)} disabled={pending}
                        className="text-xs text-red-400 hover:text-red-600 font-bold">Révoquer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-black text-stone-500 uppercase tracking-widest mb-3">Invitations utilisées</h2>
        <div className="bg-white rounded-2xl border-2 border-stone-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-xs font-black text-stone-400 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Invité par</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {utilisees.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-stone-400">Aucune invitation utilisée.</td></tr>
              ) : utilisees.map(item => (
                <tr key={item.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                  <td className="px-4 py-3 font-bold text-stone-800">{item.email}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-stone-500 text-xs">{item.invite_par?.full_name ?? '—'}</td>
                  <td className="px-4 py-3 text-stone-400 text-xs">{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3"><Badge variant="green">Utilisée</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

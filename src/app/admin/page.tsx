import { StatCard } from '@/components/admin/StatCard'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { safeFetch } from '@/lib/supabase/safe-fetch'

export const dynamic = 'force-dynamic'

async function getStats() {
  const admin = await createAdminClient()
  const [membres, pending, actualites, temoignages] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    admin.from('actualites').select('id', { count: 'exact', head: true }).eq('publie', true),
    admin.from('temoignages').select('id', { count: 'exact', head: true }).eq('valide', false),
  ])
  return {
    membres: membres.count ?? 0,
    pending: pending.count ?? 0,
    actualites: actualites.count ?? 0,
    temoignages: temoignages.count ?? 0,
  }
}

export default async function AdminDashboard() {
  const s = await safeFetch(() => getStats(), { membres: 0, pending: 0, actualites: 0, temoignages: 0 })

  const stats = [
    { label: 'Membres actifs',        value: s.membres,     icon: '👥', color: 'violet' as const, trend: 'Comptes validés' },
    { label: 'En attente validation', value: s.pending,     icon: '⏳', color: 'amber'  as const, trend: s.pending > 0 ? 'À traiter !' : 'Aucun en attente' },
    { label: 'Actualités publiées',   value: s.actualites,  icon: '📰', color: 'teal'   as const, trend: 'Articles en ligne' },
    { label: 'Témoignages à valider', value: s.temoignages, icon: '💬', color: 'rose'   as const, trend: s.temoignages > 0 ? 'En attente' : 'Tout est à jour' },
  ]

  const raccourcis = [
    { href: '/admin/actualites',  label: '📰 Nouvelle actualité',  desc: 'Publier un article' },
    { href: '/admin/activites',   label: '📅 Nouvelle activité',   desc: 'Créer un événement' },
    { href: '/admin/membres',     label: '👤 Valider des membres', desc: s.pending > 0 ? `${s.pending} en attente` : 'Gérer les comptes' },
    { href: '/admin/temoignages', label: '💬 Modérer témoignages', desc: s.temoignages > 0 ? `${s.temoignages} en attente` : 'Aucun en attente' },
    { href: '/admin/invitations', label: '✉️ Envoyer invitation',  desc: 'Inviter un membre' },
    { href: '/admin/goodies',     label: '🎁 Gérer la boutique',   desc: 'Stocks & produits' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-stone-800">Tableau de bord</h1>
        <p className="text-stone-400 text-sm mt-1 font-medium">Bienvenue dans le panel admin de l&apos;INSCAE SC.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-4">Actions rapides</p>
          <div className="grid grid-cols-2 gap-3">
            {raccourcis.map(r => (
              <Link key={r.href} href={r.href}
                className="bg-white rounded-2xl border-2 border-stone-100 p-4 hover:border-violet-300 hover:bg-violet-50 transition-all group">
                <p className="font-black text-stone-800 text-sm group-hover:text-violet-700">{r.label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{r.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-4">Liens rapides</p>
          <div className="bg-white rounded-2xl border-2 border-stone-100 divide-y divide-stone-50">
            {[
              { href: '/admin/membres',     emoji: '👤', label: 'Gérer tous les membres' },
              { href: '/admin/invitations', emoji: '✉️', label: 'Invitations envoyées' },
              { href: '/admin/presidents',  emoji: '🏛️', label: 'Historique des présidents' },
              { href: '/admin/contenus',    emoji: '🎬', label: 'Vidéos & contenus' },
              { href: '/admin/goodies',     emoji: '🎁', label: 'Boutique & stocks' },
            ].map(r => (
              <Link key={r.href} href={r.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-violet-50 transition-colors">
                <span className="text-xl shrink-0">{r.emoji}</span>
                <p className="text-sm font-semibold text-stone-700">{r.label}</p>
                <span className="ml-auto text-stone-300 font-bold">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

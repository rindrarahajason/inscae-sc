import { getActivite } from '@/lib/supabase/actions/activites'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

const statutConfig: Record<string, { label: string; bg: string; text: string }> = {
  a_venir:  { label: '🔵 À venir',  bg: 'bg-blue-100',  text: 'text-blue-800' },
  en_cours: { label: '🟢 En cours', bg: 'bg-green-100', text: 'text-green-800' },
  termine:  { label: '⚫ Terminé',  bg: 'bg-stone-100', text: 'text-stone-600' },
}

export default async function ActivitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const activite = await safeFetch(() => getActivite(id), null)
  if (!activite) notFound()

  const stat = statutConfig[activite.statut] ?? statutConfig.a_venir

  return (
    <div className="bg-[#FFFBF0] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/activites" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-violet-700 transition-colors mb-8 font-semibold">
          ← Retour aux activités
        </Link>

        {activite.image_url && (
          <img src={activite.image_url} alt={activite.titre} className="w-full h-64 object-cover rounded-3xl mb-8 shadow-sm" />
        )}

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`pill text-xs ${stat.bg} ${stat.text}`}>{stat.label}</span>
            {activite.categorie && <span className="pill text-xs bg-amber-100 text-amber-700">{activite.categorie}</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-violet-900 leading-tight mb-4">{activite.titre}</h1>
          <div className="flex flex-wrap gap-6 text-sm text-stone-500 font-semibold">
            {activite.date_debut && (
              <span className="flex items-center gap-1.5">📅 {new Date(activite.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            )}
            {activite.lieu && <span className="flex items-center gap-1.5">📍 {activite.lieu}</span>}
          </div>
        </div>

        {activite.description && (
          <div className="text-stone-700 leading-relaxed whitespace-pre-wrap text-base">
            {activite.description}
          </div>
        )}
      </div>
    </div>
  )
}

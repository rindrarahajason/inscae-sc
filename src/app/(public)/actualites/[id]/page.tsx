import { getActualite, getActualites } from '@/lib/supabase/actions/actualites'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

const catColor: Record<string, string> = {
  'Vie associative': 'bg-violet-100 text-violet-700',
  'Rapport': 'bg-teal-100 text-teal-700',
  'Partenariat': 'bg-orange-100 text-orange-700',
  'Finances': 'bg-rose-100 text-rose-700',
  'Événement': 'bg-indigo-100 text-indigo-700',
  'Annonce': 'bg-amber-100 text-amber-700',
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await safeFetch(() => getActualite(id), null)
  if (!article) notFound()

  return (
    <div className="bg-[#FFFBF0] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/actualites" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-violet-700 transition-colors mb-8 font-semibold">
          ← Retour aux actualités
        </Link>

        {article.image_url && (
          <img src={article.image_url} alt={article.titre} className="w-full h-64 object-cover rounded-3xl mb-8 shadow-sm" />
        )}

        <div className="mb-6">
          {article.categorie && (
            <span className={`pill text-xs mb-4 inline-block ${catColor[article.categorie] ?? 'bg-stone-100 text-stone-600'}`}>
              {article.categorie}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-violet-900 leading-tight mb-4">{article.titre}</h1>
          <div className="flex items-center gap-4 text-sm text-stone-400 font-semibold">
            <span>Par {article.auteur?.full_name ?? 'Rédaction'}</span>
            <span>·</span>
            <span>{new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {article.extrait && (
          <p className="text-lg text-stone-600 font-medium leading-relaxed mb-8 border-l-4 border-violet-300 pl-4 italic">
            {article.extrait}
          </p>
        )}

        <div
          className="prose prose-stone prose-lg max-w-none prose-headings:font-black prose-headings:text-violet-900 prose-a:text-violet-700 prose-strong:text-stone-800 prose-img:rounded-2xl prose-img:shadow-md prose-li:text-stone-600"
          dangerouslySetInnerHTML={{ __html: article.contenu }}
        />
      </div>
    </div>
  )
}

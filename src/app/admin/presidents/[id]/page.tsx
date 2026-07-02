import { getPresidents } from '@/lib/supabase/actions/presidents'
import { getMembresBureau, createMembreBureau, updateMembreBureau, deleteMembreBureau } from '@/lib/supabase/actions/membres_bureau'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/PageHeader'
import Link from 'next/link'
import AdminBureauClient from './client'

export const dynamic = 'force-dynamic'

function annee(d: string | null | undefined) {
  if (!d) return 'présent'
  return new Date(d).getFullYear().toString()
}

export default async function AdminBureauPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const presidents = await safeFetch(() => getPresidents(), [])
  const president = presidents.find(p => p.id === id)
  if (!president) notFound()

  const membres = await safeFetch(() => getMembresBureau(id), [])

  async function create(data: FormData) {
    'use server'
    try {
      await createMembreBureau({
        president_id: id,
        full_name: data.get('full_name') as string,
        role_bureau: data.get('role_bureau') as string,
        photo_url: data.get('photo_url') as string || undefined,
        ordre: parseInt(data.get('ordre') as string) || 0,
      })
      return { success: true }
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  }

  async function update(data: FormData) {
    'use server'
    try {
      await updateMembreBureau(data.get('id') as string, {
        full_name: data.get('full_name') as string,
        role_bureau: data.get('role_bureau') as string,
        photo_url: data.get('photo_url') as string || null,
        ordre: parseInt(data.get('ordre') as string) || 0,
      })
      return { success: true }
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  }

  async function remove(data: FormData) {
    'use server'
    try {
      await deleteMembreBureau(data.get('id') as string)
      return { success: true }
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/presidents" className="text-xs text-stone-400 hover:text-violet-700 font-semibold">
          ← Retour aux présidents
        </Link>
      </div>
      <PageHeader
        titre={`Bureau de ${president.full_name}`}
        description={`Mandat ${annee(president.debut_mandat)} — ${annee(president.fin_mandat ?? null)} · Gérez les membres du bureau.`}
      />
      <AdminBureauClient
        membres={membres}
        presidentId={id}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
      />
    </div>
  )
}

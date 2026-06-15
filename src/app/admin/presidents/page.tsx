import { getPresidents, createPresident, updatePresident, deletePresident } from '@/lib/supabase/actions/presidents'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import { PageHeader } from '@/components/admin/PageHeader'
import AdminPresidentsClient from './client'

export const dynamic = 'force-dynamic'

function yearToDate(year: string | null): string | undefined {
  if (!year) return undefined
  return `${year}-01-01`
}

async function create(data: FormData) {
  'use server'
  try {
    await createPresident({
      full_name:    data.get('full_name') as string,
      debut_mandat: yearToDate(data.get('debut_mandat') as string) as string,
      fin_mandat:   yearToDate(data.get('fin_mandat') as string),
      bio:          data.get('bio') as string || undefined,
      photo_url:    data.get('photo_url') as string || undefined,
    })
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : (e as { message?: string })?.message ?? JSON.stringify(e) }
  }
}

async function update(data: FormData) {
  'use server'
  try {
    const id = data.get('id') as string
    await updatePresident(id, {
      full_name:    data.get('full_name') as string,
      debut_mandat: yearToDate(data.get('debut_mandat') as string),
      fin_mandat:   yearToDate(data.get('fin_mandat') as string) ?? null,
      bio:          data.get('bio') as string || null,
      photo_url:    data.get('photo_url') as string || null,
      actuel:       data.get('actuel') === 'on',
    })
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : (e as { message?: string })?.message ?? JSON.stringify(e) }
  }
}

async function remove(data: FormData) {
  'use server'
  try {
    await deletePresident(data.get('id') as string)
    return { success: true }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : (e as { message?: string })?.message ?? JSON.stringify(e) }
  }
}

export default async function AdminPresidentsPage() {
  const items = await safeFetch(() => getPresidents(), [] as Awaited<ReturnType<typeof getPresidents>>)
  const data = items

  return (
    <div>
      <PageHeader titre="Histoire & Présidents" description="Gérez la liste des présidents affichée dans la page Histoire." />
      <AdminPresidentsClient
        items={data}
        onCreate={create}
        onUpdate={update}
        onDelete={remove}
      />
    </div>
  )
}

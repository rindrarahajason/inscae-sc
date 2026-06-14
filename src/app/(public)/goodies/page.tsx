import { getGoodies } from '@/lib/supabase/actions/goodies'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import GoodiesClient from './GoodiesClient'

export const metadata = { title: 'Boutique — INSCAE Section Chrétienne' }
export const revalidate = 60

export default async function GoodiesPage() {
  const items = await safeFetch(() => getGoodies(true), [] as Awaited<ReturnType<typeof getGoodies>>)
  return <GoodiesClient data={items} />
}

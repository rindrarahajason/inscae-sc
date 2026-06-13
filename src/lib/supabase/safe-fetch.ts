/**
 * Wrapper qui retourne des données vides si Supabase n'est pas configuré.
 * Permet au site de fonctionner en dev sans variables d'env.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!(url && url !== 'your_supabase_project_url' && url.startsWith('https://'))
}

export async function safeFetch<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isSupabaseConfigured()) return fallback
  try {
    return await fn()
  } catch {
    return fallback
  }
}

'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function MemberSignOut() {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-xs text-stone-400 hover:text-rose-500 transition-colors py-1 w-full font-semibold"
    >
      <LogOut size={13} className="shrink-0" />
      Se déconnecter
    </button>
  )
}

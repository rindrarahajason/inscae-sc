'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function MemberSignOut({ variant = 'small' }: { variant?: 'small' | 'full' }) {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (variant === 'full') {
    return (
      <button onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-sm font-semibold w-full">
        <LogOut size={18} />
        Se déconnecter
      </button>
    )
  }

  return (
    <button onClick={handleSignOut}
      className="flex items-center gap-2 text-xs text-stone-400 hover:text-rose-500 transition-colors py-1 w-full font-semibold">
      <LogOut size={13} className="shrink-0" />
      Se déconnecter
    </button>
  )
}

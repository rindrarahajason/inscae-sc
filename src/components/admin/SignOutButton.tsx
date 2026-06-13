'use client'

import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-xs text-violet-400 hover:text-white transition-colors py-1 w-full"
    >
      <LogOut size={12} className="shrink-0" />
      Se déconnecter
    </button>
  )
}

import Link from 'next/link'
import MemberSignOut from '@/components/reseau/MemberSignOut'

export const metadata = { title: 'Compte en attente — INSCAE Section Chrétienne' }

export default function EnAttentePage() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-black text-violet-900 mb-2">Compte en attente</h1>
        <p className="text-stone-500 text-sm mb-8">
          Votre compte a bien été créé mais doit encore être validé par un administrateur.
          Vous recevrez l&apos;accès à l&apos;espace membres dès qu&apos;il sera approuvé.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Link href="/" className="bg-violet-700 text-white font-black px-6 py-3 rounded-full hover:bg-violet-600 transition-colors text-sm">
            Retour au site public
          </Link>
          <MemberSignOut />
        </div>
      </div>
    </div>
  )
}

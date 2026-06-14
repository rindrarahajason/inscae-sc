import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifierToken, marquerInvitationUtilisee } from '@/lib/supabase/actions/invitations'
import { signUp } from '@/lib/supabase/actions/auth'

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; erreur?: string }>
}) {
  const params = await searchParams
  const token = params.token ?? ''

  // Mode invitation : si un token est fourni, on le vérifie.
  const invitation = token ? await verifierToken(token) : null
  const tokenInvalide = token && !invitation

  if (tokenInvalide) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-violet-900 mb-2">Lien invalide</h1>
          <p className="text-stone-500 text-sm mb-6">
            Ce lien d&apos;invitation est invalide ou a expiré. Vous pouvez tout de même demander un compte ci-dessous.
          </p>
          <Link href="/auth/inscription" className="bg-violet-700 text-white font-black px-6 py-3 rounded-full hover:bg-violet-600 transition-colors text-sm">
            Demander un compte
          </Link>
        </div>
      </div>
    )
  }

  async function inscrire(data: FormData) {
    'use server'
    const result = await signUp({
      email:      data.get('email') as string,
      password:   data.get('password') as string,
      full_name:  data.get('full_name') as string,
      promotion:  data.get('promotion') as string,
      phone:      data.get('phone') as string,
      profession: data.get('profession') as string,
      ville:      data.get('ville') as string,
      bio:        data.get('bio') as string,
    })
    if (result?.error) {
      redirect(`/auth/inscription?${token ? `token=${token}&` : ''}erreur=${encodeURIComponent(result.error)}`)
    }
    if (token) await marquerInvitationUtilisee(token)
    redirect('/auth/connexion?statut=attente')
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-black">✝</span>
          </div>
          <h1 className="text-2xl font-black text-violet-900">Demander un compte</h1>
          <p className="text-stone-500 mt-1 text-sm">
            {invitation
              ? <>Invitation pour <span className="font-bold text-violet-700">{invitation.email}</span></>
              : 'Votre demande sera validée par le bureau.'}
          </p>
        </div>

        {params.erreur && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 mb-4 text-sm text-rose-700 font-semibold text-center">
            {params.erreur}
          </div>
        )}

        <div className="bg-white rounded-3xl border-2 border-stone-100 p-8 shadow-sm">
          <form action={inscrire} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Nom complet *</label>
              <input type="text" name="full_name" required autoComplete="name"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Email *</label>
              <input type="email" name="email" required defaultValue={invitation?.email ?? ''}
                readOnly={!!invitation} autoComplete="email"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 read-only:bg-stone-50" />
            </div>
            <div>
              <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Mot de passe *</label>
              <input type="password" name="password" required minLength={8} autoComplete="new-password"
                className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
              <p className="text-xs text-stone-400 mt-1">8 caractères minimum</p>
            </div>

            <div className="pt-2 border-t-2 border-stone-100">
              <p className="text-xs font-black text-stone-400 uppercase tracking-wide mb-3">Pour vous présenter au bureau</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Promotion</label>
                  <input type="text" name="promotion" placeholder="ex : 40e promotion"
                    className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Téléphone</label>
                  <input type="tel" name="phone" autoComplete="tel" placeholder="03X XX XXX XX"
                    className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Profession / Études</label>
                  <input type="text" name="profession" placeholder="ex : Étudiant en gestion"
                    className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Ville</label>
                  <input type="text" name="ville" placeholder="ex : Antananarivo"
                    className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-black text-stone-500 mb-1.5 uppercase tracking-wide">Présentation / Motivation</label>
                <textarea name="bio" rows={3} placeholder="Dites-en un peu plus sur vous et pourquoi vous souhaitez rejoindre la communauté..."
                  className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none" />
              </div>
            </div>

            <button type="submit"
              className="w-full bg-amber-400 text-violet-900 py-3 rounded-full font-black hover:bg-amber-300 transition-colors text-sm shadow-lg">
              Envoyer ma demande →
            </button>
          </form>

          <p className="text-xs text-stone-400 text-center mt-4">
            Une fois validé par l&apos;administration, vous pourrez vous connecter à l&apos;espace membres.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/auth/connexion" className="text-xs text-stone-400 hover:text-violet-700 transition-colors">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}

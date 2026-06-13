import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-violet-900 text-white mt-auto relative overflow-hidden">
      {/* Blob décoratif */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-700 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400 rounded-full opacity-20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Identité */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center text-violet-900 font-black text-base">✝</div>
              <div>
                <span className="font-black text-white text-lg tracking-tight block leading-tight">INSCAE</span>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Section Chrétienne</span>
              </div>
            </div>
            <p className="text-violet-200 text-sm leading-relaxed">
              Enracinés dans la foi, engagés pour l&apos;excellence.<br />
              <span className="text-amber-300 font-semibold">Foi · Excellence · Service</span>
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">Explorer</p>
            <ul className="space-y-2 text-sm">
              {[
                ['/histoire',    '📖 Histoire & Présidents'],
                ['/activites',   '📅 Activités'],
                ['/actualites',  '📰 Actualités'],
                ['/temoignages', '💬 Témoignages'],
                ['/videos',      '🎬 Vidéos'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-violet-200 hover:text-amber-300 transition-colors font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rejoindre */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">Rejoindre</p>
            <ul className="space-y-2 text-sm mb-6">
              {[
                ['/dons',            '❤️ Faire un don'],
                ['/goodies',         '🎁 Boutique goodies'],
                ['/auth/connexion',  '🔐 Espace membres'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-violet-200 hover:text-amber-300 transition-colors font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-violet-400 text-xs">📍 Antananarivo, Madagascar</p>
          </div>
        </div>

        <div className="border-t border-violet-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-violet-400 text-xs">
            © {new Date().getFullYear()} INSCAE Section Chrétienne
          </p>
          <p className="text-violet-500 text-xs">Fait avec ❤️ à Madagascar</p>
        </div>
      </div>
    </footer>
  )
}

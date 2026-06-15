export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📶</span>
        </div>
        <h1 className="text-2xl font-black text-violet-900 mb-3">Pas de connexion</h1>
        <p className="text-stone-500 text-sm mb-6">
          Vous êtes hors ligne. Certaines pages en cache restent accessibles.
        </p>
        <a href="/" className="inline-block bg-violet-700 text-white px-6 py-3 rounded-full font-black text-sm hover:bg-violet-600 transition-colors">
          Retour à l&apos;accueil
        </a>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIos, setShowIos] = useState(false)
  const [dismissed, setDismissed] = useState(true) // start hidden, check after mount

  useEffect(() => {
    // Don't show if already installed or dismissed recently
    if (localStorage.getItem('pwa_dismissed')) return
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // iOS detection
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as { standalone?: boolean }).standalone
    if (isIos) { setShowIos(true); setDismissed(false); return }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setDismissed(false)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('pwa_dismissed', '1')
    setDismissed(true)
  }

  async function install() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm">
      <div className="bg-violet-900 text-white rounded-2xl p-4 shadow-2xl border border-violet-700 flex items-start gap-3">
        <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
          <Smartphone size={20} className="text-violet-900" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm">Installer l&apos;app ISC</p>
          {showIos ? (
            <p className="text-violet-300 text-xs mt-0.5 leading-snug">
              Appuyez sur <strong className="text-white">□↑</strong> puis <strong className="text-white">&ldquo;Sur l&apos;écran d&apos;accueil&rdquo;</strong>
            </p>
          ) : (
            <p className="text-violet-300 text-xs mt-0.5 leading-snug">
              Accédez à l&apos;espace membres même sans connexion
            </p>
          )}
          {!showIos && (
            <button onClick={install}
              className="mt-2 flex items-center gap-1.5 bg-amber-400 text-violet-900 text-xs font-black px-3 py-1.5 rounded-full hover:bg-amber-300 transition-colors">
              <Download size={12} />
              Installer
            </button>
          )}
        </div>
        <button onClick={dismiss} className="text-violet-400 hover:text-white transition-colors shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

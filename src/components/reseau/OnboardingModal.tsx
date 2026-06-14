'use client'

import { useState, useEffect } from 'react'
import { Home, Users, MessageSquare, UserPlus, Heart, Send, X } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'isc_onboarded'

const STEPS = [
  {
    id: 'bienvenue',
    emoji: '✝',
    titre: 'Bienvenue sur l\'espace membres ISC !',
    contenu: (
      <div className="space-y-3 text-stone-600 text-sm leading-relaxed">
        <p>
          Cette plateforme est <strong className="text-violet-800">notre nouvel espace de communion</strong> —
          un endroit conçu pour nous rapprocher, même à distance.
        </p>
        <p>
          Ici, tu pourras partager des nouvelles, t'encourager mutuellement,
          rester connecté avec tes frères et sœurs de l'INSCAE Section Chrétienne,
          et vivre la communauté au quotidien.
        </p>
        <div className="bg-violet-50 rounded-2xl p-4 border-2 border-violet-100">
          <p className="text-violet-800 font-semibold text-center">
            « Comme le fer aiguise le fer, l'homme aiguise le visage de son prochain. »
          </p>
          <p className="text-violet-400 text-xs text-center mt-1">Proverbes 27:17</p>
        </div>
      </div>
    ),
  },
  {
    id: 'tour',
    emoji: '🗺️',
    titre: 'Ce que tu peux faire ici',
    contenu: (
      <div className="space-y-3">
        {[
          { icon: Home, label: 'Fil d\'actualité', desc: 'Partage des messages, photos et encouragements avec toute la communauté' },
          { icon: Users, label: 'Annuaire', desc: 'Retrouve tous les membres de l\'ISC — promotion, profession, ville' },
          { icon: MessageSquare, label: 'Messagerie', desc: 'Envoie des messages privés à n\'importe quel membre' },
          { icon: UserPlus, label: 'Inviter un ami', desc: 'Invite quelqu\'un à rejoindre la communauté — il sera validé par les admins' },
          { icon: Heart, label: 'J\'aime & commentaires', desc: 'Interagis avec les publications de tes frères et sœurs' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-start gap-3 bg-stone-50 rounded-xl p-3">
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
              <Icon size={16} className="text-violet-700" />
            </div>
            <div>
              <p className="font-bold text-stone-800 text-sm">{label}</p>
              <p className="text-xs text-stone-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'presentation',
    emoji: '👋',
    titre: 'Présente-toi à la communauté !',
    contenu: (
      <div className="space-y-3 text-stone-600 text-sm leading-relaxed">
        <p>
          La dernière étape — la plus importante !
          <strong className="text-violet-800"> Publie ton premier message</strong> pour te présenter à tes frères et sœurs.
        </p>
        <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4">
          <p className="font-bold text-amber-800 mb-2">Idées pour ta présentation :</p>
          <ul className="text-amber-700 text-xs space-y-1">
            <li>• Ton nom et ta promotion</li>
            <li>• Ce que tu fais maintenant (études, travail, ville)</li>
            <li>• Un verset ou un mot d'encouragement</li>
            <li>• Ce que tu attends de cette communauté</li>
          </ul>
        </div>
        <p className="text-xs text-stone-400 text-center">
          Tu peux aussi ajouter une photo ! 📸
        </p>
      </div>
    ),
  },
]

type Props = {
  userName: string | null
  onPublish: (contenu: string, image_url?: string) => Promise<{ error?: string; success?: boolean }>
}

export default function OnboardingModal({ userName, onPublish }: Props) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [texte, setTexte] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function fermer() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `feed/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
    if (!error) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${path}`
      setImageUrl(url)
      setImagePreview(url)
    }
    setUploading(false)
  }

  async function handlePublish() {
    if (!texte.trim() && !imageUrl) return
    setPublishing(true)
    await onPublish(texte, imageUrl || undefined)
    setPublished(true)
    setPublishing(false)
    setTimeout(() => fermer(), 2000)
  }

  if (!visible) return null

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s.id}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-violet-700' : i < step ? 'w-4 bg-violet-300' : 'w-4 bg-stone-200'}`} />
            ))}
          </div>
          <button onClick={fermer} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="text-center mb-5">
            <div className="text-4xl mb-3">{currentStep.emoji}</div>
            <h2 className="text-xl font-black text-violet-900 leading-tight">
              {step === 0 && userName ? `${currentStep.titre.split('!')[0]}, ${userName.split(' ')[0]} !` : currentStep.titre}
            </h2>
          </div>

          {currentStep.contenu}

          {/* Zone de publication sur la dernière étape */}
          {isLast && !published && (
            <div className="mt-5 space-y-3">
              <textarea
                value={texte}
                onChange={e => setTexte(e.target.value)}
                rows={4}
                placeholder={`Bonjour à tous ! Je m'appelle ${userName?.split(' ')[0] ?? '...'} et je suis ravi(e) de rejoindre la communauté ISC ! ...`}
                className="w-full border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 resize-none"
              />
              {imagePreview && (
                <div className="relative">
                  <Image src={imagePreview} alt="Aperçu" width={400} height={300} className="w-full rounded-xl object-cover max-h-40" />
                  <button onClick={() => { setImageUrl(''); setImagePreview('') }}
                    className="absolute top-2 right-2 bg-stone-800/70 text-white rounded-full p-1">
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 text-xs text-stone-400 hover:text-violet-700 cursor-pointer font-semibold">
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                📸 {uploading ? 'Upload...' : 'Ajouter une photo'}
              </label>
            </div>
          )}

          {isLast && published && (
            <div className="mt-5 bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-bold text-teal-800">Publié ! Bienvenue dans la communauté !</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-stone-100 flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 border-2 border-stone-200 text-stone-600 py-3 rounded-full font-bold text-sm hover:bg-stone-50 transition-colors">
              ← Retour
            </button>
          )}
          {!isLast ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex-1 bg-violet-700 text-white py-3 rounded-full font-black text-sm hover:bg-violet-600 transition-colors shadow-lg">
              Suivant →
            </button>
          ) : !published ? (
            <button onClick={handlePublish} disabled={publishing || uploading || (!texte.trim() && !imageUrl)}
              className="flex-1 bg-violet-700 text-white py-3 rounded-full font-black text-sm hover:bg-violet-600 transition-colors shadow-lg disabled:opacity-40 inline-flex items-center justify-center gap-2">
              <Send size={14} />
              {publishing ? 'Publication...' : 'Publier et rejoindre !'}
            </button>
          ) : null}
          {isLast && !published && (
            <button onClick={fermer} className="text-xs text-stone-400 hover:text-stone-600 px-3">
              Passer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

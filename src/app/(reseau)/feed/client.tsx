'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Send, Heart, MessageCircle, ImagePlus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export type Commentaire = {
  id: string
  contenu: string
  created_at: string
  auteur_id: string
  auteur: { id: string; full_name: string } | null
}
export type Post = {
  id: string
  contenu: string
  image_url?: string | null
  created_at: string
  auteur_id: string
  auteur: { id: string; full_name: string; avatar_url: string | null; promotion: string | null } | null
  likeCount: number
  likedByMe: boolean
  commentaires: Commentaire[]
}

function initiales(nom: string) {
  return nom.split(' ').map(m => m[0]).slice(0, 2).join('').toUpperCase()
}

function depuis(date: string) {
  const d = new Date(date)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return "à l'instant"
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function FeedClient({
  posts,
  currentUserId,
  currentUserName,
  onPublish,
  onDelete,
  onToggleLike,
  onComment,
  onDeleteComment,
}: {
  posts: Post[]
  currentUserId: string | null
  currentUserName: string | null
  onPublish: (contenu: string, image_url?: string) => Promise<{ error?: string; success?: boolean }>
  onDelete: (id: string) => Promise<{ error?: string; success?: boolean }>
  onToggleLike: (id: string) => Promise<{ error?: string; success?: boolean }>
  onComment: (postId: string, contenu: string) => Promise<{ error?: string; success?: boolean }>
  onDeleteComment: (id: string) => Promise<{ error?: string; success?: boolean }>
}) {
  const router = useRouter()
  const [texte, setTexte] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [erreur, setErreur] = useState('')
  const [pending, startTransition] = useTransition()
  const [ouverts, setOuverts] = useState<Record<string, boolean>>({})
  const [commentTexte, setCommentTexte] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setErreur('Image trop lourde (max 5 Mo)'); return }
    setUploading(true)
    setErreur('')
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `feed/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
    if (error) { setErreur("Erreur upload : " + error.message); setUploading(false); return }
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${path}`
    setImageUrl(url)
    setImagePreview(url)
    setUploading(false)
  }

  function retirerImage() {
    setImageUrl('')
    setImagePreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  function publier() {
    const contenu = texte.trim()
    if (!contenu && !imageUrl) return
    setErreur('')
    startTransition(async () => {
      const r = await onPublish(contenu, imageUrl || undefined)
      if (r?.error) setErreur(r.error)
      else { setTexte(''); retirerImage(); router.refresh() }
    })
  }

  function supprimer(id: string) {
    startTransition(async () => { await onDelete(id); router.refresh() })
  }

  function aimer(id: string) {
    startTransition(async () => { await onToggleLike(id); router.refresh() })
  }

  function commenter(postId: string) {
    const contenu = (commentTexte[postId] ?? '').trim()
    if (!contenu) return
    startTransition(async () => {
      const r = await onComment(postId, contenu)
      if (!r?.error) { setCommentTexte(s => ({ ...s, [postId]: '' })); router.refresh() }
    })
  }

  function supprimerCommentaire(id: string) {
    startTransition(async () => { await onDeleteComment(id); router.refresh() })
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-black text-violet-900 mb-6">Fil d&apos;actualité</h1>

      {/* Formulaire de publication */}
      <div className="bg-white rounded-3xl border-2 border-stone-100 p-5 mb-6 shadow-sm">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-700 text-white flex items-center justify-center font-black text-sm shrink-0">
            {currentUserName ? initiales(currentUserName) : '✝'}
          </div>
          <div className="flex-1">
            <textarea
              value={texte}
              onChange={e => setTexte(e.target.value)}
              className="w-full resize-none text-sm text-stone-700 outline-none placeholder-stone-400 min-h-[60px]"
              rows={2}
              placeholder="Partagez quelque chose avec la communauté..."
            />

            {/* Prévisualisation image */}
            {imagePreview && (
              <div className="relative mt-2 inline-block">
                <Image src={imagePreview} alt="Aperçu" width={300} height={200}
                  className="rounded-xl object-cover max-h-48 w-auto" />
                <button onClick={retirerImage}
                  className="absolute top-1 right-1 bg-stone-800/70 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors">
                  <X size={14} />
                </button>
              </div>
            )}

            {uploading && <p className="text-xs text-stone-400 mt-1">Upload en cours...</p>}
            {erreur && <p className="text-xs text-rose-600 font-semibold mt-1">{erreur}</p>}

            <div className="flex items-center justify-between mt-3">
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-violet-700 font-semibold transition-colors">
                <ImagePlus size={16} />
                Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              <button
                onClick={publier}
                disabled={pending || uploading || (!texte.trim() && !imageUrl)}
                className="inline-flex items-center gap-2 bg-violet-700 text-white px-4 py-2 rounded-full text-sm font-black hover:bg-violet-600 transition-colors disabled:opacity-40"
              >
                <Send size={14} />
                {pending ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="text-stone-400 text-sm text-center py-12">Aucune publication pour le moment. Soyez le premier à publier !</p>
        )}
        {posts.map(p => {
          const ouvert = ouverts[p.id] ?? false
          return (
            <div key={p.id} className="bg-white rounded-3xl border-2 border-stone-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-violet-900 flex items-center justify-center font-black text-sm shrink-0">
                  {p.auteur?.avatar_url
                    ? <Image src={p.auteur.avatar_url} alt="" width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                    : p.auteur ? initiales(p.auteur.full_name) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-black text-violet-900 text-sm leading-tight">{p.auteur?.full_name ?? 'Membre'}</p>
                      <p className="text-xs text-stone-400">
                        {p.auteur?.promotion ? `${p.auteur.promotion} · ` : ''}{depuis(p.created_at)}
                      </p>
                    </div>
                    {currentUserId && p.auteur_id === currentUserId && (
                      <button onClick={() => supprimer(p.id)} disabled={pending} aria-label="Supprimer"
                        className="text-stone-300 hover:text-rose-500 transition-colors shrink-0">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {p.contenu && (
                    <p className="text-sm text-stone-700 mt-2 whitespace-pre-wrap break-words">{p.contenu}</p>
                  )}

                  {/* Image du post */}
                  {p.image_url && (
                    <div className="mt-3 rounded-2xl overflow-hidden">
                      <Image src={p.image_url} alt="Image du post" width={600} height={400}
                        className="w-full object-cover max-h-80 rounded-2xl" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
                    <button onClick={() => aimer(p.id)} disabled={pending}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${p.likedByMe ? 'text-rose-500' : 'text-stone-400 hover:text-rose-500'}`}>
                      <Heart size={16} className={p.likedByMe ? 'fill-rose-500' : ''} />
                      {p.likeCount > 0 ? p.likeCount : ''} J&apos;aime
                    </button>
                    <button onClick={() => setOuverts(s => ({ ...s, [p.id]: !ouvert }))}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-violet-700 transition-colors">
                      <MessageCircle size={16} />
                      {p.commentaires.length > 0 ? p.commentaires.length : ''} Commenter
                    </button>
                  </div>

                  {/* Commentaires */}
                  {ouvert && (
                    <div className="mt-3 space-y-3">
                      {p.commentaires.map(c => (
                        <div key={c.id} className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-black text-[10px] shrink-0">
                            {c.auteur ? initiales(c.auteur.full_name) : '?'}
                          </div>
                          <div className="flex-1 min-w-0 bg-stone-50 rounded-2xl px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-xs text-violet-900">{c.auteur?.full_name ?? 'Membre'}</p>
                              {currentUserId && c.auteur_id === currentUserId && (
                                <button onClick={() => supprimerCommentaire(c.id)} disabled={pending} aria-label="Supprimer"
                                  className="text-stone-300 hover:text-rose-500 transition-colors">
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 break-words">{c.contenu}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          value={commentTexte[p.id] ?? ''}
                          onChange={e => setCommentTexte(s => ({ ...s, [p.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commenter(p.id) } }}
                          placeholder="Écrire un commentaire..."
                          className="flex-1 border-2 border-stone-200 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-violet-500"
                        />
                        <button onClick={() => commenter(p.id)} disabled={pending || !(commentTexte[p.id] ?? '').trim()}
                          aria-label="Envoyer"
                          className="bg-violet-700 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors disabled:opacity-40 shrink-0">
                          <Send size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

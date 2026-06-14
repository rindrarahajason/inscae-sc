'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  folder: string
  onUpload: (url: string) => void
  currentUrl?: string
  className?: string
}

export default function ImageUpload({ folder, onUpload, currentUrl, className = '' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Fichier trop volumineux (max 5 MB)'); return }
    setError('')
    setUploading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const ext = file.name.split('.').pop()
    const path = `${folder}/${user?.id ?? 'anon'}_${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('uploads').upload(path, file, { upsert: true })
    if (uploadError) { setError(uploadError.message); setUploading(false); return }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${path}`
    setPreview(url)
    onUpload(url)
    setUploading(false)
  }

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

      {preview ? (
        <div className="relative">
          <img src={preview} alt="Aperçu" className="w-full h-40 object-cover rounded-xl border-2 border-stone-200" />
          <button type="button" onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white/90 text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-white shadow-sm">
            Changer
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-violet-400 hover:bg-violet-50 transition-colors text-stone-400 hover:text-violet-600">
          {uploading ? (
            <span className="text-sm font-semibold">Envoi en cours...</span>
          ) : (
            <>
              <span className="text-2xl">📷</span>
              <span className="text-xs font-semibold">Cliquer pour uploader une image</span>
              <span className="text-xs">JPG, PNG, WEBP — max 5 MB</span>
            </>
          )}
        </button>
      )}
      {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
    </div>
  )
}

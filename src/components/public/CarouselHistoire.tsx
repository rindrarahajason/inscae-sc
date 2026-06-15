'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Photo = { id: string; annee: number; url: string; legende: string | null }
type ByYear = Record<number, Photo[]>

export default function CarouselHistoire({ photos }: { photos: Photo[] }) {
  const byYear: ByYear = {}
  photos.forEach(p => {
    if (!byYear[p.annee]) byYear[p.annee] = []
    byYear[p.annee].push(p)
  })

  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b)
  const [yearIdx, setYearIdx] = useState(0)
  const [photoIdx, setPhotoIdx] = useState(0)

  if (years.length === 0) return null

  const currentYear = years[yearIdx]
  const currentPhotos = byYear[currentYear]
  const currentPhoto = currentPhotos[photoIdx]

  function prevYear() { setYearIdx(i => Math.max(0, i - 1)); setPhotoIdx(0) }
  function nextYear() { setYearIdx(i => Math.min(years.length - 1, i + 1)); setPhotoIdx(0) }
  function prevPhoto() { setPhotoIdx(i => Math.max(0, i - 1)) }
  function nextPhoto() { setPhotoIdx(i => Math.min(currentPhotos.length - 1, i + 1)) }

  return (
    <section className="bg-stone-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Nos souvenirs</p>
          <h2 className="text-3xl font-black text-white">Galerie photos</h2>
        </div>

        {/* Sélecteur d'année */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={prevYear} disabled={yearIdx === 0}
            className="w-9 h-9 bg-violet-700 disabled:bg-violet-900 disabled:opacity-40 text-white rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors">
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2 overflow-x-auto max-w-sm py-1 px-2">
            {years.map((y, i) => (
              <button key={y} onClick={() => { setYearIdx(i); setPhotoIdx(0) }}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-black transition-colors ${i === yearIdx ? 'bg-amber-400 text-violet-900' : 'text-stone-400 hover:text-white'}`}>
                {y}
              </button>
            ))}
          </div>

          <button onClick={nextYear} disabled={yearIdx === years.length - 1}
            className="w-9 h-9 bg-violet-700 disabled:bg-violet-900 disabled:opacity-40 text-white rounded-full flex items-center justify-center hover:bg-violet-600 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Photo principale */}
        <div className="relative bg-black rounded-3xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
          <Image
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.legende ?? `${currentYear}`}
            fill
            className="object-contain"
          />
          {currentPhotos.length > 1 && (
            <>
              <button onClick={prevPhoto} disabled={photoIdx === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 disabled:opacity-20 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextPhoto} disabled={photoIdx === currentPhotos.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 disabled:opacity-20 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <div className="absolute top-3 left-3 bg-amber-400 text-violet-900 font-black text-sm px-3 py-1 rounded-full">
            {currentYear}
          </div>
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {photoIdx + 1} / {currentPhotos.length}
          </div>
        </div>

        {/* Légende */}
        {currentPhoto.legende && (
          <p className="text-center text-stone-400 text-sm italic mb-4">{currentPhoto.legende}</p>
        )}

        {/* Miniatures */}
        {currentPhotos.length > 1 && (
          <div className="flex gap-2 justify-center flex-wrap">
            {currentPhotos.map((p, i) => (
              <button key={p.id} onClick={() => setPhotoIdx(i)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === photoIdx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <Image src={p.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

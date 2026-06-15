import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'INSCAE Section Chrétienne',
    short_name: 'ISC',
    description: 'La communauté chrétienne des étudiants et anciens de l\'INSCAE Madagascar',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFBF0',
    theme_color: '#5B21B6',
    orientation: 'portrait',
    categories: ['education', 'social', 'lifestyle'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
    shortcuts: [
      { name: 'Fil d\'actualité', short_name: 'Feed', url: '/feed', description: 'Espace membres' },
      { name: 'Actualités', short_name: 'News', url: '/actualites', description: 'Dernières actualités' },
    ],
  }
}

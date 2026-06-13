export type UserRole = 'super_admin' | 'bureau' | 'membre'

export type UserStatus = 'pending' | 'active' | 'suspended'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  status: UserStatus
  promotion?: string
  bio?: string
  phone?: string
  profession?: string
  ville?: string
  created_at: string
  updated_at: string
}

export interface President {
  id: string
  full_name: string
  photo_url?: string
  debut_mandat: string
  fin_mandat?: string
  bio?: string
  created_at: string
}

export interface Activite {
  id: string
  titre: string
  description: string
  image_url?: string
  date_debut: string
  date_fin?: string
  lieu?: string
  statut: 'a_venir' | 'en_cours' | 'termine'
  created_at: string
  updated_at: string
}

export interface Actualite {
  id: string
  titre: string
  contenu: string
  image_url?: string
  auteur_id: string
  publie: boolean
  created_at: string
  updated_at: string
}

export interface Temoignage {
  id: string
  auteur_id?: string
  auteur_nom: string
  contenu: string
  valide: boolean
  created_at: string
}

export interface Video {
  id: string
  titre: string
  description?: string
  youtube_url: string
  thumbnail_url?: string
  created_at: string
}

export interface Goodie {
  id: string
  nom: string
  description?: string
  prix: number
  image_url?: string
  stock: number
  stripe_price_id: string
  created_at: string
}

export interface Invitation {
  id: string
  email: string
  invite_par: string
  token: string
  utilisee: boolean
  expires_at: string
  created_at: string
}

export interface Message {
  id: string
  expediteur_id: string
  destinataire_id: string
  contenu: string
  lu: boolean
  created_at: string
}

export interface Post {
  id: string
  auteur_id: string
  contenu: string
  image_url?: string
  created_at: string
  updated_at: string
  auteur?: Profile
  likes_count?: number
  comments_count?: number
}

import {
  getPosts, createPost, deletePost, getCurrentProfile,
  toggleLike, addComment, deleteComment,
} from '@/lib/supabase/actions/reseau'
import { safeFetch } from '@/lib/supabase/safe-fetch'
import FeedClient, { type Post } from './client'
import OnboardingModal from '@/components/reseau/OnboardingModal'

export const dynamic = 'force-dynamic'

export default async function FeedPage() {
  const [posts, profil] = await Promise.all([
    safeFetch(() => getPosts() as Promise<Post[]>, [] as Post[]),
    safeFetch(() => getCurrentProfile(), null),
  ])

  async function publier(contenu: string, image_url?: string, categorie?: string) {
    'use server'
    return createPost(contenu, image_url, categorie)
  }
  async function supprimer(id: string) {
    'use server'
    return deletePost(id)
  }
  async function aimer(id: string) {
    'use server'
    return toggleLike(id)
  }
  async function commenter(postId: string, contenu: string) {
    'use server'
    return addComment(postId, contenu)
  }
  async function supprimerCommentaire(id: string) {
    'use server'
    return deleteComment(id)
  }

  return (
    <>
      <OnboardingModal userName={profil?.full_name ?? null} onPublish={publier} />
      <FeedClient
        posts={posts}
        currentUserId={profil?.id ?? null}
        currentUserName={profil?.full_name ?? null}
        onPublish={publier}
        onDelete={supprimer}
        onToggleLike={aimer}
        onComment={commenter}
        onDeleteComment={supprimerCommentaire}
      />
    </>
  )
}

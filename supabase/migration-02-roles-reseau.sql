-- ============================================
-- MIGRATION 02 — 4e rôle "admin" + RLS réseau (likes / commentaires)
-- À exécuter UNE FOIS dans Supabase → SQL Editor
-- ============================================

-- 1) Ajouter le rôle "admin" -----------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('super_admin', 'admin', 'bureau', 'membre'));

-- 2) Inclure "admin" dans toutes les politiques d'écriture -----------------
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau'))
);

drop policy if exists "presidents_admin" on public.presidents;
create policy "presidents_admin" on public.presidents for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

drop policy if exists "activites_admin" on public.activites;
create policy "activites_admin" on public.activites for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

drop policy if exists "actualites_admin" on public.actualites;
create policy "actualites_admin" on public.actualites for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

drop policy if exists "temoignages_admin" on public.temoignages;
create policy "temoignages_admin" on public.temoignages for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

drop policy if exists "temoignages_delete_admin" on public.temoignages;
create policy "temoignages_delete_admin" on public.temoignages for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

drop policy if exists "videos_admin" on public.videos;
create policy "videos_admin" on public.videos for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

drop policy if exists "goodies_admin" on public.goodies;
create policy "goodies_admin" on public.goodies for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

drop policy if exists "invitations_admin" on public.invitations;
create policy "invitations_admin" on public.invitations for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

-- 3) RLS pour les LIKES ----------------------------------------------------
drop policy if exists "likes_read_members" on public.likes;
create policy "likes_read_members" on public.likes for select using (
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);

drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own" on public.likes for insert with check (
  auth.uid() = user_id and
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);

drop policy if exists "likes_delete_own" on public.likes;
create policy "likes_delete_own" on public.likes for delete using (auth.uid() = user_id);

-- 4) RLS pour les COMMENTAIRES --------------------------------------------
drop policy if exists "commentaires_read_members" on public.commentaires;
create policy "commentaires_read_members" on public.commentaires for select using (
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);

drop policy if exists "commentaires_insert_own" on public.commentaires;
create policy "commentaires_insert_own" on public.commentaires for insert with check (
  auth.uid() = auteur_id and
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);

drop policy if exists "commentaires_delete_own" on public.commentaires;
create policy "commentaires_delete_own" on public.commentaires for delete using (auth.uid() = auteur_id);

-- ============================================
-- INSCAE Section Chrétienne — Schéma Supabase
-- ============================================

create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  avatar_url text,
  role text not null default 'membre' check (role in ('super_admin', 'admin', 'bureau', 'membre')),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  promotion text,
  bio text,
  phone text,
  profession text,
  ville text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PRESIDENTS
-- ============================================
create table public.presidents (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  photo_url text,
  debut_mandat date not null,
  fin_mandat date,
  bio text,
  actuel boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- ACTIVITES
-- ============================================
create table public.activites (
  id uuid default uuid_generate_v4() primary key,
  titre text not null,
  description text not null,
  image_url text,
  date_debut text not null,
  date_fin text,
  lieu text,
  statut text not null default 'a_venir' check (statut in ('a_venir', 'en_cours', 'termine')),
  categorie text,
  emoji text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ACTUALITES
-- ============================================
create table public.actualites (
  id uuid default uuid_generate_v4() primary key,
  titre text not null,
  contenu text not null,
  extrait text,
  image_url text,
  auteur_id uuid references public.profiles(id),
  categorie text,
  publie boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- TEMOIGNAGES
-- ============================================
create table public.temoignages (
  id uuid default uuid_generate_v4() primary key,
  auteur_id uuid references public.profiles(id),
  auteur_nom text not null,
  auteur_promo text,
  contenu text not null,
  valide boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- VIDEOS
-- ============================================
create table public.videos (
  id uuid default uuid_generate_v4() primary key,
  titre text not null,
  description text,
  youtube_url text not null,   -- stocke l'ID YouTube
  thumbnail_url text,
  categorie text,
  date_affichage text,         -- ex: "Juin 2024"
  created_at timestamptz default now()
);

-- ============================================
-- GOODIES
-- ============================================
create table public.goodies (
  id uuid default uuid_generate_v4() primary key,
  nom text not null,
  description text,
  prix integer not null,       -- en Ariary
  image_url text,
  stock integer not null default 0,
  stripe_price_id text not null default 'price_placeholder',
  actif boolean default true,
  nouveau boolean default false,
  couleur text default 'bg-violet-100',
  created_at timestamptz default now()
);

-- ============================================
-- INVITATIONS
-- ============================================
create table public.invitations (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  invite_par uuid references public.profiles(id),
  token text not null unique,
  utilisee boolean default false,
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz default now()
);

-- ============================================
-- POSTS (réseau social)
-- ============================================
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  auteur_id uuid references public.profiles(id) on delete cascade not null,
  contenu text not null,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- LIKES
-- ============================================
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

-- ============================================
-- COMMENTAIRES
-- ============================================
create table public.commentaires (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  auteur_id uuid references public.profiles(id) on delete cascade not null,
  contenu text not null,
  created_at timestamptz default now()
);

-- ============================================
-- MESSAGES PRIVÉS
-- ============================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  expediteur_id uuid references public.profiles(id) on delete cascade not null,
  destinataire_id uuid references public.profiles(id) on delete cascade not null,
  contenu text not null,
  lu boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.presidents enable row level security;
alter table public.activites enable row level security;
alter table public.actualites enable row level security;
alter table public.temoignages enable row level security;
alter table public.videos enable row level security;
alter table public.goodies enable row level security;
alter table public.invitations enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.commentaires enable row level security;
alter table public.messages enable row level security;

-- PROFILES
create policy "profiles_read_all"   on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_admin_all"  on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau'))
);

-- CONTENU PUBLIC (lecture libre)
create policy "presidents_read"  on public.presidents for select using (true);
create policy "activites_read"   on public.activites  for select using (true);
create policy "videos_read"      on public.videos     for select using (true);
create policy "goodies_read"     on public.goodies    for select using (actif = true);
create policy "actualites_read"  on public.actualites for select using (publie = true);
create policy "temoignages_read" on public.temoignages for select using (valide = true);

-- CONTENU PUBLIC (insertion libre pour témoignages)
create policy "temoignages_insert" on public.temoignages for insert with check (true);

-- CONTENU ADMIN (écriture réservée au bureau)
create policy "presidents_admin"  on public.presidents  for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);
create policy "activites_admin"   on public.activites   for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);
create policy "actualites_admin"  on public.actualites  for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);
create policy "temoignages_admin" on public.temoignages for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);
create policy "temoignages_delete_admin" on public.temoignages for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);
create policy "videos_admin"      on public.videos      for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);
create policy "goodies_admin"     on public.goodies     for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);
create policy "invitations_admin" on public.invitations for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('super_admin','admin','bureau') and status = 'active')
);

-- POSTS (réseau membres)
create policy "posts_read_members" on public.posts for select using (
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);
create policy "posts_insert_member" on public.posts for insert with check (
  auth.uid() = auteur_id and
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);
create policy "posts_update_own" on public.posts for update using (auth.uid() = auteur_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = auteur_id);

-- MESSAGES
create policy "messages_read" on public.messages for select using (
  auth.uid() = expediteur_id or auth.uid() = destinataire_id
);
create policy "messages_insert" on public.messages for insert with check (
  auth.uid() = expediteur_id and
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);

-- LIKES
create policy "likes_read_members" on public.likes for select using (
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);
create policy "likes_insert_own" on public.likes for insert with check (
  auth.uid() = user_id and
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);
create policy "likes_delete_own" on public.likes for delete using (auth.uid() = user_id);

-- COMMENTAIRES
create policy "commentaires_read_members" on public.commentaires for select using (
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);
create policy "commentaires_insert_own" on public.commentaires for insert with check (
  auth.uid() = auteur_id and
  exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
);
create policy "commentaires_delete_own" on public.commentaires for delete using (auth.uid() = auteur_id);

-- ============================================
-- TRIGGERS updated_at
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at  before update on public.profiles  for each row execute function update_updated_at();
create trigger activites_updated_at before update on public.activites for each row execute function update_updated_at();
create trigger actualites_updated_at before update on public.actualites for each row execute function update_updated_at();
create trigger posts_updated_at     before update on public.posts     for each row execute function update_updated_at();

-- ============================================
-- TRIGGER : créer profile à l'inscription
-- ============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, status)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'pending');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- DONNÉES DE DÉMONSTRATION
-- ============================================

-- Présidents
insert into public.presidents (full_name, debut_mandat, fin_mandat, bio, actuel) values
  ('Jean-Baptiste Rakoto',     '1995-01-01', '1997-01-01', 'Fondateur et premier président, vision pionnière.', false),
  ('Marie-Claire Andriamanga', '1997-01-01', '1999-01-01', 'A structuré les premières activités régulières.', false),
  ('Emmanuel Rasolonjatovo',   '1999-01-01', '2002-01-01', 'Période de forte croissance du nombre de membres.', false),
  ('Lalaina Razafimahefa',     '2002-01-01', '2004-01-01', 'Partenariats avec d''autres associations.', false),
  ('Patrick Andriantsoa',      '2004-01-01', '2007-01-01', 'Développement du réseau des anciens membres.', false),
  ('Hanta Rakotondrabe',       '2007-01-01', '2009-01-01', 'Lancement des retraites spirituelles annuelles.', false),
  ('Thierry Ratsimba',         '2009-01-01', '2012-01-01', 'Modernisation de la communication.', false),
  ('Voahangy Randriamihaja',   '2012-01-01', '2014-01-01', 'Programme d''accompagnement des étudiants.', false),
  ('Fidy Ramaroson',           '2014-01-01', '2017-01-01', 'Expansion digitale et réseaux sociaux.', false),
  ('Harizo Andrianjafy',       '2017-01-01', '2020-01-01', 'Séminaires professionnels foi & carrière.', false),
  ('Nadia Rasoanaivo',         '2020-01-01', '2022-01-01', 'Gestion COVID-19 avec cultes en ligne.', false),
  ('Miora Razafindralambo',    '2022-01-01', null,         'Relance post-pandémie et projets communautaires.', true);

-- Activités
insert into public.activites (titre, description, date_debut, lieu, statut, categorie, emoji) values
  ('Retraite Spirituelle 2025', 'Trois jours de ressourcement et prière. Thème : « Marche par la foi, non par la vue ».', '14 – 16 Juin 2025', 'Antsirabe, Madagascar', 'a_venir', 'Spirituel', '⛺'),
  ('Culte Hebdomadaire', 'Chaque vendredi soir : louange, prière et étude de la Parole. Ouvert à tous.', 'Chaque vendredi 18h', 'Salle B203, INSCAE', 'en_cours', 'Culte', '🙏'),
  ('Séminaire Foi & Carrière', 'Conférence avec des professionnels chrétiens membres de l''ISC.', '5 Juillet 2025', 'Grand Amphi INSCAE', 'a_venir', 'Formation', '💼'),
  ('Action Sociale — Soutien scolaire', 'Bénévolat auprès des enfants défavorisés du quartier Isotry. Chaque samedi.', 'Chaque samedi 8h', 'Isotry, Tana', 'en_cours', 'Social', '📚');

-- Actualités
insert into public.actualites (titre, contenu, extrait, categorie, publie) values
  ('L''ISC accueille 45 nouveaux membres pour 2025', 'Une cérémonie d''accueil chaleureuse a marqué l''intégration des nouvelles recrues lors du culte de rentrée. Le bureau a présenté le programme annuel riche en activités spirituelles, professionnelles et sociales pour cette nouvelle année académique.', 'Une cérémonie d''accueil chaleureuse a marqué l''intégration des nouvelles recrues lors du culte de rentrée.', 'Vie associative', true),
  ('Compte-rendu : Retraite spirituelle 2024 à Antsirabe', 'Trois jours inoubliables de ressourcement, de prière et de partage. Plus de 80 membres ont participé à cette édition exceptionnelle autour du thème de l''identité chrétienne. Les témoignages recueillis ont été bouleversants.', 'Trois jours inoubliables. Plus de 80 membres ont participé à cette édition exceptionnelle.', 'Rapport d''activité', true),
  ('Partenariat avec la Mission Évangélique de Tana', 'L''INSCAE SC signe une convention de partenariat avec la Mission Évangélique pour renforcer l''accompagnement spirituel et faciliter les actions sociales conjointes dans la capitale.', 'L''ISC signe une convention de partenariat pour renforcer l''accompagnement spirituel.', 'Partenariat', true);

-- Témoignages
insert into public.temoignages (auteur_nom, auteur_promo, contenu, valide) values
  ('Fanantenana Rakoto',   'INSCAE 2023', 'Rejoindre l''ISC a été un tournant décisif dans ma vie universitaire. Au milieu du stress des examens, j''ai trouvé une communauté qui priait avec moi et pour moi. C''est là que j''ai appris ce que signifie vraiment faire confiance à Dieu.', true),
  ('Andriamihaja Tsiory',  'INSCAE 2021', 'La retraite de 2020 a changé ma perspective sur l''échec. J''avais raté deux fois mon année. La parole reçue m''a redonné la force de persévérer. Aujourd''hui je travaille dans un cabinet d''audit et témoigne de la fidélité de Dieu.', true),
  ('Patrick Rakotondrabe', 'INSCAE 2019', 'Les valeurs de l''ISC — foi, excellence, service — sont exactement ce que je vis chaque jour dans mon entreprise. Nous venons de lancer une startup et je suis convaincu que c''est Dieu qui ouvre les portes.', true);

-- Vidéos
insert into public.videos (titre, description, youtube_url, categorie, date_affichage) values
  ('Retraite 2024 — Moments forts',         'Retrouvez les temps forts de notre retraite spirituelle annuelle.',   'dQw4w9WgXcQ', 'Retraite',    'Juin 2024'),
  ('Culte de rentrée 2025',                  'Message d''ouverture de l''année académique par la présidente.',       'dQw4w9WgXcQ', 'Culte',       'Fév 2025'),
  ('Témoignage : Dieu dans mes études',     'Jean-Marc Ravoavy, major de promo 2023, témoigne de son parcours.',   'dQw4w9WgXcQ', 'Témoignage',  'Déc 2023'),
  ('Séminaire Foi & Carrière 2024 — Panel', 'Table ronde avec 5 anciens membres devenus directeurs.',              'dQw4w9WgXcQ', 'Séminaire',   'Juil 2024'),
  ('Concert de louange — Noël 2024',        'Moment de louange et d''adoration lors de la célébration de Noël.',   'dQw4w9WgXcQ', 'Louange',     'Déc 2024');

-- Goodies
insert into public.goodies (nom, description, prix, stock, actif, nouveau, couleur) values
  ('T-Shirt INSCAE SC — Blanc',    '100% coton, sérigraphie logo + devise. S, M, L, XL.',       35000, 24,  true, true,  'bg-violet-100'),
  ('T-Shirt INSCAE SC — Bleu',     '100% coton. Couleur officielle de l''association.',          35000, 18,  true, false, 'bg-blue-100'),
  ('Mug INSCAE SC',                'Céramique 350ml avec logo et verset.',                        20000, 30,  true, false, 'bg-amber-100'),
  ('Carnet de notes — Édition foi','A5 couverture rigide, 120 pages lignées, versets bibliques.',12000, 50,  true, true,  'bg-teal-100'),
  ('Stylo gravé INSCAE SC',        'Stylo métal premium gravé.',                                   8000, 100, true, false, 'bg-stone-100'),
  ('Sacoche — Collection 2025',    'Tote bag coton épais, format A4.',                           15000, 0,   false, false,'bg-rose-100'),
  ('Sticker Pack (lot de 10)',     '10 stickers variés : logo, versets, illustrations.',          5000, 200, true, true,  'bg-orange-100'),
  ('Hoodie INSCAE SC',             'Sweat à capuche brodé, unisexe, S au XXL.',                  75000, 10,  true, true,  'bg-indigo-100');

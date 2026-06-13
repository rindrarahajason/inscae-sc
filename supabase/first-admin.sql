-- Exécuter APRÈS avoir créé votre compte via /auth/inscription ou Supabase Auth dashboard
-- Remplacer 'votre@email.mg' par votre email réel

update public.profiles
set role = 'super_admin', status = 'active'
where email = 'votre@email.mg';

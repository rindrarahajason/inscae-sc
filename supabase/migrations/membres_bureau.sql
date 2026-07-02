create table if not exists membres_bureau (
  id            uuid primary key default gen_random_uuid(),
  president_id  uuid not null references presidents(id) on delete cascade,
  full_name     text not null,
  role_bureau   text not null,
  photo_url     text,
  ordre         integer default 0,
  created_at    timestamptz default now()
);

alter table membres_bureau enable row level security;

create policy "Public read membres_bureau"
  on membres_bureau for select using (true);

create policy "Admin write membres_bureau"
  on membres_bureau for all
  using (
    exists (
      select 1 from profils
      where profils.id = auth.uid()
      and profils.role in ('super_admin','admin','bureau')
      and profils.status = 'active'
    )
  );

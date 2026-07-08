-- ============================================================
-- Portfolio schema — run once in Supabase SQL Editor
-- Security model: anon role reads published content only;
-- every write requires an authenticated session (your account).
-- Also do in the dashboard:
--   Auth -> Sign In / Up -> disable "Allow new users to sign up"
--   Auth -> create your admin user manually (strong password)
--   Auth -> enable leaked password protection
-- ============================================================

-- ---------- TABLES ----------
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists lab_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort int default 0,
  created_at timestamptz not null default now()
);

create table if not exists labs (
  id uuid primary key default gen_random_uuid(),
  category text default '',
  slug text unique not null,
  title text not null,
  summary text default '',
  description text default '',
  cover_url text default '',
  tags text[] default '{}',
  links jsonb default '{}'::jsonb,
  files jsonb default '[]'::jsonb,
  featured boolean default false,
  published boolean default true,
  lab_date date,
  created_at timestamptz not null default now()
);

create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  org text not null,
  role text not null,
  dates text default '',
  bullets text[] default '{}',
  description text default '',
  files jsonb default '[]'::jsonb,
  sort int default 0,
  created_at timestamptz not null default now()
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text default '',
  status text default 'Issued',
  issued text default '',
  description text default '',
  credential_url text default '',
  image_url text default '',
  files jsonb default '[]'::jsonb,
  sort int default 0,
  created_at timestamptz not null default now()
);

create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text default '',
  org text default '',
  body text default '',
  file_url text default '',
  files jsonb default '[]'::jsonb,
  published boolean default true,
  sort int default 0,
  created_at timestamptz not null default now()
);

-- ---------- ROW LEVEL SECURITY ----------
alter table site_settings   enable row level security;
alter table lab_categories  enable row level security;
alter table labs            enable row level security;
alter table experience      enable row level security;
alter table certifications  enable row level security;
alter table recommendations enable row level security;

-- Public reads (anon + authenticated)
create policy "public read settings"  on site_settings   for select using (true);
create policy "public read cats"      on lab_categories  for select using (true);
create policy "public read labs"      on labs            for select using (published = true or auth.role() = 'authenticated');
create policy "public read exp"       on experience      for select using (true);
create policy "public read certs"     on certifications  for select using (true);
create policy "public read recs"      on recommendations for select using (published = true or auth.role() = 'authenticated');

-- Authenticated writes (signups are disabled, so authenticated == you)
create policy "admin write settings" on site_settings   for all to authenticated using (true) with check (true);
create policy "admin write cats"     on lab_categories  for all to authenticated using (true) with check (true);
create policy "admin write labs"     on labs            for all to authenticated using (true) with check (true);
create policy "admin write exp"      on experience      for all to authenticated using (true) with check (true);
create policy "admin write certs"    on certifications  for all to authenticated using (true) with check (true);
create policy "admin write recs"     on recommendations for all to authenticated using (true) with check (true);

-- ---------- STORAGE ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "admin upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "admin update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

create policy "admin delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');

-- ============================================================
-- ALREADY RAN AN EARLIER VERSION? Run only this block instead:
-- ============================================================
-- create table if not exists lab_categories (
--   id uuid primary key default gen_random_uuid(),
--   name text unique not null, sort int default 0,
--   created_at timestamptz not null default now());
-- alter table lab_categories enable row level security;
-- create policy "public read cats" on lab_categories for select using (true);
-- create policy "admin write cats" on lab_categories for all to authenticated using (true) with check (true);
-- alter table labs add column if not exists category text default '';
-- alter table experience add column if not exists description text default '';
-- alter table experience add column if not exists files jsonb default '[]'::jsonb;
-- alter table certifications add column if not exists description text default '';
-- alter table certifications add column if not exists files jsonb default '[]'::jsonb;
-- alter table recommendations add column if not exists files jsonb default '[]'::jsonb;

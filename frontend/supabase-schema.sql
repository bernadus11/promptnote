-- ============================================================
-- SUPABASE SCHEMA LENGKAP - PromptNote AI
-- Jalankan seluruh script ini di SQL Editor Supabase
-- ============================================================


-- ============================================================
-- BAGIAN 1: HAPUS SEMUA YANG LAMA (CLEAN SLATE)
-- ============================================================

-- Drop triggers dulu sebelum function
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists prompts_updated_at on prompts;

-- Drop functions
drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_updated_at() cascade;

-- Drop policies prompts
drop policy if exists "Users can read their own prompts"   on prompts;
drop policy if exists "Users can insert their own prompts" on prompts;
drop policy if exists "Users can update their own prompts" on prompts;
drop policy if exists "Users can delete their own prompts" on prompts;

-- Drop policies profiles
drop policy if exists "Users can read their own profile"   on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;

-- Drop tables (urutan penting: child dulu, baru parent)
drop table if exists public.prompts  cascade;
drop table if exists public.profiles cascade;


-- ============================================================
-- BAGIAN 2: BUAT TABEL DENGAN CASCADE DELETE
-- ============================================================

-- Tabel profiles
create table public.profiles (
  id         uuid        not null primary key,
  full_name  text,
  role       text        not null default 'user',
  created_at timestamptz not null default now(),

  -- ON DELETE CASCADE: hapus profile otomatis saat user dihapus
  constraint profiles_id_fkey
    foreign key (id)
    references auth.users (id)
    on delete cascade
);

-- Tabel prompts
create table public.prompts (
  id          bigint      generated always as identity primary key,
  user_id     uuid        not null,
  title       text        not null,
  description text,
  category    text        not null default 'ChatGPT',
  tags        text[]      not null default array[]::text[],
  starred     boolean     not null default false,
  date        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- ON DELETE CASCADE: hapus prompts otomatis saat user dihapus
  constraint prompts_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade
);


-- ============================================================
-- BAGIAN 3: ROW LEVEL SECURITY
-- ============================================================

-- RLS prompts
alter table public.prompts  enable row level security;
alter table public.profiles enable row level security;

create policy "Users can read their own prompts"
  on prompts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own prompts"
  on prompts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prompts"
  on prompts for update
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own prompts"
  on prompts for delete
  using (auth.uid() = user_id);

-- RLS profiles
create policy "Users can read their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using  (auth.uid() = id)
  with check (auth.uid() = id);


-- ============================================================
-- BAGIAN 4: TRIGGER UPDATED_AT
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger prompts_updated_at
  before update on public.prompts
  for each row
  execute function public.set_updated_at();


-- ============================================================
-- BAGIAN 5: TRIGGER AUTO-INSERT PROFILE SAAT SIGNUP
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();


-- ============================================================
-- BAGIAN 6: VERIFIKASI HASIL
-- Cek apakah CASCADE sudah terpasang dengan benar
-- ============================================================

select
  tc.table_name,
  kcu.column_name,
  rc.delete_rule           as on_delete,
  ccu.table_name           as references_table
from information_schema.table_constraints     tc
join information_schema.key_column_usage      kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema   = kcu.table_schema
join information_schema.referential_constraints rc
  on tc.constraint_name = rc.constraint_name
join information_schema.constraint_column_usage ccu
  on rc.unique_constraint_name = ccu.constraint_name
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema    = 'public'
order by tc.table_name;

-- Hasil yang diharapkan:
-- table_name | column_name | on_delete | references_table
-- -----------+-------------+-----------+-----------------
-- profiles   | id          | CASCADE   | users
-- prompts    | user_id     | CASCADE   | users
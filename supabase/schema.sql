-- =========================================
-- DASTAVEZ SAARTHI DATABASE
-- =========================================

create extension if not exists pgcrypto;


-- =========================================
-- PROFILES
-- =========================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  email text,
  mobile text,

  date_of_birth date,
  gender text,

  father_name text,
  mother_name text,

  address text,
  city text,
  district text,
  state text,
  pincode text,

  aadhaar_last4 text,

  role text not null default 'citizen'
    check (role in ('citizen', 'admin')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================
-- SERVICES
-- =========================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text unique not null,

  description text,
  category text,

  requirements jsonb not null default '[]'::jsonb,

  is_active boolean not null default true,

  created_at timestamptz not null default now()
);


-- =========================================
-- APPLICATIONS
-- =========================================

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),

  application_number text unique not null,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  service_id uuid
    references public.services(id)
    on delete set null,

  status text not null default 'draft',

  citizen_data jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- =========================================
-- DOCUMENTS
-- =========================================

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),

  application_id uuid
    references public.applications(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  document_type text not null,
  file_name text not null,
  file_path text not null,

  status text not null default 'uploaded',

  created_at timestamptz not null default now()
);


-- =========================================
-- AGENT EVENTS
-- =========================================

create table if not exists public.agent_events (
  id uuid primary key default gen_random_uuid(),

  application_id uuid
    references public.applications(id)
    on delete cascade,

  event_type text not null,
  message text not null,

  status text not null default 'completed',

  created_at timestamptz not null default now()
);


-- =========================================
-- CREATE PROFILE AUTOMATICALLY
-- AFTER USER SIGNUP
-- =========================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

  insert into public.profiles (
    id,
    full_name,
    email
  )

  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  )

  on conflict (id) do nothing;

  return new;

end;
$$;


drop trigger if exists on_auth_user_created
on auth.users;


create trigger on_auth_user_created

after insert on auth.users

for each row

execute procedure public.handle_new_user();


-- =========================================
-- ENABLE RLS
-- =========================================

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.applications enable row level security;
alter table public.documents enable row level security;
alter table public.agent_events enable row level security;


-- =========================================
-- PROFILE POLICIES
-- =========================================

drop policy if exists "Users can view own profile"
on public.profiles;

create policy "Users can view own profile"

on public.profiles

for select

using (
  auth.uid() = id
);


drop policy if exists "Users can update own profile"
on public.profiles;

create policy "Users can update own profile"

on public.profiles

for update

using (
  auth.uid() = id
)

with check (
  auth.uid() = id
);


drop policy if exists "Users can insert own profile"
on public.profiles;

create policy "Users can insert own profile"

on public.profiles

for insert

with check (
  auth.uid() = id
);


-- =========================================
-- SERVICES
-- PUBLIC CAN VIEW ACTIVE SERVICES
-- =========================================

drop policy if exists "Anyone can view active services"
on public.services;

create policy "Anyone can view active services"

on public.services

for select

using (
  is_active = true
);


-- =========================================
-- APPLICATION POLICIES
-- =========================================

drop policy if exists "Users can view own applications"
on public.applications;

create policy "Users can view own applications"

on public.applications

for select

using (
  auth.uid() = user_id
);


drop policy if exists "Users can create own applications"
on public.applications;

create policy "Users can create own applications"

on public.applications

for insert

with check (
  auth.uid() = user_id
);


drop policy if exists "Users can update own applications"
on public.applications;

create policy "Users can update own applications"

on public.applications

for update

using (
  auth.uid() = user_id
)

with check (
  auth.uid() = user_id
);


-- =========================================
-- DOCUMENT POLICIES
-- =========================================

drop policy if exists "Users can view own documents"
on public.documents;

create policy "Users can view own documents"

on public.documents

for select

using (
  auth.uid() = user_id
);


drop policy if exists "Users can create own documents"
on public.documents;

create policy "Users can create own documents"

on public.documents

for insert

with check (
  auth.uid() = user_id
);


-- =========================================
-- AGENT EVENTS
-- =========================================

drop policy if exists "Users can view own agent events"
on public.agent_events;

create policy "Users can view own agent events"

on public.agent_events

for select

using (
  exists (
    select 1
    from public.applications a
    where a.id = application_id
    and a.user_id = auth.uid()
  )
);
-- Stage 1 — Auth + roles.
-- A `profiles` row per auth user, carrying the app role. This is the DB source
-- of truth for role (Stage 2 RLS reads it via a `my_role()` helper). The role
-- is ALSO mirrored into auth user_metadata at signup so middleware can gate
-- routes cheaply without a DB round-trip.

create type public.user_role as enum ('couple', 'admin', 'vendor');

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         public.user_role not null default 'couple',
  display_name text not null default '',
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can read and update only their own profile. (No insert policy: rows are
-- created by the signup trigger below, which runs as definer.)
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- On signup, create the profile, reading role + display_name from the metadata
-- passed to auth.signUp({ options: { data: { role, display_name } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'couple'),
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helper for Stage 2 RLS (security definer avoids recursive policy checks
-- when other tables reference profiles).
create or replace function public.my_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

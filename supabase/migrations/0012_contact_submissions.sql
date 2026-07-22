-- Contact form persistence.
--
-- The contact form was a 700ms setTimeout that discarded every message — and
-- its interest dropdown offers "I'm a vendor", so a vendor waiting on approval
-- had their only support channel silently drop them. This stores submissions
-- so the admin can actually read and action them.
--
-- RLS: ANYONE may insert (the form is public, signed-out visitors included),
-- but only admins may read or update. A submitter can't list other people's
-- messages.

create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null default '',
  email      text not null default '',
  interest   text not null default '',
  message    text not null default '',
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

-- Public submit. `with check (true)` on INSERT only — no select granted here,
-- so this cannot be used to read the table.
drop policy if exists contact_public_insert on public.contact_submissions;
create policy contact_public_insert on public.contact_submissions
  for insert with check (true);

-- Admin reads + marks handled.
drop policy if exists contact_admin on public.contact_submissions;
create policy contact_admin on public.contact_submissions
  for all using (public.my_role() = 'admin');

-- 0015 · Events + guest assignment.
--
-- A couple creates events (Haldi, Sangeet, Reception…) and checks which guests
-- attend each one; each event shows a headcount (summed party counts). Scoped
-- to the wedding via can_access_wedding() (from 0014), so collaborators see and
-- edit events too. ADDITIVE + IDEMPOTENT.

-- Events belonging to a wedding.
create table if not exists public.events (
  id         uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name       text not null default '',
  date       date,
  sort       int  not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists events_wedding_idx on public.events (wedding_id);

alter table public.events enable row level security;

drop policy if exists events_owner on public.events;
create policy events_owner on public.events for all
  using (public.can_access_wedding(wedding_id))
  with check (public.can_access_wedding(wedding_id));

drop policy if exists events_admin on public.events;
create policy events_admin on public.events for all
  using (public.my_role() = 'admin');

-- Which guests attend which event (many-to-many). Composite PK like
-- saved_inspiration. Both sides cascade on delete.
create table if not exists public.event_guests (
  event_id   uuid not null references public.events (id) on delete cascade,
  guest_id   uuid not null references public.guests (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, guest_id)
);
create index if not exists event_guests_event_idx on public.event_guests (event_id);
create index if not exists event_guests_guest_idx on public.event_guests (guest_id);

alter table public.event_guests enable row level security;

-- Access if the caller can access the event's wedding (join through events).
drop policy if exists event_guests_owner on public.event_guests;
create policy event_guests_owner on public.event_guests for all
  using (
    exists (select 1 from public.events e
            where e.id = event_guests.event_id
              and public.can_access_wedding(e.wedding_id))
  )
  with check (
    exists (select 1 from public.events e
            where e.id = event_guests.event_id
              and public.can_access_wedding(e.wedding_id))
  );

drop policy if exists event_guests_admin on public.event_guests;
create policy event_guests_admin on public.event_guests for all
  using (public.my_role() = 'admin');

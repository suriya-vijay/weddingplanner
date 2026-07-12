-- Batch 2 · Feature 2 — Venue design + seating layout (one per wedding).
-- The whole layout (shapes + seat assignments) is a self-describing JSON blob,
-- so the schema never changes as we add shape types. Couple-owned RLS mirrors
-- the guests_owner pattern (scoped through the wedding's owner).

create table if not exists public.venue_layouts (
  id         uuid primary key default gen_random_uuid(),
  wedding_id uuid not null unique references public.weddings (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.venue_layouts enable row level security;

drop policy if exists venue_owner on public.venue_layouts;
create policy venue_owner on public.venue_layouts for all
  using (
    exists (select 1 from public.weddings w
            where w.id = venue_layouts.wedding_id and w.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.weddings w
            where w.id = venue_layouts.wedding_id and w.owner_id = auth.uid())
  );

drop policy if exists venue_admin on public.venue_layouts;
create policy venue_admin on public.venue_layouts for all
  using (public.my_role() = 'admin');

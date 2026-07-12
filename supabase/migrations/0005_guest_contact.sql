-- Batch 1 — Guest contact fields: optional email + phone per guest/family.
-- Couple-owned via the existing `guests_owner` RLS (scoped through the wedding).

alter table public.guests
  add column if not exists email text default '',
  add column if not exists phone text default '';

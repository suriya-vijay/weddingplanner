-- Real vendor profile-view counter.
-- The Overview "Profile views" tile was a hardcoded number; this makes it real:
-- a lifetime count incremented each time someone opens the vendor's public
-- page. ADDITIVE: one integer column, no policy changes. New vendors start at 0.
-- Increment is done server-side with the service-role client (anon visitors
-- can't UPDATE vendors under RLS); the app tolerates this column's absence.

alter table public.vendors
  add column if not exists profile_views int not null default 0;

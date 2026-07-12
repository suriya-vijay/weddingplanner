-- Batch 2 · Feature 4 — Vendor approval gate.
-- New vendors are 'pending' and hidden from the public marketplace until an
-- admin approves them. ADDITIVE: one new column, no policy changes.
-- Public visibility is enforced in the app layer (getPublicVendors /
-- getVendorBySlug filter status='approved'); RLS is unchanged so the vendor's
-- own portal + admin reads are unaffected.

alter table public.vendors
  add column if not exists status text not null default 'pending'
  check (status in ('pending', 'approved', 'rejected'));

-- Backfill: everything that exists today stays public — approve all current
-- rows (seeded catalog + any already-claimed vendors) so nothing disappears.
update public.vendors set status = 'approved' where status = 'pending';

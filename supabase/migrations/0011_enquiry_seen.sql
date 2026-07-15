-- Enquiry read-tracking → phone-style unread notification badges.
-- Per-viewer "last seen" timestamps on each enquiry so we can tell a vendor
-- they have a new enquiry/message and a couple they have a new reply. Unread =
-- a message from the OTHER party (or, for the vendor, a brand-new enquiry) with
-- created_at > my last_seen. ADDITIVE: two nullable columns + one new couple
-- UPDATE policy (couples had only SELECT+INSERT). Existing policies untouched.

alter table public.vendor_enquiries
  add column if not exists vendor_last_seen_at timestamptz,
  add column if not exists couple_last_seen_at timestamptz;

-- Let a couple UPDATE their own enquiry rows (to stamp couple_last_seen_at).
-- Mirrors enq_couple_select (0006). The owning vendor already has enq_vendor
-- (for all), so it can stamp vendor_last_seen_at.
drop policy if exists enq_couple_update on public.vendor_enquiries;
create policy enq_couple_update on public.vendor_enquiries for update
  using (
    from_wedding_id in (
      select id from public.weddings where owner_id = auth.uid()
    )
  );

-- Batch 2 · Feature 5 — Vendor rejection reason.
-- When an admin rejects a vendor, they record WHY; the vendor sees the reason
-- in their portal so they can fix and resubmit. ADDITIVE: one text column with
-- a default, no policy changes. The vendor already reads its own row (RLS
-- vendors_owner) and the admin writes via vendors_admin, so no new grants are
-- needed. The app tolerates this column's absence (reads default to '',
-- writes fall back), so a half-applied DB never breaks moderation.

alter table public.vendors
  add column if not exists rejection_reason text not null default '';

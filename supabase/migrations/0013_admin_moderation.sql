-- Admin moderation log = the missing audit trail.
--
-- Today `vendors.rejection_reason` is a single overwritten column: approving a
-- vendor blanks it, and a vendor editing their own profile to resubmit also
-- clears it. So there is no record of who moderated what, when, or why — and a
-- rejection reason disappears the moment it stops being current.
--
-- This appends one immutable row per moderation action instead.

create table if not exists public.vendor_moderation_log (
  id         uuid primary key default gen_random_uuid(),
  -- NOT a foreign key, and `on delete set null` on the actor. The whole point
  -- of an audit trail is that it outlives the thing it describes: with a
  -- cascading FK, deleting a vendor would erase the very record of the
  -- deletion. `vendor_name` is denormalised for the same reason.
  vendor_id   uuid not null,
  vendor_name text not null default '',
  actor_id    uuid references public.profiles (id) on delete set null,
  actor_name  text not null default '',
  action      text not null,           -- approved | rejected | deleted | edited | verified
  reason      text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists vendor_moderation_log_vendor_idx
  on public.vendor_moderation_log (vendor_id, created_at desc);

alter table public.vendor_moderation_log enable row level security;

-- Admin-only, read and write. Vendors never see the log.
drop policy if exists modlog_admin on public.vendor_moderation_log;
create policy modlog_admin on public.vendor_moderation_log
  for all using (public.my_role() = 'admin');

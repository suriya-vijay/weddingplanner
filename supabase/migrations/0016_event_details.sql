-- 0016 · Event invitation details.
--
-- Each event becomes the invitation-ready record: name + date already exist;
-- add time, venue, address, dress code and notes. These are the structured
-- source of truth that will feed the digital wedding invitation later.
-- ADDITIVE + IDEMPOTENT. No RLS change — the existing events_owner/events_admin
-- policies (0015, scoped via can_access_wedding) already cover new columns.

alter table public.events
  add column if not exists time       text not null default '',   -- start time, e.g. "4:00 PM"
  add column if not exists venue      text not null default '',   -- e.g. "The Grand Ballroom"
  add column if not exists address    text not null default '',   -- full street/city/state/zip
  add column if not exists dress_code text not null default '',
  add column if not exists notes      text not null default '';

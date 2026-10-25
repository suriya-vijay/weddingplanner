-- 0017 · Security hardening.
--
-- Closes privilege-escalation and tenant-isolation gaps found in review:
--   1. Role could be self-assigned (signup metadata → profiles.role, and
--      profiles_update_own allowed editing `role`). Role now lives in
--      auth app_metadata (only the service role can write it), the signup
--      trigger never grants admin, and end users can't change profiles.role.
--   2. Vendors could set their own status/verified/rating (self-approve).
--   3. Wedding INSERT checked can_access_wedding(id) — the new row isn't
--      visible to that lookup, so first-time wedding creation could fail.
--      Collaborators could also change owner_id or delete the wedding.
--   4. Couples could rewrite any enquiry column; either side could post chat
--      messages as the other party.
--
-- IDEMPOTENT: safe to re-run. Run in the Supabase SQL editor (or db push).
--
-- "End user" below = a request made with a user JWT (anon/authenticated) by
-- someone who isn't an admin. The service role (server actions using the
-- service key) and the SQL editor are never restricted by these triggers.

create or replace function public.is_end_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.role(), '') in ('anon', 'authenticated')
     and coalesce(public.my_role()::text, '') <> 'admin';
$$;

-- ── 1) Roles ──────────────────────────────────────────────────────────────

-- Signup: trust app_metadata (service-written) first; from user-editable
-- metadata accept only couple/vendor. Never admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.user_role;
begin
  if (new.raw_app_meta_data ->> 'role') in ('couple', 'vendor', 'admin') then
    r := (new.raw_app_meta_data ->> 'role')::public.user_role;
  elsif (new.raw_user_meta_data ->> 'role') = 'vendor' then
    r := 'vendor';
  else
    r := 'couple';
  end if;

  insert into public.profiles (id, role, display_name)
  values (new.id, r, coalesce(new.raw_user_meta_data ->> 'display_name', ''));

  -- Mirror into app_metadata so the app can gate routes without a DB read.
  update auth.users
     set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
                             || jsonb_build_object('role', r::text)
   where id = new.id;
  return new;
end;
$$;

-- End users can't change their own role.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_end_user() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- When an admin (or the SQL editor) changes profiles.role, keep app_metadata
-- in sync — this is how you promote someone to admin now.
create or replace function public.sync_role_to_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
     set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
                             || jsonb_build_object('role', new.role::text)
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists sync_role_to_auth on public.profiles;
create trigger sync_role_to_auth
  after update of role on public.profiles
  for each row when (old.role is distinct from new.role)
  execute function public.sync_role_to_auth();

-- Backfill: copy every existing profile role into app_metadata.
update auth.users u
   set raw_app_meta_data = coalesce(u.raw_app_meta_data, '{}'::jsonb)
                           || jsonb_build_object('role', p.role::text)
  from public.profiles p
 where p.id = u.id;

-- ── 2) Vendors: no self-approval ─────────────────────────────────────────

create or replace function public.protect_vendor_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_end_user() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.status := 'pending';
    new.verified := false;
    new.rating := 0;
    new.reviews := 0;
    new.profile_views := 0;
    new.rejection_reason := '';
    return new;
  end if;

  new.owner_id := old.owner_id;
  new.verified := old.verified;
  new.rating := old.rating;
  new.reviews := old.reviews;
  new.profile_views := old.profile_views;
  -- The one status change a vendor may make: resubmit after rejection.
  if not (old.status = 'rejected' and new.status = 'pending') then
    new.status := old.status;
    new.rejection_reason := old.rejection_reason;
  else
    new.rejection_reason := '';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_vendor_columns on public.vendors;
create trigger protect_vendor_columns
  before insert or update on public.vendors
  for each row execute function public.protect_vendor_columns();

-- Atomic profile-view counter (replaces read-then-write from the app).
create or replace function public.increment_vendor_views(vid uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.vendors set profile_views = profile_views + 1 where id = vid;
$$;
revoke all on function public.increment_vendor_views(uuid) from public, anon, authenticated;

-- ── 3) Weddings ──────────────────────────────────────────────────────────

drop policy if exists wed_owner on public.weddings;
drop policy if exists wed_select on public.weddings;
drop policy if exists wed_insert on public.weddings;
drop policy if exists wed_update on public.weddings;
drop policy if exists wed_delete on public.weddings;

-- `owner_id = auth.uid()` is checked directly so a brand-new row passes
-- without needing to be visible to can_access_wedding().
create policy wed_select on public.weddings for select
  using (owner_id = auth.uid() or public.can_access_wedding(id));
create policy wed_insert on public.weddings for insert
  with check (owner_id = auth.uid());
create policy wed_update on public.weddings for update
  using (owner_id = auth.uid() or public.can_access_wedding(id))
  with check (owner_id = auth.uid() or public.can_access_wedding(id));
create policy wed_delete on public.weddings for delete
  using (owner_id = auth.uid());

create or replace function public.protect_wedding_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_end_user() then
    new.owner_id := old.owner_id;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_wedding_owner on public.weddings;
create trigger protect_wedding_owner
  before update on public.weddings
  for each row execute function public.protect_wedding_owner();

-- ── 4) Enquiries + chat ─────────────────────────────────────────────────

-- Couples may only enquire to approved vendors.
drop policy if exists enq_couple_insert on public.vendor_enquiries;
create policy enq_couple_insert on public.vendor_enquiries for insert
  with check (
    public.can_access_wedding(from_wedding_id)
    and exists (select 1 from public.vendors v
                where v.id = vendor_enquiries.vendor_id and v.status = 'approved')
  );

-- Couple side may only bump its "last seen" marker; vendor side may change
-- status + its own marker. Neither can re-point an enquiry.
create or replace function public.protect_enquiry_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_vendor boolean;
  seen timestamptz;
begin
  if not public.is_end_user() then
    return new;
  end if;

  select exists (select 1 from public.vendors v
                 where v.id = old.vendor_id and v.owner_id = auth.uid())
    into is_vendor;

  if is_vendor then
    new.vendor_id := old.vendor_id;
    new.from_wedding_id := old.from_wedding_id;
    new.couple := old.couple;
    new.date := old.date;
    new.event_date := old.event_date;
    new.city := old.city;
    new.functions := old.functions;
    new.budget := old.budget;
    new.message := old.message;
    new.couple_last_seen_at := old.couple_last_seen_at;
  else
    seen := new.couple_last_seen_at;
    new := old;
    new.couple_last_seen_at := seen;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_enquiry_columns on public.vendor_enquiries;
create trigger protect_enquiry_columns
  before update on public.vendor_enquiries
  for each row execute function public.protect_enquiry_columns();

-- Messages: read for both participants; write only as yourself; no edits.
drop policy if exists enq_msg_participants on public.enquiry_messages;
drop policy if exists enq_msg_read on public.enquiry_messages;
drop policy if exists enq_msg_insert on public.enquiry_messages;

create policy enq_msg_read on public.enquiry_messages for select
  using (
    exists (
      select 1 from public.vendor_enquiries e
      where e.id = enquiry_messages.enquiry_id
        and (
          exists (select 1 from public.vendors v
                  where v.id = e.vendor_id and v.owner_id = auth.uid())
          or public.can_access_wedding(e.from_wedding_id)
        )
    )
  );

create policy enq_msg_insert on public.enquiry_messages for insert
  with check (
    exists (
      select 1 from public.vendor_enquiries e
      where e.id = enquiry_messages.enquiry_id
        and (
          (enquiry_messages.sender = 'vendor'
           and exists (select 1 from public.vendors v
                       where v.id = e.vendor_id and v.owner_id = auth.uid()))
          or (enquiry_messages.sender = 'couple'
              and public.can_access_wedding(e.from_wedding_id))
        )
    )
  );

-- ── 5) Contact form: basic size limits against junk inserts ─────────────

drop policy if exists contact_public_insert on public.contact_submissions;
create policy contact_public_insert on public.contact_submissions
  for insert with check (
    handled = false
    and length(name) between 1 and 200
    and length(email) between 3 and 320
    and length(interest) <= 100
    and length(message) between 1 and 5000
  );

-- ── Review ──────────────────────────────────────────────────────────────
-- Before this migration anyone could have made themselves admin. Check this
-- list and demote anyone who shouldn't be here:
--   update public.profiles set role = 'couple' where id = '<uuid>';
select p.id, p.display_name, u.email, p.created_at
  from public.profiles p join auth.users u on u.id = p.id
 where p.role = 'admin'
 order by p.created_at;

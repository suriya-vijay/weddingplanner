-- 0014 · Couple collaboration — let a partner co-edit the SAME wedding.
--
-- Today `weddings.owner_id` is unique and every couple table's RLS keys to
-- `owner_id = auth.uid()`. This lets a second person (e.g. the groom in India)
-- be invited to the bride's wedding as a *collaborator* — their OWN login, no
-- shared credentials — and see/edit the same guests, budget, checklist,
-- timeline, seating, and enquiries.
--
-- ADDITIVE + IDEMPOTENT: new table + a security-definer helper, then each
-- couple policy is dropped-if-exists and recreated to allow owner OR
-- collaborator. Re-running is safe. The advisor stays OWNER-PRIVATE (it's
-- owner_id-direct with no wedding_id) — simplest and most private.

-- 1) Collaborators + pending invites (one table serves both).
create table if not exists public.wedding_collaborators (
  id           uuid primary key default gen_random_uuid(),
  wedding_id   uuid not null references public.weddings (id) on delete cascade,
  user_id      uuid references public.profiles (id) on delete cascade,  -- null until accepted
  invited_email text not null default '',
  token        text not null unique,
  status       text not null default 'pending',   -- 'pending' | 'accepted'
  created_at   timestamptz not null default now(),
  accepted_at  timestamptz
);
create index if not exists wedding_collaborators_wedding_idx on public.wedding_collaborators (wedding_id);
create index if not exists wedding_collaborators_user_idx    on public.wedding_collaborators (user_id);

alter table public.wedding_collaborators enable row level security;

-- 2) Access helper — true if auth.uid() OWNS the wedding OR is an ACCEPTED
--    collaborator on it. security definer + stable to avoid recursive RLS
--    (mirrors public.my_role() from 0001).
create or replace function public.can_access_wedding(wid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.weddings w
    where w.id = wid and w.owner_id = auth.uid()
  ) or exists (
    select 1 from public.wedding_collaborators c
    where c.wedding_id = wid
      and c.user_id = auth.uid()
      and c.status = 'accepted'
  );
$$;

-- 3) Collaborators-table RLS: anyone who can access the wedding may read its
--    collaborator rows; only the OWNER manages them.
drop policy if exists wcollab_read on public.wedding_collaborators;
create policy wcollab_read on public.wedding_collaborators for select
  using (public.can_access_wedding(wedding_id));

drop policy if exists wcollab_owner_write on public.wedding_collaborators;
create policy wcollab_owner_write on public.wedding_collaborators for all
  using (exists (select 1 from public.weddings w
                 where w.id = wedding_collaborators.wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w
                 where w.id = wedding_collaborators.wedding_id and w.owner_id = auth.uid()));

drop policy if exists wcollab_admin on public.wedding_collaborators;
create policy wcollab_admin on public.wedding_collaborators for all
  using (public.my_role() = 'admin');

-- 4) Rewrite every couple policy to allow owner OR collaborator via the helper.

-- weddings itself (was owner_id = auth.uid())
drop policy if exists wed_owner on public.weddings;
create policy wed_owner on public.weddings for all
  using (public.can_access_wedding(id))
  with check (public.can_access_wedding(id));

-- child tables (were: exists(... w.owner_id = auth.uid()))
drop policy if exists guests_owner on public.guests;
create policy guests_owner on public.guests for all
  using (public.can_access_wedding(wedding_id))
  with check (public.can_access_wedding(wedding_id));

drop policy if exists budget_owner on public.budget_items;
create policy budget_owner on public.budget_items for all
  using (public.can_access_wedding(wedding_id))
  with check (public.can_access_wedding(wedding_id));

drop policy if exists checklist_owner on public.checklist_items;
create policy checklist_owner on public.checklist_items for all
  using (public.can_access_wedding(wedding_id))
  with check (public.can_access_wedding(wedding_id));

drop policy if exists timeline_owner on public.timeline_milestones;
create policy timeline_owner on public.timeline_milestones for all
  using (public.can_access_wedding(wedding_id))
  with check (public.can_access_wedding(wedding_id));

drop policy if exists saved_owner on public.saved_inspiration;
create policy saved_owner on public.saved_inspiration for all
  using (public.can_access_wedding(wedding_id))
  with check (public.can_access_wedding(wedding_id));

drop policy if exists venue_owner on public.venue_layouts;
create policy venue_owner on public.venue_layouts for all
  using (public.can_access_wedding(wedding_id))
  with check (public.can_access_wedding(wedding_id));

-- Enquiries (couple side): couple may read/insert/update enquiries for a
-- wedding they can access. Vendor-side + admin policies are untouched.
drop policy if exists enq_couple_select on public.vendor_enquiries;
create policy enq_couple_select on public.vendor_enquiries for select
  using (public.can_access_wedding(from_wedding_id));

drop policy if exists enq_couple_insert on public.vendor_enquiries;
create policy enq_couple_insert on public.vendor_enquiries for insert
  with check (public.can_access_wedding(from_wedding_id));

drop policy if exists enq_couple_update on public.vendor_enquiries;
create policy enq_couple_update on public.vendor_enquiries for update
  using (public.can_access_wedding(from_wedding_id));

-- Enquiry chat messages: widen ONLY the couple branch to collaborators; the
-- vendor branch (v.owner_id = auth.uid()) is unchanged.
drop policy if exists enq_msg_participants on public.enquiry_messages;
create policy enq_msg_participants on public.enquiry_messages for all
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
  )
  with check (
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

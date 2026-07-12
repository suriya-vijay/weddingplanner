-- Batch 2 · Feature 1 — Vendor↔couple enquiry chat.
-- A message thread per enquiry so the couple and the owning vendor can talk.
-- ADDITIVE ONLY: new table + new couple SELECT policy on vendor_enquiries.
-- Existing enq_vendor / enq_couple_insert / enq_admin policies are untouched.

create table if not exists public.enquiry_messages (
  id           uuid primary key default gen_random_uuid(),
  enquiry_id   uuid not null references public.vendor_enquiries (id) on delete cascade,
  sender       text not null check (sender in ('couple', 'vendor')),
  body         text not null default '',
  created_at   timestamptz not null default now()
);

create index if not exists enquiry_messages_thread_idx
  on public.enquiry_messages (enquiry_id, created_at);

alter table public.enquiry_messages enable row level security;

-- A message is visible/insertable to whoever owns the parent enquiry — either
-- the owning vendor (via vendors.owner_id) or the couple (via the enquiry's
-- from_wedding_id → weddings.owner_id). Admin sees all.
drop policy if exists enq_msg_participants on public.enquiry_messages;
create policy enq_msg_participants on public.enquiry_messages for all
  using (
    exists (
      select 1 from public.vendor_enquiries e
      where e.id = enquiry_messages.enquiry_id
        and (
          exists (select 1 from public.vendors v
                  where v.id = e.vendor_id and v.owner_id = auth.uid())
          or exists (select 1 from public.weddings w
                     where w.id = e.from_wedding_id and w.owner_id = auth.uid())
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
          or exists (select 1 from public.weddings w
                     where w.id = e.from_wedding_id and w.owner_id = auth.uid())
        )
    )
  );

drop policy if exists enq_msg_admin on public.enquiry_messages;
create policy enq_msg_admin on public.enquiry_messages for all
  using (public.my_role() = 'admin');

-- NEW: let a couple SELECT their own enquiry rows (they only had INSERT before),
-- so they can view the thread they started. Existing policies unchanged.
drop policy if exists enq_couple_select on public.vendor_enquiries;
create policy enq_couple_select on public.vendor_enquiries for select
  using (
    from_wedding_id in (
      select id from public.weddings where owner_id = auth.uid()
    )
  );

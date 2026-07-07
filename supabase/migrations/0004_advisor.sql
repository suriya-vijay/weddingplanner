-- Stage 4 — AI Wedding Advisor: per-couple conversations + messages.
-- Couple-owned, RLS-scoped exactly like weddings/children. A conversation is
-- owned directly (owner_id); messages scope through their parent conversation.

create table public.advisor_conversations (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references public.profiles (id) on delete cascade,
  title      text not null default 'New conversation',
  created_at timestamptz not null default now()
);

create table public.advisor_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.advisor_conversations (id) on delete cascade,
  role            text not null default 'user',   -- 'user' | 'model'
  content         text not null default '',
  created_at      timestamptz not null default now()
);

create index advisor_messages_convo_idx
  on public.advisor_messages (conversation_id, created_at);

-- ── Row-Level Security ─────────────────────────────────────────
alter table public.advisor_conversations enable row level security;
alter table public.advisor_messages      enable row level security;

-- conversations: the owning couple; admin all.
create policy advisor_convo_owner on public.advisor_conversations for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy advisor_convo_admin on public.advisor_conversations for all
  using (public.my_role() = 'admin');

-- messages: scope through the parent conversation's owner.
create policy advisor_msg_owner on public.advisor_messages for all
  using (exists (
    select 1 from public.advisor_conversations c
    where c.id = advisor_messages.conversation_id and c.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.advisor_conversations c
    where c.id = advisor_messages.conversation_id and c.owner_id = auth.uid()
  ));
create policy advisor_msg_admin on public.advisor_messages for all
  using (public.my_role() = 'admin');

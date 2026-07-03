-- Stage 2 — Core data model + Row-Level Security.
-- Couple-side tables are private to the owning couple (+ admin). Vendor and
-- inspiration tables are a shared catalog: public read, owner/admin write.

-- ── Couple side ────────────────────────────────────────────────
create table public.weddings (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references public.profiles (id) on delete cascade,
  couple_names   text default '',
  partner_a      text default '',
  partner_b      text default '',
  date           date,
  city           text default '',
  venue          text default '',
  tradition      text default '',
  guest_estimate int default 0,
  total_budget   bigint default 0,
  created_at     timestamptz not null default now(),
  unique (owner_id)                       -- one wedding per couple
);

create table public.guests (
  id         uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  name       text not null default '',
  side       text not null default 'Bride',
  "group"    text not null default 'Guests',
  count      int  not null default 1,
  rsvp       text not null default 'Pending',
  meal       text not null default 'Veg',
  created_at timestamptz not null default now()
);

create table public.budget_items (
  id         uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  category   text not null default 'Other',
  label      text not null default '',
  estimated  bigint not null default 0,
  spent      bigint not null default 0,
  status     text not null default 'Not started',
  created_at timestamptz not null default now()
);

create table public.checklist_items (
  id         uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  task       text not null default '',
  phase      text not null default '12+ months',
  category   text not null default 'Planning',
  done       boolean not null default false,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

create table public.timeline_milestones (
  id         uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings (id) on delete cascade,
  title      text not null default '',
  detail     text not null default '',
  date       date,
  status     text not null default 'upcoming',
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

-- ── Vendor side (shared catalog) ───────────────────────────────
create table public.vendors (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references public.profiles (id) on delete set null, -- null = unclaimed
  slug          text unique not null,
  name          text not null,
  category      text not null default '',
  tagline       text default '',
  location      text default '',
  service_areas text[] default '{}',
  rating        numeric default 0,
  reviews       int default 0,
  starting_at   text default '',
  price_tier    text default '₹₹',
  verified      boolean default false,
  styles        text[] default '{}',
  about         text default '',
  instagram     text default '',
  website       text default '',
  availability  text default '',
  cover_plate   text default '',      -- gradient fallback
  logo_plate    text default '',
  gallery_plates text[] default '{}',
  cover_url     text,                 -- Stage 3 fills these
  logo_url      text,
  gallery_urls  text[] default '{}',
  created_at    timestamptz not null default now()
);

create table public.vendor_packages (
  id        uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  name      text not null default '',
  price     text not null default '',
  features  text[] default '{}',
  sort      int not null default 0
);

create table public.vendor_reviews (
  id        uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors (id) on delete cascade,
  author    text not null default '',
  rating    int not null default 5,
  text      text not null default '',
  wedding   text default '',
  created_at timestamptz not null default now()
);

create table public.vendor_enquiries (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid not null references public.vendors (id) on delete cascade,
  from_wedding_id uuid references public.weddings (id) on delete set null,
  couple          text default '',
  date            date default now(),
  event_date      date,
  city            text default '',
  functions       text default '',
  budget          text default '',
  status          text not null default 'New',
  message         text default '',
  created_at      timestamptz not null default now()
);

-- ── Admin-curated inspiration ──────────────────────────────────
create table public.inspiration_items (
  id        uuid primary key default gen_random_uuid(),
  title     text not null default '',
  ceremony  text default '',
  tradition text default '',
  color     text default '',
  budget    text default '',
  location  text default '',
  aspect    numeric default 1,
  plate     text default '',      -- gradient fallback
  image_url text,                 -- Stage 3
  vendors   text[] default '{}',  -- denormalized vendor-name tags (simple)
  sort      int not null default 0,
  created_at timestamptz not null default now()
);

create table public.saved_inspiration (
  wedding_id     uuid not null references public.weddings (id) on delete cascade,
  inspiration_id uuid not null references public.inspiration_items (id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (wedding_id, inspiration_id)
);

-- ── Row-Level Security ─────────────────────────────────────────
alter table public.weddings            enable row level security;
alter table public.guests              enable row level security;
alter table public.budget_items        enable row level security;
alter table public.checklist_items     enable row level security;
alter table public.timeline_milestones enable row level security;
alter table public.vendors             enable row level security;
alter table public.vendor_packages     enable row level security;
alter table public.vendor_reviews      enable row level security;
alter table public.vendor_enquiries    enable row level security;
alter table public.inspiration_items   enable row level security;
alter table public.saved_inspiration   enable row level security;

-- weddings: couple owns theirs; admin all
create policy wed_owner on public.weddings for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy wed_admin on public.weddings for all
  using (public.my_role() = 'admin');

-- child tables: scope through the parent wedding's owner. One helper predicate
-- pattern repeated per table.
create policy guests_owner on public.guests for all
  using (exists (select 1 from public.weddings w where w.id = guests.wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = guests.wedding_id and w.owner_id = auth.uid()));

create policy budget_owner on public.budget_items for all
  using (exists (select 1 from public.weddings w where w.id = budget_items.wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = budget_items.wedding_id and w.owner_id = auth.uid()));

create policy checklist_owner on public.checklist_items for all
  using (exists (select 1 from public.weddings w where w.id = checklist_items.wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = checklist_items.wedding_id and w.owner_id = auth.uid()));

create policy timeline_owner on public.timeline_milestones for all
  using (exists (select 1 from public.weddings w where w.id = timeline_milestones.wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = timeline_milestones.wedding_id and w.owner_id = auth.uid()));

create policy saved_owner on public.saved_inspiration for all
  using (exists (select 1 from public.weddings w where w.id = saved_inspiration.wedding_id and w.owner_id = auth.uid()))
  with check (exists (select 1 from public.weddings w where w.id = saved_inspiration.wedding_id and w.owner_id = auth.uid()));

-- vendors: PUBLIC read (marketplace); owner or admin write
create policy vendors_read on public.vendors for select using (true);
create policy vendors_owner on public.vendors for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy vendors_admin on public.vendors for all using (public.my_role() = 'admin');

-- vendor_packages / vendor_reviews: public read; write if you own the parent vendor (or admin)
create policy vpkg_read on public.vendor_packages for select using (true);
create policy vpkg_owner on public.vendor_packages for all
  using (exists (select 1 from public.vendors v where v.id = vendor_packages.vendor_id and v.owner_id = auth.uid()))
  with check (exists (select 1 from public.vendors v where v.id = vendor_packages.vendor_id and v.owner_id = auth.uid()));
create policy vpkg_admin on public.vendor_packages for all using (public.my_role() = 'admin');

create policy vrev_read on public.vendor_reviews for select using (true);
create policy vrev_admin on public.vendor_reviews for all using (public.my_role() = 'admin');

-- enquiries: the owning vendor reads/updates; a couple may INSERT a lead
create policy enq_vendor on public.vendor_enquiries for all
  using (exists (select 1 from public.vendors v where v.id = vendor_enquiries.vendor_id and v.owner_id = auth.uid()));
create policy enq_couple_insert on public.vendor_enquiries for insert
  with check (from_wedding_id in (select id from public.weddings where owner_id = auth.uid()));
create policy enq_admin on public.vendor_enquiries for all using (public.my_role() = 'admin');

-- inspiration: PUBLIC read (gallery); admin write
create policy insp_read on public.inspiration_items for select using (true);
create policy insp_admin on public.inspiration_items for all using (public.my_role() = 'admin');

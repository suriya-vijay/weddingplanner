-- Stage 3 — Storage: image upload for inspiration + vendor media.
-- Two public-read buckets. Writes are restricted:
--   • inspiration   → admin only (matches the admin-curated content model)
--   • vendor-media  → the vendor owner, keyed on the first path folder = auth.uid()
--
-- Path conventions (enforced by the policies below):
--   inspiration/<anything>.<ext>            (admin writes)
--   vendor-media/<auth.uid()>/<file>.<ext>  (owner writes; folder 1 = user id)

-- ── Buckets (public read) ──────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('inspiration', 'inspiration', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('vendor-media', 'vendor-media', true)
on conflict (id) do update set public = true;

-- ── Policies on storage.objects ────────────────────────────────
-- Public read for both buckets (marketplace + gallery show images to anyone).
drop policy if exists "public read inspiration" on storage.objects;
create policy "public read inspiration" on storage.objects
  for select using (bucket_id = 'inspiration');

drop policy if exists "public read vendor-media" on storage.objects;
create policy "public read vendor-media" on storage.objects
  for select using (bucket_id = 'vendor-media');

-- inspiration: admin-only writes (insert / update / delete).
drop policy if exists "admin write inspiration" on storage.objects;
create policy "admin write inspiration" on storage.objects
  for all
  using (bucket_id = 'inspiration' and public.my_role() = 'admin')
  with check (bucket_id = 'inspiration' and public.my_role() = 'admin');

-- vendor-media: a vendor writes only under their own <auth.uid()>/ folder.
-- (storage.foldername(name))[1] is the first path segment.
drop policy if exists "owner write vendor-media" on storage.objects;
create policy "owner write vendor-media" on storage.objects
  for all
  using (
    bucket_id = 'vendor-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'vendor-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins may also manage vendor media (support / moderation).
drop policy if exists "admin write vendor-media" on storage.objects;
create policy "admin write vendor-media" on storage.objects
  for all
  using (bucket_id = 'vendor-media' and public.my_role() = 'admin')
  with check (bucket_id = 'vendor-media' and public.my_role() = 'admin');

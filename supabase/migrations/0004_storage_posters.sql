-- Storage bucket for event posters.
-- Public read so <img src> works without signed URLs.
-- Writes happen only via service_role (admin server action) — RLS bypasses.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'posters',
  'posters',
  true,
  10 * 1024 * 1024,
  array['image/png','image/jpeg','image/webp','image/avif','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Posters public read" on storage.objects;
create policy "Posters public read" on storage.objects
  for select using (bucket_id = 'posters');

-- Advisor follow-ups for 0001.
-- 1. Signed-in teachers already read everything, so the "published only"
--    policies only need to cover anon (avoids two permissive SELECT policies).
-- 2. Index the created_by foreign key.

drop policy if exists "Anyone reads published lessons" on public.lessons;
create policy "Anyone reads published lessons" on public.lessons
  for select to anon
  using (published);

drop policy if exists "Anyone reads files of published lessons" on storage.objects;
create policy "Anyone reads files of published lessons" on storage.objects
  for select to anon
  using (
    bucket_id = 'lessons'
    and exists (
      select 1 from public.lessons l
      where l.storage_path = storage.objects.name and l.published
    )
  );

create index if not exists lessons_created_by_idx on public.lessons (created_by);

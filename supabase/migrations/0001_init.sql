-- Fragen: lessons table + private storage bucket.
-- Run once in the Supabase SQL editor (or with `supabase db push`).

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 1 and 120),
  description text check (char_length(description) <= 500),
  topic text check (char_length(topic) <= 40),
  storage_path text not null unique,
  file_name text not null,
  file_size integer not null check (file_size > 0),
  published boolean not null default true,
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lessons_published_created_idx
  on public.lessons (published, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lessons_touch on public.lessons;
create trigger lessons_touch before update on public.lessons
  for each row execute function public.touch_updated_at();

alter table public.lessons enable row level security;

-- Students (anonymous) see published lessons only.
drop policy if exists "Anyone reads published lessons" on public.lessons;
create policy "Anyone reads published lessons" on public.lessons
  for select to anon, authenticated
  using (published);

-- Teachers (any signed-in user; accounts are created by hand, sign-up is off).
drop policy if exists "Teachers read all lessons" on public.lessons;
create policy "Teachers read all lessons" on public.lessons
  for select to authenticated using (true);

drop policy if exists "Teachers insert lessons" on public.lessons;
create policy "Teachers insert lessons" on public.lessons
  for insert to authenticated with check (true);

drop policy if exists "Teachers update lessons" on public.lessons;
create policy "Teachers update lessons" on public.lessons
  for update to authenticated using (true) with check (true);

drop policy if exists "Teachers delete lessons" on public.lessons;
create policy "Teachers delete lessons" on public.lessons
  for delete to authenticated using (true);

-- Private bucket: no public URLs. Files are read through the app.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lessons', 'lessons', false, 5242880, array['text/html'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone reads files of published lessons" on storage.objects;
create policy "Anyone reads files of published lessons" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'lessons'
    and exists (
      select 1 from public.lessons l
      where l.storage_path = storage.objects.name and l.published
    )
  );

drop policy if exists "Teachers read lesson files" on storage.objects;
create policy "Teachers read lesson files" on storage.objects
  for select to authenticated using (bucket_id = 'lessons');

drop policy if exists "Teachers upload lesson files" on storage.objects;
create policy "Teachers upload lesson files" on storage.objects
  for insert to authenticated with check (bucket_id = 'lessons');

drop policy if exists "Teachers update lesson files" on storage.objects;
create policy "Teachers update lesson files" on storage.objects
  for update to authenticated using (bucket_id = 'lessons');

drop policy if exists "Teachers delete lesson files" on storage.objects;
create policy "Teachers delete lesson files" on storage.objects
  for delete to authenticated using (bucket_id = 'lessons');

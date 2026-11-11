-- Short share codes: every lesson gets a 5-character code, so the link teachers
-- share is fragen.sndyy.id/k3x9q instead of the long readable slug.
-- Alphabet skips look-alikes (0/o, 1/l/i) so codes are easy to copy from a board.

create or replace function public.generate_lesson_code()
returns text
language plpgsql
set search_path = ''
as $$
declare
  alphabet constant text := '23456789abcdefghjkmnpqrstuvwxyz';
  candidate text;
begin
  loop
    candidate := '';
    for i in 1..5 loop
      candidate := candidate || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.lessons where code = candidate);
  end loop;
  return candidate;
end;
$$;

alter table public.lessons add column if not exists code text;

update public.lessons set code = public.generate_lesson_code() where code is null;

alter table public.lessons alter column code set default public.generate_lesson_code();
alter table public.lessons alter column code set not null;

create unique index if not exists lessons_code_key on public.lessons (code);

alter table public.lessons drop constraint if exists lessons_code_format;
alter table public.lessons add constraint lessons_code_format check (code ~ '^[2-9a-hjkmnp-z]{5}$');

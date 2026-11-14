create extension if not exists "pgcrypto";

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question text not null check (char_length(question) between 1 and 4000),
  language text not null default 'English',
  farm_context jsonb not null default '{}'::jsonb,
  photo_path text,
  created_at timestamptz not null default now()
);

create index if not exists questions_user_created_idx on public.questions (user_id, created_at desc);
alter table public.questions enable row level security;

grant usage on schema public to authenticated;
grant select, insert on table public.questions to authenticated;

create policy "Users can read their own questions" on public.questions for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create their own questions" on public.questions for insert to authenticated with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('crop-photos', 'crop-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Users can upload their own crop photos" on storage.objects for insert to authenticated
with check (bucket_id = 'crop-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

notify pgrst, 'reload schema';

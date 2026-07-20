-- =============================================
-- VIBE-A-THONS TABLE
-- Run this in Supabase SQL Editor (in addition to the original supabase-schema.sql)
-- =============================================

create table if not exists public.vibe_a_thons (
  id uuid default gen_random_uuid() primary key,
  theme text not null,
  description text not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  first_prize integer not null default 0,
  second_prize integer not null default 0,
  third_prize integer not null default 0,
  created_at timestamp with time zone default now()
);

alter table public.vibe_a_thons enable row level security;

create policy "Vibe-a-thons are viewable by everyone"
  on public.vibe_a_thons for select using (true);

-- Link project submissions to the vibe-a-thon they were entered in
alter table public.projects
  add column if not exists vibe_a_thon_id uuid references public.vibe_a_thons(id) on delete set null;

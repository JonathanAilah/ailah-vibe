-- ==============================================
-- FUND SETTINGS — scholarship fund tracker on the home page
-- Run this in Supabase SQL Editor
-- ==============================================

-- Single-row table storing the current fund state.
-- The check constraint ensures only one row can ever exist.
create table if not exists public.fund_settings (
  id integer primary key default 1,
  goal_amount integer not null default 20000,        -- Total goal ($20,000)
  offline_raised integer not null default 0,          -- Donations received outside Stripe (checks, wire transfers, matching gifts)
  cohort_spots_total integer not null default 50,     -- How many scholarships available this cohort
  cohort_spots_funded integer not null default 0,     -- How many have been funded
  updated_at timestamp with time zone default now(),
  constraint single_row check (id = 1)
);

-- Seed the single row (only inserts if it doesn't already exist)
insert into public.fund_settings (id, goal_amount, offline_raised, cohort_spots_total, cohort_spots_funded)
values (1, 20000, 0, 50, 0)
on conflict (id) do nothing;

alter table public.fund_settings enable row level security;

-- Anyone can read the fund status (used on the home page)
drop policy if exists "Fund settings are viewable by everyone" on public.fund_settings;
create policy "Fund settings are viewable by everyone"
  on public.fund_settings for select using (true);

-- =============================================
-- VIBE CODEN — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- Go to: supabase.com → Your Project → SQL Editor → New Query
-- =============================================

-- ── PROFILES ──
-- Stores extra user info beyond what Supabase auth provides
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  username text unique not null,
  email text not null,
  age integer not null,
  city text not null,
  state text not null,
  level integer default 1,
  xp integer default 0,
  streak integer default 0,
  created_at timestamp with time zone default now()
);

-- ── PROJECTS ──
-- Stores vibe-a-thon project submissions
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text check (category in ('App', 'Game', 'Site')) not null,
  votes integer default 0,
  submitted_at timestamp with time zone default now()
);

-- ── VOTES ──
-- Tracks who voted on what (one vote per user per project)
create table if not exists public.votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  voted_at timestamp with time zone default now(),
  unique(user_id, project_id) -- prevents double voting
);

-- ── SCHOLARSHIP APPLICATIONS ──
-- Stores scholarship applications from students
create table if not exists public.scholarship_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  full_name text not null,
  email text not null,
  age integer not null,
  city text not null,
  state text not null,
  goal text not null,
  story text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'funded')),
  applied_at timestamp with time zone default now()
);

-- ── DONATIONS ──
-- Records donations to scholarships (Stripe will fill this)
create table if not exists public.donations (
  id uuid default gen_random_uuid() primary key,
  donor_email text not null,
  amount_cents integer not null,
  scholarship_id text, -- 'general' or scholarship application id
  stripe_payment_id text,
  donated_at timestamp with time zone default now()
);

-- ── ORDERS ──
-- Stores merch orders from the shop (Stripe will fill this)
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  items jsonb not null,
  total_cents integer not null,
  stripe_payment_id text,
  status text default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered')),
  ordered_at timestamp with time zone default now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Protects data so users can only see their own
-- =============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.votes enable row level security;
alter table public.scholarship_applications enable row level security;
alter table public.donations enable row level security;
alter table public.orders enable row level security;

-- PROFILES: Users can read all profiles, only edit their own
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- PROJECTS: Anyone can read, only owner can insert/update/delete
create policy "Projects are viewable by everyone"
  on public.projects for select using (true);

create policy "Users can submit their own projects"
  on public.projects for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update using (auth.uid() = user_id);

-- VOTES: Anyone can read vote counts, users can only insert their own
create policy "Votes are viewable by everyone"
  on public.votes for select using (true);

create policy "Users can vote once per project"
  on public.votes for insert with check (auth.uid() = user_id);

-- SCHOLARSHIP APPLICATIONS: Users can read and submit their own
create policy "Users can view their own applications"
  on public.scholarship_applications for select using (auth.uid() = user_id);

create policy "Users can submit applications"
  on public.scholarship_applications for insert with check (auth.uid() = user_id);

-- DONATIONS: Public insert (donors may not be logged in), private read
create policy "Anyone can donate"
  on public.donations for insert with check (true);

-- ORDERS: Users can see their own orders
create policy "Users can view their own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users can place orders"
  on public.orders for insert with check (auth.uid() = user_id);

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- Triggers when a new user signs up via Supabase auth
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username, email, age, city, state)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Builder'),
    coalesce(new.raw_user_meta_data->>'username', 'builder_' || substr(new.id::text, 1, 8)),
    new.email,
    coalesce((new.raw_user_meta_data->>'age')::integer, 16),
    coalesce(new.raw_user_meta_data->>'city', ''),
    coalesce(new.raw_user_meta_data->>'state', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Run the function after every new signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

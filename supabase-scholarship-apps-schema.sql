-- ==============================================
-- SCHOLARSHIP APPLICATIONS — additional fields
-- Run this in Supabase SQL Editor
-- ==============================================

-- Add parent/guardian info (students are minors)
alter table public.scholarship_applications
  add column if not exists parent_name text,
  add column if not exists parent_email text,
  add column if not exists heard_about text;

-- Allow anonymous applications (in case a student applies before creating an account)
alter table public.scholarship_applications
  alter column user_id drop not null;

-- Add a public insert policy so the form can submit
drop policy if exists "Anyone can submit scholarship applications" on public.scholarship_applications;
create policy "Anyone can submit scholarship applications"
  on public.scholarship_applications for insert with check (true);

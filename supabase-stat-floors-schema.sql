-- ==============================================
-- IMPACT STATS — display floors
-- Run this in Supabase SQL Editor
-- These are baseline numbers shown on the home page and vibe-a-thons page.
-- Actual counts from the database will override any floor once they exceed it.
-- ==============================================

alter table public.fund_settings
  add column if not exists students_floor integer not null default 12480,
  add column if not exists projects_shipped_floor integer not null default 1204,
  add column if not exists prizes_awarded_floor integer not null default 48200,
  add column if not exists scholarships_awarded_floor integer not null default 214;

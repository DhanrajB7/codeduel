-- Run this in your Supabase SQL Editor
-- Creates the CodeDuel rooms table

create table public.codeduel_rooms (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  problem_id integer not null,
  status text not null default 'waiting' check (status in ('waiting', 'countdown', 'playing', 'finished')),
  player1_id text not null,
  player1_name text not null,
  player2_id text,
  player2_name text,
  player1_code text,
  player2_code text,
  player1_tests_passed integer default 0,
  player2_tests_passed integer default 0,
  player1_total_tests integer default 0,
  player2_total_tests integer default 0,
  player1_submitted boolean default false,
  player2_submitted boolean default false,
  player1_submit_time timestamptz,
  player2_submit_time timestamptz,
  winner text,
  time_limit integer default 300,
  started_at timestamptz,
  created_at timestamptz default now()
);

-- Index for fast room lookups by code
create index idx_codeduel_rooms_code on public.codeduel_rooms(code);

-- Disable RLS for simplicity (no auth)
alter table public.codeduel_rooms disable row level security;

-- Enable realtime for this table
alter publication supabase_realtime add table public.codeduel_rooms;

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  current_streak integer not null default 0 check (current_streak >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, date)
);

create index if not exists habits_user_id_created_at_idx
  on public.habits (user_id, created_at desc);

create index if not exists habit_logs_habit_id_date_idx
  on public.habit_logs (habit_id, date);

alter table public.users disable row level security;
alter table public.habits disable row level security;
alter table public.habit_logs disable row level security;


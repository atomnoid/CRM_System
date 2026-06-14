-- Run this in the Supabase SQL Editor after creating a project.

create extension if not exists "pgcrypto";

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class text not null,
  monthly_fee numeric not null,
  fee_paid boolean not null default false,
  paid_till_month text,
  created_at timestamptz not null default now()
);

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  monthly_salary numeric not null,
  created_at timestamptz not null default now()
);

alter table public.students enable row level security;
alter table public.teachers enable row level security;

create policy "Allow public read access on students"
  on public.students for select
  using (true);

create policy "Allow public insert on students"
  on public.students for insert
  with check (true);

create policy "Allow public update on students"
  on public.students for update
  using (true);

create policy "Allow public delete on students"
  on public.students for delete
  using (true);

create policy "Allow public read access on teachers"
  on public.teachers for select
  using (true);

create policy "Allow public insert on teachers"
  on public.teachers for insert
  with check (true);

create policy "Allow public update on teachers"
  on public.teachers for update
  using (true);

create policy "Allow public delete on teachers"
  on public.teachers for delete
  using (true);

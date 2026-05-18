create extension if not exists "pgcrypto";

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  photo_path text null,
  full_name text not null,
  gender text null,
  date_of_birth date null,
  address text null,
  card_number text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_employees_updated_at on public.employees;

create trigger set_employees_updated_at
before update on public.employees
for each row
execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('employee-photos', 'employee-photos', false)
on conflict (id) do update
set public = false;

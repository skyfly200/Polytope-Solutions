-- Clients and projects: the first slice of the CRM / project tracker.
-- Quotes, time entries, notes and invoices will reference projects.id later.

create table clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  company     text,
  email       text,
  industry    text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table projects (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references clients (id) on delete restrict,
  name         text not null,
  description  text,
  status       text not null default 'lead'
               check (status in ('lead', 'quoted', 'active', 'on_hold', 'completed', 'cancelled')),
  start_date   date,
  due_date     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index projects_client_id_idx on projects (client_id);

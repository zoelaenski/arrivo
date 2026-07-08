-- Run this in Supabase: Dashboard → SQL Editor → New query

create table invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  client_name text not null,
  description text,
  amount_usdc numeric(12, 2) not null,

  recipient_wallet text not null,
  reference_pubkey text not null unique,

  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue')),
  due_date date,

  created_at timestamptz not null default now(),
  paid_at timestamptz
);

-- Enable Row Level Security so users can only see their own invoices
alter table invoices enable row level security;

create policy "Users can view their own invoices"
  on invoices for select
  using (auth.uid() = user_id);

create policy "Users can insert their own invoices"
  on invoices for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own invoices"
  on invoices for update
  using (auth.uid() = user_id);

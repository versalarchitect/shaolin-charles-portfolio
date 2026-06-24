-- Owner-only freelance invoicing tool (charlesjackson.dev/app/invoicing).
-- Single user (the site owner). RLS restricts every table to the admin emails — the same gate as
-- get_access_tier() — so only Charles can read/write. Amounts are NUMERIC(12,2) in the item's
-- stated currency; the CAD-equivalent + taxes are computed at invoice time.

-- Owner check (invoker rights, so auth.jwt() is the CALLER's — do not mark SECURITY DEFINER).
create or replace function invoice_is_owner() returns boolean
language sql stable as $$
  select coalesce(auth.jwt()->>'email', '') in ('charles@predictive.company', 'charlesdotdirect@gmail.com')
$$;

-- Freelancer identity (singleton row id='me') + the GST/QST registration numbers shown on invoices.
create table if not exists invoice_settings (
  id            text primary key default 'me',
  business_name text not null default 'Charles Jackson',
  address       text,
  email         text,
  gst_number    text,  -- TPS (GST/HST)
  qst_number    text,  -- TVQ (QST)
  gst_rate      numeric(6,5) not null default 0.05000,
  qst_rate      numeric(6,5) not null default 0.09975,
  updated_at    timestamptz not null default now()
);

create table if not exists invoice_clients (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text unique not null,          -- URL segment: /app/invoicing/<slug>
  legal_name       text,
  address          text,
  email            text,
  pay_cadence      text not null default 'biweekly',
  invoice_prefix   text,                           -- e.g. 'MH'
  next_invoice_seq integer not null default 1,
  created_at       timestamptz not null default now()
);

-- The "base": the current stack of recurring line-items for a client.
create table if not exists invoice_base_items (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references invoice_clients(id) on delete cascade,
  label      text not null,
  amount     numeric(12,2) not null,
  currency   text not null default 'CAD',          -- CAD | USD (USD shown as CAD-equiv at invoice time)
  active     boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists invoice_base_items_client_idx on invoice_base_items(client_id);

-- Every base adjustment, with its "why" — drives the descriptive rows + the audit trail.
create table if not exists invoice_base_changes (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references invoice_clients(id) on delete cascade,
  base_item_id uuid references invoice_base_items(id) on delete set null,
  label        text not null,
  delta_amount numeric(12,2) not null,
  currency     text not null default 'CAD',
  reason       text,
  created_at   timestamptz not null default now()
);
create index if not exists invoice_base_changes_client_idx on invoice_base_changes(client_id);

create table if not exists invoices (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references invoice_clients(id) on delete cascade,
  number       text not null,
  issue_date   date not null default current_date,
  period_start date,
  period_end   date,
  status       text not null default 'draft',      -- draft | sent | paid
  fx_usd_cad   numeric(10,5),
  subtotal_cad numeric(12,2) not null default 0,
  gst          numeric(12,2) not null default 0,
  qst          numeric(12,2) not null default 0,
  total_cad    numeric(12,2) not null default 0,
  notes        text,
  created_at   timestamptz not null default now()
);
create index if not exists invoices_client_idx on invoices(client_id);

create table if not exists invoice_line_items (
  id         uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  label      text not null,
  amount_cad numeric(12,2) not null,
  source     text not null default 'base',         -- base | adjustment | oneoff
  note       text,
  sort_order integer not null default 0
);
create index if not exists invoice_line_items_invoice_idx on invoice_line_items(invoice_id);

-- RLS: owner-only (authenticated as an admin email) + service_role.
do $$
declare t text;
begin
  foreach t in array array['invoice_settings','invoice_clients','invoice_base_items','invoice_base_changes','invoices','invoice_line_items']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I on %I', t || '_owner', t);
    execute format('create policy %I on %I for all to authenticated using (invoice_is_owner()) with check (invoice_is_owner())', t || '_owner', t);
    execute format('drop policy if exists %I on %I', t || '_service', t);
    execute format('create policy %I on %I for all to service_role using (true) with check (true)', t || '_service', t);
  end loop;
end $$;

-- Seed: owner identity (the given tax numbers) + MicroHabitat + its current base.
insert into invoice_settings (id, business_name, gst_number, qst_number)
values ('me', 'Charles Jackson', '706018702 RT0001', '4017555621 TQ0001')
on conflict (id) do update set gst_number = excluded.gst_number, qst_number = excluded.qst_number;

insert into invoice_clients (name, slug, pay_cadence, invoice_prefix)
values ('MicroHabitat', 'microhabitat', 'biweekly', 'MH')
on conflict (slug) do nothing;

insert into invoice_base_items (client_id, label, amount, currency, sort_order)
select c.id, x.label, x.amount, x.currency, x.sort_order
from invoice_clients c,
  (values
    ('Research and development', 5000.00, 'CAD', 1),
    ('Visuals and signage', 350.00, 'CAD', 2),
    ('Marketing', 250.00, 'USD', 3)
  ) as x(label, amount, currency, sort_order)
where c.slug = 'microhabitat'
  and not exists (select 1 from invoice_base_items bi where bi.client_id = c.id);

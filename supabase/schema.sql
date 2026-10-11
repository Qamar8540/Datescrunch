-- DatesCrunch database schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
--
-- Admin login uses Supabase Auth (auth.users) — no separate `admins` table
-- and no manually-stored passwords. After running this file, create the one
-- admin user from Supabase Dashboard → Authentication → Users → Add user.

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references categories (id) on delete set null,
  price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  stock_qty integer not null default 0,
  video_url text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_id_idx on products (category_id);

-- ---------------------------------------------------------------------
-- product_images  (multiple images per product, ordered)
-- ---------------------------------------------------------------------
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0
);

create index product_images_product_id_idx on product_images (product_id);

-- ---------------------------------------------------------------------
-- orders  (COD only — no payment_status/payment_id columns for now)
-- ---------------------------------------------------------------------
create type order_status as enum (
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_no bigserial unique,
  customer_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  pincode text not null,
  notes text,
  status order_status not null default 'pending',
  total_amount numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- order_items  (snapshot name/price so later product edits don't rewrite history)
-- ---------------------------------------------------------------------
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name_snapshot text not null,
  price_snapshot numeric(10, 2) not null,
  quantity integer not null
);

create index order_items_order_id_idx on order_items (order_id);

-- ---------------------------------------------------------------------
-- settings  (simple key/value store — whatsapp number, store info, etc.)
-- ---------------------------------------------------------------------
create table settings (
  key text primary key,
  value text
);

insert into settings (key, value) values
  ('whatsapp_number', ''),
  ('store_name', 'DatesCrunch'),
  ('store_phone', ''),
  ('store_email', ''),
  ('store_address', ''),
  ('store_description', '');

-- ---------------------------------------------------------------------
-- Row Level Security
-- Public (anon) visitors may only READ active catalog data. Orders are
-- never inserted directly by the browser — they go through the
-- place_order() function below, which validates stock/pricing safely.
-- Everything else requires an authenticated admin session.
-- ---------------------------------------------------------------------
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table settings enable row level security;

create policy "Public can read categories"
  on categories for select
  using (true);

create policy "Public can read active products"
  on products for select
  using (is_active = true);

create policy "Public can read product images"
  on product_images for select
  using (true);

create policy "Public can read settings"
  on settings for select
  using (true);

-- Authenticated admin (any logged-in Supabase Auth user — there is only
-- one, the store owner) gets full read/write access everywhere.
create policy "Admin full access categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access product_images"
  on product_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access orders"
  on orders for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access order_items"
  on order_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access settings"
  on settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed initial categories
insert into categories (name, slug) values
  ('Dates', 'dates'),
  ('Dry Fruits', 'dry-fruits'),
  ('Gift Packs / Combos', 'gift-packs');

-- ---------------------------------------------------------------------
-- place_order(): the only way an order gets created. Runs as a trusted
-- "security definer" so an anonymous checkout can safely validate stock,
-- compute the total from real database prices, and decrement stock —
-- without needing broad write access to these tables. See
-- migrations/003_place_order_function.sql for the full explanation.
-- ---------------------------------------------------------------------
create or replace function place_order(
  p_customer_name text,
  p_phone text,
  p_address text,
  p_city text,
  p_pincode text,
  p_notes text,
  p_items jsonb
)
returns table (order_id uuid, order_no bigint, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_total numeric(10,2) := 0;
  v_item jsonb;
  v_product products%rowtype;
  v_qty integer;
  v_unit_price numeric(10,2);
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty.';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::int;

    select * into v_product from products
      where id = (v_item->>'product_id')::uuid
      and is_active = true
      for update;

    if not found then
      raise exception 'One of the items in your cart is no longer available.';
    end if;

    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity for %.', v_product.name;
    end if;

    if v_product.stock_qty < v_qty then
      raise exception 'Only % left in stock for %.', v_product.stock_qty, v_product.name;
    end if;

    v_unit_price := coalesce(v_product.discount_price, v_product.price);
    v_total := v_total + (v_unit_price * v_qty);
  end loop;

  insert into orders (customer_name, phone, address, city, pincode, notes, status, total_amount)
  values (p_customer_name, p_phone, p_address, p_city, p_pincode, p_notes, 'pending', v_total)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::int;

    select * into v_product from products where id = (v_item->>'product_id')::uuid;
    v_unit_price := coalesce(v_product.discount_price, v_product.price);

    insert into order_items (order_id, product_id, product_name_snapshot, price_snapshot, quantity)
    values (v_order_id, v_product.id, v_product.name, v_unit_price, v_qty);

    update products
      set stock_qty = stock_qty - v_qty, updated_at = now()
      where id = v_product.id;
  end loop;

  return query
    select o.id, o.order_no, o.created_at from orders o where o.id = v_order_id;
end;
$$;

grant execute on function place_order(text, text, text, text, text, text, jsonb)
  to anon, authenticated;

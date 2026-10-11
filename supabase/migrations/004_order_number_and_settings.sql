-- Run this in the Supabase SQL Editor if your database is from Phase 4
-- or earlier. Fresh installs: schema.sql already includes all of this.
--
-- What changed and why:
-- 1. place_order() now also returns the order's created_at timestamp, so
--    the app can build a readable order number like DC-20260929-0001
--    (date + sequence) instead of just DC-000001. The underlying
--    `order_no` sequence from Phase 4 is unchanged — this only adds a
--    date prefix at display time, computed from the real order date.
--    Postgres doesn't allow changing a function's return columns with
--    CREATE OR REPLACE, so we drop and recreate it.
-- 2. Two new Settings rows so the admin can manage a phone number and a
--    short business description separately from the WhatsApp number —
--    the `settings` table is a plain key/value store, so this is just
--    two inserted rows, not a schema change.

drop function if exists place_order(text, text, text, text, text, text, jsonb);

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

-- New settings keys (safe no-op if they already exist).
insert into settings (key, value)
  values ('store_phone', ''), ('store_description', '')
  on conflict (key) do nothing;

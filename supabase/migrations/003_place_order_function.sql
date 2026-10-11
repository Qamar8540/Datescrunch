-- Run this in the Supabase SQL Editor if your database already exists
-- from Phase 1/2/3. Fresh installs: schema.sql already includes this.
--
-- Why a function instead of letting the browser insert rows directly:
-- checkout is used by anonymous visitors (no login), so they only have the
-- public "anon" role. That role can read active products but must NOT be
-- able to write to `orders`/`products` directly, or a malicious client
-- could submit fake prices or oversell stock. This function runs as a
-- trusted "security definer", validates everything server-side, and is the
-- ONLY way an anonymous visitor can create an order.

-- 1. Human-friendly, sequential order number.
alter table orders add column if not exists order_no bigserial unique;

-- 2. The direct public INSERT policies from schema.sql are no longer
-- needed (and are a gap) now that place_order() below handles it safely.
drop policy if exists "Public can create orders" on orders;
drop policy if exists "Public can create order items" on order_items;

-- 3. Atomic checkout: validates stock, computes the total from the
-- database (never trusts a client-supplied price), inserts the order +
-- items, and decrements stock — all in one transaction with row locks so
-- two simultaneous orders can't oversell the same product.
create or replace function place_order(
  p_customer_name text,
  p_phone text,
  p_address text,
  p_city text,
  p_pincode text,
  p_notes text,
  p_items jsonb -- [{ "product_id": "...", "quantity": 2 }, ...]
)
returns table (order_id uuid, order_no bigint)
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

  -- Pass 1: lock each product row and validate stock/availability.
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

  -- Pass 2: insert line items (snapshotting name/price) and decrement stock.
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
    select o.id, o.order_no from orders o where o.id = v_order_id;
end;
$$;

-- Anonymous visitors and signed-in admins both need to call this.
grant execute on function place_order(text, text, text, text, text, text, jsonb)
  to anon, authenticated;

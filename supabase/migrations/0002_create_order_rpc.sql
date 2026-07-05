-- ============================================================================
-- Migration 0002: secure checkout via RPC
-- ----------------------------------------------------------------------------
-- The storefront (anon) must create an order + items and get back the order
-- number, WITHOUT being able to read the orders table (customer data stays
-- private). A SECURITY DEFINER function does the writes server-side and returns
-- only the generated order number. The existing apply_order_item_stock trigger
-- still fires on each item insert to decrement stock.
-- ============================================================================

create or replace function public.create_order(
  p_customer  jsonb,   -- {name,email,phone,address,city,state,postal_code,country,payment_method}
  p_items     jsonb,   -- [{product_id?|slug?, name, unit_price, quantity}]
  p_subtotal  numeric,
  p_shipping  numeric,
  p_total     numeric
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_number   text;
  it         jsonb;
  v_pid      uuid;
begin
  insert into orders (
    customer_name, customer_email, customer_phone, address, city, state,
    postal_code, country, payment_method, status, subtotal, shipping, total
  ) values (
    coalesce(nullif(p_customer->>'name',''), 'Cliente'),
    coalesce(p_customer->>'email',''),
    coalesce(p_customer->>'phone',''),
    coalesce(p_customer->>'address',''),
    coalesce(p_customer->>'city',''),
    coalesce(p_customer->>'state',''),
    coalesce(p_customer->>'postal_code',''),
    coalesce(p_customer->>'country',''),
    coalesce(p_customer->>'payment_method',''),
    'paid',
    coalesce(p_subtotal, 0),
    coalesce(p_shipping, 0),
    coalesce(p_total, 0)
  )
  returning id, order_number into v_order_id, v_number;

  for it in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  loop
    v_pid := null;
    if (it ? 'product_id') and coalesce(it->>'product_id','') <> '' then
      v_pid := (it->>'product_id')::uuid;
    elsif (it ? 'slug') and coalesce(it->>'slug','') <> '' then
      select id into v_pid from products where slug = it->>'slug' limit 1;
    end if;

    insert into order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
    values (
      v_order_id,
      v_pid,
      coalesce(nullif(it->>'name',''), 'Producto'),
      coalesce((it->>'unit_price')::numeric, 0),
      coalesce((it->>'quantity')::int, 1),
      coalesce((it->>'line_total')::numeric,
               coalesce((it->>'unit_price')::numeric,0) * coalesce((it->>'quantity')::int,1))
    );
  end loop;

  return v_number;
end;
$$;

grant execute on function public.create_order(jsonb, jsonb, numeric, numeric, numeric) to anon, authenticated;

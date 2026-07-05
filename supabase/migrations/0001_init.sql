-- ============================================================================
-- Don Pepe Business — Store & Accounting Platform
-- Migration 0001: schema, security (RLS) and seed data
-- ----------------------------------------------------------------------------
-- Model:
--   categories          product groupings (import / seafood / atm ...)
--   products            catalog read by the public store, managed in /admin
--   orders + items      persisted checkouts (auditable sales)
--   inventory_movements stock audit trail (entradas/salidas/ajustes)
--   ledger_entries      general ledger: income & expenses
--
-- Security model (single admin role):
--   * anon (public store) can READ active products & categories,
--     and can INSERT orders + order_items (checkout).
--   * authenticated users (the store owners) can do everything.
--   Only owners have accounts, so authenticated == admin.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name_es     text not null,
  name_en     text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  category_id    uuid references public.categories(id) on delete set null,
  division       text not null default 'import',        -- import | seafood | atm
  name_es        text not null,
  name_en        text not null,
  description_es text default '',
  description_en text default '',
  badge_es       text default '',
  badge_en       text default '',
  price          numeric(12,2) not null default 0,      -- selling price (per unit/paca)
  cost           numeric(12,2) not null default 0,      -- purchase cost (for margin)
  unit           text not null default 'unidad',        -- paca, kg, unidad...
  stock          int  not null default 0,
  low_stock_at   int  not null default 5,               -- low-stock threshold
  image_url      text default '',
  featured       boolean not null default false,
  active         boolean not null default true,
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated
  before update on public.products
  for each row execute function public.set_updated_at();

create index if not exists idx_products_division on public.products(division);
create index if not exists idx_products_active   on public.products(active);

-- ---------------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique default ('DP-' || upper(substr(gen_random_uuid()::text, 1, 8))),
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text default '',
  address         text default '',
  city            text default '',
  state           text default '',
  postal_code     text default '',
  country         text default '',
  status          text not null default 'pending',      -- pending|paid|shipped|completed|cancelled
  payment_method  text default '',
  subtotal        numeric(12,2) not null default 0,
  shipping        numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  notes           text default '',
  created_at      timestamptz not null default now()
);

create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_orders_status  on public.orders(status);

-- ---------------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price   numeric(12,2) not null default 0,
  quantity     int not null default 1,
  line_total   numeric(12,2) not null default 0
);

create index if not exists idx_order_items_order on public.order_items(order_id);

-- Auto-decrement stock and log an inventory movement when an order item is
-- created. SECURITY DEFINER so public (anon) checkouts can adjust stock without
-- being granted write access to products/inventory directly.
create or replace function public.apply_order_item_stock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.product_id is not null and new.quantity > 0 then
    update public.products
      set stock = stock - new.quantity
      where id = new.product_id;

    insert into public.inventory_movements (product_id, type, quantity, reason)
    values (
      new.product_id,
      'out',
      -new.quantity,
      'Venta ' || coalesce((select order_number from public.orders where id = new.order_id), '')
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_order_item_stock on public.order_items;
create trigger trg_order_item_stock
  after insert on public.order_items
  for each row execute function public.apply_order_item_stock();

-- ---------------------------------------------------------------------------
-- inventory_movements  (stock audit trail)
-- ---------------------------------------------------------------------------
create table if not exists public.inventory_movements (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  type        text not null,                             -- in | out | adjust
  quantity    int not null,                              -- signed impact applied to stock
  reason      text default '',
  note        text default '',
  created_at  timestamptz not null default now()
);

create index if not exists idx_inv_product on public.inventory_movements(product_id);

-- ---------------------------------------------------------------------------
-- ledger_entries  (income / expenses)
-- ---------------------------------------------------------------------------
create table if not exists public.ledger_entries (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,                             -- income | expense
  category    text default 'general',
  description text not null,
  amount      numeric(12,2) not null default 0,          -- always positive
  entry_date  date not null default current_date,
  order_id    uuid references public.orders(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_ledger_date on public.ledger_entries(entry_date desc);
create index if not exists idx_ledger_type on public.ledger_entries(type);

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table public.categories          enable row level security;
alter table public.products            enable row level security;
alter table public.orders              enable row level security;
alter table public.order_items         enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.ledger_entries      enable row level security;

-- categories: public read, admin write
drop policy if exists cat_public_read on public.categories;
create policy cat_public_read on public.categories
  for select using (true);
drop policy if exists cat_admin_all on public.categories;
create policy cat_admin_all on public.categories
  for all to authenticated using (true) with check (true);

-- products: public reads active products, admin full access
drop policy if exists prod_public_read on public.products;
create policy prod_public_read on public.products
  for select using (active = true);
drop policy if exists prod_admin_read on public.products;
create policy prod_admin_read on public.products
  for select to authenticated using (true);
drop policy if exists prod_admin_write on public.products;
create policy prod_admin_write on public.products
  for all to authenticated using (true) with check (true);

-- orders: public (checkout) can insert; only admin can read/update
drop policy if exists order_public_insert on public.orders;
create policy order_public_insert on public.orders
  for insert with check (true);
drop policy if exists order_admin_read on public.orders;
create policy order_admin_read on public.orders
  for select to authenticated using (true);
drop policy if exists order_admin_write on public.orders;
create policy order_admin_write on public.orders
  for update to authenticated using (true) with check (true);
drop policy if exists order_admin_delete on public.orders;
create policy order_admin_delete on public.orders
  for delete to authenticated using (true);

-- order_items: public (checkout) can insert; only admin can read
drop policy if exists oi_public_insert on public.order_items;
create policy oi_public_insert on public.order_items
  for insert with check (true);
drop policy if exists oi_admin_read on public.order_items;
create policy oi_admin_read on public.order_items
  for select to authenticated using (true);

-- inventory_movements: admin only
drop policy if exists inv_admin_all on public.inventory_movements;
create policy inv_admin_all on public.inventory_movements
  for all to authenticated using (true) with check (true);

-- ledger_entries: admin only
drop policy if exists ledger_admin_all on public.ledger_entries;
create policy ledger_admin_all on public.ledger_entries
  for all to authenticated using (true) with check (true);

-- ===========================================================================
-- Seed: categories + current catalog (migrated from the hardcoded site copy)
-- ===========================================================================
insert into public.categories (slug, name_es, name_en, sort_order) values
  ('import',  'Don Pepe Import',   'Don Pepe Import',   1),
  ('seafood', 'Don Pepe Sea Food', 'Don Pepe Sea Food', 2),
  ('atm',     'Don Pepe ATM',      'Don Pepe ATM',      3)
on conflict (slug) do nothing;

-- Import products
insert into public.products (slug, division, category_id, name_es, name_en, description_es, description_en, price, cost, unit, stock, image_url, sort_order)
select v.slug, 'import', c.id, v.name_es, v.name_en, v.desc_es, v.desc_en, v.price, v.cost, 'paca', v.stock, v.img, v.ord
from (values
  ('yuca-empacada-al-vacio', 'Yuca empacada al vacío', 'Vacuum-Packed Yuca',
   'Selección premium de yuca ecuatoriana, cultivada en tierras fértiles y cosechada en su punto exacto de maduración. Procesada bajo estrictos estándares de calidad y empacada al vacío para preservar su frescura, textura suave y sabor auténtico sin conservantes.',
   'Premium selection of Ecuadorian yuca, grown in fertile soils and harvested at its exact point of maturity. Processed under strict quality standards and vacuum-packed to preserve freshness, soft texture and authentic flavor without preservatives.',
   120.00, 78.00, 40, 'https://images.pexels.com/photos/30893343/pexels-photo-30893343.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 1),
  ('chifle-premium', 'Chifle premium', 'Premium Chifle',
   'El tradicional snack de plátano verde ecuatoriano llevado a su máxima expresión. Cortado en láminas delgadas, frito a la perfección para lograr una textura extra crujiente y sazonado ligeramente con sal marina.',
   'The traditional Ecuadorian green plantain snack taken to its highest expression. Thinly sliced, fried to perfection for an extra crispy texture and lightly seasoned with sea salt.',
   120.00, 74.00, 60, 'https://images.pexels.com/photos/30622220/pexels-photo-30622220.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 2),
  ('pasta-de-mani-organica', 'Pasta de maní orgánica', 'Organic Peanut Butter',
   'Elaborada 100% con maní orgánico tostado de origen ecuatoriano. Molida artesanalmente para conseguir una textura cremosa y un sabor intenso, libre de aditivos, azúcares añadidos o conservantes.',
   'Made with 100% roasted organic peanuts of Ecuadorian origin. Artisanally milled for a creamy texture and intense flavor, free of additives, added sugars or preservatives.',
   120.00, 82.00, 35, 'https://images.pexels.com/photos/5149342/pexels-photo-5149342.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 3),
  ('cafe-premium', 'Café premium', 'Premium Coffee',
   'Granos de arábica cultivados a gran altura en fincas exclusivas de las montañas ecuatorianas. Cosechados a mano y tostados cuidadosamente para revelar notas a chocolate oscuro y frutos rojos.',
   'Arabica beans grown at high altitudes in exclusive farms of the Ecuadorian mountains. Hand-picked and carefully roasted to reveal notes of dark chocolate and red berries.',
   120.00, 88.00, 50, 'https://images.pexels.com/photos/4109751/pexels-photo-4109751.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 4),
  ('cacao-de-finca', 'Cacao de finca', 'Farm Cacao',
   'Proveniente de las mejores fincas cacaoteras de la costa ecuatoriana. Cacao de origen único, conocido como Fino de Aroma, con notas florales y frutales inconfundibles.',
   'Sourced from the best cacao farms on the Ecuadorian coast. Single-origin cacao, known as Fino de Aroma, with unmistakable floral and fruity notes.',
   120.00, 90.00, 30, 'https://images.pexels.com/photos/35585310/pexels-photo-35585310.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 5),
  ('especias-naturales', 'Especias naturales', 'Natural Spices',
   'Una cuidada selección de especias y hierbas aromáticas sembradas en suelos ricos en minerales. Secadas de forma natural para concentrar sus aceites esenciales.',
   'A careful selection of spices and aromatic herbs planted in mineral-rich soils. Naturally dried to concentrate their essential oils.',
   120.00, 70.00, 45, 'https://images.pexels.com/photos/31437952/pexels-photo-31437952.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 6)
) as v(slug, name_es, name_en, desc_es, desc_en, price, cost, stock, img, ord)
join public.categories c on c.slug = 'import'
on conflict (slug) do nothing;

-- Seafood products
insert into public.products (slug, division, category_id, name_es, name_en, description_es, description_en, badge_es, badge_en, price, cost, unit, stock, image_url, sort_order)
select v.slug, 'seafood', c.id, v.name_es, v.name_en, v.desc_es, v.desc_en, v.badge_es, v.badge_en, v.price, v.cost, 'caja', v.stock, v.img, v.ord
from (values
  ('albacora', 'Albacora', 'Albacore Tuna',
   'Capturada mediante métodos de pesca selectiva y sostenible en el Océano Pacífico. Carne firme y sabor suave, manejada bajo una rigurosa cadena de frío desde el barco hasta su destino.',
   'Caught using selective and sustainable fishing methods in the Pacific Ocean. Firm meat and mild flavor, handled under a rigorous cold chain from the boat to its destination.',
   'Fresco & Congelado', 'Fresh & Frozen', 180.00, 120.00, 25, 'https://images.pexels.com/photos/8352346/pexels-photo-8352346.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 1),
  ('camaron', 'Camarón', 'Shrimp',
   'Reconocido mundialmente como el mejor, nuestro camarón ecuatoriano se cría en un entorno natural privilegiado. Textura crujiente, color excepcional y sabor dulce inconfundible.',
   'Globally recognized as the best, our Ecuadorian shrimp is raised in a privileged natural environment. Crisp texture, exceptional color and unmistakable sweet flavor.',
   'Talla premium', 'Premium size', 220.00, 150.00, 40, 'https://images.pexels.com/photos/33211047/pexels-photo-33211047.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 2),
  ('calamar', 'Calamar', 'Squid',
   'Extraído de aguas profundas y limpias, procesado inmediatamente en plantas certificadas para garantizar una textura tierna y un sabor fresco del mar.',
   'Extracted from deep, clean waters, immediately processed in certified plants to guarantee a tender texture and fresh sea taste.',
   'Procesado en planta', 'Plant processed', 160.00, 105.00, 30, 'https://images.pexels.com/photos/30648997/pexels-photo-30648997.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 3),
  ('mariscos-varios', 'Mariscos varios', 'Assorted Seafood',
   'Una exquisita variedad de frutos del mar ecuatoriano que incluye pulpo, mejillones y conchas. Seleccionados a mano y ultracongelados para sellar su frescura.',
   'An exquisite variety of Ecuadorian seafood including octopus, mussels and clams. Hand-selected and flash-frozen to lock in freshness.',
   'Cadena de frío', 'Cold chain', 175.00, 118.00, 20, 'https://images.pexels.com/photos/3903587/pexels-photo-3903587.jpeg?auto=compress&cs=tinysrgb&w=700&h=520&dpr=1', 4)
) as v(slug, name_es, name_en, desc_es, desc_en, badge_es, badge_en, price, cost, stock, img, ord)
join public.categories c on c.slug = 'seafood'
on conflict (slug) do nothing;

# Plataforma de Administración — Don Pepe Business

Panel interno conectado a Supabase para gestionar la tienda y llevar control
contable/auditable. La tienda pública lee el catálogo desde la misma base de datos.

## Puesta en marcha (3 pasos)

### 1. Crear las tablas en Supabase

Abre tu proyecto en Supabase → **SQL Editor** → **New query**, pega todo el
contenido de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
y ejecútalo (**Run**).

Esto crea las tablas, la seguridad (RLS) y carga el catálogo inicial
(productos de Import y Sea Food que ya estaban en el sitio).

> Alternativa: si autorizas el conector de Supabase en Claude, se puede aplicar
> automáticamente en vez de pegar el SQL a mano.

### 2. Crear el usuario administrador

Supabase → **Authentication** → **Users** → **Add user** →
"Create new user". Escribe el correo y la contraseña del dueño/admin.
(Marca "Auto Confirm User" para que pueda entrar sin verificar correo.)

Solo las personas con cuenta pueden entrar al panel y modificar datos.

### 3. Ejecutar el proyecto

```bash
npm install      # ya se agregó @supabase/supabase-js
npm run dev
```

- Tienda pública: `http://localhost:3000/`
- Panel admin:   `http://localhost:3000/admin`  (redirige a login)

Las llaves de Supabase ya están en `.env` (`VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY`). Son llaves públicas seguras para el navegador; la
seguridad real la aplican las políticas RLS de la base de datos.

## Qué incluye el panel (`/admin`)

| Sección        | Ruta                    | Función |
|----------------|-------------------------|---------|
| Dashboard      | `/admin`                | KPIs de ventas, órdenes pendientes, balance y stock bajo (30 días). |
| Productos      | `/admin/productos`      | Alta/edición/baja de productos, precios, costos, stock, visibilidad. |
| Órdenes        | `/admin/ordenes`        | Historial de ventas, detalle de items, cambio de estado. |
| Inventario     | `/admin/inventario`     | Existencias y registro de movimientos (entradas/salidas/ajustes). |
| Contabilidad   | `/admin/contabilidad`   | Libro de ingresos y gastos con balance por período. |

## Cómo se conecta con la tienda

- Los productos con **"Visible en tienda" activado** aparecen automáticamente en
  `/productos` y en la página de detalle. Al editar precio/nombre/descripción en
  el panel, la tienda se actualiza sola.
- Si la base de datos aún no tiene productos, la tienda usa los textos estáticos
  como respaldo (nunca se rompe).
- Al completar un pago en el checkout, la orden se guarda en `orders` +
  `order_items`, y un *trigger* descuenta el stock y registra el movimiento de
  inventario automáticamente.

## Modelo de datos

- `categories`, `products` — catálogo (leído por la tienda).
- `orders`, `order_items` — ventas persistidas (auditable).
- `inventory_movements` — historial de stock.
- `ledger_entries` — ingresos y gastos contables.

Ver detalle y políticas de seguridad en
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).

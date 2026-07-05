import React, { useEffect, useState } from "react";
import { Download, FileText, Printer, ShoppingBag, Boxes, BookOpenText, Package, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem, InventoryMovement, LedgerEntry, Product } from "@/lib/database.types";
import { money, dateTime, shortDate } from "@/lib/format";
import { toCSV, downloadCSV, stamp } from "@/lib/csv";
import { PageHeader, Card, StatCard, ErrorNote, Field, inputCls } from "@/components/admin/ui";

const firstOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
};
const today = () => new Date().toISOString().slice(0, 10);

interface Summary {
  orders: number;
  revenue: number;
  income: number;
  expense: number;
  inventoryValue: number;
}

export function AdminReports() {
  const [from, setFrom] = useState(firstOfMonth());
  const [to, setTo] = useState(today());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // date-range bounds as ISO timestamps (inclusive end of day)
  const fromIso = `${from}T00:00:00`;
  const toIso = `${to}T23:59:59`;

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, ledgerRes, productsRes] = await Promise.all([
        supabase.from("orders").select("total,status").gte("created_at", fromIso).lte("created_at", toIso),
        supabase.from("ledger_entries").select("type,amount").gte("entry_date", from).lte("entry_date", to),
        supabase.from("products").select("stock,cost"),
      ]);
      if (ordersRes.error) throw ordersRes.error;
      if (ledgerRes.error) throw ledgerRes.error;
      if (productsRes.error) throw productsRes.error;

      const orders = ordersRes.data || [];
      const ledger = ledgerRes.data || [];
      const products = productsRes.data || [];

      setSummary({
        orders: orders.length,
        revenue: orders.filter((o: any) => o.status !== "cancelled").reduce((s: number, o: any) => s + Number(o.total || 0), 0),
        income: ledger.filter((l: any) => l.type === "income").reduce((s: number, l: any) => s + Number(l.amount), 0),
        expense: ledger.filter((l: any) => l.type === "expense").reduce((s: number, l: any) => s + Number(l.amount), 0),
        inventoryValue: products.reduce((s: number, p: any) => s + Number(p.stock) * Number(p.cost), 0),
      });
    } catch (e: any) {
      setError(e.message || "No se pudo cargar el resumen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  // ---- CSV exports -------------------------------------------------------
  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    setError(null);
    try {
      await fn();
    } catch (e: any) {
      setError(e.message || "No se pudo generar el reporte.");
    } finally {
      setBusy(null);
    }
  };

  const exportOrders = () =>
    run("orders", async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", fromIso)
        .lte("created_at", toIso)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data || []) as Order[];
      const csv = toCSV<Order>(
        [
          { key: "order_number", label: "N° Orden" },
          { key: "created_at", label: "Fecha", get: (r) => dateTime(r.created_at) },
          { key: "customer_name", label: "Cliente" },
          { key: "customer_email", label: "Correo" },
          { key: "customer_phone", label: "Teléfono" },
          { key: "status", label: "Estado" },
          { key: "payment_method", label: "Pago" },
          { key: "subtotal", label: "Subtotal", get: (r) => Number(r.subtotal).toFixed(2) },
          { key: "shipping", label: "Envío", get: (r) => Number(r.shipping).toFixed(2) },
          { key: "total", label: "Total", get: (r) => Number(r.total).toFixed(2) },
          { key: "city", label: "Ciudad" },
          { key: "country", label: "País" },
        ],
        rows
      );
      downloadCSV(`ordenes_${from}_a_${to}.csv`, csv);
    });

  const exportOrderItems = () =>
    run("items", async () => {
      const { data: orders, error: e1 } = await supabase
        .from("orders")
        .select("id,order_number,created_at")
        .gte("created_at", fromIso)
        .lte("created_at", toIso);
      if (e1) throw e1;
      const list = (orders || []) as Pick<Order, "id" | "order_number" | "created_at">[];
      if (list.length === 0) {
        downloadCSV(`detalle_ordenes_${from}_a_${to}.csv`, toCSV([{ key: "x", label: "Sin datos" }], []));
        return;
      }
      const byId = new Map(list.map((o) => [o.id, o]));
      const ids = list.map((o) => o.id);
      const { data: items, error: e2 } = await supabase.from("order_items").select("*").in("order_id", ids);
      if (e2) throw e2;
      const rows = (items || []) as OrderItem[];
      const csv = toCSV<OrderItem>(
        [
          { key: "order_number", label: "N° Orden", get: (r) => byId.get(r.order_id)?.order_number || "" },
          { key: "fecha", label: "Fecha", get: (r) => (byId.get(r.order_id) ? shortDate(byId.get(r.order_id)!.created_at) : "") },
          { key: "product_name", label: "Producto" },
          { key: "quantity", label: "Cantidad" },
          { key: "unit_price", label: "Precio unit.", get: (r) => Number(r.unit_price).toFixed(2) },
          { key: "line_total", label: "Total línea", get: (r) => Number(r.line_total).toFixed(2) },
        ],
        rows
      );
      downloadCSV(`detalle_ordenes_${from}_a_${to}.csv`, csv);
    });

  const exportInventory = () =>
    run("inv", async () => {
      const { data, error } = await supabase
        .from("inventory_movements")
        .select("*, products(name_es)")
        .gte("created_at", fromIso)
        .lte("created_at", toIso)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data || []) as (InventoryMovement & { products?: { name_es: string } | null })[];
      const csv = toCSV(
        [
          { key: "created_at", label: "Fecha", get: (r: any) => dateTime(r.created_at) },
          { key: "product", label: "Producto", get: (r: any) => r.products?.name_es || "" },
          { key: "type", label: "Tipo" },
          { key: "quantity", label: "Cantidad" },
          { key: "reason", label: "Motivo" },
        ],
        rows
      );
      downloadCSV(`movimientos_inventario_${from}_a_${to}.csv`, csv);
    });

  const exportLedger = () =>
    run("ledger", async () => {
      const { data, error } = await supabase
        .from("ledger_entries")
        .select("*")
        .gte("entry_date", from)
        .lte("entry_date", to)
        .order("entry_date", { ascending: false });
      if (error) throw error;
      const rows = (data || []) as LedgerEntry[];
      const csv = toCSV<LedgerEntry>(
        [
          { key: "entry_date", label: "Fecha", get: (r) => shortDate(r.entry_date) },
          { key: "type", label: "Tipo", get: (r) => (r.type === "income" ? "Ingreso" : "Gasto") },
          { key: "category", label: "Categoría" },
          { key: "description", label: "Descripción" },
          { key: "amount", label: "Monto", get: (r) => Number(r.amount).toFixed(2) },
        ],
        rows
      );
      downloadCSV(`contabilidad_${from}_a_${to}.csv`, csv);
    });

  const exportStock = () =>
    run("stock", async () => {
      const { data, error } = await supabase.from("products").select("*").order("division").order("name_es");
      if (error) throw error;
      const rows = (data || []) as Product[];
      const csv = toCSV<Product>(
        [
          { key: "name_es", label: "Producto" },
          { key: "division", label: "División" },
          { key: "unit", label: "Unidad" },
          { key: "stock", label: "Stock" },
          { key: "low_stock_at", label: "Alerta" },
          { key: "cost", label: "Costo", get: (r) => Number(r.cost).toFixed(2) },
          { key: "price", label: "Precio", get: (r) => Number(r.price).toFixed(2) },
          { key: "value", label: "Valor (costo×stock)", get: (r) => (Number(r.stock) * Number(r.cost)).toFixed(2) },
          { key: "active", label: "Activo", get: (r) => (r.active ? "Sí" : "No") },
        ],
        rows
      );
      downloadCSV(`inventario_actual_${stamp()}.csv`, csv);
    });

  // ---- Printable accounting report (opens print dialog -> Save as PDF) ----
  const printReport = () => {
    if (!summary) return;
    const balance = summary.revenue + summary.income - summary.expense;
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Reporte contable ${from} a ${to}</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:40px;}
  h1{font-size:20px;margin:0 0 4px;color:#8a6d1f;}
  .sub{color:#666;font-size:12px;margin-bottom:24px;}
  table{width:100%;border-collapse:collapse;margin-top:12px;}
  td,th{padding:10px 12px;border-bottom:1px solid #ddd;text-align:left;font-size:13px;}
  th{background:#f4efe2;text-transform:uppercase;font-size:11px;letter-spacing:.05em;}
  .num{text-align:right;font-variant-numeric:tabular-nums;}
  .total{font-weight:bold;font-size:15px;}
  .pos{color:#0a7d3d;} .neg{color:#b3261e;}
  .foot{margin-top:32px;color:#888;font-size:11px;}
</style></head><body>
<h1>DON PEPE BUSINESS GROUP</h1>
<div class="sub">Reporte contable &middot; ${shortDate(from)} — ${shortDate(to)} &middot; Generado ${dateTime(new Date())}</div>
<table>
  <tr><th>Concepto</th><th class="num">Monto</th></tr>
  <tr><td>Ventas (${summary.orders} órdenes)</td><td class="num">${money(summary.revenue)}</td></tr>
  <tr><td>Otros ingresos (contabilidad)</td><td class="num pos">${money(summary.income)}</td></tr>
  <tr><td>Gastos</td><td class="num neg">- ${money(summary.expense)}</td></tr>
  <tr class="total"><td>Balance del período</td><td class="num ${balance >= 0 ? "pos" : "neg"}">${money(balance)}</td></tr>
</table>
<table>
  <tr><th>Otros indicadores</th><th class="num">Valor</th></tr>
  <tr><td>Valor del inventario (a costo, actual)</td><td class="num">${money(summary.inventoryValue)}</td></tr>
</table>
<div class="foot">Documento generado automáticamente desde el panel de administración. Cifras en USD.</div>
<script>window.onload=function(){window.print();}</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  const balance = summary ? summary.revenue + summary.income - summary.expense : 0;

  const ExportBtn = ({
    id,
    label,
    desc,
    icon,
    onClick,
  }: {
    id: string;
    label: string;
    desc: string;
    icon: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      disabled={busy === id}
      className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#0f1626] p-4 text-left hover:border-[#d4af37]/40 transition-colors disabled:opacity-60"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#d4af37]/10 text-[#d4af37]">
        {busy === id ? <Loader2 size={18} className="animate-spin" /> : icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="block text-xs text-slate-500">{desc}</span>
      </span>
      <Download size={16} className="text-slate-500 shrink-0" />
    </button>
  );

  return (
    <div>
      <PageHeader title="Reportes" subtitle="Exporta datos para contabilidad y auditoría (CSV / PDF)." />

      {error && <ErrorNote message={error} />}

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <Field label="Desde">
          <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Hasta">
          <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <button
          onClick={printReport}
          disabled={!summary}
          className="inline-flex items-center gap-2 rounded bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#0a0f1c] hover:bg-[#e6c352] transition-colors disabled:opacity-60"
        >
          <Printer size={16} /> Reporte contable (PDF)
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Ventas del período" value={loading ? "…" : money(summary?.revenue)} accent="text-[#d4af37]" hint={`${summary?.orders ?? 0} órdenes`} />
        <StatCard label="Ingresos extra" value={loading ? "…" : money(summary?.income)} accent="text-emerald-400" />
        <StatCard label="Gastos" value={loading ? "…" : money(summary?.expense)} accent="text-red-400" />
        <StatCard label="Balance" value={loading ? "…" : money(balance)} accent={balance >= 0 ? "text-emerald-400" : "text-red-400"} />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Descargas (CSV)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ExportBtn id="orders" label="Órdenes / Ventas" desc="Todas las órdenes del período" icon={<ShoppingBag size={18} />} onClick={exportOrders} />
        <ExportBtn id="items" label="Detalle de órdenes" desc="Productos vendidos por orden" icon={<FileText size={18} />} onClick={exportOrderItems} />
        <ExportBtn id="ledger" label="Libro contable" desc="Ingresos y gastos del período" icon={<BookOpenText size={18} />} onClick={exportLedger} />
        <ExportBtn id="inv" label="Movimientos de inventario" desc="Entradas, salidas y ajustes" icon={<Boxes size={18} />} onClick={exportInventory} />
        <ExportBtn id="stock" label="Inventario actual" desc="Snapshot de stock y valor (a hoy)" icon={<Package size={18} />} onClick={exportStock} />
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Los archivos CSV abren directamente en Excel o Google Sheets. El reporte contable en PDF se genera
        con la opción “Guardar como PDF” de tu navegador.
      </p>
    </div>
  );
}

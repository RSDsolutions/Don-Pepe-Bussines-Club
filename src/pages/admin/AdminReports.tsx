import React, { useEffect, useState } from "react";
import { Download, FileText, ShoppingBag, Boxes, BookOpenText, Package, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem, InventoryMovement, LedgerEntry, Product } from "@/lib/database.types";
import { money, dateTime, shortDate } from "@/lib/format";
import { toCSV, downloadCSV, stamp, type CsvColumn } from "@/lib/csv";
import { downloadTablePDF, downloadSummaryPDF } from "@/lib/pdf";
import { PageHeader, StatCard, ErrorNote, Field, inputCls } from "@/components/admin/ui";

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

interface ReportData {
  columns: CsvColumn<any>[];
  rows: any[];
}

interface ReportDef {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  title: string;
  filename: string;
  landscape?: boolean;
  fetch: () => Promise<ReportData>;
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
  const period = `Período: ${from} — ${to}`;

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

  // ---- Report data fetchers ----------------------------------------------
  const fetchOrders = async (): Promise<ReportData> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", fromIso)
      .lte("created_at", toIso)
      .order("created_at", { ascending: false });
    if (error) throw error;
    const columns: CsvColumn<Order>[] = [
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
    ];
    return { columns, rows: (data || []) as Order[] };
  };

  const fetchOrderItems = async (): Promise<ReportData> => {
    const { data: orders, error: e1 } = await supabase
      .from("orders")
      .select("id,order_number,created_at")
      .gte("created_at", fromIso)
      .lte("created_at", toIso);
    if (e1) throw e1;
    const list = (orders || []) as Pick<Order, "id" | "order_number" | "created_at">[];
    const byId = new Map(list.map((o) => [o.id, o]));

    let rows: OrderItem[] = [];
    if (list.length > 0) {
      const { data: items, error: e2 } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", list.map((o) => o.id));
      if (e2) throw e2;
      rows = (items || []) as OrderItem[];
    }
    const columns: CsvColumn<OrderItem>[] = [
      { key: "order_number", label: "N° Orden", get: (r) => byId.get(r.order_id)?.order_number || "" },
      { key: "fecha", label: "Fecha", get: (r) => (byId.get(r.order_id) ? shortDate(byId.get(r.order_id)!.created_at) : "") },
      { key: "product_name", label: "Producto" },
      { key: "quantity", label: "Cantidad" },
      { key: "unit_price", label: "Precio unit.", get: (r) => Number(r.unit_price).toFixed(2) },
      { key: "line_total", label: "Total línea", get: (r) => Number(r.line_total).toFixed(2) },
    ];
    return { columns, rows };
  };

  const fetchLedger = async (): Promise<ReportData> => {
    const { data, error } = await supabase
      .from("ledger_entries")
      .select("*")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .order("entry_date", { ascending: false });
    if (error) throw error;
    const columns: CsvColumn<LedgerEntry>[] = [
      { key: "entry_date", label: "Fecha", get: (r) => shortDate(r.entry_date) },
      { key: "type", label: "Tipo", get: (r) => (r.type === "income" ? "Ingreso" : "Gasto") },
      { key: "category", label: "Categoría" },
      { key: "description", label: "Descripción" },
      { key: "amount", label: "Monto", get: (r) => Number(r.amount).toFixed(2) },
    ];
    return { columns, rows: (data || []) as LedgerEntry[] };
  };

  const fetchInventoryMovements = async (): Promise<ReportData> => {
    const { data, error } = await supabase
      .from("inventory_movements")
      .select("*, products(name_es)")
      .gte("created_at", fromIso)
      .lte("created_at", toIso)
      .order("created_at", { ascending: false });
    if (error) throw error;
    type Row = InventoryMovement & { products?: { name_es: string } | null };
    const columns: CsvColumn<Row>[] = [
      { key: "created_at", label: "Fecha", get: (r) => dateTime(r.created_at) },
      { key: "product", label: "Producto", get: (r) => r.products?.name_es || "" },
      { key: "type", label: "Tipo", get: (r) => (r.type === "in" ? "Entrada" : r.type === "out" ? "Salida" : "Ajuste") },
      { key: "quantity", label: "Cantidad" },
      { key: "reason", label: "Motivo" },
    ];
    return { columns, rows: (data || []) as Row[] };
  };

  const fetchStock = async (): Promise<ReportData> => {
    const { data, error } = await supabase.from("products").select("*").order("division").order("name_es");
    if (error) throw error;
    const columns: CsvColumn<Product>[] = [
      { key: "name_es", label: "Producto" },
      { key: "division", label: "División" },
      { key: "unit", label: "Unidad" },
      { key: "stock", label: "Stock" },
      { key: "low_stock_at", label: "Alerta" },
      { key: "cost", label: "Costo", get: (r) => Number(r.cost).toFixed(2) },
      { key: "price", label: "Precio", get: (r) => Number(r.price).toFixed(2) },
      { key: "value", label: "Valor (costo×stock)", get: (r) => (Number(r.stock) * Number(r.cost)).toFixed(2) },
      { key: "active", label: "Activo", get: (r) => (r.active ? "Sí" : "No") },
    ];
    return { columns, rows: (data || []) as Product[] };
  };

  const reports: ReportDef[] = [
    {
      id: "orders", label: "Órdenes / Ventas", desc: "Todas las órdenes del período",
      icon: <ShoppingBag size={18} />, title: "Reporte de órdenes / ventas",
      filename: `ordenes_${from}_a_${to}`, landscape: true, fetch: fetchOrders,
    },
    {
      id: "items", label: "Detalle de órdenes", desc: "Productos vendidos por orden",
      icon: <FileText size={18} />, title: "Detalle de órdenes (productos vendidos)",
      filename: `detalle_ordenes_${from}_a_${to}`, fetch: fetchOrderItems,
    },
    {
      id: "ledger", label: "Libro contable", desc: "Ingresos y gastos del período",
      icon: <BookOpenText size={18} />, title: "Libro contable (ingresos y gastos)",
      filename: `contabilidad_${from}_a_${to}`, fetch: fetchLedger,
    },
    {
      id: "inv", label: "Movimientos de inventario", desc: "Entradas, salidas y ajustes",
      icon: <Boxes size={18} />, title: "Movimientos de inventario",
      filename: `movimientos_inventario_${from}_a_${to}`, fetch: fetchInventoryMovements,
    },
    {
      id: "stock", label: "Inventario actual", desc: "Snapshot de stock y valor (a hoy)",
      icon: <Package size={18} />, title: "Inventario actual",
      filename: `inventario_actual_${stamp()}`, fetch: fetchStock,
    },
  ];

  const doExport = async (r: ReportDef, kind: "csv" | "pdf") => {
    setBusy(`${r.id}:${kind}`);
    setError(null);
    try {
      const { columns, rows } = await r.fetch();
      if (kind === "csv") {
        downloadCSV(`${r.filename}.csv`, toCSV(columns, rows));
      } else {
        downloadTablePDF({
          filename: `${r.filename}.pdf`,
          title: r.title,
          subtitle: r.id === "stock" ? undefined : period,
          columns,
          rows,
          landscape: r.landscape,
        });
      }
    } catch (e: any) {
      setError(e.message || "No se pudo generar el reporte.");
    } finally {
      setBusy(null);
    }
  };

  const downloadAccountingSummary = () => {
    if (!summary) return;
    const balance = summary.revenue + summary.income - summary.expense;
    downloadSummaryPDF({
      filename: `resumen_contable_${from}_a_${to}.pdf`,
      title: "Resumen contable del período",
      subtitle: period,
      sections: [
        {
          heading: "Resultados del período",
          emphasizeLast: true,
          rows: [
            [`Ventas (${summary.orders} órdenes)`, money(summary.revenue)],
            ["Otros ingresos (contabilidad)", money(summary.income)],
            ["Gastos", `- ${money(summary.expense)}`],
            ["Balance del período", money(balance)],
          ],
        },
        {
          heading: "Otros indicadores",
          rows: [["Valor del inventario (a costo, actual)", money(summary.inventoryValue)]],
        },
      ],
    });
  };

  const balance = summary ? summary.revenue + summary.income - summary.expense : 0;

  const miniBtn =
    "inline-flex items-center gap-1.5 rounded border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#d4af37]/60 hover:text-[#d4af37] transition-colors disabled:opacity-50";

  return (
    <div>
      <PageHeader title="Reportes" subtitle="Exporta datos para contabilidad y auditoría (CSV o PDF)." />

      {error && <ErrorNote message={error} />}

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <Field label="Desde">
          <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Hasta">
          <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <button
          onClick={downloadAccountingSummary}
          disabled={!summary}
          className="inline-flex items-center gap-2 rounded bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#0a0f1c] hover:bg-[#e6c352] transition-colors disabled:opacity-60"
        >
          <Download size={16} /> Resumen contable (PDF)
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Ventas del período" value={loading ? "…" : money(summary?.revenue)} accent="text-[#d4af37]" hint={`${summary?.orders ?? 0} órdenes`} />
        <StatCard label="Ingresos extra" value={loading ? "…" : money(summary?.income)} accent="text-emerald-400" />
        <StatCard label="Gastos" value={loading ? "…" : money(summary?.expense)} accent="text-red-400" />
        <StatCard label="Balance" value={loading ? "…" : money(balance)} accent={balance >= 0 ? "text-emerald-400" : "text-red-400"} />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Descargas</h2>
      <div className="grid grid-cols-1 gap-3">
        {reports.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center gap-4 rounded-lg border border-white/10 bg-[#0f1626] p-4 hover:border-[#d4af37]/30 transition-colors"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#d4af37]/10 text-[#d4af37]">
              {r.icon}
            </span>
            <span className="min-w-[180px] flex-1">
              <span className="block text-sm font-semibold text-white">{r.label}</span>
              <span className="block text-xs text-slate-500">{r.desc}</span>
            </span>
            <span className="flex gap-2 shrink-0">
              <button onClick={() => doExport(r, "csv")} disabled={busy !== null} className={miniBtn}>
                {busy === `${r.id}:csv` ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                CSV
              </button>
              <button onClick={() => doExport(r, "pdf")} disabled={busy !== null} className={miniBtn}>
                {busy === `${r.id}:pdf` ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                PDF
              </button>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        CSV abre en Excel o Google Sheets con las columnas ya separadas. PDF descarga un documento
        con formato listo para imprimir o archivar.
      </p>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Order, Product, LedgerEntry } from "@/lib/database.types";
import { money, dateTime } from "@/lib/format";
import { PageHeader, StatCard, Card, Loading, ErrorNote, StatusBadge } from "@/components/admin/ui";

interface Stats {
  revenue30: number;
  orders30: number;
  ordersPending: number;
  lowStock: number;
  income30: number;
  expense30: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const sinceIso = since.toISOString();

      try {
        const [ordersRes, productsRes, ledgerRes, recentRes] = await Promise.all([
          supabase.from("orders").select("id,status,total,created_at").gte("created_at", sinceIso),
          supabase.from("products").select("id,name_es,stock,low_stock_at,active"),
          supabase.from("ledger_entries").select("type,amount,entry_date").gte("entry_date", sinceIso.slice(0, 10)),
          supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(6),
        ]);

        if (ordersRes.error) throw ordersRes.error;
        if (productsRes.error) throw productsRes.error;
        if (ledgerRes.error) throw ledgerRes.error;
        if (recentRes.error) throw recentRes.error;

        const orders = ordersRes.data || [];
        const products = productsRes.data || [];
        const ledger = (ledgerRes.data || []) as Pick<LedgerEntry, "type" | "amount" | "entry_date">[];

        const revenue30 = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((s, o) => s + Number(o.total || 0), 0);
        const income30 = ledger.filter((l) => l.type === "income").reduce((s, l) => s + Number(l.amount), 0);
        const expense30 = ledger.filter((l) => l.type === "expense").reduce((s, l) => s + Number(l.amount), 0);
        const low = products.filter((p) => Number(p.stock) <= Number(p.low_stock_at));

        setStats({
          revenue30,
          orders30: orders.length,
          ordersPending: orders.filter((o) => o.status === "pending").length,
          lowStock: low.length,
          income30,
          expense30,
        });
        setLowStockProducts(low.slice(0, 6) as Product[]);
        setRecentOrders((recentRes.data || []) as Order[]);
      } catch (e: any) {
        setError(e.message || "No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  const balance = (stats?.income30 || 0) + (stats?.revenue30 || 0) - (stats?.expense30 || 0);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumen de los últimos 30 días" />

      {error && <ErrorNote message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Ventas (30d)"
          value={money(stats?.revenue30)}
          hint={`${stats?.orders30 ?? 0} órdenes`}
          accent="text-[#d4af37]"
          icon={<DollarSign size={18} />}
        />
        <StatCard
          label="Órdenes pendientes"
          value={stats?.ordersPending ?? 0}
          hint="por procesar"
          icon={<ShoppingBag size={18} />}
        />
        <StatCard
          label="Balance neto (30d)"
          value={money(balance)}
          hint="ingresos − gastos"
          accent={balance >= 0 ? "text-emerald-400" : "text-red-400"}
          icon={<Wallet size={18} />}
        />
        <StatCard
          label="Stock bajo"
          value={stats?.lowStock ?? 0}
          hint="productos por reponer"
          accent={(stats?.lowStock ?? 0) > 0 ? "text-amber-400" : "text-white"}
          icon={<AlertTriangle size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Ingresos contables (30d)"
          value={money(stats?.income30)}
          accent="text-emerald-400"
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          label="Gastos (30d)"
          value={money(stats?.expense30)}
          accent="text-red-400"
          icon={<TrendingDown size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Órdenes recientes</h2>
            <Link to="/admin/ordenes" className="text-xs text-[#d4af37] hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-slate-500">Aún no hay órdenes.</div>
            )}
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{o.customer_name}</div>
                  <div className="text-xs text-slate-500">
                    {o.order_number} · {dateTime(o.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={o.status} />
                  <span className="text-sm font-semibold text-[#d4af37]">{money(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Reponer stock</h2>
            <Link to="/admin/inventario" className="text-xs text-[#d4af37] hover:underline">
              Inventario
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {lowStockProducts.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-slate-500">
                Todo el stock está en niveles saludables.
              </div>
            )}
            {lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-white truncate">{p.name_es}</span>
                <span
                  className={`text-sm font-semibold ${
                    Number(p.stock) === 0 ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {p.stock} {p.stock === 1 ? "u." : "u."}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

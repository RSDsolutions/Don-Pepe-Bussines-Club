import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronRight, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem } from "@/lib/database.types";
import { money, dateTime } from "@/lib/format";
import {
  PageHeader,
  Card,
  Loading,
  ErrorNote,
  EmptyState,
  Modal,
  StatusBadge,
  ORDER_STATUSES,
  STATUS_LABEL,
  inputCls,
} from "@/components/admin/ui";

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setOrders((data || []) as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openOrder = async (o: Order) => {
    setSelected(o);
    setItemsLoading(true);
    const { data } = await supabase.from("order_items").select("*").eq("order_id", o.id);
    setItems((data || []) as OrderItem[]);
    setItemsLoading(false);
  };

  const updateStatus = async (o: Order, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", o.id);
    if (error) {
      alert("No se pudo actualizar: " + error.message);
      return;
    }
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status } : x)));
    if (selected?.id === o.id) setSelected({ ...selected, status });
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q) ||
        o.order_number.toLowerCase().includes(q);
      return matchesStatus && matchesQ;
    });
  }, [orders, query, statusFilter]);

  const totalRevenue = filtered
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div>
      <PageHeader
        title="Órdenes"
        subtitle={`${filtered.length} órdenes · ${money(totalRevenue)} en ventas`}
      />

      {error && <ErrorNote message={error} />}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente, correo o N° de orden..."
            className={`${inputCls} pl-9`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputCls} max-w-[180px]`}
        >
          <option value="all">Todos los estados</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <Card>
        {loading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <EmptyState message="No hay órdenes que coincidan." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-white/10">
                  <th className="px-4 py-3 font-semibold">Orden</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold text-right">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => openOrder(o)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#d4af37]">{o.order_number}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{o.customer_name}</div>
                      <div className="text-xs text-slate-500">{o.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{dateTime(o.created_at)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#d4af37]">{money(o.total)}</td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      <ChevronRight size={16} className="inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Orden ${selected.order_number}` : ""}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Cliente</div>
                <div className="text-white">{selected.customer_name}</div>
                <div className="text-slate-400">{selected.customer_email}</div>
                {selected.customer_phone && <div className="text-slate-400">{selected.customer_phone}</div>}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Envío</div>
                <div className="text-slate-300">
                  {[selected.address, selected.city, selected.state, selected.postal_code, selected.country]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Estado</div>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected, s)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      selected.status === s
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-[#d4af37]"
                        : "border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Package size={13} /> Productos
              </div>
              {itemsLoading ? (
                <Loading label="Cargando items..." />
              ) : items.length === 0 ? (
                <div className="text-sm text-slate-500">Sin detalle de items.</div>
              ) : (
                <div className="rounded border border-white/10 divide-y divide-white/5">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span className="text-slate-200">
                        {it.product_name} <span className="text-slate-500">× {it.quantity}</span>
                      </span>
                      <span className="text-slate-300">{money(it.line_total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{money(selected.subtotal)}</span>
              </div>
              {Number(selected.shipping) > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Envío</span>
                  <span>{money(selected.shipping)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-white pt-1">
                <span>Total</span>
                <span className="text-[#d4af37]">{money(selected.total)}</span>
              </div>
              {selected.payment_method && (
                <div className="text-xs text-slate-500 pt-1">Pago: {selected.payment_method}</div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

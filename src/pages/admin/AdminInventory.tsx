import React, { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Settings2, History } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product, InventoryMovement } from "@/lib/database.types";
import { money, dateTime } from "@/lib/format";
import {
  PageHeader,
  Card,
  Loading,
  ErrorNote,
  EmptyState,
  Modal,
  Field,
  inputCls,
  btnPrimary,
  btnGhost,
} from "@/components/admin/ui";

type MovementType = "in" | "out" | "adjust";

interface MovementWithProduct extends InventoryMovement {
  products?: { name_es: string } | null;
}

const TYPE_META: Record<MovementType, { label: string; icon: any; color: string }> = {
  in: { label: "Entrada", icon: ArrowDownCircle, color: "text-emerald-400" },
  out: { label: "Salida", icon: ArrowUpCircle, color: "text-red-400" },
  adjust: { label: "Ajuste", icon: Settings2, color: "text-amber-400" },
};

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<MovementWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [target, setTarget] = useState<Product | null>(null);
  const [type, setType] = useState<MovementType>("in");
  const [qty, setQty] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [prodRes, movRes] = await Promise.all([
      supabase.from("products").select("*").order("division").order("name_es"),
      supabase
        .from("inventory_movements")
        .select("*, products(name_es)")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (prodRes.error) setError(prodRes.error.message);
    else setProducts((prodRes.data || []) as Product[]);
    if (!movRes.error) setMovements((movRes.data || []) as MovementWithProduct[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openMovement = (p: Product) => {
    setTarget(p);
    setType("in");
    setQty(0);
    setReason("");
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    setFormError(null);
    const amount = Math.abs(Number(qty));
    if (!amount) {
      setFormError("Ingresa una cantidad mayor a cero.");
      return;
    }

    // Signed impact applied to stock.
    let signed = amount;
    let newStock = target.stock;
    if (type === "in") {
      signed = amount;
      newStock = target.stock + amount;
    } else if (type === "out") {
      signed = -amount;
      newStock = target.stock - amount;
      if (newStock < 0) {
        setFormError(`Stock insuficiente (disponible: ${target.stock}).`);
        return;
      }
    } else {
      // adjust => set absolute value
      signed = amount - target.stock;
      newStock = amount;
    }

    setSaving(true);
    const { error: movErr } = await supabase.from("inventory_movements").insert({
      product_id: target.id,
      type,
      quantity: signed,
      reason: reason || TYPE_META[type].label,
    });
    if (movErr) {
      setSaving(false);
      setFormError(movErr.message);
      return;
    }
    const { error: prodErr } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", target.id);
    setSaving(false);
    if (prodErr) {
      setFormError(prodErr.message);
      return;
    }
    setModalOpen(false);
    load();
  };

  return (
    <div>
      <PageHeader title="Inventario" subtitle="Controla existencias y registra movimientos de stock." />

      {error && <ErrorNote message={error} />}

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
          <Card>
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="font-semibold text-white">Existencias</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-white/10">
                    <th className="px-4 py-3 font-semibold">Producto</th>
                    <th className="px-4 py-3 font-semibold text-right">Stock</th>
                    <th className="px-4 py-3 font-semibold text-right">Valor (costo)</th>
                    <th className="px-4 py-3 font-semibold text-right">Movimiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => {
                    const low = Number(p.stock) <= Number(p.low_stock_at);
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{p.name_es}</div>
                          <div className="text-xs text-slate-500 capitalize">
                            {p.division} · {p.unit}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={
                              low
                                ? Number(p.stock) === 0
                                  ? "text-red-400 font-semibold"
                                  : "text-amber-400 font-semibold"
                                : "text-slate-200"
                            }
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400">
                          {money(Number(p.stock) * Number(p.cost))}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => openMovement(p)}
                            className="rounded border border-slate-600 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-white/5"
                          >
                            Registrar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
              <History size={16} className="text-[#d4af37]" />
              <h2 className="font-semibold text-white">Movimientos recientes</h2>
            </div>
            {movements.length === 0 ? (
              <EmptyState message="Sin movimientos registrados." />
            ) : (
              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {movements.map((m) => {
                  const meta = TYPE_META[(m.type as MovementType) || "adjust"];
                  const Icon = meta.icon;
                  return (
                    <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                      <Icon size={18} className={meta.color} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-white truncate">
                          {m.products?.name_es || "Producto"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {meta.label} · {dateTime(m.created_at)}
                          {m.reason ? ` · ${m.reason}` : ""}
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${meta.color}`}>
                        {m.quantity > 0 ? "+" : ""}
                        {m.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={target ? `Movimiento — ${target.name_es}` : ""}
      >
        {target && (
          <form onSubmit={handleSave} className="space-y-4">
            {formError && <ErrorNote message={formError} />}
            <div className="text-sm text-slate-400">
              Stock actual: <span className="font-semibold text-white">{target.stock}</span> {target.unit}
            </div>

            <Field label="Tipo de movimiento">
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(TYPE_META) as MovementType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded border px-3 py-2 text-sm font-medium transition-colors ${
                      type === t
                        ? "border-[#d4af37] bg-[#d4af37]/15 text-[#d4af37]"
                        : "border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {TYPE_META[t].label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={type === "adjust" ? "Nuevo stock total" : "Cantidad"}>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              />
            </Field>

            <Field label="Motivo / nota (opcional)">
              <input
                className={inputCls}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Compra a proveedor, merma, conteo físico..."
              />
            </Field>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setModalOpen(false)} className={btnGhost}>
                Cancelar
              </button>
              <button type="submit" disabled={saving} className={btnPrimary}>
                {saving ? "Guardando..." : "Registrar movimiento"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

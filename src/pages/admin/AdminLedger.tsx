import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { LedgerEntry } from "@/lib/database.types";
import { money, shortDate } from "@/lib/format";
import {
  PageHeader,
  Card,
  StatCard,
  Loading,
  ErrorNote,
  EmptyState,
  Modal,
  Field,
  inputCls,
  btnPrimary,
  btnGhost,
} from "@/components/admin/ui";

type EntryType = "income" | "expense";

const todayIso = () => new Date().toISOString().slice(0, 10);

export function AdminLedger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Period filter (month by default)
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(todayIso());

  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<EntryType>("expense");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [entryDate, setEntryDate] = useState(todayIso());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ledger_entries")
      .select("*")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setEntries((data || []) as LedgerEntry[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const totals = useMemo(() => {
    const income = entries.filter((e) => e.type === "income").reduce((s, e) => s + Number(e.amount), 0);
    const expense = entries.filter((e) => e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);
    return { income, expense, balance: income - expense };
  }, [entries]);

  const openNew = (t: EntryType) => {
    setType(t);
    setAmount(0);
    setCategory("general");
    setDescription("");
    setEntryDate(todayIso());
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!description.trim()) {
      setFormError("La descripción es obligatoria.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setFormError("El monto debe ser mayor a cero.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("ledger_entries").insert({
      type,
      category: category || "general",
      description: description.trim(),
      amount: Math.abs(Number(amount)),
      entry_date: entryDate,
    });
    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (entry: LedgerEntry) => {
    if (!confirm("¿Eliminar este movimiento contable?")) return;
    const { error } = await supabase.from("ledger_entries").delete().eq("id", entry.id);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    setEntries((prev) => prev.filter((x) => x.id !== entry.id));
  };

  return (
    <div>
      <PageHeader
        title="Contabilidad"
        subtitle="Libro de ingresos y gastos con balance por período."
        action={
          <div className="flex gap-2">
            <button onClick={() => openNew("income")} className={btnGhost}>
              <TrendingUp size={16} className="text-emerald-400" /> Ingreso
            </button>
            <button onClick={() => openNew("expense")} className={btnPrimary}>
              <Plus size={16} /> Gasto
            </button>
          </div>
        }
      />

      {error && <ErrorNote message={error} />}

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <Field label="Desde">
          <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Hasta">
          <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Ingresos" value={money(totals.income)} accent="text-emerald-400" icon={<TrendingUp size={18} />} />
        <StatCard label="Gastos" value={money(totals.expense)} accent="text-red-400" icon={<TrendingDown size={18} />} />
        <StatCard
          label="Balance"
          value={money(totals.balance)}
          accent={totals.balance >= 0 ? "text-[#d4af37]" : "text-red-400"}
          icon={<Wallet size={18} />}
        />
      </div>

      <Card>
        {loading ? (
          <Loading />
        ) : entries.length === 0 ? (
          <EmptyState message="No hay movimientos en este período." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-white/10">
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Descripción</th>
                  <th className="px-4 py-3 font-semibold">Categoría</th>
                  <th className="px-4 py-3 font-semibold text-right">Monto</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((e) => {
                  const income = e.type === "income";
                  return (
                    <tr key={e.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{shortDate(e.entry_date)}</td>
                      <td className="px-4 py-3 text-white">
                        {e.description}
                        {e.order_id && <span className="ml-2 text-xs text-slate-500">(venta)</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 capitalize">{e.category}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${income ? "text-emerald-400" : "text-red-400"}`}>
                        {income ? "+" : "−"}
                        {money(e.amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(e)}
                          className="rounded p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={type === "income" ? "Registrar ingreso" : "Registrar gasto"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <ErrorNote message={formError} />}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`rounded border px-3 py-2 text-sm font-medium ${
                type === "income" ? "border-emerald-500 bg-emerald-500/15 text-emerald-300" : "border-slate-700 text-slate-400"
              }`}
            >
              Ingreso
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`rounded border px-3 py-2 text-sm font-medium ${
                type === "expense" ? "border-red-500 bg-red-500/15 text-red-300" : "border-slate-700 text-slate-400"
              }`}
            >
              Gasto
            </button>
          </div>

          <Field label="Descripción">
            <input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej. Compra de café a proveedor" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Monto ($)">
              <input type="number" step="0.01" min={0} className={inputCls} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} />
            </Field>
            <Field label="Fecha">
              <input type="date" className={inputCls} value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
            </Field>
          </div>

          <Field label="Categoría">
            <input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="general, inventario, nómina, logística..." />
          </Field>

          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
            <button type="button" onClick={() => setModalOpen(false)} className={btnGhost}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Guardando..." : "Registrar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

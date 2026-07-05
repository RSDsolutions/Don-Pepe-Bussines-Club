import React, { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/database.types";
import { money, slugify } from "@/lib/format";
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

const DIVISIONS = [
  { value: "import", label: "Import" },
  { value: "seafood", label: "Sea Food" },
  { value: "atm", label: "ATM" },
];

const emptyForm: Partial<Product> = {
  name_es: "",
  name_en: "",
  slug: "",
  division: "import",
  description_es: "",
  description_en: "",
  badge_es: "",
  badge_en: "",
  price: 0,
  cost: 0,
  unit: "paca",
  stock: 0,
  low_stock_at: 5,
  image_url: "",
  featured: false,
  active: true,
  sort_order: 0,
};

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("division")
      .order("sort_order");
    if (error) setError(error.message);
    else setProducts((data || []) as Product[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesDiv = divisionFilter === "all" || p.division === divisionFilter;
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q || p.name_es.toLowerCase().includes(q) || p.name_en.toLowerCase().includes(q);
      return matchesDiv && matchesQ;
    });
  }, [products, query, divisionFilter]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setFormError(null);
    setModalOpen(true);
  };

  const set = (patch: Partial<Product>) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name_es || !form.name_en) {
      setFormError("El nombre en español e inglés son obligatorios.");
      return;
    }
    setSaving(true);
    const slug = form.slug?.trim() || slugify(form.name_es || "");
    const payload = {
      slug,
      division: form.division,
      name_es: form.name_es,
      name_en: form.name_en,
      description_es: form.description_es || "",
      description_en: form.description_en || "",
      badge_es: form.badge_es || "",
      badge_en: form.badge_en || "",
      price: Number(form.price) || 0,
      cost: Number(form.cost) || 0,
      unit: form.unit || "unidad",
      stock: Number(form.stock) || 0,
      low_stock_at: Number(form.low_stock_at) || 0,
      image_url: form.image_url || "",
      featured: !!form.featured,
      active: form.active !== false,
      sort_order: Number(form.sort_order) || 0,
    };

    const res = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (res.error) {
      setFormError(res.error.message);
      return;
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name_es}"? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    load();
  };

  const toggleActive = async (p: Product) => {
    const { error } = await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    if (!error) setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !p.active } : x)));
  };

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Gestiona el catálogo que ve la tienda pública."
        action={
          <button onClick={openNew} className={btnPrimary}>
            <Plus size={16} /> Nuevo producto
          </button>
        }
      />

      {error && <ErrorNote message={error} />}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto..."
            className={`${inputCls} pl-9`}
          />
        </div>
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className={`${inputCls} max-w-[180px]`}
        >
          <option value="all">Todas las divisiones</option>
          {DIVISIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <Card>
        {loading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <EmptyState message="No hay productos que coincidan." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b border-white/10">
                  <th className="px-4 py-3 font-semibold">Producto</th>
                  <th className="px-4 py-3 font-semibold">División</th>
                  <th className="px-4 py-3 font-semibold text-right">Precio</th>
                  <th className="px-4 py-3 font-semibold text-right">Costo</th>
                  <th className="px-4 py-3 font-semibold text-right">Stock</th>
                  <th className="px-4 py-3 font-semibold text-center">Activo</th>
                  <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt=""
                            className="h-10 w-10 rounded object-cover border border-white/10"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-white/5 border border-white/10" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-white flex items-center gap-1.5">
                            {p.name_es}
                            {p.featured && <Star size={12} className="text-[#d4af37] fill-[#d4af37]" />}
                          </div>
                          <div className="text-xs text-slate-500">{p.name_en}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-300">{p.division}</td>
                    <td className="px-4 py-3 text-right text-[#d4af37] font-semibold">{money(p.price)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">{money(p.cost)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          Number(p.stock) <= Number(p.low_stock_at)
                            ? Number(p.stock) === 0
                              ? "text-red-400 font-semibold"
                              : "text-amber-400 font-semibold"
                            : "text-slate-200"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          p.active ? "bg-emerald-500/70" : "bg-slate-600"
                        }`}
                        title={p.active ? "Visible en tienda" : "Oculto"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            p.active ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar producto" : "Nuevo producto"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <ErrorNote message={formError} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre (ES)">
              <input className={inputCls} value={form.name_es || ""} onChange={(e) => set({ name_es: e.target.value })} />
            </Field>
            <Field label="Nombre (EN)">
              <input className={inputCls} value={form.name_en || ""} onChange={(e) => set({ name_en: e.target.value })} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="División">
              <select className={inputCls} value={form.division || "import"} onChange={(e) => set({ division: e.target.value })}>
                {DIVISIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Slug (URL)">
              <input
                className={inputCls}
                value={form.slug || ""}
                onChange={(e) => set({ slug: e.target.value })}
                placeholder="auto"
              />
            </Field>
            <Field label="Unidad">
              <input className={inputCls} value={form.unit || ""} onChange={(e) => set({ unit: e.target.value })} placeholder="paca, kg..." />
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Precio ($)">
              <input type="number" step="0.01" className={inputCls} value={form.price ?? 0} onChange={(e) => set({ price: parseFloat(e.target.value) })} />
            </Field>
            <Field label="Costo ($)">
              <input type="number" step="0.01" className={inputCls} value={form.cost ?? 0} onChange={(e) => set({ cost: parseFloat(e.target.value) })} />
            </Field>
            <Field label="Stock">
              <input type="number" className={inputCls} value={form.stock ?? 0} onChange={(e) => set({ stock: parseInt(e.target.value) })} />
            </Field>
            <Field label="Alerta stock">
              <input type="number" className={inputCls} value={form.low_stock_at ?? 0} onChange={(e) => set({ low_stock_at: parseInt(e.target.value) })} />
            </Field>
          </div>

          <Field label="URL de imagen">
            <input className={inputCls} value={form.image_url || ""} onChange={(e) => set({ image_url: e.target.value })} placeholder="https://..." />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Etiqueta / Badge (ES)">
              <input className={inputCls} value={form.badge_es || ""} onChange={(e) => set({ badge_es: e.target.value })} />
            </Field>
            <Field label="Etiqueta / Badge (EN)">
              <input className={inputCls} value={form.badge_en || ""} onChange={(e) => set({ badge_en: e.target.value })} />
            </Field>
          </div>

          <Field label="Descripción (ES)">
            <textarea rows={3} className={inputCls} value={form.description_es || ""} onChange={(e) => set({ description_es: e.target.value })} />
          </Field>
          <Field label="Descripción (EN)">
            <textarea rows={3} className={inputCls} value={form.description_en || ""} onChange={(e) => set({ description_en: e.target.value })} />
          </Field>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.active !== false} onChange={(e) => set({ active: e.target.checked })} />
              Visible en tienda
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => set({ featured: e.target.checked })} />
              Destacado
            </label>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              Orden
              <input
                type="number"
                className={`${inputCls} w-20`}
                value={form.sort_order ?? 0}
                onChange={(e) => set({ sort_order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
            <button type="button" onClick={() => setModalOpen(false)} className={btnGhost}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

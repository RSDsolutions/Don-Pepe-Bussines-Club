import React from "react";
import { Loader2 } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-white/10 bg-[#0f1626] ${className}`}>{children}</div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "text-white",
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
        {icon && <span className="text-[#d4af37]">{icon}</span>}
      </div>
      <div className={`mt-3 text-2xl font-bold ${accent}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </Card>
  );
}

export function Loading({ label = "Cargando..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-16 justify-center text-slate-400">
      <Loader2 className="animate-spin text-[#d4af37]" size={20} />
      {label}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center text-slate-500 text-sm">{message}</div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div className="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 mb-4">
      {message}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  paid: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  shipped: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  paid: "Pagada",
  shipped: "Enviada",
  completed: "Completada",
  cancelled: "Cancelada",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || "bg-slate-500/15 text-slate-300 border-slate-500/30";
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export const ORDER_STATUSES = ["pending", "paid", "shipped", "completed", "cancelled"];
export { STATUS_LABEL };

/** Simple modal shell used by the admin forms. */
export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} rounded-lg border border-white/10 bg-[#0f1626] shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded bg-[#0a0f1c] border border-slate-700 px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37] transition-colors";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded bg-[#d4af37] px-4 py-2 text-sm font-semibold text-[#0a0f1c] hover:bg-[#e6c352] transition-colors disabled:opacity-60";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors";

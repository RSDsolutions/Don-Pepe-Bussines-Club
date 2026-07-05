import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  BookOpenText,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package, end: false },
  { to: "/admin/ordenes", label: "Órdenes", icon: ShoppingBag, end: false },
  { to: "/admin/inventario", label: "Inventario", icon: Boxes, end: false },
  { to: "/admin/contabilidad", label: "Contabilidad", icon: BookOpenText, end: false },
];

/** Blocks access until an authenticated session exists. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] text-[#d4af37]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="font-serif text-xl font-bold text-[#d4af37] tracking-wide">DON PEPE</div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mt-0.5">Admin Panel</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#d4af37]/15 text-[#d4af37]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink size={18} />
          Ver tienda
        </a>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
        <div className="px-3 pt-2 text-[11px] text-slate-600 truncate">{user?.email}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-[#0f1626] border-r border-white/10">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#0f1626] border-r border-white/10">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-[#0f1626] border-b border-white/10 px-4 py-3">
          <button onClick={() => setMobileOpen(true)} className="text-slate-300">
            <Menu size={22} />
          </button>
          <span className="font-serif font-bold text-[#d4af37]">DON PEPE</span>
          <button onClick={handleSignOut} className="text-slate-400">
            <LogOut size={20} />
          </button>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <button
          className="lg:hidden fixed top-3 right-4 z-50 text-white"
          onClick={() => setMobileOpen(false)}
        >
          <X size={22} />
        </button>
      )}
    </div>
  );
}

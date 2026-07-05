import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AdminLogin() {
  const { session, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) return <Navigate to={from} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1c] px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl font-bold text-[#d4af37] tracking-wide">DON PEPE</div>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">Panel de Administración</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0f1626] border border-[#d4af37]/20 rounded-lg p-8 shadow-2xl"
        >
          <h1 className="text-lg font-semibold text-white mb-6">Iniciar sesión</h1>

          {error && (
            <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error === "Invalid login credentials" ? "Correo o contraseña incorrectos." : error}
            </div>
          )}

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Correo
          </label>
          <div className="relative mb-4">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded bg-[#0a0f1c] border border-slate-700 pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37] transition-colors"
              placeholder="admin@donpepe.com"
            />
          </div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Contraseña
          </label>
          <div className="relative mb-6">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded bg-[#0a0f1c] border border-slate-700 pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded bg-[#d4af37] py-2.5 font-semibold text-[#0a0f1c] hover:bg-[#e6c352] transition-colors disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Acceso exclusivo para administradores de Don Pepe Business Group.
        </p>
      </div>
    </div>
  );
}

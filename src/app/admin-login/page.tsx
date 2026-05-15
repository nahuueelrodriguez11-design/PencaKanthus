"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { loginUser } from "@/app/actions";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Intentamos iniciar sesión obligatoriamente con el usuario administrador predeterminado
    // y validando de forma estricta la contraseña ingresada en el formulario (Punto 5).
    const res = await loginUser("@kanthus.smash", password.trim());
    setLoading(false);

    if (res.success && res.user && res.user.isAdmin) {
      setSuccess(true);
      try {
        localStorage.setItem("kanthus_penca_session_user_full", JSON.stringify(res.user));
        localStorage.setItem("kanthus_penca_session_user_id", String(res.user.id));
      } catch (err) {}

      // Redirigimos de inmediato a la página principal donde el panel estará visible y autorizado
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      setError("Acceso denegado. Contraseña incorrecta o el usuario no posee privilegios de administrador.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 selection:bg-[#39FF14] selection:text-black">
      <div className="w-full max-w-md bg-neutral-950 p-8 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#39FF14] text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
          STAFF EXCLUSIVO
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#39FF14] flex items-center justify-center text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Acceso Staff</h1>
            <span className="text-xs text-neutral-400 block">Kanthus Smash Club</span>
          </div>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed mb-6">
          Por razones de seguridad, la administración del Mundial está estrictamente protegida. Ingresá la clave de acceso de Kanthus para habilitar la carga de resultados oficiales y cierres automáticos.
        </p>

        {success && (
          <div className="bg-[#112211] text-[#39FF14] p-3 rounded-xl text-xs font-bold mb-4 border border-[#39FF14]/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 animate-spin" />
            <span>¡Acceso autorizado! Redirigiendo al panel de control...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-950 text-red-400 p-3 rounded-xl text-xs font-bold mb-4 border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Contraseña de Administración
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required 
                placeholder="Ingresá la clave" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black border border-neutral-800 focus:border-[#39FF14] rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none transition font-mono"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#39FF14] hover:bg-[#2de011] text-black font-black py-3 rounded-xl text-sm transition shadow-[0_0_15px_rgba(57,255,20,0.3)] disabled:opacity-50 mt-2"
          >
            {loading ? "Validando credenciales..." : "Autorizar Sesión Admin"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition">
            <ArrowLeft className="w-3 h-3" />
            <span>Volver a la Penca pública</span>
          </a>
        </div>
      </div>
    </div>
  );
}

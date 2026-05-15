"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

export default function AdminProtectionRoute() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      // Verificamos si existe una sesión de usuario válida guardada y con permisos de administrador reales
      const savedUserJson = localStorage.getItem("kanthus_penca_session_user_full");
      if (savedUserJson) {
        const user = JSON.parse(savedUserJson);
        if (user && user.isAdmin === true) {
          setAuthorized(true);
          // Si es un administrador real, lo mandamos de inmediato a la pantalla donde está el panel
          window.location.href = "/";
          return;
        }
      }
      setAuthorized(false);
    } catch (e) {
      setAuthorized(false);
    }
  }, []);

  if (authorized === null) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-neutral-950 p-8 rounded-3xl border border-red-900/50 text-center shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-800 text-red-500 flex items-center justify-center mx-auto mb-2">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-black uppercase tracking-tight text-red-500">
          Acceso no autorizado
        </h1>

        <p className="text-xs text-neutral-300 leading-relaxed">
          La ruta que estás intentando consultar está estrictamente reservada para el personal administrativo autorizado de Kanthus Smash Club. Tu sesión actual no cuenta con privilegios válidos.
        </p>

        <div className="pt-4 flex flex-col gap-2">
          <a 
            href="/admin-login"
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 rounded-xl text-xs transition border border-neutral-800 flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-[#39FF14]" />
            <span>Ingresar con clave de Staff</span>
          </a>

          <a 
            href="/"
            className="w-full bg-[#39FF14] hover:bg-[#2de011] text-black font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la página principal</span>
          </a>
        </div>
      </div>
    </div>
  );
}

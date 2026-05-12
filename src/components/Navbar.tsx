"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ============================================
// NAVBAR - Barra de navegación principal
// Usa useEffect para evitar hydration mismatch
// con localStorage
// ============================================
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    id: number;
    name: string;
    totalPoints: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Leer localStorage SOLO en el cliente después del mount
  // Esto evita hydration mismatch entre server y client
  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("kanthus_user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kanthus_user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-[#00ff88]">KANTHUS</span>
              <span className="text-white ml-1">PENCA</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#como-funciona" className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] transition-colors">
              Cómo funciona
            </Link>
            <Link href="/#premios" className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] transition-colors">
              Premios
            </Link>
            <Link href="/#reglas" className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] transition-colors">
              Reglas
            </Link>
            <Link href="/ranking" className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] transition-colors">
              🏆 Ranking
            </Link>

            {mounted && user ? (
              <>
                <Link href="/predictions" className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] transition-colors">
                  ⚽ Predicciones
                </Link>
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-white font-semibold">{user.name}</span>
                  <span className="text-xs bg-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded-full font-bold">
                    {user.totalPoints || 0} pts
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-[#a0a0a0] hover:text-red-400 transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : mounted ? (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/login" className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] transition-colors">
                  Ingresar
                </Link>
                <Link href="/register" className="btn-neon text-xs !py-2 !px-4">
                  Registrarme
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <span className="text-sm text-[#666]">...</span>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[#2a2a2a] mt-2 pt-4 fade-in">
            <div className="flex flex-col gap-3">
              <Link href="/#como-funciona" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] py-2">
                Cómo funciona
              </Link>
              <Link href="/#premios" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] py-2">
                Premios
              </Link>
              <Link href="/#reglas" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] py-2">
                Reglas
              </Link>
              <Link href="/ranking" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] py-2">
                🏆 Ranking
              </Link>
              {mounted && user ? (
                <>
                  <Link href="/predictions" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] py-2">
                    ⚽ Predicciones
                  </Link>
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-sm text-white font-semibold">{user.name}</span>
                    <span className="text-xs bg-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded-full font-bold">
                      {user.totalPoints || 0} pts
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 py-2 text-left"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : mounted ? (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-[#a0a0a0] hover:text-[#00ff88] py-2">
                    Ingresar
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="btn-neon text-xs !py-2 !px-4 text-center mt-1">
                    Registrarme
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

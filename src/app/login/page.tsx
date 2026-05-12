"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ============================================
// PÁGINA DE LOGIN
// Formulario para iniciar sesión
// ============================================
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.phone || !form.password) {
      setError("Completá todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión.");
        return;
      }

      // Guardar usuario en localStorage
      localStorage.setItem("kanthus_user", JSON.stringify(data.user));

      // Redirigir a predicciones
      router.push("/predictions");
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🍔</div>
          <h1 className="text-3xl font-black text-white mb-2">
            Bienvenido a <span className="text-[#00ff88]">Kanthus</span>
          </h1>
          <p className="text-[#a0a0a0]">
            Ingresá para cargar tus predicciones y competir.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="card-premium">
          {/* Teléfono */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#a0a0a0] mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Ej: 099123456"
              className="input-dark"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#a0a0a0] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className="input-dark"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="spinner !w-5 !h-5 !border-2" />
                Ingresando...
              </span>
            ) : (
              "⚽ Ingresar"
            )}
          </button>
        </form>

        {/* Link al registro */}
        <p className="text-center text-[#a0a0a0] text-sm mt-6">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-[#00ff88] font-semibold hover:underline">
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

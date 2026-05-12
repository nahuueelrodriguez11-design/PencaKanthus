"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ============================================
// PÁGINA DE REGISTRO
// Formulario para crear nueva cuenta
// ============================================
export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    instagram: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (!form.name || !form.phone || !form.instagram || !form.password) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (form.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          instagram: form.instagram,
          email: form.email || undefined,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrarse.");
        return;
      }

      setSuccess("¡Registro exitoso! Redirigiendo al login...");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
            Creá tu <span className="text-[#00ff88]">cuenta</span>
          </h1>
          <p className="text-[#a0a0a0]">
            Unite a la Penca Mundial Kanthus y empezá a ganar.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="card-premium">
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#a0a0a0] mb-2">
              Nombre y apellido *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              className="input-dark"
              required
            />
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#a0a0a0] mb-2">
              Teléfono *
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

          {/* Instagram */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#a0a0a0] mb-2">
              Instagram *
            </label>
            <input
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="Ej: @juanperez"
              className="input-dark"
              required
            />
          </div>

          {/* Email (opcional) */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#a0a0a0] mb-2">
              Email <span className="text-[#666]">(opcional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ej: juan@email.com"
              className="input-dark"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#a0a0a0] mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 4 caracteres"
              className="input-dark"
              required
            />
          </div>

          {/* Confirmar contraseña */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#a0a0a0] mb-2">
              Confirmar contraseña *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repetí tu contraseña"
              className="input-dark"
              required
            />
          </div>

          {/* Mensajes */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg text-[#00ff88] text-sm">
              ✅ {success}
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
                Registrando...
              </span>
            ) : (
              "🎯 Registrarme gratis"
            )}
          </button>
        </form>

        {/* Link al login */}
        <p className="text-center text-[#a0a0a0] text-sm mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-[#00ff88] font-semibold hover:underline">
            Ingresá acá
          </Link>
        </p>
      </div>
    </div>
  );
}

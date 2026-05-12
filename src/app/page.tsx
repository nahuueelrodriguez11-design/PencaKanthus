import Link from "next/link";

// ============================================
// PÁGINA PRINCIPAL - HOME
// Hero, cómo funciona, puntos, premios, reglas
// Página 100% estática — no usa base de datos
// ============================================
export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative overflow-hidden">
        {/* Fondo con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0d1a0f] to-[#0a0a0a]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00ff88] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full px-4 py-2 mb-8">
              <span className="text-lg">🍔</span>
              <span className="text-sm font-semibold text-[#00ff88]">Kanthus Smash Club presenta</span>
            </div>

            {/* Título principal */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-none mb-6">
              <span className="text-white">PENCA</span>
              <br />
              <span className="neon-text">MUNDIAL</span>
              <br />
              <span className="text-white">KANTHUS</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg sm:text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-10 leading-relaxed">
              Jugá, acertá resultados y ganá premios mientras vivís el Mundial
              con Kanthus. ¡Cada predicción te acerca a la victoria!
            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-neon text-base">
                🎯 Registrarme gratis
              </Link>
              <a href="#premios" className="btn-outline text-base">
                🏆 Ver premios
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#00ff88]">5</div>
                <div className="text-xs sm:text-sm text-[#666] mt-1">pts exacto</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#00ff88]">50+</div>
                <div className="text-xs sm:text-sm text-[#666] mt-1">partidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-[#00ff88]">🍔</div>
                <div className="text-xs sm:text-sm text-[#666] mt-1">premios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PROMO TV 55"
          ========================================== */}
      <section className="bg-gradient-to-r from-[#00ff88]/10 via-[#00ff88]/5 to-[#00ff88]/10 border-y border-[#00ff88]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-base sm:text-lg font-semibold text-white">
            📺 <span className="text-[#00ff88]">¡Cada compra mayor a $500</span> también suma chances para el sorteo de una{" "}
            <span className="text-[#00ff88] font-bold">TV 55&quot;</span> para ver el Mundial!
          </p>
        </div>
      </section>

      {/* ==========================================
          CÓMO FUNCIONA
          ========================================== */}
      <section id="como-funciona" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              ¿Cómo <span className="text-[#00ff88]">funciona</span>?
            </h2>
            <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
              Es simple, rápido y divertido. Seguí estos pasos y empezá a ganar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: "1", icon: "📝", title: "Registrate gratis", desc: "Creá tu cuenta en segundos con tu nombre, teléfono e Instagram." },
              { step: "2", icon: "⚽", title: "Cargá predicciones", desc: "Elegí el resultado de cada partido antes de que comience." },
              { step: "3", icon: "🎯", title: "Sumá puntos", desc: "Ganá 5 pts por resultado exacto, 3 pts por acertar ganador." },
              { step: "4", icon: "📊", title: "Subí en el ranking", desc: "Competí con otros jugadores y escalá posiciones." },
              { step: "5", icon: "🏆", title: "Ganá premios", desc: "Los mejores se llevan combos Kanthus, descuentos y más." },
            ].map((item) => (
              <div key={item.step} className="card-premium text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div className="text-xs font-bold text-[#00ff88] mb-2">PASO {item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#a0a0a0] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SISTEMA DE PUNTOS
          ========================================== */}
      <section className="py-20 sm:py-28 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Sistema de <span className="text-[#00ff88]">puntos</span>
            </h2>
            <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
              Cuanto más preciso seas, más puntos sumás.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Resultado exacto */}
            <div className="card-premium text-center neon-border">
              <div className="text-5xl font-black text-[#00ff88] mb-2">5</div>
              <div className="text-sm font-bold text-[#00ff88] uppercase tracking-wider mb-4">puntos</div>
              <h3 className="text-xl font-bold text-white mb-3">Resultado exacto</h3>
              <p className="text-sm text-[#a0a0a0] mb-4">
                Si ponés 2-1 y el partido termina 2-1, ¡sumás 5 puntos!
              </p>
              <div className="bg-[#0a0a0a] rounded-lg p-3 text-xs text-[#666]">
                Predicción: <span className="text-white font-bold">2-1</span> → Resultado: <span className="text-[#00ff88] font-bold">2-1</span> ✅
              </div>
            </div>

            {/* Acertar ganador */}
            <div className="card-premium text-center">
              <div className="text-5xl font-black text-[#00ff88] mb-2">3</div>
              <div className="text-sm font-bold text-[#00ff88] uppercase tracking-wider mb-4">puntos</div>
              <h3 className="text-xl font-bold text-white mb-3">Acertar ganador</h3>
              <p className="text-sm text-[#a0a0a0] mb-4">
                Si ponés 2-1 y gana el mismo equipo pero 1-0, sumás 3 puntos.
              </p>
              <div className="bg-[#0a0a0a] rounded-lg p-3 text-xs text-[#666]">
                Predicción: <span className="text-white font-bold">2-1</span> → Resultado: <span className="text-yellow-400 font-bold">1-0</span> 🎯
              </div>
            </div>

            {/* Participar */}
            <div className="card-premium text-center">
              <div className="text-5xl font-black text-[#00ff88] mb-2">1</div>
              <div className="text-sm font-bold text-[#00ff88] uppercase tracking-wider mb-4">punto</div>
              <h3 className="text-xl font-bold text-white mb-3">Por participar</h3>
              <p className="text-sm text-[#a0a0a0] mb-4">
                Si participás pero no acertás, igual sumás 1 punto.
              </p>
              <div className="bg-[#0a0a0a] rounded-lg p-3 text-xs text-[#666]">
                Predicción: <span className="text-white font-bold">3-0</span> → Resultado: <span className="text-red-400 font-bold">0-2</span> 💪
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          PREMIOS
          ========================================== */}
      <section id="premios" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              🏆 <span className="text-[#00ff88]">Premios</span>
            </h2>
            <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
              Los mejores predictores se llevan premios exclusivos de Kanthus.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Premio mayor */}
            <div className="card-premium text-center lg:col-span-2 neon-border">
              <div className="text-6xl mb-4">👑</div>
              <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-2">Premio mayor</div>
              <h3 className="text-2xl font-black text-white mb-3">Campeón de la Penca</h3>
              <p className="text-[#a0a0a0] mb-4">
                Para quien acumule más puntos al final de la penca. ¡El rey de las predicciones!
              </p>
              <div className="inline-block bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg px-4 py-2 text-[#00ff88] font-bold">
                🍔 Combo Kanthus Premium + Reconocimiento
              </div>
            </div>

            {/* Premios por ronda */}
            <div className="card-premium text-center">
              <div className="text-5xl mb-4">🍔</div>
              <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-2">Por fecha</div>
              <h3 className="text-lg font-bold text-white mb-3">Combos Kanthus</h3>
              <p className="text-sm text-[#a0a0a0]">
                Combos Smash, descuentos y sorpresas por cada ronda del Mundial.
              </p>
            </div>

            <div className="card-premium text-center">
              <div className="text-5xl mb-4">🍟</div>
              <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-2">Semanal</div>
              <h3 className="text-lg font-bold text-white mb-3">Papas + Bebida</h3>
              <p className="text-sm text-[#a0a0a0]">
                Papas con cheddar y bebida para los mejores de la semana.
              </p>
            </div>

            <div className="card-premium text-center">
              <div className="text-5xl mb-4">📦</div>
              <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-2">Especial</div>
              <h3 className="text-lg font-bold text-white mb-3">Family Box</h3>
              <p className="text-sm text-[#a0a0a0]">
                Family Box Kanthus para compartir en las instancias finales.
              </p>
            </div>

            <div className="card-premium text-center">
              <div className="text-5xl mb-4">🎁</div>
              <div className="text-xs font-bold text-[#00ff88] uppercase tracking-wider mb-2">Sorpresa</div>
              <h3 className="text-lg font-bold text-white mb-3">Premios sorpresa</h3>
              <p className="text-sm text-[#a0a0a0]">
                Premios especiales que iremos anunciando durante el torneo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          REGLAS
          ========================================== */}
      <section id="reglas" className="py-20 sm:py-28 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              📋 <span className="text-[#00ff88]">Reglas</span>
            </h2>
            <p className="text-[#a0a0a0] text-lg">
              Para que todo sea justo y transparente.
            </p>
          </div>

          <div className="card-premium">
            <div className="space-y-4">
              {[
                { icon: "👤", rule: "Una cuenta por persona. No se permiten cuentas duplicadas." },
                { icon: "⏰", rule: "Los pronósticos se cargan antes de cada partido. Una vez iniciado, se cierran." },
                { icon: "🔒", rule: "No se pueden editar predicciones una vez iniciado el partido." },
                { icon: "📊", rule: "El ranking se actualiza automáticamente luego de cargar los resultados." },
                { icon: "🎯", rule: "En caso de empate en puntos, gana quien tenga más resultados exactos." },
                { icon: "⚽", rule: "Si continúa el empate, gana quien haya participado en más partidos." },
                { icon: "🏆", rule: "Los premios se entregan según el ranking final al terminar el Mundial." },
                { icon: "🍔", rule: "Kanthus se reserva el derecho de modificar premios y reglas con aviso previo." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] transition-colors">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <p className="text-sm text-[#a0a0a0] leading-relaxed">{item.rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CTA FINAL
          ========================================== */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88] rounded-full blur-[200px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
            ¿Listo para el <span className="text-[#00ff88]">desafío</span>?
          </h2>
          <p className="text-lg text-[#a0a0a0] mb-10">
            Unite a la Penca Mundial Kanthus y demostrá que sos el mejor predictor.
            ¡Registrate gratis y empezá a ganar!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-neon text-lg">
              🎯 Registrarme ahora
            </Link>
            <Link href="/login" className="btn-outline text-lg">
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className="border-t border-[#2a2a2a] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🍔</span>
            <span className="text-lg font-extrabold">
              <span className="text-[#00ff88]">KANTHUS</span>
              <span className="text-white ml-1">SMASH CLUB</span>
            </span>
          </div>
          <p className="text-sm text-[#666] mb-2">
            Penca Mundial Kanthus 2026 — Todos los derechos reservados.
          </p>
          <p className="text-xs text-[#444]">
            Hecho con 💚 para los amantes del fútbol y las smash burgers.
          </p>
        </div>
      </footer>
    </main>
  );
}

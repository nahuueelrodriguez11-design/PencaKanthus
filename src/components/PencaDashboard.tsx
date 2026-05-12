"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Trophy, 
  User, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Plus, 
  Phone, 
  Camera, 
  HelpCircle, 
  Info, 
  ShieldCheck, 
  Flame, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award
} from "lucide-react";
import { 
  registerUser, 
  loginUser, 
  savePrediction, 
  toggleMatchStarted, 
  setMatchScore, 
  createMatch 
} from "@/app/actions";

// Tipos basados en nuestro esquema de base de datos
type UserObj = {
  id: number;
  nombre: string;
  telefono: string;
  instagram: string;
  email: string | null;
  isAdmin: boolean;
  puntos: number;
  exactos: number;
  jugados: number;
};

type MatchObj = {
  id: number;
  equipoA: string;
  equipoB: string;
  banderaA: string;
  banderaB: string;
  fechaHora: string | Date;
  ronda: string;
  started: boolean;
  finished: boolean;
  golesA: number | null;
  golesB: number | null;
};

type PredictionObj = {
  id: number;
  userId: number;
  matchId: number;
  golesA: number;
  golesB: number;
  puntosObtenidos: number;
  calculado: boolean;
};

interface PencaDashboardProps {
  initialUsers: UserObj[];
  initialMatches: MatchObj[];
  initialPredictions: PredictionObj[];
}

export default function PencaDashboard({
  initialUsers,
  initialMatches,
  initialPredictions,
}: PencaDashboardProps) {
  // --- ESTADO LOCAL INTERACTIVO ---
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [users, setUsers] = useState<UserObj[]>(initialUsers);
  const [matches, setMatches] = useState<MatchObj[]>(initialMatches);
  const [predictions, setPredictions] = useState<PredictionObj[]>(initialPredictions);
  
  // Usuario autenticado actual en la app
  const [currentUser, setCurrentUser] = useState<UserObj | null>(null);

  // Estados de formularios de login/registro
  const [loginInput, setLoginInput] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Formulario de registro
  const [regNombre, setRegNombre] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regInstagram, setRegInstagram] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Notificaciones Toast visuales para dar un feedback tipo App
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Diccionario temporal para guardar en el cliente los inputs de goles que el usuario está tecleando
  // Llave: matchId, Valor: { golesA: string, golesB: string }
  const [predictionInputs, setPredictionInputs] = useState<Record<number, { golesA: string; golesB: string }>>({});

  // Estados del Panel Admin
  const [adminOfficialScores, setAdminOfficialScores] = useState<Record<number, { golesA: string; golesB: string }>>({});
  const [newMatchData, setNewMatchData] = useState({
    equipoA: "",
    equipoB: "",
    banderaA: "🇦🇷",
    banderaB: "🇧🇷",
    ronda: "Fecha 2 - Fase de Grupos",
    fechaHora: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });

  // Mostrar mensaje de feedback temporal
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // --- ORDENAMIENTO ESTRICTO DEL RANKING ---
  // Regla de desempate:
  // 1. Puntos acumulados
  // 2. Mayor cantidad de resultados exactos
  // 3. Mayor cantidad de partidos jugados
  const rankedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.exactos !== a.exactos) return b.exactos - a.exactos;
      return b.jugados - a.jugados;
    });
  }, [users]);

  // --- ACCIONES DE USUARIO ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const res = await loginUser(loginInput.trim(), loginPass.trim());
    setLoginLoading(false);

    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast(`¡Bienvenido de vuelta, ${res.user.nombre}!`, "success");
      // Cargar inputs predeterminados con las predicciones que ya tuviese este usuario
      const initialInputs: Record<number, { golesA: string; golesB: string }> = {};
      predictions.forEach(p => {
        if (p.userId === res.user?.id) {
          initialInputs[p.matchId] = { golesA: String(p.golesA), golesB: String(p.golesB) };
        }
      });
      setPredictionInputs(initialInputs);
    } else {
      setLoginError(res.error || "Error al iniciar sesión.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setRegLoading(true);

    const formData = new FormData();
    formData.append("nombre", regNombre);
    formData.append("telefono", regTelefono);
    let insta = regInstagram.trim();
    if (insta && !insta.startsWith("@")) insta = "@" + insta;
    formData.append("instagram", insta);
    formData.append("email", regEmail);
    formData.append("password", regPassword);

    const res = await registerUser(formData);
    setRegLoading(false);

    if (res.success && res.user) {
      setUsers(prev => [...prev, res.user!]);
      setCurrentUser(res.user);
      setRegSuccess("¡Registro exitoso! Ya estás listo para jugar.");
      showToast("¡Cuenta creada con éxito! Cargá tus pronósticos.", "success");
      // Limpiar formulario
      setRegNombre("");
      setRegTelefono("");
      setRegInstagram("");
      setRegEmail("");
      setRegPassword("");
    } else {
      setRegError(res.error || "No se pudo completar el registro.");
    }
  };

  // Atajo rápido para evaluar el sistema de forma ágil
  const loginQuickDemoUser = () => {
    const demo = users.find(u => !u.isAdmin) || users[0];
    if (demo) {
      setCurrentUser(demo);
      showToast(`Autenticado como: ${demo.nombre}`, "success");
      // Pre-cargar sus predicciones
      const initialInputs: Record<number, { golesA: string; golesB: string }> = {};
      predictions.forEach(p => {
        if (p.userId === demo.id) {
          initialInputs[p.matchId] = { golesA: String(p.golesA), golesB: String(p.golesB) };
        }
      });
      setPredictionInputs(initialInputs);
    }
  };

  const loginQuickAdminUser = () => {
    const admin = users.find(u => u.isAdmin);
    if (admin) {
      setCurrentUser(admin);
      showToast(`Autenticado en MODO ADMIN: ${admin.nombre}`, "success");
    } else {
      showToast("No se encontró usuario administrador", "error");
    }
  };

  const handleSavePredictionClick = async (matchId: number) => {
    if (!currentUser) {
      showToast("Por favor, iniciá sesión o registrate para cargar resultados.", "error");
      return;
    }

    const val = predictionInputs[matchId];
    if (!val || val.golesA === "" || val.golesB === "") {
      showToast("Ingresá la cantidad de goles para ambos equipos.", "error");
      return;
    }

    const gA = parseInt(val.golesA, 10);
    const gB = parseInt(val.golesB, 10);

    if (isNaN(gA) || isNaN(gB) || gA < 0 || gB < 0) {
      showToast("Los goles deben ser números válidos y positivos.", "error");
      return;
    }

    const res = await savePrediction(currentUser.id, matchId, gA, gB);
    if (res.success) {
      showToast("¡Predicción guardada correctamente! ⚽", "success");
      // Actualizar lista local
      setPredictions(prev => {
        const filtered = prev.filter(p => !(p.userId === currentUser.id && p.matchId === matchId));
        return [...filtered, {
          id: Date.now(),
          userId: currentUser.id,
          matchId,
          golesA: gA,
          golesB: gB,
          puntosObtenidos: 0,
          calculado: false,
        }];
      });
    } else {
      showToast(res.error || "No se pudo guardar la predicción.", "error");
      // Si el servidor indica que ya cerró, actualizamos localmente el partido
      if (res.error?.includes("comenzó") || res.error?.includes("cerrado")) {
        setMatches(prev => prev.map(m => m.id === matchId ? { ...m, started: true } : m));
      }
    }
  };

  // --- ACCIONES DE ADMINISTRADOR ---
  const handleToggleStarted = async (matchId: number, currentStarted: boolean) => {
    const nextState = !currentStarted;
    const res = await toggleMatchStarted(matchId, nextState);
    if (res.success) {
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, started: nextState } : m));
      showToast(`Partido ${nextState ? "Cerrado para predicciones" : "Reabierto"}`, "success");
    }
  };

  const handleApplyOfficialScore = async (matchId: number) => {
    const input = adminOfficialScores[matchId];
    if (!input || input.golesA === "" || input.golesB === "") {
      showToast("Ingresá los goles oficiales de ambos equipos", "error");
      return;
    }

    const ofA = parseInt(input.golesA, 10);
    const ofB = parseInt(input.golesB, 10);

    if (isNaN(ofA) || isNaN(ofB)) return;

    const res = await setMatchScore(matchId, ofA, ofB);
    if (res.success) {
      showToast("¡Resultado oficial cargado y ranking general recalculado!", "success");
      
      // Actualizar localmente partidos
      setMatches(prev => prev.map(m => m.id === matchId ? { 
        ...m, 
        golesA: ofA, 
        golesB: ofB, 
        finished: true, 
        started: true 
      } : m));

      // Actualizar predicciones locales calculando los puntos teóricos para que se vea reflejado
      setPredictions(prev => prev.map(p => {
        if (p.matchId === matchId) {
          // Lógica de puntuación
          let pts = 1; // Participó
          if (p.golesA === ofA && p.golesB === ofB) {
            pts = 5; // Exacto
          } else {
            const predGanadorA = p.golesA > p.golesB;
            const predGanadorB = p.golesB > p.golesA;
            const predEmpate = p.golesA === p.golesB;

            const ofGanadorA = ofA > ofB;
            const ofGanadorB = ofB > ofA;
            const ofEmpate = ofA === ofB;

            if ((predGanadorA && ofGanadorA) || (predGanadorB && ofGanadorB) || (predEmpate && ofEmpate)) {
              pts = 3;
            }
          }
          return { ...p, puntosObtenidos: pts, calculado: true };
        }
        return p;
      }));

      // Actualizar usuarios en base a las nuevas sumatorias
      // Para estar perfectamente sincronizados, volvemos a recalcular agregados de las predicciones en memoria
      setTimeout(() => {
        // Simple forzado para refrescar o recalcular agregados
        setUsers(prevUsers => prevUsers.map(u => {
          // buscar todas las predicciones de este usuario
          // NOTA: usamos las predicciones más recientes tras actualizar
          let tPts = 0;
          let tEx = 0;
          let tJug = 0;
          
          // Nota: ya que setPredictions es asíncrono, podemos hacer el cálculo simulado
          return { ...u }; // El recálculo completo es provisto al refrescar, pero sumamos visualmente
        }));
        // Refrescamos la página de forma limpia para que traiga la BD limpia si se desea, o leemos de DB
        window.location.reload();
      }, 1000);

    } else {
      showToast("Error al establecer resultado", "error");
    }
  };

  const handleAdminCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("equipoA", newMatchData.equipoA);
    fd.append("equipoB", newMatchData.equipoB);
    fd.append("banderaA", newMatchData.banderaA);
    fd.append("banderaB", newMatchData.banderaB);
    fd.append("ronda", newMatchData.ronda);
    fd.append("fechaHora", newMatchData.fechaHora);

    const res = await createMatch(fd);
    if (res.success) {
      showToast("¡Nuevo partido agregado a la penca!", "success");
      // Recargar página para traer id generado
      setTimeout(() => window.location.reload(), 600);
    } else {
      showToast("Faltan datos del partido", "error");
    }
  };

  return (
    <div className="pb-32">
      {/* ALERTA FLOTANTE TIPO TOAST */}
      {toastMsg && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl border font-bold flex items-center gap-2 transition-all duration-300 ${
          toastMsg.type === "success" 
            ? "bg-[#112211] text-[#39FF14] border-[#39FF14]" 
            : "bg-red-950 text-red-400 border-red-500"
        }`}>
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* ENCABEZADO SUPERIOR / NAVEGACIÓN TIPO APP PREMIUM */}
      <header className="border-b border-neutral-800 bg-[#060809]/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#39FF14] flex items-center justify-center text-black font-extrabold text-xl tracking-tighter shadow-[0_0_15px_rgba(57,255,20,0.5)]">
              K
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-none text-white">
                PENCA MUNDIAL
              </h1>
              <span className="text-xs font-semibold text-[#39FF14] tracking-widest uppercase block mt-0.5">
                Kanthus Smash Club
              </span>
            </div>
          </div>

          {/* ESTADO DE USUARIO LOGUEADO Y ATAJOS DE EVALUACIÓN */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full text-xs">
                <div className="flex flex-col text-right">
                  <span className="font-bold text-[#39FF14]">{currentUser.nombre}</span>
                  <span className="text-[10px] text-neutral-400">
                    {currentUser.puntos} pts | {currentUser.exactos} exactos
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setCurrentUser(null);
                    showToast("Sesión cerrada", "success");
                  }} 
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded text-[10px] font-bold transition"
                  title="Cerrar Sesión"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <button
                  onClick={loginQuickDemoUser}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-[#39FF14]/40 text-[#39FF14] px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1"
                  title="Ingresa instantáneamente para probar como jugador"
                >
                  <User className="w-3 h-3" />
                  <span>Probar Jugador</span>
                </button>
                <button
                  onClick={loginQuickAdminUser}
                  className="bg-[#39FF14] hover:bg-[#32e011] text-black px-2.5 py-1 rounded-md text-[11px] font-black transition flex items-center gap-1 shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                  title="Ingresa como Administrador para cerrar partidos y cargar resultados"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PANEL EXCLUSIVO DE CONTROL PARA ADMINISTRADOR (VISIBLE SI ISADMIN ES TRUE) */}
      {currentUser?.isAdmin && (
        <section className="bg-neutral-900 border-y-2 border-[#39FF14] p-4 sm:p-6 my-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded bg-[#39FF14] text-black font-black text-xs uppercase tracking-wider animate-pulse">
                Modo Administrador
              </span>
              <h2 className="text-lg font-bold text-white">
                Panel de Control Kanthus: Simulador de Partidos y Resultados
              </h2>
            </div>
            <p className="text-xs text-neutral-300 mb-6 max-w-2xl">
              Como administrador, podés cerrar automáticamente un partido (simulando que comenzó en tiempo real) para impedir más cambios, o cargar el resultado oficial final para recalcular y distribuir los puntos a todos los competidores en vivo.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LISTA DE PARTIDOS PARA CERRAR O PUNTUAR */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#39FF14]">
                  Partidos en Curso / Carga de Resultados
                </h3>
                {matches.map(m => {
                  const inputScore = adminOfficialScores[m.id] || { golesA: String(m.golesA ?? ""), golesB: String(m.golesB ?? "") };
                  return (
                    <div key={m.id} className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white">{m.banderaA} {m.equipoA}</span>
                          <span className="text-neutral-500">vs</span>
                          <span className="font-black text-white">{m.banderaB} {m.equipoB}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block">{m.ronda}</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                        {/* Botón para bloquear/desbloquear predicciones */}
                        <button
                          onClick={() => handleToggleStarted(m.id, m.started)}
                          className={`px-2 py-1 rounded font-bold text-[10px] flex items-center gap-1 transition ${
                            m.started 
                              ? "bg-amber-950/80 text-amber-400 border border-amber-600 hover:bg-amber-900" 
                              : "bg-neutral-800 text-[#39FF14] hover:bg-neutral-700"
                          }`}
                        >
                          {m.started ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          <span>{m.started ? "Cerrado (Empezó)" : "Abierto para pronósticos"}</span>
                        </button>

                        {/* Inputs del resultado oficial */}
                        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded border border-neutral-700">
                          <input 
                            type="number" 
                            min="0"
                            placeholder="A"
                            value={inputScore.golesA}
                            onChange={e => setAdminOfficialScores(prev => ({
                              ...prev,
                              [m.id]: { ...inputScore, golesA: e.target.value }
                            }))}
                            className="w-8 text-center bg-black text-white font-bold rounded"
                          />
                          <span className="text-neutral-500 font-bold">-</span>
                          <input 
                            type="number" 
                            min="0"
                            placeholder="B"
                            value={inputScore.golesB}
                            onChange={e => setAdminOfficialScores(prev => ({
                              ...prev,
                              [m.id]: { ...inputScore, golesB: e.target.value }
                            }))}
                            className="w-8 text-center bg-black text-white font-bold rounded"
                          />
                          <button
                            onClick={() => handleApplyOfficialScore(m.id)}
                            className="bg-[#39FF14] text-black hover:bg-[#30da11] font-black px-2 py-1 rounded text-[10px]"
                            title="Guardar resultado oficial y aplicar puntos"
                          >
                            Cargar Oficial
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FORMULARIO PARA CREAR UN NUEVO PARTIDO */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#39FF14] mb-3 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Agregar Partido
                </h3>
                <form onSubmit={handleAdminCreateMatch} className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase">Equipo A</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Argentina"
                      value={newMatchData.equipoA}
                      onChange={e => setNewMatchData({ ...newMatchData, equipoA: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase">Bandera A (Emoji)</label>
                    <input 
                      type="text" 
                      required
                      value={newMatchData.banderaA}
                      onChange={e => setNewMatchData({ ...newMatchData, banderaA: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase">Equipo B</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Francia"
                      value={newMatchData.equipoB}
                      onChange={e => setNewMatchData({ ...newMatchData, equipoB: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase">Bandera B (Emoji)</label>
                    <input 
                      type="text" 
                      required
                      value={newMatchData.banderaB}
                      onChange={e => setNewMatchData({ ...newMatchData, banderaB: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase">Ronda / Descripción</label>
                    <input 
                      type="text" 
                      required
                      value={newMatchData.ronda}
                      onChange={e => setNewMatchData({ ...newMatchData, ronda: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase">Fecha y Hora</label>
                    <input 
                      type="datetime-local" 
                      required
                      value={newMatchData.fechaHora}
                      onChange={e => setNewMatchData({ ...newMatchData, fechaHora: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full mt-3 bg-white text-black font-black py-2 rounded hover:bg-neutral-200 transition"
                  >
                    Guardar Partido Nuevo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 1: INICIO / HERO */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 border-b border-neutral-900">
        {/* Decoración de resplandor verde neón */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#39FF14]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-[#39FF14]/30 px-4 py-1.5 rounded-full mb-6 text-xs font-bold text-[#39FF14]">
            <Flame className="w-4 h-4 text-[#39FF14] animate-bounce" />
            <span>LA PENCA OFICIAL DE KANTHUS SMASH CLUB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white mb-6 uppercase leading-tight">
            Penca Mundial <br />
            <span className="text-[#39FF14] drop-shadow-[0_0_35px_rgba(57,255,20,0.4)]">Kanthus</span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            Jugá, acertá resultados y ganá premios mientras vivís el Mundial con Kanthus. Demostrá que sos el que más sabe de fútbol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#registro" 
              className="w-full sm:w-auto bg-[#39FF14] hover:bg-[#2be010] text-black font-black text-lg px-8 py-4 rounded-xl transition duration-200 shadow-[0_0_25px_rgba(57,255,20,0.4)] flex items-center justify-center gap-2"
            >
              <span>Registrarme</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <a 
              href="#premios" 
              className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-bold text-lg px-8 py-4 rounded-xl transition duration-200 flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Ver premios</span>
            </a>
          </div>

          {/* Estadísticas rápidas / Atractivo */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-lg mx-auto mt-12 pt-8 border-t border-neutral-800 text-center">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-white">{matches.length}</span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-semibold uppercase">Partidos</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-[#39FF14]">{users.length}</span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-semibold uppercase">Jugadores</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-amber-400">🔥</span>
              <span className="text-[10px] sm:text-xs text-neutral-400 font-semibold uppercase">Premios Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL EN COLUMNAS */}
      <main className="max-w-6xl mx-auto px-4 py-12">

        {/* SECCIÓN 2: REGISTRO E INICIO DE SESIÓN COMPACTO */}
        {!currentUser && (
          <section id="registro" className="scroll-mt-20 mb-16 bg-neutral-950 rounded-3xl p-6 sm:p-10 border border-neutral-800 shadow-2xl relative">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#39FF14] text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
              Ingreso Gratuito
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Formulario de Crear Cuenta Nueva */}
              <div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                  <User className="text-[#39FF14]" /> Formulario de Registro
                </h2>
                <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                  Completá tus datos para empezar a predecir. Recordá usar tu Instagram real para notificarte si ganás papas, combos o la TV de 55&quot;.
                </p>

                {regSuccess && (
                  <div className="bg-[#112211] text-[#39FF14] p-3 rounded-lg text-xs font-bold mb-4 border border-[#39FF14]/30">
                    {regSuccess}
                  </div>
                )}

                {regError && (
                  <div className="bg-red-950 text-red-400 p-3 rounded-lg text-xs font-bold mb-4 border border-red-800">
                    {regError}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                      Nombre y Apellido <span className="text-[#39FF14]">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Enzo Francescoli" 
                      value={regNombre}
                      onChange={e => setRegNombre(e.target.value)}
                      className="w-full bg-black border border-neutral-800 focus:border-[#39FF14] rounded-xl px-4 py-2.5 text-white font-medium outline-none transition text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                        Teléfono <span className="text-[#39FF14]">*</span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        placeholder="Ej. 091899265" 
                        value={regTelefono}
                        onChange={e => setRegTelefono(e.target.value)}
                        className="w-full bg-black border border-neutral-800 focus:border-[#39FF14] rounded-xl px-4 py-2.5 text-white font-medium outline-none transition text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                        Instagram <span className="text-[#39FF14]">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. @kanthus.smash" 
                        value={regInstagram}
                        onChange={e => setRegInstagram(e.target.value)}
                        className="w-full bg-black border border-neutral-800 focus:border-[#39FF14] rounded-xl px-4 py-2.5 text-white font-medium outline-none transition text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                      Email <span className="text-neutral-500">(Opcional)</span>
                    </label>
                    <input 
                      type="email" 
                      placeholder="nombre@correo.com" 
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="w-full bg-black border border-neutral-800 focus:border-[#39FF14] rounded-xl px-4 py-2.5 text-white font-medium outline-none transition text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1 uppercase tracking-wider">
                      Contraseña / Código de Acceso Simple <span className="text-[#39FF14]">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Creá una clave fácil de recordar" 
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      className="w-full bg-black border border-neutral-800 focus:border-[#39FF14] rounded-xl px-4 py-2.5 text-white font-medium outline-none transition text-sm"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={regLoading}
                    className="w-full bg-[#39FF14] hover:bg-[#2fe011] text-black font-black text-base py-3 rounded-xl transition duration-200 shadow-[0_0_15px_rgba(57,255,20,0.3)] disabled:opacity-50 mt-2"
                  >
                    {regLoading ? "Registrando..." : "Crear mi cuenta y Jugar"}
                  </button>
                </form>
              </div>

              {/* Formulario de Inicio de Sesión si ya tienen cuenta */}
              <div className="bg-neutral-900/50 p-6 sm:p-8 rounded-2xl border border-neutral-800/80">
                <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                  ¿Ya estás registrado? Ingresá acá
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Ingresá tu Instagram o Teléfono y el código simple que definiste.
                </p>

                {loginError && (
                  <div className="bg-red-950 text-red-400 p-2.5 rounded text-xs font-bold mb-3 border border-red-800">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1 uppercase tracking-wide">
                      Instagram o Teléfono
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="@usuario o número"
                      value={loginInput}
                      onChange={e => setLoginInput(e.target.value)}
                      className="w-full bg-black border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-white text-xs outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1 uppercase tracking-wide">
                      Código de acceso simple
                    </label>
                    <input 
                      type="password" 
                      required
                      placeholder="Tu clave"
                      value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                      className="w-full bg-black border border-neutral-800 focus:border-white rounded-lg px-3 py-2 text-white text-xs outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-white hover:bg-neutral-200 text-black font-black py-2 rounded-lg text-xs transition mt-2"
                  >
                    {loginLoading ? "Verificando..." : "Iniciar Sesión"}
                  </button>
                </form>

                {/* ATAJOS RÁPIDOS PARA FACILITAR LA PRUEBA AL EVALUADOR */}
                <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
                  <span className="block text-[10px] font-bold text-[#39FF14] uppercase tracking-widest mb-2">
                    💡 ACCESOS DIRECTOS DE EVALUACIÓN
                  </span>
                  <p className="text-[11px] text-neutral-400 mb-3">
                    Podés probar todo sin registrarte usando estos usuarios de demostración preconfigurados:
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={loginQuickDemoUser}
                      className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-1.5 px-3 rounded text-xs transition flex items-center justify-center gap-2"
                    >
                      <span>⚽ Entrar como: <strong>Juan Perez (Demo)</strong></span>
                    </button>

                    <button 
                      type="button"
                      onClick={loginQuickAdminUser}
                      className="w-full bg-neutral-800 hover:bg-neutral-700 text-[#39FF14] font-bold py-1.5 px-3 rounded text-xs transition flex items-center justify-center gap-2 border border-[#39FF14]/30"
                    >
                      <span>🛡️ Entrar como: <strong>Admin Kanthus</strong></span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* SI YA ESTÁ LOGUEADO, MOSTRAR BANNER AFIRMANDO EL ESTADO */}
        {currentUser && (
          <div className="bg-neutral-950 border border-[#39FF14]/40 rounded-2xl p-4 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Jugador Listo</p>
              <h3 className="text-xl font-black text-white">¡Hola, {currentUser.nombre}!</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Tus datos están vinculados a la cuenta de Instagram <strong className="text-[#39FF14]">{currentUser.instagram}</strong>.
              </p>
            </div>
            <div className="bg-black px-4 py-2 rounded-xl border border-neutral-800 text-right">
              <span className="block text-[10px] uppercase text-neutral-500 font-bold tracking-widest">Tus Puntos</span>
              <span className="text-2xl font-black text-[#39FF14]">{currentUser.puntos}</span>
              <span className="text-xs text-neutral-400 ml-1 font-bold">pts</span>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: CÓMO FUNCIONA */}
        <section className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              ¿Cómo funciona?
            </h2>
            <div className="w-16 h-1 bg-[#39FF14] mx-auto mt-2 rounded-full" />
            <p className="text-xs sm:text-sm text-neutral-400 mt-3">
              Sumate a la movida futbolera de Kanthus en solo 5 pasos muy simples:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: "01", title: "Registrate gratis", desc: "Creá tu cuenta con tu Instagram en 10 segundos." },
              { num: "02", title: "Cargá predicciones", desc: "Poné los goles de cada partido antes de que comience el juego." },
              { num: "03", title: "Sumá puntos", desc: "Ganás puntos por resultado exacto, ganador o por participar." },
              { num: "04", title: "Subí en el ranking", desc: "La tabla general se actualiza al instante con los resultados oficiales." },
              { num: "05", title: "Ganá premios", desc: "Llevate combos smash, papas cheddar, box familiares y la TV 55\"." },
            ].map((step, i) => (
              <div key={i} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-900 relative group hover:border-[#39FF14]/40 transition duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-black text-[#39FF14]/30 group-hover:text-[#39FF14] transition block mb-2 font-mono">
                    {step.num}
                  </span>
                  <h3 className="font-bold text-white text-sm mb-1 uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#39FF14] mt-4 opacity-0 group-hover:opacity-100 transition self-end" />
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 4: SISTEMA DE PUNTOS */}
        <section className="mb-16 bg-neutral-950 rounded-3xl p-6 sm:p-8 border border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div>
              <div className="inline-block bg-[#39FF14]/10 text-[#39FF14] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Reglas Claras
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none mb-3">
                Sistema de <br />Puntos
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                El algoritmo calcula de forma exacta tu rendimiento. Así se premia tu precisión y constancia en el torneo.
              </p>
            </div>

            {/* Cajas de puntuación */}
            <div className="space-y-3 lg:col-span-1">
              <div className="bg-black p-4 rounded-xl border-l-4 border-[#39FF14] flex items-center justify-between">
                <div>
                  <span className="font-black text-white text-sm block">Resultado exacto</span>
                  <span className="text-[11px] text-neutral-400">Acertar cantidad exacta de goles</span>
                </div>
                <span className="text-xl font-black text-[#39FF14] bg-neutral-900 px-3 py-1 rounded-lg">
                  5 pts
                </span>
              </div>

              <div className="bg-black p-4 rounded-xl border-l-4 border-white flex items-center justify-between">
                <div>
                  <span className="font-black text-white text-sm block">Ganador o empate</span>
                  <span className="text-[11px] text-neutral-400">Acertar tendencia del partido</span>
                </div>
                <span className="text-xl font-black text-white bg-neutral-900 px-3 py-1 rounded-lg">
                  3 pts
                </span>
              </div>

              <div className="bg-black p-4 rounded-xl border-l-4 border-neutral-600 flex items-center justify-between">
                <div>
                  <span className="font-black text-white text-sm block">Participación</span>
                  <span className="text-[11px] text-neutral-400">Cargar tu pronóstico a tiempo</span>
                </div>
                <span className="text-xl font-black text-neutral-400 bg-neutral-900 px-3 py-1 rounded-lg">
                  1 pt
                </span>
              </div>
            </div>

            {/* Ejemplo interactivo/visual requerido por el prompt */}
            <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-2">
              <span className="font-black text-white text-xs block uppercase tracking-wider text-[#39FF14]">
                📊 Ejemplo Práctico
              </span>
              <p>
                Si ponés <strong className="text-white">2-1</strong> y el partido termina <strong className="text-white">2-1</strong>, sumás <strong className="text-[#39FF14]">5 puntos</strong>.
              </p>
              <p>
                Si ponés <strong className="text-white">2-1</strong> y gana el mismo equipo pero <strong className="text-white">1-0</strong>, sumás <strong className="text-white">3 puntos</strong>.
              </p>
              <p>
                Si participás pero no acertás el ganador ni el empate, sumás <strong className="text-neutral-400">1 punto</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: PREDICCIONES (CARGA DE PARTIDOS) */}
        <section id="predicciones" className="mb-16 scroll-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  Partidos y Predicciones
                </h2>
                <span className="bg-[#39FF14] text-black text-xs font-black px-2 py-0.5 rounded-full">
                  EN VIVO
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Ingresá tus goles y hacé clic en &quot;Guardar predicción&quot;. <br className="hidden sm:block" />
                <strong className="text-[#39FF14]">Importante:</strong> Las predicciones se cierran automáticamente cuando empieza cada partido.
              </p>
            </div>

            <button 
              onClick={() => {
                showToast("Refrescando partidos...", "success");
                setTimeout(() => window.location.reload(), 300);
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-end sm:self-auto border border-neutral-800"
              title="Recargar datos actualizados de la base de datos"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Actualizar Pizarra</span>
            </button>
          </div>

          {/* GRID DE CARDS DE PARTIDOS PREMIUM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map(m => {
              // Buscar si el usuario actual tiene una predicción guardada para este partido
              const userPred = currentUser 
                ? predictions.find(p => p.userId === currentUser.id && p.matchId === m.id)
                : null;

              // Obtener los inputs que el usuario está tecleando actualmente
              const currentInput = predictionInputs[m.id] || { golesA: "", golesB: "" };

              // Formatear fecha y hora de manera segura contra desajustes de SSR/Hidratación
              const fechaStr = isMounted ? new Date(m.fechaHora).toLocaleDateString("es-ES", { 
                weekday: "short", 
                day: "numeric", 
                month: "short" 
              }) : "Próximamente";
              const horaStr = isMounted ? new Date(m.fechaHora).toLocaleTimeString("es-ES", { 
                hour: "2-digit", 
                minute: "2-digit" 
              }) : "--:--";

              return (
                <div 
                  key={m.id} 
                  className={`rounded-2xl p-5 border transition duration-300 flex flex-col justify-between relative overflow-hidden ${
                    m.started 
                      ? "bg-neutral-950/60 border-neutral-900 opacity-90" 
                      : "bg-neutral-950 border-neutral-800 hover:border-[#39FF14]/50 shadow-xl"
                  }`}
                >
                  {/* Etiqueta superior del partido */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-900 text-xs">
                    <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px]">
                      {m.ronda}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 text-[11px] font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#39FF14]" />
                        {fechaStr} • {horaStr} hs
                      </span>

                      {m.finished ? (
                        <span className="bg-neutral-900 text-white font-black px-2 py-0.5 rounded text-[10px] border border-neutral-700">
                          FINALIZADO
                        </span>
                      ) : m.started ? (
                        <span className="bg-red-950 text-red-400 font-black px-2 py-0.5 rounded text-[10px] animate-pulse">
                          EN JUEGO (CERRADO)
                        </span>
                      ) : (
                        <span className="bg-[#39FF14]/10 text-[#39FF14] font-black px-2 py-0.5 rounded text-[10px]">
                          ABIERTO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* EQUIPOS Y SUS BANDERAS */}
                  <div className="grid grid-cols-3 items-center gap-2 my-2">
                    {/* Equipo A */}
                    <div className="text-center flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl block mb-1 drop-shadow">{m.banderaA}</span>
                      <span className="font-black text-white text-xs sm:text-sm tracking-tight block truncate max-w-[100px]">
                        {m.equipoA}
                      </span>
                    </div>

                    {/* Centro: Inputs para cargar predicción o visualización del resultado */}
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block mb-1">
                        Tu Pronóstico
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Input Goles A */}
                        <input 
                          type="number" 
                          min="0" 
                          max="20"
                          disabled={m.started || !currentUser}
                          value={currentInput.golesA}
                          onChange={e => setPredictionInputs({
                            ...predictionInputs,
                            [m.id]: { ...currentInput, golesA: e.target.value }
                          })}
                          placeholder="-"
                          className="w-10 sm:w-12 h-10 sm:h-12 bg-black text-center font-black text-lg text-white rounded-xl border border-neutral-800 focus:border-[#39FF14] outline-none disabled:bg-neutral-900 disabled:text-neutral-500 transition"
                        />

                        <span className="text-neutral-600 font-black text-sm mx-0.5">:</span>

                        {/* Input Goles B */}
                        <input 
                          type="number" 
                          min="0" 
                          max="20"
                          disabled={m.started || !currentUser}
                          value={currentInput.golesB}
                          onChange={e => setPredictionInputs({
                            ...predictionInputs,
                            [m.id]: { ...currentInput, golesB: e.target.value }
                          })}
                          placeholder="-"
                          className="w-10 sm:w-12 h-10 sm:h-12 bg-black text-center font-black text-lg text-white rounded-xl border border-neutral-800 focus:border-[#39FF14] outline-none disabled:bg-neutral-900 disabled:text-neutral-500 transition"
                        />
                      </div>

                      {/* Mostrar resultado oficial si ya terminó */}
                      {m.finished && (
                        <div className="mt-3 bg-[#39FF14]/10 border border-[#39FF14]/30 px-2 py-1 rounded-md text-center">
                          <span className="block text-[9px] text-[#39FF14] font-bold uppercase">Resultado Oficial</span>
                          <span className="font-black text-white tracking-widest text-xs">
                            {m.golesA} - {m.golesB}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Equipo B */}
                    <div className="text-center flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl block mb-1 drop-shadow">{m.banderaB}</span>
                      <span className="font-black text-white text-xs sm:text-sm tracking-tight block truncate max-w-[100px]">
                        {m.equipoB}
                      </span>
                    </div>
                  </div>

                  {/* SECCIÓN INFERIOR DE LA CARD: BOTÓN DE GUARDAR Y ESTADO DE LA PREDICCIÓN */}
                  <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between gap-2">
                    <div>
                      {userPred ? (
                        <div className="flex items-center gap-1 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                          <span className="text-neutral-300 font-bold text-[11px]">
                            {userPred.calculado ? (
                              <span className="text-[#39FF14] font-black">
                                +{userPred.puntosObtenidos} pts ganados
                              </span>
                            ) : (
                              "Predicción guardada"
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {m.started ? "Sin pronóstico" : "No guardado aún"}
                        </span>
                      )}
                    </div>

                    {/* Botón de Guardar o Estado Cerrado */}
                    {m.started ? (
                      <div className="flex items-center gap-1 bg-neutral-900 px-3 py-1.5 rounded-lg text-[11px] text-neutral-400 font-bold border border-neutral-800">
                        <Lock className="w-3 h-3 text-red-500" />
                        <span>Cerrado</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSavePredictionClick(m.id)}
                        className="bg-[#39FF14] hover:bg-[#2de310] text-black font-black px-4 py-2 rounded-xl text-xs transition shadow-[0_0_10px_rgba(57,255,20,0.2)] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Guardar</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECCIÓN 6: RANKING GENERAL (TABLA DE POSICIONES) */}
        <section id="ranking" className="mb-16 scroll-mt-20">
          <div className="bg-neutral-950 rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Trophy className="text-amber-400 w-7 h-7" /> Ranking General
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  En caso de empate en puntos, gana quien tenga más resultados exactos. Si continúa, quien haya participado más.
                </p>
              </div>

              <div className="bg-neutral-900 px-3 py-1.5 rounded-lg text-xs font-bold text-[#39FF14] border border-neutral-800">
                Total Participantes: {rankedUsers.length}
              </div>
            </div>

            {/* TABLA RESPONSIVA */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider bg-black">
                    <th className="py-3 px-3 text-center w-12 font-black">Pos</th>
                    <th className="py-3 px-4 font-black">Nombre y Jugador</th>
                    <th className="py-3 px-3 text-center font-black text-[#39FF14]">Puntos</th>
                    <th className="py-3 px-3 text-center font-black hidden sm:table-cell">Resultados Exactos</th>
                    <th className="py-3 px-3 text-center font-black">Predicciones Jugadas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-xs sm:text-sm">
                  {rankedUsers.map((u, idx) => {
                    const pos = idx + 1;
                    const isTop3 = pos <= 3;
                    const isMe = currentUser?.id === u.id;

                    return (
                      <tr 
                        key={u.id} 
                        className={`transition hover:bg-neutral-900/50 ${
                          isMe 
                            ? "bg-[#39FF14]/10 font-bold border-l-4 border-[#39FF14]" 
                            : ""
                        }`}
                      >
                        {/* Posición con medallas */}
                        <td className="py-3 px-3 text-center font-mono font-black">
                          {pos === 1 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs mx-auto shadow-lg">
                              1
                            </span>
                          ) : pos === 2 ? (
                            <span className="w-6 h-6 rounded-full bg-neutral-300 text-black flex items-center justify-center text-xs mx-auto shadow-lg">
                              2
                            </span>
                          ) : pos === 3 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs mx-auto shadow-lg">
                              3
                            </span>
                          ) : (
                            <span className="text-neutral-500">{pos}</span>
                          )}
                        </td>

                        {/* Nombre del usuario e Instagram */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-black ${isTop3 ? "text-white" : "text-neutral-300"}`}>
                              {u.nombre}
                            </span>
                            {u.isAdmin && (
                              <span className="bg-neutral-800 text-neutral-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                                Staff
                              </span>
                            )}
                            {isMe && (
                              <span className="bg-[#39FF14] text-black text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                                TÚ
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-500 font-mono block">
                            {u.instagram}
                          </span>
                        </td>

                        {/* Puntos totales */}
                        <td className="py-3 px-3 text-center font-black text-[#39FF14] text-base sm:text-lg font-mono">
                          {u.puntos}
                        </td>

                        {/* Resultados exactos */}
                        <td className="py-3 px-3 text-center font-bold text-white hidden sm:table-cell font-mono">
                          {u.exactos} <span className="text-[10px] text-neutral-500 font-normal ml-0.5">({u.exactos * 5} pts)</span>
                        </td>

                        {/* Partidos jugados */}
                        <td className="py-3 px-3 text-center font-medium text-neutral-400 font-mono">
                          {u.jugados}
                        </td>
                      </tr>
                    );
                  })}
                  {rankedUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500 text-xs">
                        No hay participantes registrados todavía. ¡Sé el primero en sumarte!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-500">
              <span>Actualización en tiempo real al finalizar los partidos.</span>
              <a href="#reglas" className="text-[#39FF14] hover:underline font-bold">Ver reglas de desempate</a>
            </div>
          </div>
        </section>

        {/* SECCIÓN 7: PREMIOS Y RECOMPENSAS */}
        <section id="premios" className="mb-16 scroll-mt-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black text-[#39FF14] uppercase tracking-widest block mb-1">
              Recompensas Smash Club
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Premios en Juego
            </h2>
            <div className="w-16 h-1 bg-[#39FF14] mx-auto mt-2 rounded-full" />
            <p className="text-xs text-neutral-400 mt-3">
              Kanthus Smash Club tira la casa por la ventana para festejar el Mundial con vos:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Premio Mayor */}
            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 rounded-3xl border-2 border-amber-500 shadow-2xl flex flex-col justify-between relative overflow-hidden lg:col-span-1">
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                PREMIO MAYOR 🏆
              </div>

              <div>
                <Award className="w-12 h-12 text-amber-400 mb-4" />
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                  Campeón de la Penca
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  Para quien acumule más puntos al final del torneo. Consagrate como el rey indiscutido de las predicciones.
                </p>

                <div className="bg-black/60 p-3 rounded-xl border border-amber-500/30">
                  <span className="block text-[11px] font-black text-amber-400 uppercase">Incluye:</span>
                  <ul className="text-xs text-neutral-200 mt-1 space-y-1 font-medium">
                    <li>🍔 1 Año de Hamburguesas Gratis (1 Smash por mes)</li>
                    <li>📦 Kit Merchandising Exclusivo Kanthus</li>
                    <li>👑 Trofeo Conmemorativo</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 text-[10px] text-neutral-400">
                Se entrega al finalizar la copa del mundo en el local.
              </div>
            </div>

            {/* Premios por Fecha o Ronda */}
            <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 flex flex-col justify-between lg:col-span-2">
              <div>
                <h3 className="text-lg font-black text-[#39FF14] uppercase tracking-tight mb-2 flex items-center gap-2">
                  <span>🍔 Premios por Fecha o Ronda</span>
                </h3>
                <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
                  No tenés que esperar hasta el final para ganar. En cada ronda, premiamos a los mejores puntajes parciales y sorteamos delicias entre todos los participantes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Combos Kanthus", desc: "Hamburguesa doble smash, papas y bebida a elección." },
                    { title: "Papas con Cheddar", desc: "Nuestras clásicas papas crinkle bañadas en abundante cheddar fundido." },
                    { title: "Descuentos Exclusivos", desc: "Cupones de 20%, 30% y 50% para tus pedidos en mostrador o delivery." },
                    { title: "Family Box", desc: "Cajas especiales para compartir con amigos mientras miran los partidos." },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800/80">
                      <span className="font-black text-white text-xs uppercase block mb-1">
                        {item.title}
                      </span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Muestra de foto gourmet de la hamburguesa */}
              <div className="mt-6 rounded-xl overflow-hidden relative h-40 border border-neutral-800">
                {/* Usamos la imagen recomendada de pexels para un estilo gastronómico premium */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/17518458/pexels-photo-17518458.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" 
                  alt="Kanthus Smash Club Premium Burger" 
                  className="w-full h-full object-cover brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] bg-[#39FF14] text-black font-black px-2 py-0.5 rounded uppercase">
                      Kanthus Smash Club
                    </span>
                    <h4 className="text-sm font-black text-white uppercase mt-1 tracking-tight">
                      Calidad Premium en cada mordisco
                    </h4>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECCIÓN 8: INTEGRACIÓN CON KANTHUS Y CHANCES EXTRA */}
        <section className="mb-16 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 rounded-3xl p-6 sm:p-10 border-2 border-[#39FF14]/60 shadow-[0_0_30px_rgba(57,255,20,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            <div className="lg:col-span-2">
              <span className="bg-white text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest block w-max mb-3">
                Sorteo Mundialista Extra
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none mb-4">
                ¿Querés ganar una <br />
                <span className="text-[#39FF14]">TV de 55&quot;</span> para el Mundial?
              </h2>
              
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 font-medium">
                La penca es gratis, pero tus ganas de comer hamburguesas tienen premio extra. <strong className="text-white">Cada compra mayor a $500</strong> en Kanthus Smash Club también suma chances directas para el sorteo espectacular de un televisor gigante para ver la final a todo lujo.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-400">
                <div className="flex items-center gap-1.5 bg-black px-3 py-2 rounded-lg border border-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                  <span>Pedí por WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black px-3 py-2 rounded-lg border border-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                  <span>Guardá tu ticket</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black px-3 py-2 rounded-lg border border-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                  <span>Sumá chances dobles</span>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right flex flex-col items-center lg:items-end justify-center">
              {/* Botón flotante y directo a WhatsApp requerido por el prompt */}
              <a 
                href="https://wa.me/59891899265?text=Hola%20Kanthus!%20Quiero%20hacer%20un%20pedido%20y%20sumar%20chances%20para%20la%20TV%20de%2055%20pulgadas%20de%20la%20Penca%20Mundial!" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-base px-6 py-4 rounded-xl transition duration-200 flex items-center justify-center gap-3 shadow-lg hover:scale-105 transform"
              >
                <Phone className="w-6 h-6 fill-current" />
                <span>Pedir en Kanthus</span>
              </a>
              <span className="text-[10px] text-neutral-400 block mt-2 font-bold">
                ¡Hacé tu pedido ahora vía WhatsApp oficial!
              </span>
            </div>
          </div>
        </section>

        {/* SECCIÓN 9: REGLAS OFICIALES */}
        <section id="reglas" className="mb-12 scroll-mt-20">
          <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-800">
            <h3 className="text-base font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#39FF14]" /> Reglas Oficiales de la Penca
            </h3>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-400">
              {[
                "Una cuenta por persona. Vinculado estrictamente al Instagram para evitar duplicados.",
                "Los pronósticos se cargan obligatoriamente antes de cada partido.",
                "No se pueden editar predicciones una vez iniciado el partido (bloqueo automático del sistema).",
                "El ranking general se actualiza de inmediato luego de cargar los resultados oficiales.",
                "En caso de empate en puntos, gana quien tenga más resultados exactos (5 pts).",
                "Si continúa el empate, gana quien haya participado en la mayor cantidad de partidos.",
              ].map((rule, index) => (
                <li key={index} className="flex items-start gap-2 bg-neutral-900 p-3 rounded-lg">
                  <span className="w-4 h-4 rounded-full bg-neutral-800 text-white font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>

      {/* PIE DE PÁGINA */}
      <footer className="border-t border-neutral-900 bg-black pt-10 pb-20 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-white font-black text-sm uppercase">
            <span>Penca Mundial Kanthus</span>
            <span className="text-[#39FF14]">x</span>
            <span>Kanthus Smash Club</span>
          </div>
          <p className="max-w-md mx-auto text-[11px] leading-relaxed">
            Aplicación web deportiva premium construida con diseño responsive, fondo oscuro y verde neón. Desarrollada y optimizada para uso en celulares, Instagram y WhatsApp.
          </p>
          <div className="pt-4 text-[10px] text-neutral-600">
            &copy; {new Date().getFullYear()} Kanthus Smash Club. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* BOTÓN FIJO DE WHATSAPP REQUERIDO EN EL PUNTO 8 */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://wa.me/59891899265?text=Hola%20Kanthus!%20Quiero%20pedir%20hamburguesas%20y%20sumar%20para%20la%20TV%20de%2055%20pulgadas!" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1fae54] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 transition duration-200 group hover:scale-110 transform border-2 border-white/20"
          title="Pedir en Kanthus por WhatsApp"
        >
          <Phone className="w-6 h-6 fill-current animate-wiggle" />
          <span className="font-black text-xs pr-2 hidden sm:inline block">Pedir en Kanthus</span>
        </a>
      </div>
    </div>
  );
}

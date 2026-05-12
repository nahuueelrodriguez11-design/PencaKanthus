"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ============================================
// TIPOS
// ============================================
interface Match {
  id: number;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  groupName: string;
  matchDate: string;
  stage: string;
  scoreA: number | null;
  scoreB: number | null;
  isFinished: boolean;
}

interface Prediction {
  id: number;
  userId: number;
  matchId: number;
  predictedScoreA: number;
  predictedScoreB: number;
  pointsEarned: number;
}

interface User {
  id: number;
  name: string;
  totalPoints: number;
}

// ============================================
// PÁGINA DE PREDICCIONES
// Donde el usuario carga sus pronósticos
// ============================================
export default function PredictionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [filterStage, setFilterStage] = useState("all");

  // Obtener usuario de localStorage
  const loadUser = useCallback(() => {
    const userStr = localStorage.getItem("kanthus_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));
  }, [router]);

  // Cargar datos
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Cargar partidos
        const matchesRes = await fetch("/api/matches");
        const matchesData = await matchesRes.json();
        setMatches(matchesData.matches || []);

        // Cargar predicciones del usuario
        const predRes = await fetch(`/api/predictions?userId=${user.id}`);
        const predData = await predRes.json();
        setPredictions(predData.predictions || []);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Obtener predicción para un partido
  const getPrediction = (matchId: number): Prediction | undefined => {
    return predictions.find((p) => p.matchId === matchId);
  };

  // Verificar si el partido está abierto para predicciones
  const isMatchOpen = (match: Match): boolean => {
    const matchTime = new Date(match.matchDate);
    return matchTime > new Date() && !match.isFinished;
  };

  // Guardar predicción
  const savePrediction = async (matchId: number, scoreA: string, scoreB: string) => {
    if (!user) return;

    const sA = parseInt(scoreA);
    const sB = parseInt(scoreB);

    if (isNaN(sA) || isNaN(sB) || sA < 0 || sB < 0) {
      setMessage("⚠️ Ingresá valores válidos (0 o más).");
      return;
    }

    setSaving(matchId);
    setMessage("");

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          matchId,
          predictedScoreA: sA,
          predictedScoreB: sB,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error}`);
        return;
      }

      setMessage(`✅ ${data.message}`);

      // Actualizar predicciones locales
      if (data.prediction) {
        setPredictions((prev) => {
          const existing = prev.findIndex((p) => p.matchId === matchId);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = data.prediction;
            return updated;
          }
          return [...prev, data.prediction];
        });
      }

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("❌ Error de conexión.");
    } finally {
      setSaving(null);
    }
  };

  // Obtener etapas únicas
  const stages = [...new Set(matches.map((m) => m.stage))];

  // Filtrar partidos
  const filteredMatches =
    filterStage === "all"
      ? matches
      : matches.filter((m) => m.stage === filterStage);

  // Agrupar por grupo/etapa
  const groupedMatches: Record<string, Match[]> = {};
  filteredMatches.forEach((match) => {
    const key = match.groupName;
    if (!groupedMatches[key]) groupedMatches[key] = [];
    groupedMatches[key].push(match);
  });

  // Formatear fecha
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            ⚽ Mis <span className="text-[#00ff88]">Predicciones</span>
          </h1>
          <p className="text-[#a0a0a0]">
            Cargá tus pronósticos antes de cada partido. ¡No te quedes afuera!
          </p>
          <div className="mt-3 inline-block bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full px-4 py-1 text-sm text-[#00ff88] font-semibold">
            {user.name} — {user.totalPoints || 0} puntos
          </div>
        </div>

        {/* Mensaje */}
        {message && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm text-center font-semibold ${
              message.startsWith("✅")
                ? "bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88]"
                : message.startsWith("⚠️")
                ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Filtro por etapa */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => setFilterStage("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filterStage === "all"
                ? "bg-[#00ff88] text-black"
                : "bg-[#141414] text-[#a0a0a0] border border-[#2a2a2a] hover:border-[#00ff88]"
            }`}
          >
            Todos
          </button>
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filterStage === stage
                  ? "bg-[#00ff88] text-black"
                  : "bg-[#141414] text-[#a0a0a0] border border-[#2a2a2a] hover:border-[#00ff88]"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="spinner" />
            <p className="text-[#a0a0a0] text-sm mt-4">Cargando partidos...</p>
          </div>
        )}

        {/* Partidos agrupados */}
        {!loading &&
          Object.entries(groupedMatches).map(([group, groupMatches]) => (
            <div key={group} className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-[#00ff88]">▸</span> {group}
              </h2>

              <div className="grid gap-4">
                {groupMatches.map((match) => {
                  const pred = getPrediction(match.id);
                  const isOpen = isMatchOpen(match);

                  return (
                    <div
                      key={match.id}
                      className={`card-premium ${
                        match.isFinished
                          ? "match-finished"
                          : isOpen
                          ? "match-upcoming"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Info del partido */}
                        <div className="flex-1 text-center sm:text-left">
                          <div className="text-xs text-[#666] font-semibold uppercase tracking-wider mb-1">
                            {formatDate(match.matchDate)}
                          </div>

                          <div className="flex items-center justify-center sm:justify-start gap-3">
                            <div className="text-center">
                              <span className="text-2xl">{match.flagA}</span>
                              <div className="text-xs text-white font-bold mt-1 max-w-[80px] truncate">
                                {match.teamA}
                              </div>
                            </div>

                            <div className="text-xs text-[#666] font-bold px-2">VS</div>

                            <div className="text-center">
                              <span className="text-2xl">{match.flagB}</span>
                              <div className="text-xs text-white font-bold mt-1 max-w-[80px] truncate">
                                {match.teamB}
                              </div>
                            </div>
                          </div>

                          {/* Resultado real si está finalizado */}
                          {match.isFinished && match.scoreA !== null && match.scoreB !== null && (
                            <div className="mt-2 text-sm font-bold text-[#00ff88]">
                              Resultado: {match.scoreA} - {match.scoreB}
                              {pred && (
                                <span className="ml-2 text-xs">
                                  {pred.pointsEarned === 5
                                    ? "🎯 ¡Exacto! +5pts"
                                    : pred.pointsEarned === 3
                                    ? "✅ Ganador +3pts"
                                    : pred.pointsEarned > 0
                                    ? "💪 +1pt"
                                    : ""}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Inputs de predicción */}
                        <div className="flex items-center gap-3">
                          {isOpen ? (
                            <>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  defaultValue={pred?.predictedScoreA ?? ""}
                                  id={`scoreA-${match.id}`}
                                  className="input-dark !w-16 !text-center !text-lg !font-bold !py-2"
                                  placeholder="-"
                                />
                                <span className="text-[#666] font-bold">-</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="20"
                                  defaultValue={pred?.predictedScoreB ?? ""}
                                  id={`scoreB-${match.id}`}
                                  className="input-dark !w-16 !text-center !text-lg !font-bold !py-2"
                                  placeholder="-"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const sA = (
                                    document.getElementById(
                                      `scoreA-${match.id}`
                                    ) as HTMLInputElement
                                  )?.value;
                                  const sB = (
                                    document.getElementById(
                                      `scoreB-${match.id}`
                                    ) as HTMLInputElement
                                  )?.value;
                                  savePrediction(match.id, sA, sB);
                                }}
                                disabled={saving === match.id}
                                className="btn-neon !py-2 !px-4 text-xs whitespace-nowrap"
                              >
                                {saving === match.id ? (
                                  <div className="spinner !w-4 !h-4 !border-2 !m-0" />
                                ) : pred ? (
                                  "✏️ Actualizar"
                                ) : (
                                  "💾 Guardar"
                                )}
                              </button>
                            </>
                          ) : match.isFinished ? (
                            <div className="text-xs text-[#666] font-semibold">
                              {pred
                                ? `Tu predicción: ${pred.predictedScoreA}-${pred.predictedScoreB}`
                                : "No predijiste"}
                            </div>
                          ) : (
                            <div className="text-xs text-red-400 font-semibold">
                              🔒 Cerrado
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        {/* Sin partidos */}
        {!loading && Object.keys(groupedMatches).length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚽</div>
            <p className="text-[#a0a0a0]">No hay partidos para esta etapa.</p>
          </div>
        )}
      </div>
    </div>
  );
}

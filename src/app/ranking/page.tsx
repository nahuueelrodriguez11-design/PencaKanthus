"use client";

import { useState, useEffect } from "react";

// ============================================
// TIPOS
// ============================================
interface RankingUser {
  id: number;
  name: string;
  instagram: string;
  totalPoints: number;
  exactPredictions: number;
  predictionsCount: number;
  position: number;
}

// ============================================
// PÁGINA DE RANKING
// Tabla general de posiciones
// ============================================
export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Leer usuario actual SOLO en el cliente (evita hydration mismatch)
  useEffect(() => {
    const userStr = localStorage.getItem("kanthus_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setCurrentUserId(u.id);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const res = await fetch("/api/ranking");
        const data = await res.json();
        setRanking(data.ranking || []);
      } catch (err) {
        console.error("Error cargando ranking:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, []);

  // Obtener clase del badge según posición
  const getRankClass = (position: number): string => {
    if (position === 1) return "rank-1";
    if (position === 2) return "rank-2";
    if (position === 3) return "rank-3";
    return "rank-default";
  };

  // Obtener emoji según posición
  const getRankEmoji = (position: number): string => {
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return "";
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            🏆 Ranking <span className="text-[#00ff88]">General</span>
          </h1>
          <p className="text-[#a0a0a0]">
            Tabla de posiciones de la Penca Mundial Kanthus.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="spinner" />
            <p className="text-[#a0a0a0] text-sm mt-4">Cargando ranking...</p>
          </div>
        )}

        {/* Top 3 destacado */}
        {!loading && ranking.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {/* Segundo lugar */}
            {ranking[1] && (
              <div className="card-premium text-center pt-6 order-1">
                <div className="text-3xl mb-2">🥈</div>
                <div className="text-sm font-bold text-white truncate">{ranking[1].name}</div>
                <div className="text-xs text-[#a0a0a0] mt-1 truncate">{ranking[1].instagram}</div>
                <div className="text-2xl font-black text-[#c0c0c0] mt-2">{ranking[1].totalPoints}</div>
                <div className="text-xs text-[#666]">puntos</div>
              </div>
            )}

            {/* Primer lugar (más grande) */}
            {ranking[0] && (
              <div className="card-premium text-center neon-border pt-4 order-0 sm:order-2 scale-105">
                <div className="text-4xl mb-2">👑</div>
                <div className="text-sm font-bold text-[#00ff88] truncate">{ranking[0].name}</div>
                <div className="text-xs text-[#a0a0a0] mt-1 truncate">{ranking[0].instagram}</div>
                <div className="text-3xl font-black text-[#ffd700] mt-2">{ranking[0].totalPoints}</div>
                <div className="text-xs text-[#666]">puntos</div>
                <div className="text-xs text-[#00ff88] mt-1">
                  {ranking[0].exactPredictions} exactos
                </div>
              </div>
            )}

            {/* Tercer lugar */}
            {ranking[2] && (
              <div className="card-premium text-center pt-6 order-2">
                <div className="text-3xl mb-2">🥉</div>
                <div className="text-sm font-bold text-white truncate">{ranking[2].name}</div>
                <div className="text-xs text-[#a0a0a0] mt-1 truncate">{ranking[2].instagram}</div>
                <div className="text-2xl font-black text-[#cd7f32] mt-2">{ranking[2].totalPoints}</div>
                <div className="text-xs text-[#666]">puntos</div>
              </div>
            )}
          </div>
        )}

        {/* Tabla completa */}
        {!loading && ranking.length > 0 && (
          <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left text-xs font-bold text-[#666] uppercase tracking-wider py-3 px-4">#</th>
                    <th className="text-left text-xs font-bold text-[#666] uppercase tracking-wider py-3 px-4">Nombre</th>
                    <th className="text-center text-xs font-bold text-[#666] uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Jugadas</th>
                    <th className="text-center text-xs font-bold text-[#666] uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Exactos</th>
                    <th className="text-right text-xs font-bold text-[#666] uppercase tracking-wider py-3 px-4">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((user) => (
                    <tr
                      key={user.id}
                      className={`border-b border-[#2a2a2a]/50 transition-colors ${
                        currentUserId && user.id === currentUserId
                          ? "bg-[#00ff88]/5"
                          : "hover:bg-[#1a1a1a]"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className={`rank-badge ${getRankClass(user.position)}`}>
                          {user.position <= 3 ? getRankEmoji(user.position) : user.position}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-semibold text-white truncate max-w-[150px]">
                          {user.name}
                        </div>
                        <div className="text-xs text-[#666] truncate max-w-[150px] sm:hidden">
                          {user.predictionsCount} jugadas
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-[#a0a0a0] hidden sm:table-cell">
                        {user.predictionsCount}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-[#a0a0a0] hidden sm:table-cell">
                        {user.exactPredictions}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-lg font-black text-[#00ff88]">
                          {user.totalPoints}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sin datos */}
        {!loading && ranking.length === 0 && (
          <div className="text-center py-12 card-premium">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-[#a0a0a0]">
              Todavía no hay jugadores en el ranking. ¡Sé el primero!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

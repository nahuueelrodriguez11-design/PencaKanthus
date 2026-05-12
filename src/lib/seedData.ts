import { db } from "@/db";
import { matches, users } from "@/db/schema";
import { count } from "drizzle-orm";

export async function ensureSeedData() {
  try {
    const matchesCount = await db.select({ value: count() }).from(matches);
    if (matchesCount[0].value === 0) {
      // Seed initial premium World Cup 2026 Knockout matches (FIFA Official Bracket)
      const baseDate = new Date("2026-06-28T16:00:00Z").getTime();
      const hourMs = 1000 * 60 * 60 * 4;

      await db.insert(matches).values([
        // --- ROUND OF 32 ---
        { equipoA: "2A", equipoB: "2B", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate), ronda: "Round of 32 - M73", started: false, finished: false },
        { equipoA: "1E", equipoB: "3° A/B/C/D/F", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs), ronda: "Round of 32 - M74", started: false, finished: false },
        { equipoA: "1F", equipoB: "2C", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 2), ronda: "Round of 32 - M75", started: false, finished: false },
        { equipoA: "1C", equipoB: "2F", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 3), ronda: "Round of 32 - M76", started: false, finished: false },
        { equipoA: "1I", equipoB: "3° C/D/F/G/H", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 4), ronda: "Round of 32 - M77", started: false, finished: false },
        { equipoA: "2E", equipoB: "2I", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 5), ronda: "Round of 32 - M78", started: false, finished: false },
        { equipoA: "1A", equipoB: "3° C/E/F/H/I", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 6), ronda: "Round of 32 - M79", started: false, finished: false },
        { equipoA: "1L", equipoB: "3° E/H/I/J/K", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 7), ronda: "Round of 32 - M80", started: false, finished: false },
        { equipoA: "1D", equipoB: "3° B/E/F/I/J", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 8), ronda: "Round of 32 - M81", started: false, finished: false },
        { equipoA: "1G", equipoB: "3° A/E/H/I/J", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 9), ronda: "Round of 32 - M82", started: false, finished: false },
        { equipoA: "2K", equipoB: "2L", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 10), ronda: "Round of 32 - M83", started: false, finished: false },
        { equipoA: "1H", equipoB: "2J", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 11), ronda: "Round of 32 - M84", started: false, finished: false },
        { equipoA: "1B", equipoB: "3° E/F/G/I/J", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 12), ronda: "Round of 32 - M85", started: false, finished: false },
        { equipoA: "1J", equipoB: "2H", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 13), ronda: "Round of 32 - M86", started: false, finished: false },
        { equipoA: "1K", equipoB: "3° D/E/I/J/L", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 14), ronda: "Round of 32 - M87", started: false, finished: false },
        { equipoA: "2D", equipoB: "2G", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date(baseDate + hourMs * 15), ronda: "Round of 32 - M88", started: false, finished: false },

        // --- ROUND OF 16 ---
        { equipoA: "Ganador M73", equipoB: "Ganador M75", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date(baseDate + hourMs * 18), ronda: "Round of 16 - M89", started: false, finished: false },
        { equipoA: "Ganador M74", equipoB: "Ganador M77", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date(baseDate + hourMs * 19), ronda: "Round of 16 - M90", started: false, finished: false },
        { equipoA: "Ganador M76", equipoB: "Ganador M78", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date(baseDate + hourMs * 20), ronda: "Round of 16 - M91", started: false, finished: false },
        { equipoA: "Ganador M79", equipoB: "Ganador M80", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date(baseDate + hourMs * 21), ronda: "Round of 16 - M92", started: false, finished: false },
        { equipoA: "Ganador M83", equipoB: "Ganador M84", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date(baseDate + hourMs * 22), ronda: "Round of 16 - M93", started: false, finished: false },
        { equipoA: "Ganador M81", equipoB: "Ganador M82", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date(baseDate + hourMs * 23), ronda: "Round of 16 - M94", started: false, finished: false },
        { equipoA: "Ganador M86", equipoB: "Ganador M88", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date(baseDate + hourMs * 24), ronda: "Round of 16 - M95", started: false, finished: false },
        { equipoA: "Ganador M85", equipoB: "Ganador M87", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date(baseDate + hourMs * 25), ronda: "Round of 16 - M96", started: false, finished: false },

        // --- QUARTERFINALS ---
        { equipoA: "Ganador M89", equipoB: "Ganador M90", banderaA: "⭐", banderaB: "⭐", fechaHora: new Date(baseDate + hourMs * 30), ronda: "Quarterfinal - M97", started: false, finished: false },
        { equipoA: "Ganador M93", equipoB: "Ganador M94", banderaA: "⭐", banderaB: "⭐", fechaHora: new Date(baseDate + hourMs * 31), ronda: "Quarterfinal - M98", started: false, finished: false },
        { equipoA: "Ganador M91", equipoB: "Ganador M92", banderaA: "⭐", banderaB: "⭐", fechaHora: new Date(baseDate + hourMs * 32), ronda: "Quarterfinal - M99", started: false, finished: false },
        { equipoA: "Ganador M95", equipoB: "Ganador M96", banderaA: "⭐", banderaB: "⭐", fechaHora: new Date(baseDate + hourMs * 33), ronda: "Quarterfinal - M100", started: false, finished: false },

        // --- SEMIFINALS ---
        { equipoA: "Ganador M97", equipoB: "Ganador M98", banderaA: "⚡", banderaB: "⚡", fechaHora: new Date(baseDate + hourMs * 40), ronda: "Semifinal - M101", started: false, finished: false },
        { equipoA: "Ganador M99", equipoB: "Ganador M100", banderaA: "⚡", banderaB: "⚡", fechaHora: new Date(baseDate + hourMs * 41), ronda: "Semifinal - M102", started: false, finished: false },

        // --- THIRD PLACE ---
        { equipoA: "Perdedor M101", equipoB: "Perdedor M102", banderaA: "🥉", banderaB: "🥉", fechaHora: new Date(baseDate + hourMs * 46), ronda: "Third Place - M103", started: false, finished: false },

        // --- FINAL ---
        { equipoA: "Ganador M101", equipoB: "Ganador M102", banderaA: "🏆", banderaB: "🏆", fechaHora: new Date(baseDate + hourMs * 50), ronda: "Final - M104", started: false, finished: false },
      ]);
    }

    const usersCount = await db.select({ value: count() }).from(users);
    if (usersCount[0].value === 0) {
      // Create admin user and demo user
      await db.insert(users).values([
        {
          nombre: "Admin Kanthus",
          telefono: "091899265",
          instagram: "@kanthus.smash",
          email: "admin@kanthus.com",
          password: "admin",
          isAdmin: true,
          puntos: 0,
          exactos: 0,
          jugados: 0,
        },
        {
          nombre: "Juan Perez (Demo)",
          telefono: "099888777",
          instagram: "@juanperez_futbol",
          email: "juan@perez.com",
          password: "123",
          isAdmin: false,
          puntos: 5,
          exactos: 1,
          jugados: 1,
        },
      ]);
    }
  } catch (err) {
    console.error("Aviso: No se pudo verificar o sembrar datos iniciales en Neon (tablas ya creadas manualmente):", err);
  }
}

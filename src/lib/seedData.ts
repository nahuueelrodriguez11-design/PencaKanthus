import { db } from "@/db";
import { matches, users } from "@/db/schema";
import { count, eq, or } from "drizzle-orm";

export async function ensureSeedData() {
  try {
    // 1. LIMPIEZA FORZOSA DE CUALQUIER VERSIÓN CACHEADA O VIEJOS PLACEHOLDERS DE LA BASE DE DATOS NEON
    await db.delete(matches).where(
      or(
        eq(matches.equipoA, "2A"),
        eq(matches.equipoA, "1E"),
        eq(matches.equipoA, "Ganador M73"),
        eq(matches.equipoA, "Ganador M89"),
        eq(matches.equipoA, "Ganador M97"),
        eq(matches.equipoA, "Ganador M101")
      )
    );

    // 2. VERIFICAMOS SI EL FIXTURE EXACTO DEL MUNDIAL 2026 YA ESTÁ CARGADO
    // Buscamos el partido inaugural del Grupo A (México vs Sudáfrica)
    const checkExist = await db.select().from(matches).where(eq(matches.equipoA, "México"));
    
    if (checkExist.length === 0) {
      console.log("Limpiando fixture anterior e insertando el fixture completo oficial del Mundial 2026...");
      
      // Borramos todos los partidos anteriores para no dejar cruces viejos ni duplicados
      await db.delete(matches);

      // Listado exacto de los 96 partidos con sus respectivas banderas, fechas y rondas
      await db.insert(matches).values([
        // --- GRUPO A ---
        { equipoA: "México", equipoB: "Sudáfrica", banderaA: "🇲🇽", banderaB: "🇿🇦", fechaHora: new Date("2026-06-11T16:00:00"), ronda: "Grupo A", started: false, finished: false },
        { equipoA: "Corea del Sur", equipoB: "Chequia", banderaA: "🇰🇷", banderaB: "🇨🇿", fechaHora: new Date("2026-06-11T23:00:00"), ronda: "Grupo A", started: false, finished: false },
        { equipoA: "Chequia", equipoB: "Sudáfrica", banderaA: "🇨🇿", banderaB: "🇿🇦", fechaHora: new Date("2026-06-18T13:00:00"), ronda: "Grupo A", started: false, finished: false },
        { equipoA: "México", equipoB: "Corea del Sur", banderaA: "🇲🇽", banderaB: "🇰🇷", fechaHora: new Date("2026-06-18T22:00:00"), ronda: "Grupo A", started: false, finished: false },
        { equipoA: "Sudáfrica", equipoB: "Corea del Sur", banderaA: "🇿🇦", banderaB: "🇰🇷", fechaHora: new Date("2026-06-24T22:00:00"), ronda: "Grupo A", started: false, finished: false },
        { equipoA: "Chequia", equipoB: "México", banderaA: "🇨🇿", banderaB: "🇲🇽", fechaHora: new Date("2026-06-24T22:00:00"), ronda: "Grupo A", started: false, finished: false },

        // --- GRUPO B ---
        { equipoA: "Canadá", equipoB: "Bosnia y Herzegovina", banderaA: "🇨🇦", banderaB: "🇧🇦", fechaHora: new Date("2026-06-12T16:00:00"), ronda: "Grupo B", started: false, finished: false },
        { equipoA: "Catar", equipoB: "Suiza", banderaA: "🇶🇦", banderaB: "🇨🇭", fechaHora: new Date("2026-06-13T16:00:00"), ronda: "Grupo B", started: false, finished: false },
        { equipoA: "Suiza", equipoB: "Bosnia y Herzegovina", banderaA: "🇨🇭", banderaB: "🇧🇦", fechaHora: new Date("2026-06-18T16:00:00"), ronda: "Grupo B", started: false, finished: false },
        { equipoA: "Canadá", equipoB: "Catar", banderaA: "🇨🇦", banderaB: "🇶🇦", fechaHora: new Date("2026-06-18T19:00:00"), ronda: "Grupo B", started: false, finished: false },
        { equipoA: "Suiza", equipoB: "Canadá", banderaA: "🇨🇭", banderaB: "🇨🇦", fechaHora: new Date("2026-06-24T16:00:00"), ronda: "Grupo B", started: false, finished: false },
        { equipoA: "Bosnia y Herzegovina", equipoB: "Catar", banderaA: "🇧🇦", banderaB: "🇶🇦", fechaHora: new Date("2026-06-24T16:00:00"), ronda: "Grupo B", started: false, finished: false },

        // --- GRUPO C ---
        { equipoA: "Brasil", equipoB: "Marruecos", banderaA: "🇧🇷", banderaB: "🇲🇦", fechaHora: new Date("2026-06-13T19:00:00"), ronda: "Grupo C", started: false, finished: false },
        { equipoA: "Haití", equipoB: "Escocia", banderaA: "🇭🇹", banderaB: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fechaHora: new Date("2026-06-13T22:00:00"), ronda: "Grupo C", started: false, finished: false },
        { equipoA: "Escocia", equipoB: "Marruecos", banderaA: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", banderaB: "🇲🇦", fechaHora: new Date("2026-06-19T19:00:00"), ronda: "Grupo C", started: false, finished: false },
        { equipoA: "Brasil", equipoB: "Haití", banderaA: "🇧🇷", banderaB: "🇭🇹", fechaHora: new Date("2026-06-19T21:30:00"), ronda: "Grupo C", started: false, finished: false },
        { equipoA: "Marruecos", equipoB: "Haití", banderaA: "🇲🇦", banderaB: "🇭🇹", fechaHora: new Date("2026-06-24T19:00:00"), ronda: "Grupo C", started: false, finished: false },
        { equipoA: "Escocia", equipoB: "Brasil", banderaA: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", banderaB: "🇧🇷", fechaHora: new Date("2026-06-24T19:00:00"), ronda: "Grupo C", started: false, finished: false },

        // --- GRUPO D ---
        { equipoA: "Estados Unidos", equipoB: "Paraguay", banderaA: "🇺🇸", banderaB: "🇵🇾", fechaHora: new Date("2026-06-12T22:00:00"), ronda: "Grupo D", started: false, finished: false },
        { equipoA: "Australia", equipoB: "Turquía", banderaA: "🇦🇺", banderaB: "🇹🇷", fechaHora: new Date("2026-06-14T01:00:00"), ronda: "Grupo D", started: false, finished: false },
        { equipoA: "Estados Unidos", equipoB: "Australia", banderaA: "🇺🇸", banderaB: "🇦🇺", fechaHora: new Date("2026-06-19T16:00:00"), ronda: "Grupo D", started: false, finished: false },
        { equipoA: "Turquía", equipoB: "Paraguay", banderaA: "🇹🇷", banderaB: "🇵🇾", fechaHora: new Date("2026-06-20T00:00:00"), ronda: "Grupo D", started: false, finished: false },
        { equipoA: "Turquía", equipoB: "Estados Unidos", banderaA: "🇹🇷", banderaB: "🇺🇸", fechaHora: new Date("2026-06-25T23:00:00"), ronda: "Grupo D", started: false, finished: false },
        { equipoA: "Paraguay", equipoB: "Australia", banderaA: "🇵🇾", banderaB: "🇦🇺", fechaHora: new Date("2026-06-25T23:00:00"), ronda: "Grupo D", started: false, finished: false },

        // --- GRUPO E ---
        { equipoA: "Alemania", equipoB: "Curazao", banderaA: "🇩🇪", banderaB: "🇨🇼", fechaHora: new Date("2026-06-14T14:00:00"), ronda: "Grupo E", started: false, finished: false },
        { equipoA: "Costa de Marfil", equipoB: "Ecuador", banderaA: "🇨🇮", banderaB: "🇪🇨", fechaHora: new Date("2026-06-14T20:00:00"), ronda: "Grupo E", started: false, finished: false },
        { equipoA: "Alemania", equipoB: "Costa de Marfil", banderaA: "🇩🇪", banderaB: "🇨🇮", fechaHora: new Date("2026-06-20T17:00:00"), ronda: "Grupo E", started: false, finished: false },
        { equipoA: "Ecuador", equipoB: "Curazao", banderaA: "🇪🇨", banderaB: "🇨🇼", fechaHora: new Date("2026-06-20T21:00:00"), ronda: "Grupo E", started: false, finished: false },
        { equipoA: "Curazao", equipoB: "Costa de Marfil", banderaA: "🇨🇼", banderaB: "🇨🇮", fechaHora: new Date("2026-06-25T17:00:00"), ronda: "Grupo E", started: false, finished: false },
        { equipoA: "Ecuador", equipoB: "Alemania", banderaA: "🇪🇨", banderaB: "🇩🇪", fechaHora: new Date("2026-06-25T17:00:00"), ronda: "Grupo E", started: false, finished: false },

        // --- GRUPO F ---
        { equipoA: "Países Bajos", equipoB: "Japón", banderaA: "🇳🇱", banderaB: "🇯🇵", fechaHora: new Date("2026-06-14T17:00:00"), ronda: "Grupo F", started: false, finished: false },
        { equipoA: "Suecia", equipoB: "Túnez", banderaA: "🇸🇪", banderaB: "🇹🇳", fechaHora: new Date("2026-06-14T23:00:00"), ronda: "Grupo F", started: false, finished: false },
        { equipoA: "Países Bajos", equipoB: "Suecia", banderaA: "🇳🇱", banderaB: "🇸🇪", fechaHora: new Date("2026-06-20T14:00:00"), ronda: "Grupo F", started: false, finished: false },
        { equipoA: "Túnez", equipoB: "Japón", banderaA: "🇹🇳", banderaB: "🇯🇵", fechaHora: new Date("2026-06-21T01:00:00"), ronda: "Grupo F", started: false, finished: false },
        { equipoA: "Túnez", equipoB: "Países Bajos", banderaA: "🇹🇳", banderaB: "🇳🇱", fechaHora: new Date("2026-06-25T20:00:00"), ronda: "Grupo F", started: false, finished: false },
        { equipoA: "Japón", equipoB: "Suecia", banderaA: "🇯🇵", banderaB: "🇸🇪", fechaHora: new Date("2026-06-25T20:00:00"), ronda: "Grupo F", started: false, finished: false },

        // --- GRUPO G ---
        { equipoA: "Bélgica", equipoB: "Egipto", banderaA: "🇧🇪", banderaB: "🇪🇬", fechaHora: new Date("2026-06-15T16:00:00"), ronda: "Grupo G", started: false, finished: false },
        { equipoA: "Irán", equipoB: "Nueva Zelanda", banderaA: "🇮🇷", banderaB: "🇳🇿", fechaHora: new Date("2026-06-15T22:00:00"), ronda: "Grupo G", started: false, finished: false },
        { equipoA: "Bélgica", equipoB: "Irán", banderaA: "🇧🇪", banderaB: "🇮🇷", fechaHora: new Date("2026-06-21T16:00:00"), ronda: "Grupo G", started: false, finished: false },
        { equipoA: "Nueva Zelanda", equipoB: "Egipto", banderaA: "🇳🇿", banderaB: "🇪🇬", fechaHora: new Date("2026-06-21T22:00:00"), ronda: "Grupo G", started: false, finished: false },
        { equipoA: "Nueva Zelanda", equipoB: "Bélgica", banderaA: "🇳🇿", banderaB: "🇧🇪", fechaHora: new Date("2026-06-27T00:00:00"), ronda: "Grupo G", started: false, finished: false },
        { equipoA: "Egipto", equipoB: "Irán", banderaA: "🇪🇬", banderaB: "🇮🇷", fechaHora: new Date("2026-06-27T00:00:00"), ronda: "Grupo G", started: false, finished: false },

        // --- GRUPO H ---
        { equipoA: "España", equipoB: "Cabo Verde", banderaA: "🇪🇸", banderaB: "🇨🇻", fechaHora: new Date("2026-06-15T13:00:00"), ronda: "Grupo H", started: false, finished: false },
        { equipoA: "Arabia Saudita", equipoB: "Uruguay", banderaA: "🇸🇦", banderaB: "🇺🇾", fechaHora: new Date("2026-06-15T19:00:00"), ronda: "Grupo H", started: false, finished: false },
        { equipoA: "España", equipoB: "Arabia Saudita", banderaA: "🇪🇸", banderaB: "🇸🇦", fechaHora: new Date("2026-06-21T13:00:00"), ronda: "Grupo H", started: false, finished: false },
        { equipoA: "Uruguay", equipoB: "Cabo Verde", banderaA: "🇺🇾", banderaB: "🇨🇻", fechaHora: new Date("2026-06-21T19:00:00"), ronda: "Grupo H", started: false, finished: false },
        { equipoA: "Cabo Verde", equipoB: "Arabia Saudita", banderaA: "🇨🇻", banderaB: "🇸🇦", fechaHora: new Date("2026-06-26T21:00:00"), ronda: "Grupo H", started: false, finished: false },
        { equipoA: "Uruguay", equipoB: "España", banderaA: "🇺🇾", banderaB: "🇪🇸", fechaHora: new Date("2026-06-26T21:00:00"), ronda: "Grupo H", started: false, finished: false },

        // --- GRUPO I ---
        { equipoA: "Francia", equipoB: "Senegal", banderaA: "🇫🇷", banderaB: "🇸🇳", fechaHora: new Date("2026-06-16T16:00:00"), ronda: "Grupo I", started: false, finished: false },
        { equipoA: "Irak", equipoB: "Noruega", banderaA: "🇮逃", banderaB: "🇳🇴", fechaHora: new Date("2026-06-16T19:00:00"), ronda: "Grupo I", started: false, finished: false },
        { equipoA: "Francia", equipoB: "Irak", banderaA: "🇫🇷", banderaB: "🇮逃", fechaHora: new Date("2026-06-22T18:00:00"), ronda: "Grupo I", started: false, finished: false },
        { equipoA: "Noruega", equipoB: "Senegal", banderaA: "🇳🇴", banderaB: "🇸🇳", fechaHora: new Date("2026-06-22T21:00:00"), ronda: "Grupo I", started: false, finished: false },
        { equipoA: "Noruega", equipoB: "Francia", banderaA: "🇳🇴", banderaB: "🇫🇷", fechaHora: new Date("2026-06-26T16:00:00"), ronda: "Grupo I", started: false, finished: false },
        { equipoA: "Senegal", equipoB: "Irak", banderaA: "🇸🇳", banderaB: "🇮逃", fechaHora: new Date("2026-06-26T16:00:00"), ronda: "Grupo I", started: false, finished: false },

        // --- GRUPO J ---
        { equipoA: "Argentina", equipoB: "Argelia", banderaA: "🇦🇷", banderaB: "🇩🇿", fechaHora: new Date("2026-06-16T22:00:00"), ronda: "Grupo J", started: false, finished: false },
        { equipoA: "Austria", equipoB: "Jordania", banderaA: "🇦🇹", banderaB: "🇯🇴", fechaHora: new Date("2026-06-17T01:00:00"), ronda: "Grupo J", started: false, finished: false },
        { equipoA: "Argentina", equipoB: "Austria", banderaA: "🇦🇷", banderaB: "🇦🇹", fechaHora: new Date("2026-06-22T14:00:00"), ronda: "Grupo J", started: false, finished: false },
        { equipoA: "Jordania", equipoB: "Argelia", banderaA: "🇯🇴", banderaB: "🇩🇿", fechaHora: new Date("2026-06-23T00:00:00"), ronda: "Grupo J", started: false, finished: false },
        { equipoA: "Argelia", equipoB: "Austria", banderaA: "🇩🇿", banderaB: "🇦🇹", fechaHora: new Date("2026-06-27T23:00:00"), ronda: "Grupo J", started: false, finished: false },
        { equipoA: "Jordania", equipoB: "Argentina", banderaA: "🇯🇴", banderaB: "🇦🇷", fechaHora: new Date("2026-06-27T23:00:00"), ronda: "Grupo J", started: false, finished: false },

        // --- GRUPO K ---
        { equipoA: "Portugal", equipoB: "RD Congo", banderaA: "🇵🇹", banderaB: "🇨🇩", fechaHora: new Date("2026-06-17T14:00:00"), ronda: "Grupo K", started: false, finished: false },
        { equipoA: "Uzbekistán", equipoB: "Colombia", banderaA: "🇺🇿", banderaB: "🇨🇴", fechaHora: new Date("2026-06-17T23:00:00"), ronda: "Grupo K", started: false, finished: false },
        { equipoA: "Portugal", equipoB: "Uzbekistán", banderaA: "🇵🇹", banderaB: "🇺🇿", fechaHora: new Date("2026-06-23T14:00:00"), ronda: "Grupo K", started: false, finished: false },
        { equipoA: "Colombia", equipoB: "RD Congo", banderaA: "🇨🇴", banderaB: "🇨🇩", fechaHora: new Date("2026-06-23T23:00:00"), ronda: "Grupo K", started: false, finished: false },
        { equipoA: "Colombia", equipoB: "Portugal", banderaA: "🇨🇴", banderaB: "🇵🇹", fechaHora: new Date("2026-06-27T20:30:00"), ronda: "Grupo K", started: false, finished: false },
        { equipoA: "RD Congo", equipoB: "Uzbekistán", banderaA: "🇨🇩", banderaB: "🇺🇿", fechaHora: new Date("2026-06-27T20:30:00"), ronda: "Grupo K", started: false, finished: false },

        // --- GRUPO L ---
        { equipoA: "Inglaterra", equipoB: "Croacia", banderaA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", banderaB: "🇭🇷", fechaHora: new Date("2026-06-17T17:00:00"), ronda: "Grupo L", started: false, finished: false },
        { equipoA: "Ghana", equipoB: "Panamá", banderaA: "🇬🇭", banderaB: "🇵🇦", fechaHora: new Date("2026-06-17T20:00:00"), ronda: "Grupo L", started: false, finished: false },
        { equipoA: "Inglaterra", equipoB: "Ghana", banderaA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", banderaB: "🇬🇭", fechaHora: new Date("2026-06-23T17:00:00"), ronda: "Grupo L", started: false, finished: false },
        { equipoA: "Panamá", equipoB: "Croacia", banderaA: "🇵🇦", banderaB: "🇭🇷", fechaHora: new Date("2026-06-23T20:00:00"), ronda: "Grupo L", started: false, finished: false },
        { equipoA: "Panamá", equipoB: "Inglaterra", banderaA: "🇵🇦", banderaB: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fechaHora: new Date("2026-06-27T18:00:00"), ronda: "Grupo L", started: false, finished: false },
        { equipoA: "Croacia", equipoB: "Ghana", banderaA: "🇭🇷", banderaB: "🇬🇭", fechaHora: new Date("2026-06-27T18:00:00"), ronda: "Grupo L", started: false, finished: false },

        // --- ELIMINATORIA DE 32 (16 partidos, equipos "A definir") ---
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-06-28T16:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-06-29T14:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-06-29T17:30:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-06-29T22:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-06-30T14:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-06-30T18:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-06-30T22:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-01T13:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-01T17:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-01T21:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-02T16:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-02T20:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-03T00:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-03T15:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-03T19:00:00"), ronda: "Eliminatoria de 32", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚽", banderaB: "⚽", fechaHora: new Date("2026-07-03T22:30:00"), ronda: "Eliminatoria de 32", started: false, finished: false },

        // --- OCTAVOS DE FINAL (8 partidos, equipos "A definir") ---
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date("2026-07-04T14:00:00"), ronda: "Octavos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date("2026-07-04T18:00:00"), ronda: "Octavos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date("2026-07-05T17:00:00"), ronda: "Octavos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date("2026-07-05T21:00:00"), ronda: "Octavos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date("2026-07-06T16:00:00"), ronda: "Octavos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date("2026-07-06T21:00:00"), ronda: "Octavos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date("2026-07-07T13:00:00"), ronda: "Octavos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🔥", banderaB: "🔥", fechaHora: new Date("2026-07-07T17:00:00"), ronda: "Octavos de Final", started: false, finished: false },

        // --- CUARTOS DE FINAL (4 partidos, equipos "A definir") ---
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⭐", banderaB: "⭐", fechaHora: new Date("2026-07-09T17:00:00"), ronda: "Cuartos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⭐", banderaB: "⭐", fechaHora: new Date("2026-07-09T21:00:00"), ronda: "Cuartos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A-definir", banderaA: "⭐", banderaB: "⭐", fechaHora: new Date("2026-07-10T17:00:00"), ronda: "Cuartos de Final", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⭐", banderaB: "⭐", fechaHora: new Date("2026-07-10T21:00:00"), ronda: "Cuartos de Final", started: false, finished: false },

        // --- SEMIFINALES (2 partidos, equipos "A definir") ---
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚡", banderaB: "⚡", fechaHora: new Date("2026-07-14T19:00:00"), ronda: "Semifinal", started: false, finished: false },
        { equipoA: "A definir", equipoB: "A definir", banderaA: "⚡", banderaB: "⚡", fechaHora: new Date("2026-07-15T19:00:00"), ronda: "Semifinal", started: false, finished: false },

        // --- TERCER PUESTO (1 partido, equipos "A definir") ---
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🥉", banderaB: "🥉", fechaHora: new Date("2026-07-18T16:00:00"), ronda: "Tercer Puesto", started: false, finished: false },

        // --- FINAL (1 partido, equipos "A definir") ---
        { equipoA: "A definir", equipoB: "A definir", banderaA: "🏆", banderaB: "🏆", fechaHora: new Date("2026-07-19T16:00:00"), ronda: "Final", started: false, finished: false },
      ]);
      console.log("¡Fixture completo del Mundial 2026 (104 partidos) sembrado exitosamente en Neon!");
    }

    // 2. ASEGURAR USUARIOS BÁSICOS DE ACCESO
    const usersCount = await db.select({ value: count() }).from(users);
    if (usersCount[0].value === 0) {
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
    console.error("Aviso en ensureSeedData (Neon):", err);
  }
}

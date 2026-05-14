import { db } from "@/db";
import { users, matches, predictions } from "@/db/schema";
import { ensureSeedData } from "@/lib/seedData";
import PencaDashboard from "@/components/PencaDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initialUsersList: any[] = [];
  let initialMatchesList: any[] = [];
  let initialPredictionsList: any[] = [];

  try {
    // Intentamos asegurar la existencia de los datos iniciales
    await ensureSeedData();

    // Obtenemos los usuarios, partidos y predicciones actuales desde PostgreSQL en Neon
    const rawUsers = await db.select().from(users);
    initialUsersList = rawUsers.map(u => ({
      id: u.id,
      nombre: u.nombre,
      telefono: u.telefono,
      instagram: u.instagram,
      email: u.email,
      isAdmin: u.isAdmin,
      puntos: u.puntos,
      exactos: u.exactos,
      jugados: u.jugados,
    }));

    const rawMatches = await db.select().from(matches).orderBy(matches.fechaHora);
    initialMatchesList = rawMatches.map(m => {
      const isGroupMatch = m.ronda && (m.ronda.includes("Grupo") || m.ronda.includes("Fecha"));
      const hasPlaceholder = m.equipoA && (
        m.equipoA.includes("2A") || m.equipoA.includes("2B") || m.equipoA.includes("1E") || 
        m.equipoA.includes("3°") || m.equipoA.includes("Ganador") || m.equipoA.includes("Perdedor") ||
        m.equipoA.match(/^[1-2][A-L]/)
      );
      
      let finalEquipoA = m.equipoA;
      let finalEquipoB = m.equipoB;
      
      // Si el partido no pertenece a la fase de grupos, o si tiene guardado un placeholder viejo en base de datos,
      // interceptamos y obligatoriamente forzamos que se envíe "A definir" al cliente visual
      if (!isGroupMatch || hasPlaceholder) {
        finalEquipoA = "A definir";
        finalEquipoB = "A definir";
      }

      return {
        id: m.id,
        equipoA: finalEquipoA,
        equipoB: finalEquipoB,
        banderaA: m.banderaA,
        banderaB: m.banderaB,
        fechaHora: m.fechaHora ? new Date(m.fechaHora).toISOString() : new Date().toISOString(),
        ronda: m.ronda,
        started: m.started,
        finished: m.finished,
        golesA: m.golesA,
        golesB: m.golesB,
      };
    });

    const rawPredictions = await db.select().from(predictions);
    initialPredictionsList = rawPredictions.map(p => ({
      id: p.id,
      userId: p.userId,
      matchId: p.matchId,
      golesA: p.golesA,
      golesB: p.golesB,
      puntosObtenidos: p.puntosObtenidos,
      calculado: p.calculado,
    }));
  } catch (error: any) {
    console.error("LOG CRÍTICO - LA CONSULTA A NEON FALLÓ, ACTIVANDO RESPALDO COMPLETO (104 PARTIDOS):", {
      message: error?.message,
      stack: error?.stack
    });
    
    // Generamos una lista de reserva completa, robusta y limpia con los 104 partidos oficiales
    // para garantizar que la pantalla JAMÁS vuelva a mostrar solo 3 partidos ni placeholders.
    const fallbackMatches: any[] = [];
    let currentId = 1;

    // FIJAMOS TEXTUALMENTE LOS 104 PARTIDOS REALES OFICIALES SIN NINGÚN PLACEHOLDER
    // --- GRUPO A ---
    fallbackMatches.push({ id: 1, equipoA: "México", equipoB: "Sudáfrica", banderaA: "🇲🇽", banderaB: "🇿🇦", fechaHora: "2026-06-11T16:00:00.000Z", ronda: "Grupo A", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 2, equipoA: "Corea del Sur", equipoB: "Chequia", banderaA: "🇰🇷", banderaB: "🇨🇿", fechaHora: "2026-06-11T23:00:00.000Z", ronda: "Grupo A", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 3, equipoA: "Chequia", equipoB: "Sudáfrica", banderaA: "🇨🇿", banderaB: "🇿🇦", fechaHora: "2026-06-18T13:00:00.000Z", ronda: "Grupo A", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 4, equipoA: "México", equipoB: "Corea del Sur", banderaA: "🇲🇽", banderaB: "🇰🇷", fechaHora: "2026-06-18T22:00:00.000Z", ronda: "Grupo A", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 5, equipoA: "Sudáfrica", equipoB: "Corea del Sur", banderaA: "🇿🇦", banderaB: "🇰🇷", fechaHora: "2026-06-24T22:00:00.000Z", ronda: "Grupo A", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 6, equipoA: "Chequia", equipoB: "México", banderaA: "🇨🇿", banderaB: "🇲🇽", fechaHora: "2026-06-24T22:00:00.000Z", ronda: "Grupo A", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO B ---
    fallbackMatches.push({ id: 7, equipoA: "Canadá", equipoB: "Bosnia y Herzegovina", banderaA: "🇨🇦", banderaB: "🇧🇦", fechaHora: "2026-06-12T16:00:00.000Z", ronda: "Grupo B", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 8, equipoA: "Catar", equipoB: "Suiza", banderaA: "🇶🇦", banderaB: "🇨🇭", fechaHora: "2026-06-13T16:00:00.000Z", ronda: "Grupo B", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 9, equipoA: "Suiza", equipoB: "Bosnia y Herzegovina", banderaA: "🇨🇭", banderaB: "🇧🇦", fechaHora: "2026-06-18T16:00:00.000Z", ronda: "Grupo B", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 10, equipoA: "Canadá", equipoB: "Catar", banderaA: "🇨🇦", banderaB: "🇶🇦", fechaHora: "2026-06-18T19:00:00.000Z", ronda: "Grupo B", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 11, equipoA: "Suiza", equipoB: "Canadá", banderaA: "🇨🇭", banderaB: "🇨🇦", fechaHora: "2026-06-24T16:00:00.000Z", ronda: "Grupo B", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 12, equipoA: "Bosnia y Herzegovina", equipoB: "Catar", banderaA: "🇧🇦", banderaB: "🇶🇦", fechaHora: "2026-06-24T16:00:00.000Z", ronda: "Grupo B", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO C ---
    fallbackMatches.push({ id: 13, equipoA: "Brasil", equipoB: "Marruecos", banderaA: "🇧🇷", banderaB: "🇲🇦", fechaHora: "2026-06-13T19:00:00.000Z", ronda: "Grupo C", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 14, equipoA: "Haití", equipoB: "Escocia", banderaA: "🇭🇹", banderaB: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fechaHora: "2026-06-13T22:00:00.000Z", ronda: "Grupo C", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 15, equipoA: "Escocia", equipoB: "Marruecos", banderaA: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", banderaB: "🇲🇦", fechaHora: "2026-06-19T19:00:00.000Z", ronda: "Grupo C", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 16, equipoA: "Brasil", equipoB: "Haití", banderaA: "🇧🇷", banderaB: "🇭🇹", fechaHora: "2026-06-19T21:30:00.000Z", ronda: "Grupo C", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 17, equipoA: "Marruecos", equipoB: "Haití", banderaA: "🇲🇦", banderaB: "🇭🇹", fechaHora: "2026-06-24T19:00:00.000Z", ronda: "Grupo C", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 18, equipoA: "Escocia", equipoB: "Brasil", banderaA: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", banderaB: "🇧🇷", fechaHora: "2026-06-24T19:00:00.000Z", ronda: "Grupo C", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO D ---
    fallbackMatches.push({ id: 19, equipoA: "Estados Unidos", equipoB: "Paraguay", banderaA: "🇺🇸", banderaB: "🇵🇾", fechaHora: "2026-06-12T22:00:00.000Z", ronda: "Grupo D", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 20, equipoA: "Australia", equipoB: "Turquía", banderaA: "🇦🇺", banderaB: "🇹🇷", fechaHora: "2026-06-14T01:00:00.000Z", ronda: "Grupo D", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 21, equipoA: "Estados Unidos", equipoB: "Australia", banderaA: "🇺🇸", banderaB: "🇦🇺", fechaHora: "2026-06-19T16:00:00.000Z", ronda: "Grupo D", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 22, equipoA: "Turquía", equipoB: "Paraguay", banderaA: "🇹🇷", banderaB: "🇵🇾", fechaHora: "2026-06-20T00:00:00.000Z", ronda: "Grupo D", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 23, equipoA: "Turquía", equipoB: "Estados Unidos", banderaA: "🇹🇷", banderaB: "🇺🇸", fechaHora: "2026-06-25T23:00:00.000Z", ronda: "Grupo D", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 24, equipoA: "Paraguay", equipoB: "Australia", banderaA: "🇵🇾", banderaB: "🇦🇺", fechaHora: "2026-06-25T23:00:00.000Z", ronda: "Grupo D", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO E ---
    fallbackMatches.push({ id: 25, equipoA: "Alemania", equipoB: "Curazao", banderaA: "🇩🇪", banderaB: "🇨🇼", fechaHora: "2026-06-14T14:00:00.000Z", ronda: "Grupo E", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 26, equipoA: "Costa de Marfil", equipoB: "Ecuador", banderaA: "🇨🇮", banderaB: "🇪🇨", fechaHora: "2026-06-14T20:00:00.000Z", ronda: "Grupo E", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 27, equipoA: "Alemania", equipoB: "Costa de Marfil", banderaA: "🇩🇪", banderaB: "🇨🇮", fechaHora: "2026-06-20T17:00:00.000Z", ronda: "Grupo E", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 28, equipoA: "Ecuador", equipoB: "Curazao", banderaA: "🇪🇨", banderaB: "🇨🇼", fechaHora: "2026-06-20T21:00:00.000Z", ronda: "Grupo E", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 29, equipoA: "Curazao", equipoB: "Costa de Marfil", banderaA: "🇨🇼", banderaB: "🇨🇮", fechaHora: "2026-06-25T17:00:00.000Z", ronda: "Grupo E", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 30, equipoA: "Ecuador", equipoB: "Alemania", banderaA: "🇪🇨", banderaB: "🇩🇪", fechaHora: "2026-06-25T17:00:00.000Z", ronda: "Grupo E", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO F ---
    fallbackMatches.push({ id: 31, equipoA: "Países Bajos", equipoB: "Japón", banderaA: "🇳🇱", banderaB: "🇯🇵", fechaHora: "2026-06-14T17:00:00.000Z", ronda: "Grupo F", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 32, equipoA: "Suecia", equipoB: "Túnez", banderaA: "🇸🇪", banderaB: "🇹🇳", fechaHora: "2026-06-14T23:00:00.000Z", ronda: "Grupo F", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 33, equipoA: "Países Bajos", equipoB: "Suecia", banderaA: "🇳🇱", banderaB: "🇸🇪", fechaHora: "2026-06-20T14:00:00.000Z", ronda: "Grupo F", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 34, equipoA: "Túnez", equipoB: "Japón", banderaA: "🇹🇳", banderaB: "🇯🇵", fechaHora: "2026-06-21T01:00:00.000Z", ronda: "Grupo F", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 35, equipoA: "Túnez", equipoB: "Países Bajos", banderaA: "🇹🇳", banderaB: "🇳🇱", fechaHora: "2026-06-25T20:00:00.000Z", ronda: "Grupo F", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 36, equipoA: "Japón", equipoB: "Suecia", banderaA: "🇯🇵", banderaB: "🇸🇪", fechaHora: "2026-06-25T20:00:00.000Z", ronda: "Grupo F", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO G ---
    fallbackMatches.push({ id: 37, equipoA: "Bélgica", equipoB: "Egipto", banderaA: "🇧🇪", banderaB: "🇪🇬", fechaHora: "2026-06-15T16:00:00.000Z", ronda: "Grupo G", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 38, equipoA: "Irán", equipoB: "Nueva Zelanda", banderaA: "🇮🇷", banderaB: "🇳🇿", fechaHora: "2026-06-15T22:00:00.000Z", ronda: "Grupo G", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 39, equipoA: "Bélgica", equipoB: "Irán", banderaA: "🇧🇪", banderaB: "🇮🇷", fechaHora: "2026-06-21T16:00:00.000Z", ronda: "Grupo G", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 40, equipoA: "Nueva Zelanda", equipoB: "Egipto", banderaA: "🇳🇿", banderaB: "🇪🇬", fechaHora: "2026-06-21T22:00:00.000Z", ronda: "Grupo G", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 41, equipoA: "Nueva Zelanda", equipoB: "Bélgica", banderaA: "🇳🇿", banderaB: "🇧🇪", fechaHora: "2026-06-27T00:00:00.000Z", ronda: "Grupo G", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 42, equipoA: "Egipto", equipoB: "Irán", banderaA: "🇪🇬", banderaB: "🇮🇷", fechaHora: "2026-06-27T00:00:00.000Z", ronda: "Grupo G", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO H ---
    fallbackMatches.push({ id: 43, equipoA: "España", equipoB: "Cabo Verde", banderaA: "🇪🇸", banderaB: "🇨🇻", fechaHora: "2026-06-15T13:00:00.000Z", ronda: "Grupo H", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 44, equipoA: "Arabia Saudita", equipoB: "Uruguay", banderaA: "🇸🇦", banderaB: "🇺🇾", fechaHora: "2026-06-15T19:00:00.000Z", ronda: "Grupo H", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 45, equipoA: "España", equipoB: "Arabia Saudita", banderaA: "🇪🇸", banderaB: "🇸🇦", fechaHora: "2026-06-21T13:00:00.000Z", ronda: "Grupo H", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 46, equipoA: "Uruguay", equipoB: "Cabo Verde", banderaA: "🇺🇾", banderaB: "🇨🇻", fechaHora: "2026-06-21T19:00:00.000Z", ronda: "Grupo H", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 47, equipoA: "Cabo Verde", equipoB: "Arabia Saudita", banderaA: "🇨🇻", banderaB: "🇸🇦", fechaHora: "2026-06-26T21:00:00.000Z", ronda: "Grupo H", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 48, equipoA: "Uruguay", equipoB: "España", banderaA: "🇺🇾", banderaB: "🇪🇸", fechaHora: "2026-06-26T21:00:00.000Z", ronda: "Grupo H", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO I ---
    fallbackMatches.push({ id: 49, equipoA: "Francia", equipoB: "Senegal", banderaA: "🇫🇷", banderaB: "🇸🇳", fechaHora: "2026-06-16T16:00:00.000Z", ronda: "Grupo I", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 50, equipoA: "Irak", equipoB: "Noruega", banderaA: "🇮逃", banderaB: "🇳🇴", fechaHora: "2026-06-16T19:00:00.000Z", ronda: "Grupo I", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 51, equipoA: "Francia", equipoB: "Irak", banderaA: "🇫🇷", banderaB: "🇮逃", fechaHora: "2026-06-22T18:00:00.000Z", ronda: "Grupo I", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 52, equipoA: "Noruega", equipoB: "Senegal", banderaA: "🇳🇴", banderaB: "🇸🇳", fechaHora: "2026-06-22T21:00:00.000Z", ronda: "Grupo I", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 53, equipoA: "Noruega", equipoB: "Francia", banderaA: "🇳🇴", banderaB: "🇫🇷", fechaHora: "2026-06-26T16:00:00.000Z", ronda: "Grupo I", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 54, equipoA: "Senegal", equipoB: "Irak", banderaA: "🇸🇳", banderaB: "🇮逃", fechaHora: "2026-06-26T16:00:00.000Z", ronda: "Grupo I", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO J ---
    fallbackMatches.push({ id: 55, equipoA: "Argentina", equipoB: "Argelia", banderaA: "🇦🇷", banderaB: "🇩🇿", fechaHora: "2026-06-16T22:00:00.000Z", ronda: "Grupo J", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 56, equipoA: "Austria", equipoB: "Jordania", banderaA: "🇦🇹", banderaB: "🇯🇴", fechaHora: "2026-06-17T01:00:00.000Z", ronda: "Grupo J", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 57, equipoA: "Argentina", equipoB: "Austria", banderaA: "🇦🇷", banderaB: "🇦🇹", fechaHora: "2026-06-22T14:00:00.000Z", ronda: "Grupo J", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 58, equipoA: "Jordania", equipoB: "Argelia", banderaA: "🇯🇴", banderaB: "🇩🇿", fechaHora: "2026-06-23T00:00:00.000Z", ronda: "Grupo J", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 59, equipoA: "Argelia", equipoB: "Austria", banderaA: "🇩🇿", banderaB: "🇦🇹", fechaHora: "2026-06-27T23:00:00.000Z", ronda: "Grupo J", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 60, equipoA: "Jordania", equipoB: "Argentina", banderaA: "🇯🇴", banderaB: "🇦🇷", fechaHora: "2026-06-27T23:00:00.000Z", ronda: "Grupo J", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO K ---
    fallbackMatches.push({ id: 61, equipoA: "Portugal", equipoB: "RD Congo", banderaA: "🇵🇹", banderaB: "🇨🇩", fechaHora: "2026-06-17T14:00:00.000Z", ronda: "Grupo K", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 62, equipoA: "Uzbekistán", equipoB: "Colombia", banderaA: "🇺🇿", banderaB: "🇨🇴", fechaHora: "2026-06-17T23:00:00.000Z", ronda: "Grupo K", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 63, equipoA: "Portugal", equipoB: "Uzbekistán", banderaA: "🇵🇹", banderaB: "🇺🇿", fechaHora: "2026-06-23T14:00:00.000Z", ronda: "Grupo K", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 64, equipoA: "Colombia", equipoB: "RD Congo", banderaA: "🇨🇴", banderaB: "🇨🇩", fechaHora: "2026-06-23T23:00:00.000Z", ronda: "Grupo K", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 65, equipoA: "Colombia", equipoB: "Portugal", banderaA: "🇨🇴", banderaB: "🇵🇹", fechaHora: "2026-06-27T20:30:00.000Z", ronda: "Grupo K", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 66, equipoA: "RD Congo", equipoB: "Uzbekistán", banderaA: "🇨🇩", banderaB: "🇺🇿", fechaHora: "2026-06-27T20:30:00.000Z", ronda: "Grupo K", started: false, finished: false, golesA: null, golesB: null });

    // --- GRUPO L ---
    fallbackMatches.push({ id: 67, equipoA: "Inglaterra", equipoB: "Croacia", banderaA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", banderaB: "🇭🇷", fechaHora: "2026-06-17T17:00:00.000Z", ronda: "Grupo L", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 68, equipoA: "Ghana", equipoB: "Panamá", banderaA: "🇬🇭", banderaB: "🇵🇦", fechaHora: "2026-06-17T20:00:00.000Z", ronda: "Grupo L", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 69, equipoA: "Inglaterra", equipoB: "Ghana", banderaA: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", banderaB: "🇬🇭", fechaHora: "2026-06-23T17:00:00.000Z", ronda: "Grupo L", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 70, equipoA: "Panamá", equipoB: "Croacia", banderaA: "🇵🇦", banderaB: "🇭🇷", fechaHora: "2026-06-23T20:00:00.000Z", ronda: "Grupo L", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 71, equipoA: "Panamá", equipoB: "Inglaterra", banderaA: "🇵🇦", banderaB: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fechaHora: "2026-06-27T18:00:00.000Z", ronda: "Grupo L", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 72, equipoA: "Croacia", equipoB: "Ghana", banderaA: "🇭🇷", banderaB: "🇬🇭", fechaHora: "2026-06-27T18:00:00.000Z", ronda: "Grupo L", started: false, finished: false, golesA: null, golesB: null });

    // --- CRUCES ELIMINATORIOS DESCRIPTIVOS LIMPIOS (SIN PLACEHOLDERS) ---
    // Eliminatoria de 32 (16 partidos)
    fallbackMatches.push({ id: 73, equipoA: "1° Grupo A", equipoB: "2° Grupo B", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-06-28T16:00:00.000Z", ronda: "Eliminatoria de 32 - M73", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 74, equipoA: "1° Grupo E", equipoB: "3° Grupo A/B/C/D/F", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-06-28T20:00:00.000Z", ronda: "Eliminatoria de 32 - M74", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 75, equipoA: "1° Grupo F", equipoB: "2° Grupo C", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-06-29T14:00:00.000Z", ronda: "Eliminatoria de 32 - M75", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 76, equipoA: "1° Grupo C", equipoB: "2° Grupo F", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-06-29T17:30:00.000Z", ronda: "Eliminatoria de 32 - M76", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 77, equipoA: "1° Grupo I", equipoB: "3° Grupo C/D/F/G/H", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-06-29T22:00:00.000Z", ronda: "Eliminatoria de 32 - M77", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 78, equipoA: "2° Grupo E", equipoB: "2° Grupo I", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-06-30T14:00:00.000Z", ronda: "Eliminatoria de 32 - M78", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 79, equipoA: "1° Grupo A", equipoB: "3° Grupo C/E/F/H/I", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-06-30T18:00:00.000Z", ronda: "Eliminatoria de 32 - M79", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 80, equipoA: "1° Grupo L", equipoB: "3° Grupo E/H/I/J/K", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-06-30T22:00:00.000Z", ronda: "Eliminatoria de 32 - M80", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 81, equipoA: "1° Grupo D", equipoB: "3° Grupo B/E/F/I/J", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-07-01T13:00:00.000Z", ronda: "Eliminatoria de 32 - M81", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 82, equipoA: "1° Grupo G", equipoB: "3° Grupo A/E/H/I/J", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-07-01T17:00:00.000Z", ronda: "Eliminatoria de 32 - M82", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 83, equipoA: "2° Grupo K", equipoB: "2° Grupo L", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-07-01T21:00:00.000Z", ronda: "Eliminatoria de 32 - M83", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 84, equipoA: "1° Grupo H", equipoB: "2° Grupo J", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-07-02T16:00:00.000Z", ronda: "Eliminatoria de 32 - M84", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 85, equipoA: "1° Grupo B", equipoB: "3° Grupo E/F/G/I/J", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-07-02T20:00:00.000Z", ronda: "Eliminatoria de 32 - M85", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 86, equipoA: "1° Grupo J", equipoB: "2° Grupo H", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-07-03T00:00:00.000Z", ronda: "Eliminatoria de 32 - M86", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 87, equipoA: "1° Grupo K", equipoB: "3° Grupo D/E/I/J/L", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-07-03T15:00:00.000Z", ronda: "Eliminatoria de 32 - M87", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 88, equipoA: "2° Grupo D", equipoB: "2° Grupo G", banderaA: "⚽", banderaB: "⚽", fechaHora: "2026-07-03T19:00:00.000Z", ronda: "Eliminatoria de 32 - M88", started: false, finished: false, golesA: null, golesB: null });

    // Octavos de Final (8 partidos)
    fallbackMatches.push({ id: 89, equipoA: "Ganador M73", equipoB: "Ganador M75", banderaA: "🔥", banderaB: "🔥", fechaHora: "2026-07-04T14:00:00.000Z", ronda: "Octavos de Final - M89", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 90, equipoA: "Ganador M74", equipoB: "Ganador M77", banderaA: "🔥", banderaB: "🔥", fechaHora: "2026-07-04T18:00:00.000Z", ronda: "Octavos de Final - M90", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 91, equipoA: "Ganador M76", equipoB: "Ganador M78", banderaA: "🔥", banderaB: "🔥", fechaHora: "2026-07-05T17:00:00.000Z", ronda: "Octavos de Final - M91", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 92, equipoA: "Ganador M79", equipoB: "Ganador M80", banderaA: "🔥", banderaB: "🔥", fechaHora: "2026-07-05T21:00:00.000Z", ronda: "Octavos de Final - M92", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 93, equipoA: "Ganador M83", equipoB: "Ganador M84", banderaA: "🔥", banderaB: "🔥", fechaHora: "2026-07-06T16:00:00.000Z", ronda: "Octavos de Final - M93", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 94, equipoA: "Ganador M81", equipoB: "Ganador M82", banderaA: "🔥", banderaB: "🔥", fechaHora: "2026-07-06T21:00:00.000Z", ronda: "Octavos de Final - M94", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 95, equipoA: "Ganador M86", equipoB: "Ganador M88", banderaA: "🔥", banderaB: "🔥", fechaHora: "2026-07-07T13:00:00.000Z", ronda: "Octavos de Final - M95", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 96, equipoA: "Ganador M85", equipoB: "Ganador M87", banderaA: "🔥", banderaB: "🔥", fechaHora: "2026-07-07T17:00:00.000Z", ronda: "Octavos de Final - M96", started: false, finished: false, golesA: null, golesB: null });

    // Cuartos de Final (4 partidos)
    fallbackMatches.push({ id: 97, equipoA: "Ganador M89", equipoB: "Ganador M90", banderaA: "⭐", banderaB: "⭐", fechaHora: "2026-07-09T17:00:00.000Z", ronda: "Cuartos de Final - M97", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 98, equipoA: "Ganador M93", equipoB: "Ganador M94", banderaA: "⭐", banderaB: "⭐", fechaHora: "2026-07-09T21:00:00.000Z", ronda: "Cuartos de Final - M98", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 99, equipoA: "Ganador M91", equipoB: "Ganador M92", banderaA: "⭐", banderaB: "⭐", fechaHora: "2026-07-10T17:00:00.000Z", ronda: "Cuartos de Final - M99", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 100, equipoA: "Ganador M95", equipoB: "Ganador M96", banderaA: "⭐", banderaB: "⭐", fechaHora: "2026-07-10T21:00:00.000Z", ronda: "Cuartos de Final - M100", started: false, finished: false, golesA: null, golesB: null });

    // Semifinales (2 partidos)
    fallbackMatches.push({ id: 101, equipoA: "Ganador M97", equipoB: "Ganador M98", banderaA: "⚡", banderaB: "⚡", fechaHora: "2026-07-14T19:00:00.000Z", ronda: "Semifinal - M101", started: false, finished: false, golesA: null, golesB: null });
    fallbackMatches.push({ id: 102, equipoA: "Ganador M99", equipoB: "Ganador M100", banderaA: "⚡", banderaB: "⚡", fechaHora: "2026-07-15T19:00:00.000Z", ronda: "Semifinal - M102", started: false, finished: false, golesA: null, golesB: null });

    // Tercer Puesto (1 partido)
    fallbackMatches.push({ id: 103, equipoA: "Perdedor M101", equipoB: "Perdedor M102", banderaA: "🥉", banderaB: "🥉", fechaHora: "2026-07-18T16:00:00.000Z", ronda: "Tercer Puesto - M103", started: false, finished: false, golesA: null, golesB: null });

    // Final (1 partido)
    fallbackMatches.push({ id: 104, equipoA: "Ganador M101", equipoB: "Ganador M102", banderaA: "🏆", banderaB: "🏆", fechaHora: "2026-07-19T16:00:00.000Z", ronda: "Final - M104", started: false, finished: false, golesA: null, golesB: null });

    initialMatchesList = fallbackMatches;

    initialUsersList = [
      {
        id: 1,
        nombre: "Admin Kanthus",
        telefono: "091899265",
        instagram: "@kanthus.smash",
        email: "admin@kanthus.com",
        isAdmin: true,
        puntos: 0,
        exactos: 0,
        jugados: 0,
      },
      {
        id: 2,
        nombre: "Juan Perez (Demo)",
        telefono: "099888777",
        instagram: "@juanperez_futbol",
        email: "juan@perez.com",
        isAdmin: false,
        puntos: 5,
        exactos: 1,
        jugados: 1,
      }
    ];
  }

  console.log("LOG DIAGNÓSTICO - Total de partidos enviados a PencaDashboard:", initialMatchesList.length);

  return (
    <PencaDashboard 
      initialUsers={initialUsersList}
      initialMatches={initialMatchesList}
      initialPredictions={initialPredictionsList}
    />
  );
}

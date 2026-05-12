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
    initialMatchesList = rawMatches.map(m => ({
      id: m.id,
      equipoA: m.equipoA,
      equipoB: m.equipoB,
      banderaA: m.banderaA,
      banderaB: m.banderaB,
      fechaHora: m.fechaHora ? new Date(m.fechaHora).toISOString() : new Date().toISOString(),
      ronda: m.ronda,
      started: m.started,
      finished: m.finished,
      golesA: m.golesA,
      golesB: m.golesB,
    }));

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
  } catch (error) {
    console.error("Error de servidor al cargar datos desde Neon PostgreSQL:", error);
    
    // Proveemos datos predeterminados de reserva para que la web siempre cargue exitosamente en Netlify
    initialMatchesList = [
      {
        id: 1,
        equipoA: "Argentina",
        equipoB: "Arabia Saudita",
        banderaA: "🇦🇷",
        banderaB: "🇸🇦",
        fechaHora: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        ronda: "Fecha 1 - Grupo C",
        started: false,
        finished: false,
        golesA: null,
        golesB: null,
      },
      {
        id: 2,
        equipoA: "Brasil",
        equipoB: "Serbia",
        banderaA: "🇧🇷",
        banderaB: "🇷🇸",
        fechaHora: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        ronda: "Fecha 1 - Grupo G",
        started: false,
        finished: false,
        golesA: null,
        golesB: null,
      }
    ];

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

  return (
    <PencaDashboard 
      initialUsers={initialUsersList}
      initialMatches={initialMatchesList}
      initialPredictions={initialPredictionsList}
    />
  );
}

import { db } from "@/db";
import { matches, users } from "@/db/schema";
import { count } from "drizzle-orm";

export async function ensureSeedData() {
  try {
    const matchesCount = await db.select({ value: count() }).from(matches);
    if (matchesCount[0].value === 0) {
      // Seed initial premium World Cup matches
      await db.insert(matches).values([
        {
          equipoA: "Argentina",
          equipoB: "Arabia Saudita",
          banderaA: "🇦🇷",
          banderaB: "🇸🇦",
          fechaHora: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
          ronda: "Fecha 1 - Grupo C",
          started: false,
          finished: false,
        },
        {
          equipoA: "Brasil",
          equipoB: "Serbia",
          banderaA: "🇧🇷",
          banderaB: "🇷🇸",
          fechaHora: new Date(Date.now() + 1000 * 60 * 60 * 48), // in 2 days
          ronda: "Fecha 1 - Grupo G",
          started: false,
          finished: false,
        },
        {
          equipoA: "Uruguay",
          equipoB: "Corea del Sur",
          banderaA: "🇺🇾",
          banderaB: "🇰🇷",
          fechaHora: new Date(Date.now() + 1000 * 60 * 60 * 72), // in 3 days
          ronda: "Fecha 1 - Grupo H",
          started: false,
          finished: false,
        },
        {
          equipoA: "Francia",
          equipoB: "Australia",
          banderaA: "🇫🇷",
          banderaB: "🇦🇺",
          fechaHora: new Date(Date.now() - 1000 * 60 * 60 * 5), // started 5 hours ago
          ronda: "Fecha 1 - Grupo D",
          started: true,
          finished: false,
        },
        {
          equipoA: "España",
          equipoB: "Costa Rica",
          banderaA: "🇪🇸",
          banderaB: "🇨🇷",
          fechaHora: new Date(Date.now() - 1000 * 60 * 60 * 24), // finished yesterday
          ronda: "Fecha 1 - Grupo E",
          started: true,
          finished: true,
          golesA: 7,
          golesB: 0,
        },
      ]);
    }

    const usersCount = await db.select({ value: count() }).from(users);
    if (usersCount[0].value === 0) {
      // Create admin user and demo user
      await db.insert(users).values([
        {
          nombre: "Admin Kanthus",
          telefono: "099123456",
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

"use server";

import { db } from "@/db";
import { users, matches, predictions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { calculatePoints } from "@/lib/scoring";

// 1. Registro de usuario
export async function registerUser(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const instagram = formData.get("instagram") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!nombre || !telefono || !instagram || !password) {
    return { success: false, error: "Faltan campos obligatorios (Nombre, Teléfono, Instagram, Contraseña/Código)." };
  }

  // Verificar si ya existe el instagram o telefono (Una cuenta por persona)
  const existing = await db.select().from(users).where(eq(users.instagram, instagram));
  if (existing.length > 0) {
    return { success: false, error: "Ya existe un usuario registrado con ese usuario de Instagram." };
  }

  const [newUser] = await db.insert(users).values({
    nombre,
    telefono,
    instagram,
    email: email || null,
    password,
    isAdmin: false,
    puntos: 0,
    exactos: 0,
    jugados: 0,
  }).returning();

  return { success: true, user: newUser };
}

// 2. Inicio de sesión simple
export async function loginUser(instagramOrPhone: string, code: string) {
  if (!instagramOrPhone || !code) {
    return { success: false, error: "Ingresá tu usuario y código de acceso." };
  }

  // Buscar por instagram o por telefono
  const list = await db.select().from(users);
  const found = list.find(
    u => (u.instagram.toLowerCase() === instagramOrPhone.toLowerCase() || u.telefono === instagramOrPhone) && u.password === code
  );

  if (!found) {
    return { success: false, error: "Credenciales incorrectas. Verificá tu Instagram/Teléfono y código." };
  }

  return { success: true, user: found };
}

// 3. Guardar predicción
export async function savePrediction(userId: number, matchId: number, golesA: number, golesB: number) {
  // Verificar si el partido ya empezó
  const [match] = await db.select().from(matches).where(eq(matches.id, matchId));
  if (!match) {
    return { success: false, error: "Partido no encontrado." };
  }

  if (match.started) {
    return { success: false, error: "¡El partido ya comenzó! Las predicciones se han cerrado automáticamente." };
  }

  // Buscar si ya tiene una predicción
  const existing = await db.select().from(predictions).where(
    and(eq(predictions.userId, userId), eq(predictions.matchId, matchId))
  );

  if (existing.length > 0) {
    await db.update(predictions)
      .set({ golesA, golesB })
      .where(eq(predictions.id, existing[0].id));
  } else {
    await db.insert(predictions).values({
      userId,
      matchId,
      golesA,
      golesB,
      puntosObtenidos: 0,
      calculado: false,
    });
  }

  return { success: true };
}

// 4. Admin: Alternar estado de iniciado (Cierra predicciones)
export async function toggleMatchStarted(matchId: number, started: boolean) {
  await db.update(matches).set({ started }).where(eq(matches.id, matchId));
  return { success: true };
}

// 5. Admin: Establecer resultado oficial y recalcular puntajes generales
export async function setMatchScore(matchId: number, golesA: number, golesB: number) {
  // Guardar resultado oficial del partido
  await db.update(matches)
    .set({ golesA, golesB, finished: true, started: true })
    .where(eq(matches.id, matchId));

  // Obtener todas las predicciones de este partido
  const preds = await db.select().from(predictions).where(eq(predictions.matchId, matchId));

  for (const p of preds) {
    const pts = calculatePoints(p.golesA, p.golesB, golesA, golesB);
    await db.update(predictions)
      .set({ puntosObtenidos: pts, calculado: true })
      .where(eq(predictions.id, p.id));
  }

  // Recalcular los puntos totales para todos los usuarios
  const allUsers = await db.select().from(users);
  const allCalculatedPreds = await db.select().from(predictions).where(eq(predictions.calculado, true));

  for (const u of allUsers) {
    const userPreds = allCalculatedPreds.filter(p => p.userId === u.id);
    let totalPts = 0;
    let exactosCount = 0;
    const jugadosCount = userPreds.length;

    for (const p of userPreds) {
      totalPts += p.puntosObtenidos;
      if (p.puntosObtenidos === 5) {
        exactosCount++;
      }
    }

    await db.update(users)
      .set({ puntos: totalPts, exactos: exactosCount, jugados: jugadosCount })
      .where(eq(users.id, u.id));
  }

  return { success: true };
}

// 6. Admin: Crear un nuevo partido
export async function createMatch(formData: FormData) {
  const equipoA = formData.get("equipoA") as string;
  const equipoB = formData.get("equipoB") as string;
  const banderaA = formData.get("banderaA") as string;
  const banderaB = formData.get("banderaB") as string;
  const ronda = formData.get("ronda") as string;
  const fechaStr = formData.get("fechaHora") as string;

  if (!equipoA || !equipoB || !banderaA || !banderaB || !ronda || !fechaStr) {
    return { success: false, error: "Faltan completar campos del partido." };
  }

  await db.insert(matches).values({
    equipoA,
    equipoB,
    banderaA,
    banderaB,
    ronda,
    fechaHora: new Date(fechaStr),
    started: false,
    finished: false,
  });

  return { success: true };
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { predictions, matches as matchesTable, users as usersTable } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// ============================================
// API: Predicciones (GET y POST)
// GET /api/predictions?userId=X - Obtener predicciones del usuario
// POST /api/predictions - Crear/actualizar predicción
// ============================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 }
      );
    }

    const userPredictions = await db.query.predictions.findMany({
      where: eq(predictions.userId, parseInt(userId)),
    });

    return NextResponse.json({ predictions: userPredictions });
  } catch (error) {
    console.error("Error obteniendo predicciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, matchId, predictedScoreA, predictedScoreB } = body;

    // Validar campos
    if (!userId || !matchId || predictedScoreA === undefined || predictedScoreB === undefined) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar que el partido no haya comenzado
    const match = await db.query.matches.findFirst({
      where: eq(matchesTable.id, parseInt(matchId)),
    });

    if (!match) {
      return NextResponse.json(
        { error: "Partido no encontrado" },
        { status: 404 }
      );
    }

    if (match.isFinished || new Date(match.matchDate) <= new Date()) {
      return NextResponse.json(
        { error: "El partido ya comenzó o finalizó. No se pueden cargar predicciones." },
        { status: 403 }
      );
    }

    // Verificar si ya existe una predicción para este usuario y partido
    const existing = await db.query.predictions.findFirst({
      where: and(
        eq(predictions.userId, parseInt(userId)),
        eq(predictions.matchId, parseInt(matchId))
      ),
    });

    let result;

    if (existing) {
      // Actualizar predicción existente
      [result] = await db
        .update(predictions)
        .set({
          predictedScoreA: parseInt(predictedScoreA),
          predictedScoreB: parseInt(predictedScoreB),
        })
        .where(eq(predictions.id, existing.id))
        .returning();
    } else {
      // Crear nueva predicción
      [result] = await db
        .insert(predictions)
        .values({
          userId: parseInt(userId),
          matchId: parseInt(matchId),
          predictedScoreA: parseInt(predictedScoreA),
          predictedScoreB: parseInt(predictedScoreB),
        })
        .returning();

      // Incrementar contador de predicciones del usuario
      await db
        .update(usersTable)
        .set({
          predictionsCount: sql`${usersTable.predictionsCount} + 1`,
        })
        .where(eq(usersTable.id, parseInt(userId)));
    }

    return NextResponse.json({
      message: existing ? "Predicción actualizada" : "Predicción guardada",
      prediction: result,
    });
  } catch (error) {
    console.error("Error guardando predicción:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

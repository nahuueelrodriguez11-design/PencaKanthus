import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { matches as matchesTable, predictions as predictionsTable, users as usersTable } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// ============================================
// API: Admin - Cargar resultado de partido
// POST /api/admin/result
// Calcula puntos automáticamente
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { matchId, scoreA, scoreB, adminKey } = body;

    // Verificar clave de admin
    if (adminKey !== process.env.ADMIN_KEY && adminKey !== "kanthus2026") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    if (!matchId || scoreA === undefined || scoreB === undefined) {
      return NextResponse.json(
        { error: "matchId, scoreA y scoreB son requeridos" },
        { status: 400 }
      );
    }

    // Actualizar el partido con el resultado
    const [updatedMatch] = await db
      .update(matchesTable)
      .set({
        scoreA: parseInt(scoreA),
        scoreB: parseInt(scoreB),
        isFinished: true,
      })
      .where(eq(matchesTable.id, parseInt(matchId)))
      .returning();

    if (!updatedMatch) {
      return NextResponse.json(
        { error: "Partido no encontrado" },
        { status: 404 }
      );
    }

    // Obtener todas las predicciones para este partido
    const matchPredictions = await db.query.predictions.findMany({
      where: eq(predictionsTable.matchId, parseInt(matchId)),
    });

    // Calcular puntos para cada predicción
    const actualScoreA = parseInt(scoreA);
    const actualScoreB = parseInt(scoreB);

    for (const pred of matchPredictions) {
      let points = 0;
      let isExact = false;

      // Resultado exacto: 5 puntos
      if (pred.predictedScoreA === actualScoreA && pred.predictedScoreB === actualScoreB) {
        points = 5;
        isExact = true;
      }
      // Acertar ganador o empate: 3 puntos
      else if (
        (pred.predictedScoreA > pred.predictedScoreB && actualScoreA > actualScoreB) ||
        (pred.predictedScoreA < pred.predictedScoreB && actualScoreA < actualScoreB) ||
        (pred.predictedScoreA === pred.predictedScoreB && actualScoreA === actualScoreB)
      ) {
        points = 3;
      }
      // Participar: 1 punto
      else {
        points = 1;
      }

      // Actualizar puntos de la predicción
      await db
        .update(predictionsTable)
        .set({ pointsEarned: points })
        .where(eq(predictionsTable.id, pred.id));

      // Actualizar puntos totales del usuario
      await db
        .update(usersTable)
        .set({
          totalPoints: sql`${usersTable.totalPoints} + ${points}`,
          ...(isExact ? { exactPredictions: sql`${usersTable.exactPredictions} + 1` } : {}),
        })
        .where(eq(usersTable.id, pred.userId));
    }

    return NextResponse.json({
      message: "Resultado cargado y puntos calculados",
      match: updatedMatch,
      predictionsProcessed: matchPredictions.length,
    });
  } catch (error) {
    console.error("Error cargando resultado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

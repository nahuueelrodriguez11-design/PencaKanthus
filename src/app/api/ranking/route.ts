import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

// ============================================
// API: Ranking general
// GET /api/ranking
// Ordenado por: puntos > resultados exactos > predicciones jugadas
// ============================================
export async function GET() {
  try {
    const ranking = await db.query.users.findMany({
      orderBy: [
        desc(users.totalPoints),
        desc(users.exactPredictions),
        desc(users.predictionsCount),
      ],
      columns: {
        id: true,
        name: true,
        instagram: true,
        totalPoints: true,
        exactPredictions: true,
        predictionsCount: true,
      },
    });

    // Agregar posición
    const ranked = ranking.map((user, index) => ({
      ...user,
      position: index + 1,
    }));

    return NextResponse.json({ ranking: ranked });
  } catch (error) {
    console.error("Error obteniendo ranking:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

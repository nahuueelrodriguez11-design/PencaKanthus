import { NextResponse } from "next/server";
import { db } from "@/db";
import { matches } from "@/db/schema";
import { asc } from "drizzle-orm";

// ============================================
// API: Obtener todos los partidos
// GET /api/matches
// ============================================
export async function GET() {
  try {
    const allMatches = await db.query.matches.findMany({
      orderBy: asc(matches.matchDate),
    });

    return NextResponse.json({ matches: allMatches });
  } catch (error) {
    console.error("Error obteniendo partidos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

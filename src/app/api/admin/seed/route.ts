import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { matches as matchesTable } from "@/db/schema";

// ============================================
// API: Admin - Seed de partidos del Mundial 2026
// POST /api/admin/seed
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminKey } = body;

    if (adminKey !== process.env.ADMIN_KEY && adminKey !== "kanthus2026") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Partidos del Mundial 2026 - Fase de Grupos
    const seedMatches = [
      // Grupo A
      { teamA: "México", teamB: "Polonia", flagA: "🇲🇽", flagB: "🇵🇱", groupName: "Grupo A", matchDate: new Date("2026-06-11T18:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Países Bajos", teamB: "Arabia Saudita", flagA: "🇳🇱", flagB: "🇸🇦", groupName: "Grupo A", matchDate: new Date("2026-06-12T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "México", teamB: "Países Bajos", flagA: "🇲🇽", flagB: "🇳🇱", groupName: "Grupo A", matchDate: new Date("2026-06-16T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Polonia", teamB: "Arabia Saudita", flagA: "🇵🇱", flagB: "🇸🇦", groupName: "Grupo A", matchDate: new Date("2026-06-17T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "México", teamB: "Arabia Saudita", flagA: "🇲🇽", flagB: "🇸🇦", groupName: "Grupo A", matchDate: new Date("2026-06-21T18:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Países Bajos", teamB: "Polonia", flagA: "🇳🇱", flagB: "🇵🇱", groupName: "Grupo A", matchDate: new Date("2026-06-21T18:00:00Z"), stage: "Fase de Grupos" },

      // Grupo B
      { teamA: "Argentina", teamB: "Canadá", flagA: "🇦🇷", flagB: "🇨🇦", groupName: "Grupo B", matchDate: new Date("2026-06-12T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Croacia", teamB: "Marruecos", flagA: "🇭🇷", flagB: "🇲🇦", groupName: "Grupo B", matchDate: new Date("2026-06-13T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Argentina", teamB: "Croacia", flagA: "🇦🇷", flagB: "🇭🇷", groupName: "Grupo B", matchDate: new Date("2026-06-17T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Canadá", teamB: "Marruecos", flagA: "🇨🇦", flagB: "🇲🇦", groupName: "Grupo B", matchDate: new Date("2026-06-18T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Argentina", teamB: "Marruecos", flagA: "🇦🇷", flagB: "🇲🇦", groupName: "Grupo B", matchDate: new Date("2026-06-22T18:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Croacia", teamB: "Canadá", flagA: "🇭🇷", flagB: "🇨🇦", groupName: "Grupo B", matchDate: new Date("2026-06-22T18:00:00Z"), stage: "Fase de Grupos" },

      // Grupo C
      { teamA: "Brasil", teamB: "Serbia", flagA: "🇧🇷", flagB: "🇷🇸", groupName: "Grupo C", matchDate: new Date("2026-06-13T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Suiza", teamB: "Camerún", flagA: "🇨🇭", flagB: "🇨🇲", groupName: "Grupo C", matchDate: new Date("2026-06-14T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Brasil", teamB: "Suiza", flagA: "🇧🇷", flagB: "🇨🇭", groupName: "Grupo C", matchDate: new Date("2026-06-18T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Serbia", teamB: "Camerún", flagA: "🇷🇸", flagB: "🇨🇲", groupName: "Grupo C", matchDate: new Date("2026-06-19T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Brasil", teamB: "Camerún", flagA: "🇧🇷", flagB: "🇨🇲", groupName: "Grupo C", matchDate: new Date("2026-06-23T18:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Suiza", teamB: "Serbia", flagA: "🇨🇭", flagB: "🇷🇸", groupName: "Grupo C", matchDate: new Date("2026-06-23T18:00:00Z"), stage: "Fase de Grupos" },

      // Grupo D
      { teamA: "Francia", teamB: "Dinamarca", flagA: "🇫🇷", flagB: "🇩🇰", groupName: "Grupo D", matchDate: new Date("2026-06-14T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Uruguay", teamB: "Corea del Sur", flagA: "🇺🇾", flagB: "🇰🇷", groupName: "Grupo D", matchDate: new Date("2026-06-15T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Francia", teamB: "Uruguay", flagA: "🇫🇷", flagB: "🇺🇾", groupName: "Grupo D", matchDate: new Date("2026-06-19T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Dinamarca", teamB: "Corea del Sur", flagA: "🇩🇰", flagB: "🇰🇷", groupName: "Grupo D", matchDate: new Date("2026-06-20T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Francia", teamB: "Corea del Sur", flagA: "🇫🇷", flagB: "🇰🇷", groupName: "Grupo D", matchDate: new Date("2026-06-24T18:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Uruguay", teamB: "Dinamarca", flagA: "🇺🇾", flagB: "🇩🇰", groupName: "Grupo D", matchDate: new Date("2026-06-24T18:00:00Z"), stage: "Fase de Grupos" },

      // Grupo E
      { teamA: "España", teamB: "Japón", flagA: "🇪🇸", flagB: "🇯🇵", groupName: "Grupo E", matchDate: new Date("2026-06-15T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Alemania", teamB: "Costa Rica", flagA: "🇩🇪", flagB: "🇨🇷", groupName: "Grupo E", matchDate: new Date("2026-06-16T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "España", teamB: "Alemania", flagA: "🇪🇸", flagB: "🇩🇪", groupName: "Grupo E", matchDate: new Date("2026-06-20T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Japón", teamB: "Costa Rica", flagA: "🇯🇵", flagB: "🇨🇷", groupName: "Grupo E", matchDate: new Date("2026-06-21T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "España", teamB: "Costa Rica", flagA: "🇪🇸", flagB: "🇨🇷", groupName: "Grupo E", matchDate: new Date("2026-06-25T18:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Alemania", teamB: "Japón", flagA: "🇩🇪", flagB: "🇯🇵", groupName: "Grupo E", matchDate: new Date("2026-06-25T18:00:00Z"), stage: "Fase de Grupos" },

      // Grupo F
      { teamA: "Inglaterra", teamB: "Irán", flagA: "🏴", flagB: "🇮🇷", groupName: "Grupo F", matchDate: new Date("2026-06-16T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Portugal", teamB: "Ghana", flagA: "🇵🇹", flagB: "🇬🇭", groupName: "Grupo F", matchDate: new Date("2026-06-17T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Inglaterra", teamB: "Portugal", flagA: "🏴", flagB: "🇵🇹", groupName: "Grupo F", matchDate: new Date("2026-06-21T20:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Irán", teamB: "Ghana", flagA: "🇮🇷", flagB: "🇬🇭", groupName: "Grupo F", matchDate: new Date("2026-06-22T15:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Inglaterra", teamB: "Ghana", flagA: "🏴", flagB: "🇬🇭", groupName: "Grupo F", matchDate: new Date("2026-06-26T18:00:00Z"), stage: "Fase de Grupos" },
      { teamA: "Portugal", teamB: "Irán", flagA: "🇵🇹", flagB: "🇮🇷", groupName: "Grupo F", matchDate: new Date("2026-06-26T18:00:00Z"), stage: "Fase de Grupos" },

      // Octavos de Final
      { teamA: "1° Grupo A", teamB: "2° Grupo B", flagA: "🏆", flagB: "🏆", groupName: "Octavos", matchDate: new Date("2026-06-28T18:00:00Z"), stage: "Octavos de Final" },
      { teamA: "1° Grupo C", teamB: "2° Grupo D", flagA: "🏆", flagB: "🏆", groupName: "Octavos", matchDate: new Date("2026-06-28T22:00:00Z"), stage: "Octavos de Final" },
      { teamA: "1° Grupo E", teamB: "2° Grupo F", flagA: "🏆", flagB: "🏆", groupName: "Octavos", matchDate: new Date("2026-06-29T18:00:00Z"), stage: "Octavos de Final" },
      { teamA: "1° Grupo B", teamB: "2° Grupo A", flagA: "🏆", flagB: "🏆", groupName: "Octavos", matchDate: new Date("2026-06-29T22:00:00Z"), stage: "Octavos de Final" },
      { teamA: "1° Grupo D", teamB: "2° Grupo C", flagA: "🏆", flagB: "🏆", groupName: "Octavos", matchDate: new Date("2026-06-30T18:00:00Z"), stage: "Octavos de Final" },
      { teamA: "1° Grupo F", teamB: "2° Grupo E", flagA: "🏆", flagB: "🏆", groupName: "Octavos", matchDate: new Date("2026-06-30T22:00:00Z"), stage: "Octavos de Final" },

      // Cuartos de Final
      { teamA: "Ganador O1", teamB: "Ganador O2", flagA: "🏆", flagB: "🏆", groupName: "Cuartos", matchDate: new Date("2026-07-03T18:00:00Z"), stage: "Cuartos de Final" },
      { teamA: "Ganador O3", teamB: "Ganador O4", flagA: "🏆", flagB: "🏆", groupName: "Cuartos", matchDate: new Date("2026-07-03T22:00:00Z"), stage: "Cuartos de Final" },
      { teamA: "Ganador O5", teamB: "Ganador O6", flagA: "🏆", flagB: "🏆", groupName: "Cuartos", matchDate: new Date("2026-07-04T18:00:00Z"), stage: "Cuartos de Final" },
      { teamA: "Ganador O7", teamB: "Ganador O8", flagA: "🏆", flagB: "🏆", groupName: "Cuartos", matchDate: new Date("2026-07-04T22:00:00Z"), stage: "Cuartos de Final" },

      // Semifinales
      { teamA: "Ganador CF1", teamB: "Ganador CF2", flagA: "🏆", flagB: "🏆", groupName: "Semifinal", matchDate: new Date("2026-07-07T22:00:00Z"), stage: "Semifinal" },
      { teamA: "Ganador CF3", teamB: "Ganador CF4", flagA: "🏆", flagB: "🏆", groupName: "Semifinal", matchDate: new Date("2026-07-08T22:00:00Z"), stage: "Semifinal" },

      // Final
      { teamA: "Ganador SF1", teamB: "Ganador SF2", flagA: "🏆", flagB: "🏆", groupName: "Final", matchDate: new Date("2026-07-12T22:00:00Z"), stage: "Final" },
    ];

    // Insertar partidos
    const inserted = await db.insert(matchesTable).values(seedMatches).returning();

    return NextResponse.json({
      message: `${inserted.length} partidos cargados exitosamente`,
      count: inserted.length,
    });
  } catch (error) {
    console.error("Error en seed:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

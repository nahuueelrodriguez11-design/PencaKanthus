import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// ============================================
// API: Login de usuario
// POST /api/auth/login
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Teléfono y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Buscar usuario por teléfono
    const user = await db.query.users.findFirst({
      where: eq(users.phone, phone),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Retornar datos del usuario (sin contraseña)
    return NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        instagram: user.instagram,
        email: user.email,
        totalPoints: user.totalPoints,
        exactPredictions: user.exactPredictions,
        predictionsCount: user.predictionsCount,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

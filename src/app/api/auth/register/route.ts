import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// ============================================
// API: Registro de usuario
// POST /api/auth/register
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, instagram, email, password } = body;

    // Validar campos obligatorios
    if (!name || !phone || !instagram || !password) {
      return NextResponse.json(
        { error: "Nombre, teléfono, Instagram y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si ya existe un usuario con ese teléfono o Instagram
    const existing = await db.query.users.findFirst({
      where: eq(users.phone, phone),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese teléfono" },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        phone,
        instagram,
        email: email || null,
        password: hashedPassword,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          instagram: newUser.instagram,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
